import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import MaterialTable from "material-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";


import styles from "assets/jss/material-kit-react/views/loginPage.js";
import { List, ListItem, Box, Paper, Button, Divider, ListItemIcon, ListItemText } from "@material-ui/core";
import { People as PeopleIcon, Assignment as AssignmentIcon, ExitToApp as ExitToAppIcon } from '@material-ui/icons';
import { NavLink, Link } from "react-router-dom";
import * as Constants from "../../constants"
import { useUserState, useUserDispatch, loginUser, signOut } from "../../context/UserContext";
import { Store } from "../../store/store"
import {
  fetchProjectsData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject,
  setViewport, toggleGeomVisibility, toggleMapStyle
} from "../../store/actions"
import { dashboardProjects } from "./data"

const useStyles = makeStyles(styles);

export default function DashboardNav(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { isAuthenticated, isAdmin, profile } = useUserState();
  const userDispatch = useUserDispatch();

  const handleSignout = () => {
    signOut(userDispatch, props.history);
  }

  const { state, dispatch } = React.useContext(Store);

  const { projects, setProjects } = React.useState(dashboardProjects);

  return (
    <Box p={0} style={{ width: '275px', overflow: 'hidden', padding: '40px 0px 50px 20px' }}>
      <List component="nav">
        <ListItem button style={{ margin: '0px 0', padding: '20px' }}>
          <ListItemIcon>
            <AssignmentIcon />
          </ListItemIcon>
          <NavLink to={Constants.ROOT_URL + "dashboard/projects"} activeStyle={{ fontWeight: 'bold' }}
            style={{ fontSize: '1.2em', color: '#222' }}>{isAdmin ? "Projects" : "My Projects"}</NavLink>
        </ListItem>
      </List>
      <Divider />
      <List component="nav">
        <ListItem button style={{ margin: '0px 0', padding: '20px' }}>
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <NavLink to={Constants.ROOT_URL + (isAdmin ? "dashboard/users" : "dashboard/users/" + profile.id)} 
            activeStyle={{ fontWeight: 'bold' }}
            style={{ fontSize: '1.2em', color: '#222' }}>{isAdmin ? "Users" : "My Profile"}</NavLink>
        </ListItem>
      </List>
      <Divider />
      <List component="nav">
        <ListItem button style={{ margin: '10px 0 0 0', padding: '10px 20xp 10px 20px' }}>
          <ListItemIcon>
            <ExitToAppIcon />
          </ListItemIcon>          
          <ListItemText primary="Sign Out" onClick={handleSignout} />
        </ListItem>
      </List>
    </Box>
  );
}
