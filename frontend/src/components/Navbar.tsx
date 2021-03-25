// @flow
import * as React from "react";
import { AppBar, IconButton, Toolbar, Typography } from "@material-ui/core";
import DriveEtaIcon from "@material-ui/icons/DriveEta";

export const Navbar: React.FunctionComponent = (props) => {
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu">
          <DriveEtaIcon />
        </IconButton>
        <Typography variant="h6">Code Delivery</Typography>
      </Toolbar>
    </AppBar>
  );
};
