import React, { useEffect, useState } from 'react';
import {
    Container, Typography, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Box, CircularProgress, Alert, Snackbar
} from '@mui/material';

function AdminPage() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("info");

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('http://localhost:8080/getPendingRequests');
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();
                setRequests(data);
            } catch (err) {
                console.error('Error fetching requests:', err);
                setError(`Failed to fetch requests: ${err.message}`);
                showSnackbar(`Error fetching requests: ${err.message}`, 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchRequests();
    }, []);

    const showSnackbar = (message, severity = "info") => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAction = async (action, username, page) => {
        const endpoint = action === 'approve' ? 'approveAccess' : 'rejectAccess';
        const successMessage = action === 'approve' ? 'Request approved' : 'Request rejected';
        const failureMessage = action === 'approve' ? 'Approval failed' : 'Rejection failed';

        try {
            const res = await fetch(`http://localhost:8080/${endpoint}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, page})
            });
            const data = await res.json();
            if (data.success) {
                setRequests((prev) => prev.filter(r => !(r.username === username && r.page === page)));
                showSnackbar(successMessage, 'success');
            } else {
                console.error(`${failureMessage}:`, data.message || 'No specific error message returned.');
                showSnackbar(`${failureMessage}: ${data.message || 'Unknown error'}`, 'error');
            }
        } catch (err) {
            console.error(`${action} error:`, err);
            showSnackbar(`Error during ${action}: ${err.message}`, 'error');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'primary', fontWeight: 'bold' }}>
                    Admin Access Requests
                </Typography>

                {loading ? (
                    <CircularProgress sx={{ mt: 5 }} />
                ) : error ? (
                    <Alert severity="error" sx={{ mt: 3, width: '100%', maxWidth: '800px' }}>{error}</Alert>
                ) : requests.length === 0 ? (
                    <Typography sx={{ mt: 3 }}>No pending requests</Typography>
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden', mt: 3, maxWidth: '1000px' }}>
                        <TableContainer sx={{ maxHeight: 600 }}>
                            <Table stickyHeader aria-label="access requests table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Username</TableCell>
                                        <TableCell>Page ID</TableCell> 
                                        <TableCell>Requested At</TableCell>
                                        <TableCell align="center">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {requests.map((req, index) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={`${req.username}-${req.page}-${index}`}>
                                            <TableCell>{req.username}</TableCell>
                                            <TableCell>{req.page}</TableCell> 
                                            <TableCell>{new Date(req.request_time).toLocaleString()}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    size="small"
                                                    onClick={() => handleAction('approve', req.username, req.page)}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="error"
                                                    size="small"
                                                    onClick={() => handleAction('reject', req.username, req.page)}
                                                >
                                                    Reject
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                )}
            </Box>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}

export default AdminPage;
