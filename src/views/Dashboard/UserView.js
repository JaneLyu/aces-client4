import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import MaterialTable from "material-table";
import ImageUploader from 'react-images-upload';
import MapGL, { Source, Layer, NavigationControl, ScaleControl } from "react-map-gl";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-kit-react/views/loginPage.js";
import {
  List, ListItem, Box, Paper, Button, Divider, ListItemIcon, ListItemText,
  Stepper, Step, StepLabel, Typography, Grid, TextField, FormControl, FormGroup, FormLabel, FormControlLabel,
  Checkbox, Switch, Fab
} from "@material-ui/core";
import { People as PeopleIcon, Assignment as AssignmentIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@material-ui/icons';
import { NavLink, Link } from "react-router-dom";
import * as Constants from "../../constants"
import { useUserState, useUserDispatch, loginUser, signOut } from "../../context/UserContext";
import { Store } from "../../store/store"
import { dashboardProjects, dashboardUsers } from "./data"
import DashboardNav from "./DashboardNav"
import GridItem from "components/Grid/GridItem";

//const useStyles = makeStyles(styles);


const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Basic Information', 'Location', 'Team Members', 'Data Files'];
}


export default function UserView(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { isAuthenticated, isAdmin } = useUserState();
  const userDispatch = useUserDispatch();

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const user = dashboardUsers.find(function (element) {
    return element.id == props.userId;
  });

  const isNewUser = user == undefined;

  return (
    <Box style={{ width: '100%', overflow: 'auto', padding: '10px 20px 20px 20px', minHeight: 'calc(100vh - 150px)' }} >

      <div style={{ margin: '30px 0 15px 0', fontSize: '1.4em', fontWeight: 'bold' }}>
        {user ? user.name : 'User Profile'}
      </div>
      {
        user &&
        <Grid container spacing={4} style={{ marginTop: '20px' }}>
          <Grid item xs={12} sm={12} md={12}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', overflow: 'hidden' }}>
              <img src={Constants.STATIC_ROOT_URL + 'images/user' + user.id + '.jpg'} width="120px" />
            </div>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <div>
              <i className={"far fa-envelope"} style={{ margin: '8px', padding: '0' }} />
              <i className={"fab fa-linkedin"} style={{ margin: '8px', padding: '0' }} />
              <i className={"fab fa-twitter"} style={{ margin: '8px', padding: '0' }} />
              <i className={"fab fa-facebook"} style={{ margin: '8px', padding: '0' }} />
            </div>
          </Grid>
        </Grid>
      }
    </Box>
  );
}
