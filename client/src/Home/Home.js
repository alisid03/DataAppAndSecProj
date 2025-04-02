import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

const Home = () => {
  const navigate = useNavigate();
  const [allowedButtons, setAllowedButtons] = useState([]);
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // 'success', 'error', 'warning', 'info'


  // Fetch allowed buttons from sessionStorage on component mount
  useEffect(() => {
    setLoading(true);
    setError(null);
    const storedUsername = sessionStorage.getItem('username');

    const verifyAndLoadFeatures = async () => {
      if (!storedUsername) {
        setError('User not logged in. Redirecting to login...');
        setLoading(false);
        setTimeout(() => navigate('/'), 1500); // Redirect after message
        return;
      }

      try {
        // Step 1: Verify user exists in DB
        const verifyResponse = await fetch(`http://localhost:8080/verifyUser/${storedUsername}`);
        if (!verifyResponse.ok) {
          throw new Error('Verification request failed');
        }
        const verifyData = await verifyResponse.json();

        if (!verifyData.exists) {
          // User in sessionStorage doesn't exist in DB (or session is invalid)
          sessionStorage.removeItem('username'); // Clear invalid session storage
          setError('Invalid session. Redirecting to login...');
          setLoading(false);
          setTimeout(() => navigate('/'), 1500);
          return;
        }

        // Step 2: User verified, set username and fetch features
        setUsername(storedUsername);
        const featuresResponse = await fetch(`http://localhost:8080/allowedFeatures/${storedUsername}`);
        if (!featuresResponse.ok) {
          throw new Error('Failed to fetch features');
        }
        const featuresData = await featuresResponse.json();
        setAllowedButtons(Array.isArray(featuresData) ? featuresData.map(String) : []);

      } catch (err) {
        console.error("Error during verification or feature fetch:", err);
        // Handle specific errors differently if needed
        setError(err.message || 'An error occurred. Please try logging in again.');
        // Optionally clear session storage and redirect on error
        sessionStorage.removeItem('username');
        // setTimeout(() => navigate('/'), 2000);
      } finally {
        setLoading(false);
      }
    };

    verifyAndLoadFeatures();

  }, [navigate]); // navigate is a dependency for redirection

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };


  const handleButtonClick = (buttonNumber) => {
    if (allowedButtons.includes(buttonNumber)) {
      alert(`ACCESS GRANTED: Button ${buttonNumber}`);
      if(buttonNumber === 1) {
        navigate('/getReviews')
      }
    } else {
      showSnackbar(`ACCESS DENIED: You do not have access to Feature ${buttonNumber}`, 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={styles.container}>
      <Typography variant="h3" component="h1" sx={styles.heading}>
        Welcome, {username || 'Guest'}!
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 5 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>
      ) : (
        <>
          <Typography variant="subtitle1" sx={styles.subheading}>
            Access your available features below:
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center', mt: 3 }}>
            {[...Array(8)].map((_, index) => {
              const buttonNumber = index + 1;
              const isAllowed = allowedButtons.includes(buttonNumber.toString());
              return (
                <Button
                  key={index}
                  variant="contained"
                  color={isAllowed ? "primary" : "info"} 
                  onClick={() => handleButtonClick(buttonNumber)}
                  // disabled={!isAllowed} // Removed disabled prop
                  sx={{
                    ...styles.button,
                    opacity: isAllowed ? 1 : 0.6, // Slightly dim disallowed buttons but keep clickable
                    cursor: 'pointer', // Always pointer cursor
                  }}
                >
                  Feature {buttonNumber} {}
                </Button>
              );
            })}
            <Button variant="outlined" color="primary" onClick={() => navigate('/request')} sx={styles.requestButton}>
              Request Access
            </Button>
          </Box>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Use sx prop for styling within the component or move to a separate CSS/module file
// For simplicity, keeping styles object but applying via sx prop
const styles = {
  container: { // Applied to MUI Container via sx prop
    textAlign: "center",
    padding: { xs: "20px", md: "40px" }, // Responsive padding
    minHeight: "calc(100vh - 64px)", // Adjust if you have a fixed header/appbar
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
    // background: 'linear-gradient(to right, #f0f2f5, #e0e5ec)', // Keep or change background
  },
  heading: { // Applied via sx prop
    fontWeight: 600,
    color: '#333',
    mb: 1, // Use theme spacing
  },
  subheading: { // Applied via sx prop
    fontSize: '1.2rem',
    color: '#666',
    mb: 3, // Use theme spacing
  },
  button: { // Base styles applied via sx prop, conditional styles added inline
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "25px", // Rounded corners
    boxShadow: '0px 3px 5px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0px 5px 8px rgba(0, 0, 0, 0.15)',
    },
  },
  requestButton: { // Applied via sx prop
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: 500,
    borderRadius: "25px",
    borderColor: '#1976d2', // Primary color
    color: '#1976d2',
    transition: 'background-color 0.2s ease-in-out, border-color 0.2s ease-in-out',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.04)', // Slight background on hover
      borderColor: '#1565c0',
    },
  },
};

export default Home;
