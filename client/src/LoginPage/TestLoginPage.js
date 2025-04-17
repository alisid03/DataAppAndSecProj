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

export default function TestLoginPage() {
  const ACCEPTED = "ACCEPTED";
  const REJECTED = "REJECTED";

  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      const response = await fetch("http://localhost:8080/getUser", {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          username: data.get("username"),
          password: data.get("password"),
        }),
      });
      const loginResponseJson = await response.json();

      if (loginResponseJson.status == ACCEPTED) {
        const username = data.get("username");
        sessionStorage.setItem("username", username);
        // TODO: change to store session key instead
        sessionStorage.setItem("email", loginResponseJson.email);
        navigate("/verify");

        // try {
        //   const featuresResponse = await fetch(
        //     `http://localhost:8080/allowedFeatures/${username}`
        //   );
        //   if (!featuresResponse.ok) {
        //     throw new Error(
        //       `Failed to fetch allowed features: ${featuresResponse.statusText}`
        //     );
        //   }
        //   const allowedFeatures = await featuresResponse.json();
        //   sessionStorage.setItem("access", JSON.stringify(allowedFeatures));
        //   navigate("/home");
        // } catch (featuresError) {
        //   console.error("Error fetching allowed features:", featuresError);
        //   alert(
        //     "Login successful, but failed to load permissions. Please try again."
        //   );

        //   sessionStorage.removeItem("username");
        // }
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
