import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Icon } from "@mui/material";

const defaultTheme = createTheme();

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


async function encryptPayload(publicKey, username, password){
  const data = JSON.stringify({ username, password });
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

async function signPayload(privateKey, username, password){
  const data = JSON.stringify({ username, password });
  const encoded = new TextEncoder().encode(data);

  const sigBuffer = await window.crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    privateKey,
    encoded
  );

  return btoa(String.fromCharCode(...new Uint8Array(sigBuffer)));
}

export default function TestLoginPage() {
  const ACCEPTED = "ACCEPTED";
  const REJECTED = "REJECTED";

  const navigate = useNavigate();

  const [clientKeyPair, setClientKeyPair] = React.useState(null);

  React.useEffect(() => {
    generateClientKeyPair().then(setClientKeyPair);
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const username = data.get("username");
    const password = data.get("password");

    try {
      const serverPublicKey = await importServerKey(serverPublicKeyPEM);
      console.log("Imported public key:", serverPublicKey);
      const signature = await signPayload(clientKeyPair.privateKey, username, password);
      console.log("Signature (base64):", signature);

      const encryptedPayload = await encryptPayload(serverPublicKey, username, password)
      console.log("Encrypted payload (base64):", encryptedPayload);
      
      const body = { 
        encrypted: encryptedPayload,
        signature,
      };

      
      body.clientPublicKey = await exportClientPublicKey(clientKeyPair);
      console.log("Sending client public key:", body.clientPublicKey);
        
      

      const response = await fetch("http://localhost:8080/getUser", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(body),
      });
      console.log("Fetch returned status:", response.status);

      const loginResponseJson = await response.json();
      
      if (loginResponseJson.status == ACCEPTED) {
        sessionStorage.setItem("username", data.get("username"));
        sessionStorage.setItem("sessionToken", loginResponseJson.sessionToken);
        // Store the isAdmin status
        sessionStorage.setItem("isAdmin", loginResponseJson.isAdmin); 
        navigate("/verify");
      } else {
        const errorMessage =
          loginResponseJson.error || "Incorrect login details";
        alert(errorMessage);
      }
    } catch (error) {
      console.error(error);
    }
  }

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
          <Avatar sx={{ m: 1, bgcolor: "#000080" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            CS 6348 Project
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
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Box
          sx={{
            height: 120,
          }}
          component="img"
          src={process.env.PUBLIC_URL + "/logo.png"}
          alt=""
        />
      </Container>
    </ThemeProvider>
  );
}
