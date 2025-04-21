import React, { useState } from "react";
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
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultTheme = createTheme();

export default function Verify() {
    const navigate = useNavigate();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

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

    async function handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        try {
            const response = await fetch("http://localhost:8080/checkToken", {
                method: "POST",
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    authToken: data.get("token"),
                    sessionToken: sessionStorage.getItem("sessionToken"),
                })
            });
            const responseJson = await response.json();

            if (responseJson.auth) {
                console.log("success");
                try {
                  const featuresResponse = await fetch(
                    `http://localhost:8080/allowedFeatures/${sessionStorage.getItem("username")}`
                  );
                  if (!featuresResponse.ok) {
                    throw new Error(
                      `Failed to fetch allowed features: ${featuresResponse.statusText}`
                    );
                  }
                  const allowedFeatures = await featuresResponse.json();
                  sessionStorage.setItem("access", JSON.stringify(allowedFeatures));
                  showSnackbar("Authentication successful, redirecting to home page.", "success");
                  setTimeout(() => navigate("/home"), 1500);
                } catch (featuresError) {
                  console.error("Error fetching allowed features:", featuresError);
                  alert(
                    "Login successful, but failed to load permissions. Please try again."
                  );

                  sessionStorage.removeItem("username");
                  sessionStorage.removeItem("sessionToken");
                }
            } else if (responseJson.retry) {
                // tell user to try again
                alert("Incorrect token");
            } else if (responseJson.expire) {
                // return to login page and make new token (token expired)
                console.log("failure - expired");
                showSnackbar("Authentication token expired, please log in again. Redirecting...", "error");
                setTimeout(() => navigate("/"), 1500);
            } else if (responseJson.max) {
                // return to login page and make new token (too many attempts)
                console.log("failure - max");
                showSnackbar("Max authentication attempts reached, please log in again. Redirecting...", "error");
                setTimeout(() => navigate("/"), 1500);
            } else {
                // unknown error
                console.log("failure - unknown");
                showSnackbar("An error occurred during authentication, please log in again. Redirecting...", "error");
                setTimeout(() => navigate("/"), 1500);
            }
        } catch (err) {
            console.error(err);
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
                    id="token"
                    label="Token"
                    name="token"
                    autoComplete="token"
                    autoFocus
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Authenticate
                </Button>
            </Box>
        </Box>
        <Box
            sx={{height: 120,}}
            component="img"
            src={process.env.PUBLIC_URL + "/logo.png"}
            alt=""
        />
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