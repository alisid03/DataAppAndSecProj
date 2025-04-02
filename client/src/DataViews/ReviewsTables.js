import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#29648A" },
    secondary: { main: "#2e9cca" },
    background: { default: "#25274D", paper: "#464866" },
    text: { primary: "#E1E1F3", secondary: "#AAABB8" },
  },
});

function ViewReviews() {
  const [reviewData, setReviewData] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const response = await fetch('http://localhost:8080/getReviews', {
          method: "GET",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-type": "application/json",
          },
        });
        const data = await response.json();
        setReviewData(data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    }
    fetchReviews();
  }, []);

  const columns= [
    { field: "review_id", headerName: "Review ID", width: 100 },
    { field: "user_id", headerName: "User ID", width: 100 },
    { field: "product_id", headerName: "Product ID", width: 100 },
    { field: "rating", headerName: "Rating", type: "number", width: 100 },
    { field: "comment", headerName: "Comment", width: 300 },
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: 500, width: "100%", padding: 2 }}>
        <DataGrid
          getRowId={(row) => row.review_id}
          rows={reviewData}
          columns={columns}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </ThemeProvider>
  );
}

export default ViewReviews;