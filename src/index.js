import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter as Router,RouteProps,Route } from "react-router-dom";
//import {Router} as {BrowserRouter};
import theme from "./theme"
// TODO: CRIO_TASK_MODULE_REGISTER - Add Target container ID (refer public/index.html)
ReactDOM.render(
  <React.StrictMode>
    <Router>
    <ThemeProvider theme={theme}>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
        </SnackbarProvider>
    </ThemeProvider>
    </Router>
  </React.StrictMode>
 
  ,
   document.getElementById('root')
);
