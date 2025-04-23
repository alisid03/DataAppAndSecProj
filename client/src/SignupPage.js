import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";

const serverPublicKeyPEM =`
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6ydIeeW5q98y6EusrAVR
R431+Z1nLfIo+uQ2TDjexdZP8P6PLtp99z6EzwV7MRSduSArlS76sHBiNfZv6A8H
bnowWa4o/I2y1LvuU/R6lJ/xwx1OhfA1kg0EoyuqoSxftulMCMnDxZmakHMQ1VUi
v35vg75qERyJgS41p1GxUSaSMV6G/xFJoP98YWIBrWrJcI0F/PGuDzOIMCW/LSXb
XsaQX+s6Mm/E9ix6We/oCTUORbT1nZIm0NZyF3jXfCJgk9puvwJK6CI0rhudaX4w
UBCuJO3V4moP36reo54lG/2xBUJXWEk/hm4uF9w4V1obzUJnRtuTHThpJV+SMPxK
2wIDAQAB
-----END PUBLIC KEY-----
`;

async function importServerKey(pem) {
    // fetch the part of the PEM string between header and footer
    const cleanPem = pem
      .replace(/-----BEGIN PUBLIC KEY-----/, "")
      .replace(/-----END PUBLIC KEY-----/, "")
      .replace(/\s+/g, "");
  
    // base64 decode the string to get the binary data
    const der = Uint8Array.from(atob(cleanPem), c => c.charCodeAt(0));
  
    return await window.crypto.subtle.importKey(
      "spki",
      der.buffer,
      {
        name: "RSA-OAEP",
        hash: "SHA-256",
      },
      true,
      ["encrypt"],
    );
  }

async function encryptPayload(publicKey, username, password, email){
    const data = JSON.stringify({ username, password, email });
    const encoded = new TextEncoder().encode(data);

    const ciphertext = await window.crypto.subtle.encrypt(
        {
        name: "RSA-OAEP"
        },
        publicKey,
        encoded
    );

    return btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
}

async function generateClientKeyPair() {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,                
      publicExponent: new Uint8Array([1, 0, 1]),  
      hash: "SHA-256",                    // the hash to sign
    },
    true,                                 
    ["sign", "verify"]                   
  );
  return keyPair;  // { publicKey: CryptoKey, privateKey: CryptoKey }
}

async function exportClientPublicKey(keyPair) {
  const spki = await window.crypto.subtle.exportKey("spki", keyPair.publicKey);
  const b64 = btoa(String.fromCharCode(...new Uint8Array(spki)));
  return `-----BEGIN PUBLIC KEY-----\n${b64.match(/.{1,64}/g).join("\n")}\n-----END PUBLIC KEY-----`;
}

async function signPayload(privateKey, username, password, email) {
  const data = JSON.stringify({ username, password, email });
  const encoded = new TextEncoder().encode(data);

  const sigBuffer = await window.crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    encoded
  );

  return btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
}

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultTheme = createTheme();

export default function SignupPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");
  const [clientKeyPair, setClientKeyPair] = React.useState(null);

  React.useEffect(() => {
      generateClientKeyPair().then(setClientKeyPair);
    }, []);

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = "info") => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!username.trim() || !email.trim() || !password) {
      showSnackbar("Username, email, and password are required.", "warning");
      return;
    }
    setLoading(true);

    try {
      const trimmedUsername = username.trim();
      const trimmedEmail = email.trim();

      const serverPublicKey = await importServerKey(serverPublicKeyPEM);
      console.log("Imported public key:", serverPublicKey);
      const signature = await signPayload(clientKeyPair.privateKey, trimmedUsername, password, trimmedEmail);
      console.log("Signature (base64):", signature);

      const encryptedPayload = await encryptPayload(serverPublicKey, username, password, email);
      console.log("Encrypted payload (base64):", encryptedPayload);

      const body = { 
        encrypted: encryptedPayload,
        signature,
        clientPublicKey: await exportClientPublicKey(clientKeyPair)
      };
      console.log("Sending client public key:", body.clientPublicKey);

      const response = await fetch("http://localhost:8080/createUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        let errorMsg = `Signup failed with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch (parseError) {}
        throw new Error(errorMsg);
      }

      const responseJson = await response.json();

      if (responseJson.status === "ACCEPTED") {
        sessionStorage.setItem("username", trimmedUsername);
        sessionStorage.setItem("access", JSON.stringify([]));
        showSnackbar("Signup successful! Redirecting...", "success");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        showSnackbar(responseJson.error || "Signup failed.", "error");
      }
    } catch (error) {
      console.error("Signup error:", error);
      showSnackbar(
        error.message || "An error occurred during signup.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading} // Added
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Sign Up"
              )}{" "}
              {/* Added */}
            </Button>
            {/* Add link back to Sign In page */}
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        {/* Added Snackbar component */}
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </ThemeProvider>
  );
}
