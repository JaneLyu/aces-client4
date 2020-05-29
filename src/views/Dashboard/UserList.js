import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import MaterialTable from "material-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";


import styles from "assets/jss/material-kit-react/views/loginPage.js";
import { List, ListItem, Box, Paper, Button, Divider, ListItemIcon, ListItemText, Fab, Grid } from "@material-ui/core";
import { People as PeopleIcon, Assignment as AssignmentIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@material-ui/icons';
import { NavLink, Link } from "react-router-dom";
import * as Constants from "../../constants"
import { useUserState, useUserDispatch, loginUser, signOut } from "../../context/UserContext";
import { Store } from "../../store/store"
import {
  fetchProjectsData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject,
  setViewport, toggleGeomVisibility, toggleMapStyle
} from "../../store/actions"
import { dashboardUsers } from "./data"


const useStyles = makeStyles(styles);

export default function ProjectList(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { isAuthenticated, isAdmin } = useUserState();
  const userDispatch = useUserDispatch();

  if (!isAdmin)
    return null;

  const handleEditUser = (event, rowData) => {
    console.log('edit user ' + rowData.id);
    props.history.push(Constants.ROOT_URL + "dashboard/users/" + rowData.id);
  }

  return (
    <Box style={{ width: '100%', overflow: 'auto', padding: '10px 20px 20px 20px', minHeight: 'calc(100vh - 150px)' }} >
      <Grid container>
        <Grid item sm={12} md={6}>
          <div style={{ margin: '30px 0 15px 0', fontSize: '1.4em', fontWeight: 'bold' }}>All Users</div>
          <MaterialTable
            columns={[
              {
                title: '', field: 'id',
                render: rowData =>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden' }}>
                    <img src={Constants.STATIC_ROOT_URL + 'images/user' + rowData.id + '.jpg'} width="40px" />
                  </div>
              },
              {
                title: 'Name', field: 'name',
                cellStyle: {
                  width: '100%'
                }
              },
              //{ title: 'Projects', field: 'projects' },
            ]}
            tableLayout='fixed'
            data={dashboardUsers}
            title=""
            options={{
              pageSize: 10,
              selection: false,
              actionsColumnIndex: -1
            }}
            actions={[
              {
                icon: 'edit',
                tooltip: 'Edit',
                onClick: handleEditUser
              },
              {
                icon: 'delete',
                tooltip: 'Delete',
                onClick: (event, rowData) => console.log("delete user " + rowData.id)
              }
            ]}
            onRowClick={handleEditUser}
          />
          <div style={{ textAlign: 'right' }}>
            <Fab color="primary" style={{ margin: '20px' }}>
              <AddIcon />
            </Fab>
          </div>
        </Grid>
      </Grid>


    </Box>
  );
}
