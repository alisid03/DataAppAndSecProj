import React, { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const allFeatures = [
  { id: "1", name: "Reviews" },
  { id: "2", name: "Categories" },
  { id: "3", name: "Customers" },
  { id: "4", name: "Order Details" },
  { id: "5", name: "Orders" },
  { id: "6", name: "Payments" },
  { id: "7", name: "Product Categories" },
  { id: "8", name: "Products" },
];

export default function RequestPage() {
  const navigate = useNavigate();
  const [feature, setFeature] = useState("");
  const [username, setUsername] = useState("");
  const [allowedFeatures, setAllowedFeatures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  useEffect(() => {
    setFetchLoading(true);
    const storedUsername = sessionStorage.getItem("username");

    const verifyAndLoad = async () => {
      if (!storedUsername) {
        showSnackbar("User not logged in. Redirecting...", "warning");
        setFetchLoading(false);
        setTimeout(() => navigate("/"), 1500);
        return;
      }

      try {
        // Step 1: Verify user exists in DB
        const verifyResponse = await fetch(
          `http://localhost:8080/verifyUser/${storedUsername}`
        );
        if (!verifyResponse.ok) {
          throw new Error("Verification request failed");
        }
        const verifyData = await verifyResponse.json();

        if (!verifyData.exists) {
          sessionStorage.removeItem("username");
          showSnackbar("Invalid session. Redirecting to login...", "error");
          setFetchLoading(false);
          setTimeout(() => navigate("/"), 1500);
          return;
        }

        // Step 2: User verified, set username and fetch features
        setUsername(storedUsername);
        const featuresResponse = await fetch(
          `http://localhost:8080/allowedFeatures/${storedUsername}`
        );
        if (!featuresResponse.ok) {
          throw new Error("Failed to fetch allowed features");
        }
        const featuresData = await featuresResponse.json();
        setAllowedFeatures(
          Array.isArray(featuresData) ? featuresData.map(String) : []
        );
      } catch (err) {
        console.error("Error during verification or feature fetch:", err);
        showSnackbar(
          err.message || "An error occurred loading page data.",
          "error"
        );
        setAllowedFeatures([]);
      } finally {
        setFetchLoading(false);
      }
    };

    verifyAndLoad();
  }, [navigate]); // navigate dependency for redirection

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
    if (!feature) {
      showSnackbar("Please select a feature to request.", "warning");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("http://localhost:8080/requestAccess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, feature }),
      });

      if (!response.ok) {
        // Try to get error message from response body if possible
        let errorMsg = `Request failed with status: ${response.status}`;
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (parseError) {
          // Ignore if response body is not JSON or empty
        }
        throw new Error(errorMsg);
      }

      const responseJson = await response.json();

      if (responseJson.status === "ACCEPTED") {
        showSnackbar("Request submitted successfully!", "success");
        // Optionally update allowedFeatures state here or refetch
        setTimeout(() => navigate("/home"), 1500); // Navigate back after showing message
      } else {
        // Handle other potential statuses if the API defines them
        showSnackbar(
          responseJson.message || "Request submission failed.",
          "error"
        );
      }
    } catch (error) {
      console.error("Request submission error:", error);
      showSnackbar(
        error.message || "An error occurred while submitting the request.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const availableFeatures = allFeatures.filter(
    (f) => !allowedFeatures.includes(f.id)
  );

  return (
    // Removed ThemeProvider
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
        <Avatar sx={{ m: 1 }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Request Feature Access
        </Typography>

        {fetchLoading ? (
          <CircularProgress sx={{ my: 3 }} />
        ) : availableFeatures.length === 0 ? (
          <Typography sx={{ mt: 2, textAlign: "center" }}>
            You already have access to all available features.
          </Typography>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: "100%" }}
          >
            <FormControl fullWidth margin="normal">
              <InputLabel id="feature-label">Select Feature</InputLabel>
              <Select
                labelId="feature-label"
                id="feature"
                name="feature"
                value={feature}
                label="Select Feature"
                onChange={(e) => setFeature(e.target.value)}
                required
              >
                {availableFeatures.map((f) => (
                  <MenuItem key={f.id} value={f.id}>
                    {f.name}
                  </MenuItem> // Use descriptive name
                ))}
              </Select>
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 1 }}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Submit Request"
              )}
            </Button>
          </Box>
        )}
        <Button
          fullWidth
          variant="outlined"
          sx={{ mt: 1, mb: 2 }}
          onClick={() => navigate("/home")}
          disabled={loading}
        >
          Back to Home
        </Button>
      </Box>
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
  );
}
