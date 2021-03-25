import React from "react";
import Mapping from "./components/Mapping";
import { CssBaseline, MuiThemeProvider } from "@material-ui/core";
import theme from "./theme";
import { SnackbarProvider } from "notistack";

function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} >
        <CssBaseline />
        <Mapping />
      </SnackbarProvider>
    </MuiThemeProvider>
  );
}

export default App;
