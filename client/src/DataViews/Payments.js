import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { DataGrid } from "@mui/x-data-grid";

function ViewPayments() {
  const [paymentsData, setPaymentsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPayments() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/getPayments", {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();

        const seenIds = new Set();
        let uniqueIndex = 0;

        const processedData = data
          .filter((item) => {
            if (
              item.payment_id === null ||
              typeof item.payment_id === "undefined"
            ) {
              console.warn("Payment data missing payment_id:", item);
              return false;
            }
            return true;
          })
          .map((item) => {
            let id = item.payment_id;
            if (seenIds.has(id)) {
              console.warn(
                `Duplicate payment_id found: ${id}. Assigning temporary unique ID.`
              );

              const tempId = `duplicate-${id}-${uniqueIndex++}`;

              return {
                ...item,
                _original_payment_id: item.payment_id,
                payment_id: tempId,
                _is_duplicate_id: true,
              };
            }
            seenIds.add(id);
            return { ...item, _is_duplicate_id: false };
          });

        setPaymentsData(processedData);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError(
          `Failed to fetch payments: ${error.message}. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchPayments();
  }, []);

  const columns = [
    { field: "payment_id", headerName: "Payment ID", width: 120 },
    { field: "order_id", headerName: "Order ID", width: 120 },
    {
      field: "payment_method",
      headerName: "Payment Method",
      width: 150,
      flex: 1,
    },
    { field: "status", headerName: "Status", width: 120 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "text.primary", textAlign: "center", mb: 3 }}
      >
        Payments Data
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
            getRowId={(row) => row.payment_id}
            rows={paymentsData}
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

export default ViewPayments;
