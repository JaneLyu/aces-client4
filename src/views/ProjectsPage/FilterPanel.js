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

import * as Constants from "../../constants"

//import { Store } from "../../store/store"
//import { toggleProjectFilters, viewProject } from "../../store/actions"

//const useStyles = makeStyles(styles);
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(0),
  },
  filterCheckbox: {
    padding: '0px 4px',
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
    fontWeight: 'bold'
  }
}));

export default function FilterPanel(props) {
  const classes = useStyles();

  // use current filter status

  //const currFilters = Array.from(projectFilters);
  const filterIsActive = (filterName, filterValue) => {
    var isActive = projectFilters.findIndex(function (element) {
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
    }, []);


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
    toggleProjectFilters({ name: Constants.FILTER_NAME_TYPE, value: value }, state.state, state.dispatch);
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
    toggleProjectFilters({ name: Constants.FILTER_NAME_CATEGORY, value: value }, state.state, state.dispatch);
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
    toggleProjectFilters({ name: Constants.FILTER_NAME_MODE, value: value }, state.state, state.dispatch);
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
    toggleProjectFilters({ name: Constants.FILTER_NAME_DISTRICT, value: value }, state.state, state.dispatch);
  };



  const { projects, visibleProjects, projectFilters, toggleProjectFilters, state } = props;

  if (state.state.project != null)
    return null;

  return (
    <Paper elevation={2} style={{
      position: 'absolute', top: '120px', left: '10px', bottom: '24px',
      width: '200px', overflow: 'auto'
    }} >
      <div style={{ padding: '8px 10px 0px 10px', margin: '0', fontSize: '0.95rem', fontWeight: 'bold' }}>
        {state.state.visibleProjects.length + " Project" + (state.state.visibleProjects.length > 1 ? "s" : "")}
      </div>
      <List dense={true} style={{ fontSize: '0.9rem', marginTop: '0' }}>
        <ListItem className={classes.filterTitle}>Category</ListItem>
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
        <ListItem>
          <FormGroup>
            <Box>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Planning</span>}
                control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.planning}
                  onChange={handleChangeStatus(Constants.PROJECT_TYPE_PLAN)} value={Constants.PROJECT_TYPE_PLAN}
                  margin="dense" size="small" />} />
              <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_PLAN + '.svg')} />
            </Box>
            <Box>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Design</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={statusState.design}
                  onChange={handleChangeStatus(Constants.PROJECT_TYPE_DESIGN)} value={Constants.PROJECT_TYPE_DESIGN}
                  margin="dense" size="small" />} />
              <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_DESIGN + '.svg')} />
            </Box>
            <Box>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Deployment</span>}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={statusState.deployment}
                  onChange={handleChangeStatus(Constants.PROJECT_TYPE_DEPLOYMENT)} value={Constants.PROJECT_TYPE_DEPLOYMENT}
                  margin="dense" size="small" />} />
              <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_DEPLOYMENT + '.svg')} />
            </Box>
            <Box>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Evaluation</span>}
                control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.evaluation}
                  onChange={handleChangeStatus(Constants.PROJECT_TYPE_EVALUATION)} value={Constants.PROJECT_TYPE_EVALUATION}
                  margin="dense" size="small" />} />
              <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_EVALUATION + '.svg')} />
            </Box>
            <Box>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Data</span>}
                control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.data}
                  onChange={handleChangeStatus(Constants.PROJECT_TYPE_DATA)} value={Constants.PROJECT_TYPE_DATA}
                  margin="dense" size="small" />} />
              <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_DATA + '.svg')} />
            </Box>
            <Box>
              <FormControlLabel label={<span className={classes.filterCheckboxLabel}>Other</span>}
                control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.other}
                  onChange={handleChangeStatus(Constants.PROJECT_TYPE_OTHER)} value={Constants.PROJECT_TYPE_OTHER}
                  margin="dense" size="small" />} />
              <img src={require('assets/img/maki-marker-stroked-15-' + Constants.PROJECT_TYPE_OTHER + '.svg')} />
            </Box>
          </FormGroup>
        </ListItem>

        <ListItem className={classes.filterTitle}>Mode</ListItem>
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
        </ListItem>

        {/*         <ListItem className={classes.filterTitle}>Keyword</ListItem>
        <ListItem>
          <FormGroup>

          </FormGroup>
        </ListItem> */}


        {/*         <ListItem className={classes.filterTitle}>District</ListItem>
        <ListItem>
          <FormGroup>
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.d1}
                onChange={handleChangeDistrict('1')} value="1" />} label="District 1" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.d2}
                onChange={handleChangeDistrict('2')} value="2" />} label="District 2" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.d3}
                onChange={handleChangeDistrict('3')} value="3" />} label="District 3" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.d4}
                onChange={handleChangeDistrict('4')} value="4" />} label="District 4" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.d5}
                onChange={handleChangeDistrict('5')} value="5" />} label="District 5" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.d6}
                onChange={handleChangeDistrict('6')} value="6" />} label="District 6" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.d7}
                onChange={handleChangeDistrict('7')} value="7" />} label="District 7" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={districtState.turnpike}
                onChange={handleChangeDistrict('t')} value="t" />} label="Turnpike" />
          </FormGroup>
        </ListItem> */}
      </List>



    </Paper>
  );
}

