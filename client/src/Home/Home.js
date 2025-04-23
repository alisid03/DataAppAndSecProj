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
  const [allowedFeatures, setAllowedFeatures] = useState([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  // Read username and allowed features from sessionStorage on component mount
  useEffect(() => {
    setError(null);
    const storedUsername = sessionStorage.getItem("username");
    const storedAccessJson = sessionStorage.getItem("access");

    if (!storedUsername || !storedAccessJson) {
      setError(
        "User not logged in or permissions missing. Redirecting to login..."
      );
      // Clear potentially partial session data
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("access");
      setTimeout(() => navigate("/"), 1500);
      return;
    }

    setUsername(storedUsername);

    try {
      const parsedFeatures = JSON.parse(storedAccessJson);
      if (Array.isArray(parsedFeatures)) {
        setAllowedFeatures(parsedFeatures);
        console.log("Loaded features from session:", parsedFeatures);
      } else {
        console.error("Stored access data is not an array:", parsedFeatures);
        setError("Invalid permission data format. Please log in again.");
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("access");
        setTimeout(() => navigate("/"), 1500);
      }
    } catch (parseError) {
      console.error("Error parsing stored access data:", parseError);
      setError("Failed to read permission data. Please log in again.");
      sessionStorage.removeItem("username");
      sessionStorage.removeItem("access");
      setTimeout(() => navigate("/"), 1500);
    }
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
    4: { name: "OrderDetails", path: "/getOrderDetails" },
    5: { name: "Orders", path: "/getOrders" },
    6: { name: "Payments", path: "/getPayments" },
    7: { name: "ProductCategories", path: "/getProductCategories" },
    8: { name: "Products", path: "/getProducts" },
  };

  const handleButtonClick = (buttonNumber) => {
    const feature = featureMap[buttonNumber];

    const isAllowed =
      feature &&
      allowedFeatures.some(
        (allowedName) =>
          allowedName.toLowerCase() === feature.name.toLowerCase()
      );

    if (isAllowed) {
      showSnackbar(`Accessing ${feature.name}...`, "success");
      navigate(feature.path);
    } else {
      showSnackbar(
        `ACCESS DENIED: You do not have access to ${
          feature ? feature.name : `Feature ${buttonNumber}`
        }`,
        "error"
      );
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
              // Perform a case-insensitive check
              const isAllowed = allowedFeatures.some(
                (allowedName) =>
                  allowedName.toLowerCase() === feature.name.toLowerCase()
              );
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
                  {featureName}
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
            {/* Add Admin Page Button */}
            <Button
              variant="contained"
              color="secondary" 
              onClick={() => navigate("/admin")}
              sx={styles.button} 
            >
              Admin Page
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
