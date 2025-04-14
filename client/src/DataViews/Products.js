import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

function ViewProducts() {
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/getProducts", {
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

        const uniqueProducts = Array.from(
          data
            .filter((item) => item.product_id != null)
            .reduce((map, item) => {
              if (!map.has(item.product_id)) {
                map.set(item.product_id, item);
              }
              return map;
            }, new Map())
            .values()
        );
        setProductsData(uniqueProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(
          `Failed to fetch products: ${error.message}. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const columns = [
    { field: "product_id", headerName: "Product ID", width: 120 },
    { field: "name", headerName: "Name", width: 250, flex: 1 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 120,
      /*valueFormatter: (value) => {
        if (typeof value === "number") {
          return `$${value.toFixed(2)}`;
        }
        return "";
      },*/
    },
    { field: "stock", headerName: "Stock", type: "number", width: 100 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "text.primary", textAlign: "center", mb: 3 }}
      >
        Products Data
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
        <Box
          sx={{
            height: 600,
            width: "100%",
            "& .MuiDataGrid-root": { border: 1, borderColor: "divider" },
          }}
        >
          <DataGrid
            getRowId={(row) => row.product_id}
            rows={productsData}
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

export default ViewProducts;
