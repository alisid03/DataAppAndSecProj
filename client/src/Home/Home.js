import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

const Home = () => {
  const navigate = useNavigate();
  const [allowedButtons, setAllowedButtons] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Fetch allowed buttons from sessionStorage on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    const storedUsername = sessionStorage.getItem("username");

    const verifyAndLoadFeatures = async () => {
      if (!storedUsername) {
        setError("User not logged in. Redirecting to login...");
        setLoading(false);
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
          // User in sessionStorage doesn't exist in DB (or session is invalid)
          sessionStorage.removeItem("username"); // Clear invalid session storage
          setError("Invalid session. Redirecting to login...");
          setLoading(false);
          setTimeout(() => navigate("/"), 1500);
          return;
        }

        // Step 2: User verified, set username and fetch features
        setUsername(storedUsername);
        const featuresResponse = await fetch(
          `http://localhost:8080/allowedFeatures/${storedUsername}`
        );
        if (!featuresResponse.ok) {
          throw new Error("Failed to fetch features");
        }
        const featuresData = await featuresResponse.json();
        console.log("Fetched features data:", featuresData); // Log fetched data
        const buttons = Array.isArray(featuresData)
          ? featuresData.map(String)
          : [];
        console.log("Setting allowedButtons state to:", buttons); // Log state being set
        setAllowedButtons(buttons);
      } catch (err) {
        console.error("Error during verification or feature fetch:", err);

        setError(
          err.message || "An error occurred. Please try logging in again."
        );

        sessionStorage.removeItem("username");
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoadFeatures();
  }, [navigate]);

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

  // Map button numbers to feature names and routes
  const featureMap = {
    1: { name: "Reviews", path: "/getReviews" },
    2: { name: "Categories", path: "/getCategories" },
    3: { name: "Customers", path: "/getCustomers" },
    4: { name: "Order Details", path: "/getOrderDetails" },
    5: { name: "Orders", path: "/getOrders" },
    6: { name: "Payments", path: "/getPayments" },
    7: { name: "Product Categories", path: "/getProductCategories" },
    8: { name: "Products", path: "/getProducts" },
  };

  const handleButtonClick = (buttonNumber) => {
    const feature = featureMap[buttonNumber];
    // Convert buttonNumber to string for comparison with allowedButtons (which contains strings)
    if (feature && allowedButtons.includes(buttonNumber.toString())) {
      showSnackbar(`Accessing ${feature.name}...`, "success");
      navigate(feature.path);
    } else {
      showSnackbar(
        `ACCESS DENIED: You do not have access to ${
          feature ? feature.name : `Feature ${buttonNumber}`
        }`,
        "error"
      ); // Use Snackbar
    }
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Typography variant="h3" component="h1" sx={styles.heading}>
        Welcome, {username || "Guest"}!
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      ) : (
        <>
          <Typography variant="subtitle1" sx={styles.subheading}>
            Access your available features below:
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
              justifyContent: "center",
              mt: 3,
            }}
          >
            {Object.entries(featureMap).map(([buttonNumberStr, feature]) => {
              const buttonNumber = parseInt(buttonNumberStr, 10);
              const isAllowed = allowedButtons.includes(buttonNumberStr);
              const featureName = feature.name;
              return (
                <Button
                  key={buttonNumber}
                  variant="contained"
                  color={isAllowed ? "primary" : "info"}
                  onClick={() => handleButtonClick(buttonNumber)}
                  sx={{
                    ...styles.button,
                    opacity: isAllowed ? 1 : 0.6,
                    cursor: "pointer",
                  }}
                >
                  {featureName} {/* Display feature name */}
                </Button>
              );
            })}
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/request")}
              sx={styles.requestButton}
            >
              Request Access
            </Button>
          </Box>
        </>
      )}

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
};

const styles = {
  container: {
    textAlign: "center",
    padding: { xs: "20px", md: "40px" },
    minHeight: "calc(100vh - 64px)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    fontWeight: 600,
    color: "#333",
    mb: 1,
  },
  subheading: {
    fontSize: "1.2rem",
    color: "#666",
    mb: 3,
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "25px",
    boxShadow: "0px 3px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
    "&:hover": {
      transform: "translateY(-2px)",
      boxShadow: "0px 5px 8px rgba(0, 0, 0, 0.15)",
    },
  },
  requestButton: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "25px",
    borderColor: "#1976d2",
    color: "#1976d2",
    transition:
      "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
    "&:hover": {
      backgroundColor: "rgba(25, 118, 210, 0.04)",
      borderColor: "#1565c0",
    },
  },
};

export default Home;
