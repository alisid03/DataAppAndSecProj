import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar'; // Added
import MuiAlert from '@mui/material/Alert'; // Added
import CircularProgress from '@mui/material/CircularProgress'; // Added

const Alert = React.forwardRef(function Alert(props, ref) { // Added
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const defaultTheme = createTheme();

export default function SignupPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Added
    const [snackbarOpen, setSnackbarOpen] = useState(false); // Added
    const [snackbarMessage, setSnackbarMessage] = useState(''); // Added
    const [snackbarSeverity, setSnackbarSeverity] = useState('info'); // Added

    const handleSnackbarClose = (event, reason) => { // Added
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const showSnackbar = (message, severity = 'info') => { // Added
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!username.trim() || !password) { // Added basic validation
            showSnackbar('Username and password are required.', 'warning');
            return;
        }
        setLoading(true); // Added

        try {
            // Use trimmed username for the request
            const trimmedUsername = username.trim();
            const response = await fetch("http://localhost:8080/createUser", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: trimmedUsername,
                    password: password,
                }),
            });

            // Check if response is ok before parsing JSON
            if (!response.ok) {
                let errorMsg = `Signup failed with status: ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.error || errorMsg; // Use server error message if available
                } catch (parseError) {
                    // Ignore if response body is not JSON or empty
                }
                throw new Error(errorMsg);
            }

            const responseJson = await response.json();

            if (responseJson.status === "ACCEPTED") {
                // *** FIX: Store the new username in sessionStorage ***
                sessionStorage.setItem('username', trimmedUsername);
                showSnackbar('Signup successful! Redirecting...', 'success');
                setTimeout(() => navigate('/home'), 1500); // Redirect after showing message
            } else {
                 // Should ideally not happen if response.ok check passed, but handle just in case
                showSnackbar(responseJson.error || "Signup failed.", 'error');
            }
        } catch (error) {
            console.error("Signup error:", error);
            showSnackbar(error.message || "An error occurred during signup.", 'error');
        } finally {
            setLoading(false); // Added
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
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
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'} {/* Added */}
                        </Button>
                    </Box>
                </Box>
                {/* Added Snackbar component */}
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
        </ThemeProvider>
    );
}
