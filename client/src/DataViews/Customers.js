import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { DataGrid } from "@mui/x-data-grid";

function ViewCustomers() { // Kept function name
  const [customerData, setCustomerData] = useState([]); // Kept state variable name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCustomers() { // Kept function name
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/getCustomers', { // Kept API endpoint
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setCustomerData(data); // Kept state setter
      } catch (error) {
        console.error("Error fetching customers:", error); // Kept log message
        setError(`Failed to fetch customers: ${error.message}. Please try again later.`); // Changed error message
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers(); // Kept function call
  }, []);

  // Columns based on user feedback for Customers
  const columns = [
    { field: "user_id", headerName: "User ID", width: 100 },
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 250, flex: 1 }, // Added flex: 1
    { field: "created_at", headerName: "Created At", width: 200, type: 'dateTime', valueGetter: (value) => value && new Date(value) }, // Format date
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', textAlign: 'center', mb: 3 }}>
        Customers Data {/* Changed title */}
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
         <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
      ) : (
        <Box sx={{ height: 600, width: '100%', '& .MuiDataGrid-root': { border: 1, borderColor: 'divider' } }}>
          <DataGrid
            getRowId={(row) => row.user_id} // Kept row ID field
            rows={customerData} // Kept data source
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
            autoHeight
          />
        </Box>
      )}
    </Container>
  );
}

export default ViewCustomers; // Kept export name
