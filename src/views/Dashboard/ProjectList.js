import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";

import MaterialTable from "material-table";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/material-kit-react/views/loginPage.js";
import { List, ListItem, Box, Paper, Button, Divider, ListItemIcon, ListItemText, Fab } from "@material-ui/core";
import { People as PeopleIcon, Assignment as AssignmentIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@material-ui/icons';
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

const useStyles = makeStyles(styles);

export default function ProjectList(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { isAuthenticated, isAdmin, profile } = useUserState();
  const userDispatch = useUserDispatch();

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleEditProject = (event, rowData) => {
    //console.log('edit project ' + rowData.id);
    props.history.push(Constants.ROOT_URL + "dashboard/projects/" + rowData.id);
  }

  const handleAddProject = () => {
    props.history.push(Constants.ROOT_URL + "dashboard/projects/new");
  };


  const { state, dispatch } = React.useContext(Store);

  const { projects, setProjects } = React.useState(dashboardProjects);

  let activeProjects = dashboardProjects.filter(function (element) {
    return element.status != 0;
  });
  let pendingProjects = dashboardProjects.filter(function (element) {
    return element.status == 0;
  });

  if (!isAdmin) {
    let arr = activeProjects.filter(function (element) {
      return profile.projects.includes(element.id);
    });
    activeProjects = arr;
  }

  if (!isAdmin) {
    let arr = pendingProjects.filter(function (element) {
      return profile.projects.includes(element.id);
    });
    pendingProjects = arr;
  }

  return (
    <Box style={{ width: '100%', overflow: 'auto', padding: '10px 20px 20px 20px', minHeight: 'calc(100vh - 150px)' }} >
      {
        pendingProjects.length > 0 &&
        <React.Fragment>
          <div style={{ margin: '30px 0 15px 0', fontSize: '1.4em', fontWeight: 'bold' }}>Pending Projects</div>
          <MaterialTable
            columns={[
              {
                title: 'Title', field: 'name',
                cellStyle: {
                  width: '100%', wordWrap: 'none'
                }
              }
            ]}
            data={pendingProjects}
            title=""
            options={{
              toolbar: false,
              search: false,
              paging: false,
              //pageSize: 10,
              selection: false,
              actionsColumnIndex: -1
            }}
            actions={
              isAdmin
                ? [{
                  icon: 'edit',
                  tooltip: 'Edit Project',
                  onClick: handleEditProject
                },
                {
                  icon: 'check',
                  tooltip: 'Approve',
                  onClick: (event, rowData) => console.log("approve " + rowData.id)
                },
                {
                  icon: 'clear',
                  tooltip: 'Reject',
                  onClick: (event, rowData) => console.log("reject " + rowData.id)
                }]
                : [{
                  icon: 'edit',
                  tooltip: 'Edit Project',
                  onClick: handleEditProject
                },
                {
                  icon: 'delete',
                  tooltip: 'Delete',
                  onClick: (event, rowData) => console.log("delete " + rowData.id)
                }]}
            onRowClick={handleEditProject}
          />
        </React.Fragment>
      }

      <div style={{ margin: '30px 0 15px 0', fontSize: '1.4em', fontWeight: 'bold' }}>
        Active Projects
      </div>
      <MaterialTable
        columns={[
          {
            title: 'Title', field: 'name',
            cellStyle: {
              width: '100%', wordWrap: 'none'
            }
          },
          { title: 'Status', field: 'status', lookup: { 1: 'Planning', 2: 'Implementation', 3: 'Implementation', 4: 'Live' } },
          //{ title: 'Category', field: 'category' },
          //{ title: 'Mode', field: 'mode' }
        ]}
        data={activeProjects}
        title=""
        options={{
          search: activeProjects.length > 10,
          toolbar: activeProjects.length > 10,
          paging: activeProjects.length > 10,
          pageSize: 10,
          selection: false,
          actionsColumnIndex: -1
        }}
        actions={
          isAdmin
            ? [{
              icon: 'edit',
              tooltip: 'Edit Project',
              onClick: handleEditProject
            },
            {
              icon: 'delete',
              tooltip: 'Delete Project',
              onClick: (event, rowData) => console.log("delete " + rowData.id)
            }]
            : [{
              icon: 'edit',
              tooltip: 'Edit Project',
              onClick: handleEditProject
            }]
        }
        onRowClick={handleEditProject}
      />
      <div style={{ textAlign: 'right' }}>
        <Fab color="primary" style={{ margin: '20px' }} onClick={handleAddProject}>
          <AddIcon />
        </Fab>
      </div>
    </Box>
  );
}
