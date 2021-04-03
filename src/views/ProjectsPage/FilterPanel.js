/*eslint-disable*/
import React from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

import { Box, Checkbox, FormGroup, FormControlLabel, FormControl, Paper, Divider, ListSubheader, ListItemIcon, Typography } from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import * as Constants from "../../constants";

import { Store } from "../../store/store";
import { toggleProjectFilters, toggleGeomVisibility } from "../../store/actions";

//const useStyles = makeStyles(styles);
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
  },
  filterCheckbox: {
    padding: '0px 4px 0px 4px',
    margin: '0px',
    fontSize: '0.5rem'
  },
  filterCheckboxLabel: {
    color: '#2F4F4F',
    fontSize: '0.85rem'
  },
  filterTitle: {
    padding: '2px 8px',
    backgroundColor: '#F0F8FF',
    color: '#2F4F4F',
    fontWeight: 'bold',
    fontSize: '0.85rem'
  }
}));

export default function FilterPanel(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const { state, dispatch } = React.useContext(Store);

  const filterIsActive = (filterName, filterValue) => {
    var isActive = state.projectFilters.findIndex(function (element) {
      return element.name == filterName && element.value == filterValue;
    }) >= 0;
    //console.log(filterName + '-' + filterValue + ': ' + isActive);
    return isActive;
  };

  const updateCheckboxes = () => {
    setStatusState({
      planning: filterIsActive(Constants.FILTER_NAME_TYPE, Constants.PROJECT_TYPE_PLAN),
      design: filterIsActive(Constants.FILTER_NAME_TYPE, Constants.PROJECT_TYPE_DESIGN),
      evaluation: filterIsActive(Constants.FILTER_NAME_TYPE, Constants.PROJECT_TYPE_EVALUATION),
      deployment: filterIsActive(Constants.FILTER_NAME_TYPE, Constants.PROJECT_TYPE_DEPLOYMENT),
      data: filterIsActive(Constants.FILTER_NAME_TYPE, Constants.PROJECT_TYPE_DATA),
      other: filterIsActive(Constants.FILTER_NAME_TYPE, Constants.PROJECT_TYPE_OTHER)
    });

    setCategoryState({
      automated: filterIsActive(Constants.FILTER_NAME_CATEGORY, 'a'),
      connected: filterIsActive(Constants.FILTER_NAME_CATEGORY, 'c'),
      electric: filterIsActive(Constants.FILTER_NAME_CATEGORY, 'e'),
      shared: filterIsActive(Constants.FILTER_NAME_CATEGORY, 's')
    });

    setModeState({
      auto: filterIsActive(Constants.FILTER_NAME_MODE, 'a'),
      bike: filterIsActive(Constants.FILTER_NAME_MODE, 'b'),
      transit: filterIsActive(Constants.FILTER_NAME_MODE, 't')
    });

    setScopeState({
      statewide: filterIsActive(Constants.FILTER_NAME_SCOPE, Constants.PROJECT_SCOPE_STATEWIDE),
      local: filterIsActive(Constants.FILTER_NAME_SCOPE, Constants.PROJECT_SCOPE_LOCAL)
    });

    setDistrictState({
      d1: filterIsActive(Constants.FILTER_NAME_DISTRICT, '1'),
      d2: filterIsActive(Constants.FILTER_NAME_DISTRICT, '2'),
      d3: filterIsActive(Constants.FILTER_NAME_DISTRICT, '3'),
      d4: filterIsActive(Constants.FILTER_NAME_DISTRICT, '4'),
      d5: filterIsActive(Constants.FILTER_NAME_DISTRICT, '5'),
      d6: filterIsActive(Constants.FILTER_NAME_DISTRICT, '6'),
      d7: filterIsActive(Constants.FILTER_NAME_DISTRICT, '7'),
      turnpike: filterIsActive(Constants.FILTER_NAME_DISTRICT, 't')
    });
  }

  React.useEffect(
    () => {
      updateCheckboxes();
    }, [state.projectFilters]);


  const [statusState, setStatusState] = React.useState({
    planning: false,
    design: false,
    evaluation: false,
    deployment: false,
    data: false,
    other: false
  });
  const handleChangeStatus = (value) => event => {
    switch (value) {
      case Constants.PROJECT_TYPE_PLAN:
        setStatusState({ ...statusState, planning: event.target.checked });
        break;
      case Constants.PROJECT_TYPE_DESIGN:
        setStatusState({ ...statusState, design: event.target.checked });
        break;
      case Constants.PROJECT_TYPE_EVALUATION:
        setStatusState({ ...statusState, evaluation: event.target.checked });
        break;
      case Constants.PROJECT_TYPE_DEPLOYMENT:
        setStatusState({ ...statusState, deployment: event.target.checked });
        break;
      case Constants.PROJECT_TYPE_DATA:
        setStatusState({ ...statusState, data: event.target.checked });
        break;
      case Constants.PROJECT_TYPE_OTHER:
        setStatusState({ ...statusState, other: event.target.checked });
        break;
      default:
        return;
    }
    toggleProjectFilters({ name: Constants.FILTER_NAME_TYPE, value: value }, state, dispatch);
  };

  const [categoryState, setCategoryState] = React.useState({
    automated: false,
    connected: false,
    electric: false,
    shared: false
  });
  const handleChangeCategory = (value) => event => {
    switch (value) {
      case 'a':
        setCategoryState({ ...categoryState, automated: event.target.checked });
        break;
      case 'c':
        setCategoryState({ ...categoryState, connected: event.target.checked });
        break;
      case 'e':
        setCategoryState({ ...categoryState, electric: event.target.checked });
        break;
      case 's':
        setCategoryState({ ...categoryState, shared: event.target.checked });
        break;
      default:
        return;
    }
    toggleProjectFilters({ name: Constants.FILTER_NAME_CATEGORY, value: value }, state, dispatch);
  };

  const [modeState, setModeState] = React.useState({
    auto: false,
    bike: false,
    transit: false
  });
  const handleChangeMode = (value) => event => {
    switch (value) {
      case 'a':
        setModeState({ ...modeState, auto: event.target.checked });
        break;
      case 'b':
        setModeState({ ...modeState, bike: event.target.checked });
        break;
      case 't':
        setModeState({ ...modeState, transit: event.target.checked });
        break;
      default:
        return;
    }
    toggleProjectFilters({ name: Constants.FILTER_NAME_MODE, value: value }, state, dispatch);
  };

  const [scopeState, setScopeState] = React.useState({
    statewide: false,
    local: false
  });
  const handleChangeScope = (value) => event => {
    switch (value) {
      case Constants.PROJECT_SCOPE_STATEWIDE:
        setScopeState({ ...scopeState, statewide: event.target.checked });
        break;
      case Constants.PROJECT_SCOPE_LOCAL:
        setScopeState({ ...scopeState, local: event.target.checked });
        break;
      default:
        return;
    }
    toggleProjectFilters({ name: Constants.FILTER_NAME_SCOPE, value: value }, state, dispatch);
  };

  const [districtState, setDistrictState] = React.useState({
    d1: false,
    d2: false,
    d3: false,
    d4: false,
    d5: false,
    d6: false,
    d7: false,
    turnpike: false
  });
  const handleChangeDistrict = (value) => event => {
    switch (value) {
      case '1':
        setDistrictState({ ...districtState, d1: event.target.checked });
        break;
      case '2':
        setDistrictState({ ...districtState, d2: event.target.checked });
        break;
      case '3':
        setDistrictState({ ...districtState, d3: event.target.checked });
        break;
      case '4':
        setDistrictState({ ...districtState, d4: event.target.checked });
        break;
      case '5':
        setDistrictState({ ...districtState, d5: event.target.checked });
        break;
      case '6':
        setDistrictState({ ...districtState, d6: event.target.checked });
        break;
      case '7':
        setDistrictState({ ...districtState, d7: event.target.checked });
        break;
      case 't':
        setDistrictState({ ...districtState, turnpike: event.target.checked });
        break;
      default:
        return;
    }
    toggleProjectFilters({ name: Constants.FILTER_NAME_DISTRICT, value: value }, state, dispatch);
  };


  const [hoveredProject, setHoveredProject] = React.useState();

  const handleProjectClick = (id, event) => {
    if (id) {
      props.history.push(Constants.ROOT_URL + "projects/" + id);
      //console.log("project: " + id);
    }
  };
  const handleProjectHover = (id, event) => {
    if (hoveredProject !== id) {
      //console.log('show geom: ' + id);
      toggleGeomVisibility(id, state, dispatch);
      setHoveredProject(id);
    }
  };
  const handleProjectLeave = (id, event) => {
    if (hoveredProject) {
      //console.log('hide geom');
      toggleGeomVisibility(0, state, dispatch);
      setHoveredProject(null);
    }
  };


  function renderProjectCard(project, size = 13) {
    console.log(project.properties.id);
    return (
      <ListItem button divider={true} key={project.properties.id}
        style={{ margin: '0px', padding: '4px 6px 4px 6px' }}
        onClick={(e) => handleProjectClick(project.properties.id, e)}>
        <div>
          <div style={{ width: '', backgroundColor: '', float: '' }}>
            <div style={{ width: '64px', height: '', backgroundColor: '', padding: '0px', textAlign: '' }}>
              {
                ["a", "c", "e", "s"].map((cat, i) =>
                  (project.properties.category.includes(cat))
                    ? <img src={require('assets/img/aces_' + cat + '_on.svg')} height={size + 'px'} />
                    : <img src={require('assets/img/aces_' + cat + '_off.svg')} height={size + 'px'} />
                )
              }
            </div>
            <div style={{ width: '', height: '', backgroundColor: '', padding: '0px', textAlign: '' }}>
              <svg height="10" width="10">
                <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                  fill={Constants.PROJECT_TYPE_COLORS[Constants.PROJECT_TYPE_DESIGN]} />
              </svg>
              <img src={require('assets/img/statewide_icon.png')} height="14px" style={{ marginLeft: '10px' }} />
            </div>
          </div>

          <div style={{ width: '100%', margin: '0px 0px 0px 0px', padding: '0px', lineHeight: '1rem', fontSize: '' }}>
            {/* <div style={{float: 'left', width: '20px'}}>
            <img src={require('assets/img/statewide_icon.png')} height="16px" />
          </div> */}
            <span style={{ paddingLeft: '', backgroundColor: '', color: '#2F4F4F', fontWeight: 'bold', fontSize: '0.9rem' }}>
              dsfa dfad adfa
          </span>
          </div>

        </div>
      </ListItem>
    );
  }

  /* const { projects, visibleProjects, projectFilters, toggleProjectFilters } = props;

  if (state.project != null)
    return null; */

  return (
    <Paper elevation={2} style={{
      position: 'absolute', top: (Constants.HEADER_HEIGHT + 55) + 'px', left: '10px', bottom: '20px',
      width: '360px', overflow: 'auto', backgroundColor: '#fafafa'
    }} >
      <Paper elevation={2} style={{
        width: '140px', overflow: 'hidden', height: '100%'
      }} >
        <div style={{ padding: '8px 0px 0px 8px', margin: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>Filter by Attribute</div>
        <List dense={true} style={{ fontSize: '0.85rem' }}>
          <ListItem className={classes.filterTitle}>Location</ListItem>
          <ListItem>
            <FormGroup>
              <FormControlLabel label={
                <div>
                  <span className={classes.filterCheckboxLabel}>Statewide&nbsp;</span>
                  <img src={require('assets/img/statewide_icon.png')} height="14px" />
                </div>
              }
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={scopeState.statewide}
                  onChange={handleChangeScope(Constants.PROJECT_SCOPE_STATEWIDE)} value={Constants.PROJECT_SCOPE_STATEWIDE}
                  margin="dense" size="small" />} />
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Local</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={scopeState.local}
                  onChange={handleChangeScope(Constants.PROJECT_SCOPE_LOCAL)} value={Constants.PROJECT_SCOPE_LOCAL}
                  margin="dense" size="small" />} />
            </FormGroup>
          </ListItem>

          <ListItem className={classes.filterTitle}>ACES Category</ListItem>
          <ListItem>
            <FormGroup>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Automated</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.automated}
                  onChange={handleChangeCategory('a')} value="a" margin="dense" size="small" />} />
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Connected</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.connected}
                  onChange={handleChangeCategory('c')} value="c" margin="dense" size="small" />} />
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Electric</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.electric}
                  onChange={handleChangeCategory('e')} value="e" margin="dense" size="small" />} />
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Shared</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.shared}
                  onChange={handleChangeCategory('s')} value="s" margin="dense" size="small" />} />
            </FormGroup>
          </ListItem>

          <ListItem className={classes.filterTitle}>Type</ListItem>
          <ListItem style={{ paddingRight: '0px', marginRight: '0px' }}>
            <FormGroup>
              <Box>
                <FormControlLabel label={
                  <div>
                    <span className={classes.filterCheckboxLabel}>Planning&nbsp;</span>
                    <svg height="10" width="10" style={{ marginLeft: '4px' }}>
                      <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                        fill={Constants.PROJECT_TYPE_COLORS[Constants.PROJECT_TYPE_PLAN]} />
                    </svg>
                    {/* <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_PLAN + '.svg')} /> */}
                  </div>
                }
                  control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.planning}
                    onChange={handleChangeStatus(Constants.PROJECT_TYPE_PLAN)} value={Constants.PROJECT_TYPE_PLAN}
                    margin="dense" size="small" />} />
              </Box>
              <Box>
                <FormControlLabel label={
                  <div>
                    <span className={classes.filterCheckboxLabel}>Design&nbsp;</span>
                    <svg height="10" width="10" style={{ marginLeft: '4px' }}>
                      <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                        fill={Constants.PROJECT_TYPE_COLORS[Constants.PROJECT_TYPE_DESIGN]} />
                    </svg>
                    {/* <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_DESIGN + '.svg')} /> */}
                  </div>
                }
                  control={<Checkbox color='primary' className={classes.filterCheckbox} checked={statusState.design}
                    onChange={handleChangeStatus(Constants.PROJECT_TYPE_DESIGN)} value={Constants.PROJECT_TYPE_DESIGN}
                    margin="dense" size="small" />} />
              </Box>
              <Box>
                <FormControlLabel label={
                  <div>
                    <span className={classes.filterCheckboxLabel}>Deployment</span>
                    <svg height="10" width="10" style={{ marginLeft: '4px' }}>
                      <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                        fill={Constants.PROJECT_TYPE_COLORS[Constants.PROJECT_TYPE_DEPLOYMENT]} />
                    </svg>
                    {/* <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_DEPLOYMENT + '.svg')} /> */}
                  </div>
                }
                  control={<Checkbox color='primary' className={classes.filterCheckbox} checked={statusState.deployment}
                    onChange={handleChangeStatus(Constants.PROJECT_TYPE_DEPLOYMENT)} value={Constants.PROJECT_TYPE_DEPLOYMENT}
                    margin="dense" size="small" />} />
              </Box>
              <Box style={{ padding: '0px', margin: '0px' }}>
                <FormControlLabel label={
                  <div>
                    <span className={classes.filterCheckboxLabel}>Evaluation&nbsp;</span>
                    <svg height="10" width="10" style={{ marginLeft: '4px' }}>
                      <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                        fill={Constants.PROJECT_TYPE_COLORS[Constants.PROJECT_TYPE_EVALUATION]} />
                    </svg>
                    {/* <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_EVALUATION + '.svg')} /> */}
                  </div>
                }
                  control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.evaluation}
                    onChange={handleChangeStatus(Constants.PROJECT_TYPE_EVALUATION)} value={Constants.PROJECT_TYPE_EVALUATION}
                    margin="dense" size="small" />} />
              </Box>
              <Box>
                <FormControlLabel label={
                  <div>
                    <span className={classes.filterCheckboxLabel}>Data&nbsp;</span>
                    <svg height="10" width="10" style={{ marginLeft: '4px' }}>
                      <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                        fill={Constants.PROJECT_TYPE_COLORS[Constants.PROJECT_TYPE_DATA]} />
                    </svg>
                    {/* <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_DATA + '.svg')} /> */}
                  </div>
                }
                  control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.data}
                    onChange={handleChangeStatus(Constants.PROJECT_TYPE_DATA)} value={Constants.PROJECT_TYPE_DATA}
                    margin="dense" size="small" />} />
              </Box>
              <Box>
                <FormControlLabel label={
                  <div>
                    <span className={classes.filterCheckboxLabel}>Other&nbsp;</span>
                    <svg height="10" width="10" style={{ marginLeft: '4px' }}>
                      <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                        fill={Constants.PROJECT_TYPE_COLORS[Constants.PROJECT_TYPE_OTHER]} />
                    </svg>
                    {/* <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_OTHER + '.svg')} /> */}
                  </div>
                }
                  control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.other}
                    onChange={handleChangeStatus(Constants.PROJECT_TYPE_OTHER)} value={Constants.PROJECT_TYPE_OTHER}
                    margin="dense" size="small" />} />
              </Box>
            </FormGroup>
          </ListItem>

