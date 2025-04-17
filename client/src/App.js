import axios from "axios";
import "./App.css";
import TestLoginPage from "./LoginPage/TestLoginPage";
import Home from "./Home/Home";
import ReviewTables from "./DataViews/Reviews";
import CategoriesTables from "./DataViews/Categories";
import CustomersTables from "./DataViews/Customers";
import OrderDetailsTables from "./DataViews/OrderDetails";
import Orders from "./DataViews/Orders";
import Payments from "./DataViews/Payments";
import ProductCategoriesTables from "./DataViews/ProductCategories";
import ProductsTables from "./DataViews/Products";
import SignupPage from "./SignupPage";
import RequestPage from "./RequestPage";
import VerifyPage from "./Verify";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  HashRouter,
} from "react-router-dom";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";

const theme = createTheme({
  palette: {
    primary: { main: "#1e88e5" },
    secondary: { main: "#00897b" },
    background: { default: "#fafafa", paper: "#ffffff" },
    text: { primary: "#212121", secondary: "#757575" },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 600,
      marginBottom: "1rem",
      color: "#1e88e5",
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          padding: "24px",
          boxShadow: "0px 1px 3px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: "bold",
          backgroundColor: "#eeeeee",
          color: "#424242",
          borderBottom: "2px solid #bdbdbd",
        },
        body: {
          borderBottom: "1px solid #f5f5f5",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:nth-of-type(odd)": {
            backgroundColor: "#f9f9f9",
          },

          "&:hover": {
            backgroundColor: "#eeeeee",
          },
        },
      },
    },
    // Add DataGrid specific overrides
    MuiDataGrid: {
      styleOverrides: {
        root: ({ theme }) => ({
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: theme.shape.borderRadius,
          backgroundColor: theme.palette.background.paper,
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#eeeeee",
            borderBottom: `2px solid ${theme.palette.divider}`,
          },
          "& .MuiDataGrid-columnHeader": {
            color: "#424242",
            fontWeight: "bold",
            "&:focus, &:focus-within": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-cell": {
            // St
            borderBottom: `1px solid ${theme.palette.divider}`,
            "&:focus, &:focus-within": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-row": {
            "&:nth-of-type(odd)": {
              backgroundColor: "#f9f9f9",
            },
            "&:hover": {
              backgroundColor: "#eeeeee",
            },
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: `1px solid ${theme.palette.divider}`,
            backgroundColor: theme.palette.background.paper,
          },
        }),
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          color: "#ffffff",
          padding: "8px 16px",
          borderRadius: "20px",
        },
        containedSecondary: {
          color: "#ffffff",
          padding: "8px 16px",
          borderRadius: "20px",
        },
      },
    },
  },
});

//data will be the string we send from our server
const apiCall = () => {
  axios.get("http://localhost:8080").then((data) => {
    //this console.log will be in our frontend console
    console.log(data);
  });
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      {" "}
      {/* Wrap Router with ThemeProvider */}
      <CssBaseline /> {/* Apply baseline styles globally */}
      <Router>
        <Routes>
          <Route exact path="/" element={<TestLoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/verify" element={<VerifyPage />} />
          {/* Added routes for Data Views */}
          <Route path="/getReviews" element={<ReviewTables />} />
          <Route path="/getCategories" element={<CategoriesTables />} />
          <Route path="/getCustomers" element={<CustomersTables />} />
          <Route path="/getOrderDetails" element={<OrderDetailsTables />} />
          <Route path="/getOrders" element={<Orders />} />
          <Route path="/getPayments" element={<Payments />} />
          <Route
            path="/getProductCategories"
            element={<ProductCategoriesTables />}
          />
          <Route path="/getProducts" element={<ProductsTables />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
