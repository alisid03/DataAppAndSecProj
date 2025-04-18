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

export default function Verify() {
    const navigate = useNavigate();

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
                  navigate("/home");
                } catch (featuresError) {
                  console.error("Error fetching allowed features:", featuresError);
                  alert(
                    "Login successful, but failed to load permissions. Please try again."
                  );

                  sessionStorage.removeItem("username");
                  sessionStorage.removeItem("sessionToken");
                }
            } else {
                console.log("failure");
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
        </Container>
        </ThemeProvider>
    );
}