{/*           <ListItem className={classes.filterTitle}>Mode</ListItem>
          <ListItem>
            <FormGroup>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Auto</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={modeState.auto}
                  onChange={handleChangeMode('a')} value="a" margin="dense" size="small" />} />
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Bike</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={modeState.bike}
                  onChange={handleChangeMode('b')} value="b" margin="dense" size="small" />} />
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Transit</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={modeState.transit}
                  onChange={handleChangeMode('t')} value="t" margin="dense" size="small" />} />
            </FormGroup>
          </ListItem> */}

        </List>

      </Paper>

      <Paper elevation={0} style={{
        position: 'absolute', top: '0px', right: '0px', bottom: '0px',
        width: '220px', overflow: 'auto', backgroundColor: 'transparent'
      }} >
        {
          true &&
          <div style={{ padding: '8px 0px 0px 8px', margin: '0', fontSize: '0.9rem', fontWeight: 'bold' }}>
            {(state.visibleProjects.length == 0 ? 'No' : state.visibleProjects.length) +
              " Result" + (state.visibleProjects.length > 1 ? "s" : "")}
          </div>
        }

        <List component="nav">
          <Divider></Divider>
          {
            state.visibleProjects.map((project, key) =>
              //renderProjectCard(proj);
              <ListItem button divider={true} key={key}
                style={{ margin: '0px', padding: '6px 5px 6px 10px' }}
                onClick={(e) => handleProjectClick(project.properties.id, e)} 
                onMouseEnter={(e) => handleProjectHover(project.properties.id, e)}
                onMouseLeave={(e) => handleProjectLeave(project.properties.id, e)}>
                <div style={{ width: '', backgroundColor: '', float: '' }}>
                  <div style={{ width: '62px', height: '', backgroundColor: '', padding: '0px', textAlign: '' }}>
                    {
                      ["a", "c", "e", "s"].map((cat, i) =>
                        (project.properties.category.includes(cat))
                          ? <img src={require('assets/img/aces_' + cat + '_on.svg')} height={'13px'} />
                          : <img src={require('assets/img/aces_' + cat + '_off.svg')} height={'13px'} />
                      )
                    }
                  </div>
                  <div style={{ width: '', height: '', backgroundColor: '', padding: '0 0 0 22px', textAlign: '' }}>
                    <svg height="10" width="10">
                      <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0"
                        fill={Constants.PROJECT_TYPE_COLORS[project.properties.status]} />
                    </svg>

                  </div>
                </div>

                <div style={{ width: '100%', margin: '0px 0px 0px 0px', padding: '0px', lineHeight: '1.1rem', fontSize: '' }}>
                  {
                    project.properties.statewide &&
                    <img src={require('assets/img/statewide_icon.png')} height="13px" style={{ paddingRight: '5px' }} />
                  }
                  <span style={{
                    paddingLeft: '', backgroundColor: '', fontSize: '0.85rem',
                    color: (project.properties.statewide) ? '#005ca2' : '',
                    fontWeight: (project.properties.statewide) ? 'bold' : 'normal'
                  }}>
                    {project.properties.shortTitle}
                  </span>
                </div>
              </ListItem>
            )
          }
        </List>

      </Paper>

    </Paper>
  );
}

