import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { DataGrid } from "@mui/x-data-grid";
import { CssBaseline } from "@mui/material"; // Removed createTheme, ThemeProvider

// Removed local theme definition

function ViewProductCategories() { // Kept function name
  const [productCategoriesData, setProductCategoriesData] = useState([]); // Kept state variable name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProductCategories() { // Kept function name
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('http://localhost:8080/getProductCategories', { // Kept API endpoint
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
        setProductCategoriesData(data); // Kept state setter
      } catch (error) {
        console.error("Error fetching product categories:", error); // Kept log message
        setError(`Failed to fetch product categories: ${error.message}. Please try again later.`); // Changed error message
      } finally {
        setLoading(false);
      }
    }
    fetchProductCategories(); // Kept function call
  }, []);

  // Columns based on user feedback for ProductCategories
  const columns = [
    { field: "product_id", headerName: "Product ID", width: 150, flex: 1 }, // Added flex
    { field: "category_id", headerName: "Category ID", width: 150, flex: 1 }, // Added flex
  ];

  return (
    // Removed ThemeProvider
      <> {/* Use Fragment since ThemeProvider is removed */}
      <CssBaseline />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'text.primary', textAlign: 'center', mb: 3 }}>
          Product Categories Data {/* Changed title */}
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
            // Create a composite key as product_id might not be unique alone in this mapping table
            getRowId={(row) => `${row.product_id}-${row.category_id}`} // Kept row ID logic
            rows={productCategoriesData} // Kept data source
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
            // Removed sx prop
          />
        </Box>
      )}
      </Container>
    </> // Close Fragment
  );
}

export default ViewProductCategories; // Kept export name
