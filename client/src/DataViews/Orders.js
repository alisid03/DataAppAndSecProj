import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

function ViewOrders() {
  const [processedOrdersData, setProcessedOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrders() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/getOrders", {
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

        const processedData = data.map((row, index) => ({
          ...row,

          _grid_id_:
            row.order_id != null ? row.order_id : `fallback-order-${index}`,
        }));
        setProcessedOrdersData(processedData);
      } catch (error) {
        console.error("Error fetching orders:", error); // Kept log message
        setError(
          `Failed to fetch orders: ${error.message}. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const columns = [
    { field: "order_id", headerName: "Order ID", width: 120 },
    { field: "user_id", headerName: "User ID", width: 120 },
    {
      field: "order_date",
      headerName: "Order Date",
      width: 200,
      type: "dateTime",
      valueGetter: (value) => value && new Date(value),
    }, 
    {
      field: "total",
      headerName: "Total",
      type: "number",
      width: 120,
      /*valueFormatter: (value) => {
        // Check if value is a number before formatting
        if (typeof value === "number" && !isNaN(value)) {
          return `$${value.toFixed(2)}`;
        }
        return "";
      },*/
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "text.primary", textAlign: "center", mb: 3 }}
      >
        Orders Data {/* Changed title */}
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
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            getRowId={(row) => row._grid_id_}
            rows={processedOrdersData}
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
            sx={{
              // Applying consistent theme
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "primary.main",
                color: "primary.contrastText",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid",
                borderColor: "divider",
              },
              "& .MuiDataGrid-footerContainer": {
                borderTop: "1px solid",
                borderColor: "divider",
              },
              backgroundColor: "background.paper",
            }}
          />
        </Box>
      )}
    </Container>
  );
}

export default ViewOrders;
