import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

function ViewCategories() {
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/getCategories", {
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
        setCategoryData(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError(
          `Failed to fetch categories: ${error.message}. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const columns = [
    { field: "category_id", headerName: "Category ID", width: 150 },
    { field: "name", headerName: "Category Name", width: 300, flex: 1 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ textAlign: 'center' }}>
        Categories Data
      </Typography>
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 400,
          }}
        >
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      ) : (
        <Box sx={{ width: "100%" }}>
          <DataGrid
            getRowId={(row) => row.category_id}
            rows={categoryData}
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

export default ViewCategories;
