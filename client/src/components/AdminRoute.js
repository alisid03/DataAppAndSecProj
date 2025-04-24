import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { CircularProgress, Box, Typography } from '@mui/material';

// Protected route component that checks if user is admin
const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(null); // null = loading, true/false = loaded
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in and is admin
    const checkAdminStatus = () => {
      const storedIsAdmin = sessionStorage.getItem("isAdmin");
      const username = sessionStorage.getItem("username");
      
      // If no username, user is not logged in
      if (!username) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }
      
      // Check admin status
      setIsAdmin(storedIsAdmin === "1" || storedIsAdmin === 1 || storedIsAdmin === true);
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>Checking permissions...</Typography>
      </Box>
    );
  }

  // If not admin, redirect to home page
  if (!isAdmin) {
    return <Navigate to="/home" replace />;
  }

  // If admin, render the protected component
  return children;
};

export default AdminRoute;
