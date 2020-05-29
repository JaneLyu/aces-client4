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
  Checkbox, Switch, Fab, RadioGroup, Radio
} from "@material-ui/core";
import { People as PeopleIcon, Assignment as AssignmentIcon, ExitToApp as ExitToAppIcon, Add as AddIcon } from '@material-ui/icons';
import { NavLink, Link } from "react-router-dom";
import * as Constants from "../../constants"
import { useUserState, useUserDispatch, loginUser, signOut } from "../../context/UserContext";
import { Store } from "../../store/store"
import { dashboardProjects, dashboardUsers as peopleDB } from "./data"
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


export default function ProjectView(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { isAuthenticated, isAdmin } = useUserState();
  const userDispatch = useUserDispatch();


  const { state, dispatch } = React.useContext(Store);

  const { projects, setProjects } = React.useState(dashboardProjects);

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const project = dashboardProjects.find(function (element) {
    return element.id == props.projectId;
  });

  const isNewProject = project == undefined;


  const [viewport, setViewport] = React.useState({
    latitude: 29.15,
    longitude: -82.5,
    zoom: 7,
    bearing: 0,
    pitch: 0,
  });

  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const steps = getSteps();

  const isStepOptional = step => {
    //return step === 1;
    return false;
  };

  const isStepSkipped = step => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(newSkipped);

    if (activeStep === steps.length - 1) {
      // back to list
      props.history.push(Constants.ROOT_URL + "dashboard/projects");
    }
  };

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep(prevActiveStep => prevActiveStep + 1);
    setSkipped(prevSkipped => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  const [projectTitle, setProjectTitle] = React.useState(isNewProject ? '' : project.name);
  const handleProjectTitleChange = event => {
    setProjectTitle(event.target.value);
  };

  const [projectDesc, setProjectDesc] = React.useState(isNewProject ? '' : project.desc_text);
  const handleProjectDescChange = event => {
    setProjectDesc(event.target.value);
  };


  const onViewportChange = vp => {
    setViewport(vp);
  }

  // people
  var num = 2 + Math.floor(Math.random() * 8);
  let ppeople = [];
  while (ppeople.length < num) {
    var rnd = Math.floor(Math.random() * peopleDB.length);
    var person = peopleDB[rnd];
    const match = ppeople.find(function (element) {
      return element.id == person.id;
    });
    if (!match)
      ppeople.push(person);
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        // basic infor
        return (
          <Grid container spacing={4}>
            <Grid item sm={12} md={12}>
              <TextField label='Project Title' value={projectTitle} fullWidth variant="outlined" onChange={handleProjectTitleChange} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={1} style={{ margin: '0px 0px', padding: '20px', height: '220px' }}>
                <FormControl>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>Status</div>
                  <RadioGroup name="status1">
                    <FormControlLabel value="1" control={<Radio color="primary" />} label="Planning" style={{ color: '#666' }} />
                    <FormControlLabel value="2" control={<Radio color="primary" />} label="Design" style={{ color: '#666' }} />
                    <FormControlLabel value="3" control={<Radio color="primary" />} label="Implementation" style={{ color: '#666' }} />
                    <FormControlLabel value="4" control={<Radio color="primary" />} label="Live" style={{ color: '#666' }} />
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={1} style={{ margin: '0px 0px', padding: '20px', height: '220px' }}>
                <FormControl>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>Category</div>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch value="a" color="primary" />}
                      label="Autonomous" style={{ color: '#666' }}
                    />
                    <FormControlLabel
                      control={<Switch value="c" color="primary" />}
                      label="Connected" style={{ color: '#666' }}
                    />
                    <FormControlLabel
                      control={<Switch value="e" color="primary" />}
                      label="Electric" style={{ color: '#666' }}
                    />
                    <FormControlLabel
                      control={<Switch value="s" color="primary" />}
                      label="Shared" style={{ color: '#666' }}
                    />
                  </FormGroup>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={1} style={{ margin: '0px 0px', padding: '20px', height: '220px' }}>
                <FormControl>
                  <div style={{ fontWeight: 'bold', color: '#333' }}>Mode</div>
                  <FormGroup>
                    <FormControlLabel
                      control={<Switch value="a" color="primary" />}
                      label="Auto" style={{ color: '#666' }}
                    />
                    <FormControlLabel
                      control={<Switch value="b" color="primary" />}
                      label="Bike" style={{ color: '#666' }}
                    />
                    <FormControlLabel
                      control={<Switch value="t" color="primary" />}
                      label="Transit" style={{ color: '#666' }}
                    />
                  </FormGroup>
                </FormControl>
              </Paper>
            </Grid>
            <Grid item sm={12} md={12}>
              <TextField label="Project Description" value={projectDesc} onChange={handleProjectDescChange}
                fullWidth variant="outlined" multiline rows="10" />
            </Grid>
            <Grid item sm={12} md={12}>
              <Paper elevation={1} style={{ margin: '0px 0px', padding: '10px' }}>
                <div style={{ fontWeight: 'bold', color: '#333' }}>Images</div>
                <ImageUploader
                  withIcon={true}
                  buttonText='Upload Images'
                  //onChange={onDrop}
                  imgExtension={['.jpg', '.gif', '.png', '.gif']}
                  maxFileSize={5242880}
                />
              </Paper>
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container>
            <Grid item sm={12} md={12}>
              <div style={{ fontWeight: 'bold', color: '#333', margin: '0px 0 10px 0' }}>Project Location</div>
              <MapGL
                {...viewport}
                width="100%"
                height="450px"
                mapStyle={Constants.MAPBOX_STYLE_STREET}
                onViewportChange={onViewportChange}
                mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
              >
                <div style={{ position: 'absolute', padding: '10px', top: '0px', right: '0px' }}>
                  <NavigationControl />
                </div>

              </MapGL>
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container>
            <Grid item sm={12} md={12}>
              <div style={{ fontWeight: 'bold', color: '#333', margin: '0px 0 10px 0' }}>Team Members</div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
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
                      width: '300px'
                    }
                  },
                ]}
                data={ppeople}
                title=""
                options={{
                  toolbar: false,
                  search: false,
                  paging: false,
                  selection: false,
                  actionsColumnIndex: -1
                }}
                actions={[
                  {
                    icon: 'delete',
                    tooltip: 'Remove',
                  }
                ]}
              //onRowClick={handleEditUser}
              />
              <div style={{ textAlign: 'right' }}>
                <Fab color="primary" style={{ margin: '20px' }}>
                  <AddIcon />
                </Fab>
              </div>
            </Grid>
          </Grid>
        );
      case 3:
        return (
          <Grid container>
            <Grid item sm={12} md={12}>
              <div style={{ fontWeight: 'bold', color: '#333', margin: '0px 0 10px 0' }}>Data Files</div>
            </Grid>
            <Grid item xs={12} sm={12} md={6}>
              <MaterialTable
                columns={[
                  {
                    title: 'Name', field: 'name',
                  },
                  {
                    title: 'Type', field: 'type',
                  },
                  {
                    title: 'Size', field: 'size',
                  },
                ]}
                data={[
                  {
                    name: 'Project File 1',
                    type: 'PDF',
                    size: '2.1 MB',
                  },
                  {
                    name: 'Project File 2',
                    type: 'CSV',
                    size: '997 KB',
                  },
                  {
                    name: 'Project File 3',
                    type: 'Text',
                    size: '150 KB',
                  },
                  {
                    name: 'Project File 4',
                    type: 'Shapefile',
                    size: '10.5 MB',
                  },
                ]}
                title=""
                options={{
                  toolbar: false,
                  search: false,
                  paging: false,
                  selection: false,
                  actionsColumnIndex: -1
                }}
                actions={[
                  {
                    icon: 'delete',
                    tooltip: 'Remove',
                  }
                ]}
              //onRowClick={handleEditUser}
              />
              <div style={{ textAlign: 'right' }}>
                <Fab color="primary" style={{ margin: '20px' }}>
                  <AddIcon />
                </Fab>
              </div>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  }

  return (

    <Box style={{ width: '100%', overflow: 'auto', padding: '10px 20px 20px 20px', minHeight: 'calc(100vh - 150px)' }} >

      <div style={{ margin: '30px 0 15px 0', fontSize: '1.4em', fontWeight: 'bold' }}>
        {project ? 'Edit Project' : 'New Project'}
      </div>

      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step key={label} {...stepProps} >
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>
      <div>
        {false //activeStep === steps.length
          ? (
            <div>
              <Typography className={classes.instructions}>
                All steps completed - you&apos;re finished
            </Typography>
              <Button onClick={handleReset} className={classes.button}>
                Reset
            </Button>
            </div>
          ) : (
            <div>
              <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
              <div style={{ margin: '40px 20px 0px 20px' }}>
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  Back
              </Button>
                {isStepOptional(activeStep) && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSkip}
                    className={classes.button}
                  >
                    Skip
                  </Button>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button} style={{ marginLeft: '20px' }}
                >
                  {
                    activeStep === steps.length - 1 ? 'Finish' : 'Next'
                  }
                </Button>
              </div>
            </div>
          )}
      </div>

    </Box>
  );
}
