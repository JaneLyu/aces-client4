import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
import { useParams } from "react-router-dom";

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
import DashboardNav from "./DashboardNav"
import ProjectList from "./ProjectList"
import ProjectView from "./ProjectView";

const useStyles = makeStyles(styles);

export default function DashboardPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { isAuthenticated, isAdmin } = useUserState();
  const userDispatch = useUserDispatch();


  let params = useParams();
  let projectId = 0;
  if (params.id != undefined) {
    projectId = parseInt(params.id);
  }

  const projectViewProps = {
    ...rest,
    projectId: projectId
  };

  return (
    <Box style={{ backgroundColor: 'white' }}>
      <div style={{
        position: 'relative', width: '100%', height: "65px", overflow: 'hidden', boxShadow:
          "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)"
      }}>
        <Header
          color="dark"
          brand="FL A&middot;C&middot;E&middot;S"
          rightLinks={<HeaderLinks {...props} />}
          fixed
          {...rest}
        />
      </div>
      <div>
        <Box display="flex" p={0} style={{ width: '100%', backgroundColor: 'white' }}>
          <DashboardNav {...rest} />
          {
            projectId == 0 ? <ProjectList {...rest} />
            : <ProjectView {...projectViewProps} />
          }
        </Box>
        <Footer />
      </div>
    </Box>
  );
}
