import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

function ViewOrderDetails() {
  const [orderDetailsData, setOrderDetailsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrderDetails() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/getOrderDetails", {
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
        setOrderDetailsData(data);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError(
          `Failed to fetch order details: ${error.message}. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchOrderDetails();
  }, []);

  const columns = [
    { field: "order_detail_id", headerName: "Detail ID", width: 120 },
    { field: "order_id", headerName: "Order ID", width: 120 },
    { field: "product_id", headerName: "Product ID", width: 120 },
    { field: "quantity", headerName: "Quantity", type: "number", width: 100 },
    {
      field: "price",
      headerName: "Price",
      type: "number",
      width: 120,
      valueFormatter: (value) => {
        // Check if value is a valid number before formatting
        if (typeof value === "number" && !isNaN(value)) {
          return `$${value.toFixed(2)}`;
        }
        // Return a placeholder or the original value if not a number
        return value != null ? String(value) : "$N/A"; // Display original value or N/A
      },
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ textAlign: "center", mb: 3 }}
      >
        Order Details Data
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
            autoHeight
            getRowId={(row) => row.order_detail_id}
            rows={orderDetailsData}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </Container>
  );
}

export default ViewOrderDetails;
