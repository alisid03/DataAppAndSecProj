import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert"; // Import Alert
import { DataGrid } from "@mui/x-data-grid";

function ViewReviews() {
  const [reviewData, setReviewData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchReviews() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("http://localhost:8080/getReviews", {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json",
          },
        });
        if (!response.ok) {
          // Check if response was successful
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReviewData(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setError(
          `Failed to fetch reviews: ${error.message}. Please try again later.`
        );
      } finally {
        setLoading(false);
      }
    }
    fetchReviews();
  }, []);

  const columns = [
    { field: "review_id", headerName: "Review ID", width: 100 },
    { field: "user_id", headerName: "User ID", width: 100 },
    { field: "product_id", headerName: "Product ID", width: 100 },
    { field: "rating", headerName: "Rating", type: "number", width: 100 },
    { field: "comment", headerName: "Comment", width: 300, flex: 1 },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {" "}
      {/* Use Container */}
      <Typography
        variant="h4"
        component="h1"
        gutterBottom
        sx={{ color: "primary", textAlign: "center", mb: 3 }}
      >
        Reviews Data
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
          <CircularProgress /> {/* Use CircularProgress for loading */}
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
          {" "}
          <DataGrid
            getRowId={(row) => row.review_id}
            rows={reviewData}
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

export default ViewReviews;
