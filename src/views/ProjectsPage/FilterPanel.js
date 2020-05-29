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

import { Box, Checkbox, FormGroup, FormControlLabel, FormControl, Paper, Divider, ListSubheader, ListItemIcon } from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

import {
  STATUS_COLORS, STATUS_PLAN, STATUS_DESIGN, STATUS_IMPLEMENT, STATUS_LIVE, STATUS_ARCHIVE, ROOT_URL,
  FILTER_NAME_CATEGORY, FILTER_NAME_MODE, FILTER_NAME_STATUS, FILTER_NAME_DISTRICT
} from "../../constants"

//import { Store } from "../../store/store"
//import { toggleProjectFilters, viewProject } from "../../store/actions"

//const useStyles = makeStyles(styles);
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
  },
  filterCheckbox: {
    padding: '4px 8px',
    margin: '0px',
    //fontSize: '10px'
  },
  filterCheckboxLabel: {
    color: '#2F4F4F',
    //fontSize: '5px' not observed
  },
  filterTitle: {
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
    console.log(filterName + '-' + filterValue + ': ' + isActive);
    return isActive;
  };

  const updateCheckboxes = () => {
    setStatusState({
      planning: filterIsActive(FILTER_NAME_STATUS, STATUS_PLAN),
      implementation: filterIsActive(FILTER_NAME_STATUS, STATUS_DESIGN),
      live: filterIsActive(FILTER_NAME_STATUS, STATUS_LIVE)
    });

    setCategoryState({
      autonomous: filterIsActive(FILTER_NAME_CATEGORY, 'a'),
      connected: filterIsActive(FILTER_NAME_CATEGORY, 'c'),
      electric: filterIsActive(FILTER_NAME_CATEGORY, 'e'),
      shared: filterIsActive(FILTER_NAME_CATEGORY, 's')
    });

    setModeState({
      auto: filterIsActive(FILTER_NAME_MODE, 'a'),
      bike: filterIsActive(FILTER_NAME_MODE, 'b'),
      transit: filterIsActive(FILTER_NAME_MODE, 't')
    });
    setDistrictState({
      d1: filterIsActive(FILTER_NAME_DISTRICT, '1'),
      d2: filterIsActive(FILTER_NAME_DISTRICT, '2'),
      d3: filterIsActive(FILTER_NAME_DISTRICT, '3'),
      d4: filterIsActive(FILTER_NAME_DISTRICT, '4'),
      d5: filterIsActive(FILTER_NAME_DISTRICT, '5'),
      d6: filterIsActive(FILTER_NAME_DISTRICT, '6'),
      d7: filterIsActive(FILTER_NAME_DISTRICT, '7'),
      turnpike: filterIsActive(FILTER_NAME_DISTRICT, 't')
    });
  }

  React.useEffect(
    () => {
      updateCheckboxes();
    }, []);


  const [statusState, setStatusState] = React.useState({
    planning: false,
    implementation: false,
    live: false
  });
  const handleChangeStatus = (value) => event => {
    switch (value) {
      case 1:
        setStatusState({ ...statusState, planning: event.target.checked });
        break;
      case 2:
        setStatusState({ ...statusState, implementation: event.target.checked });
        break;
      case 4:
        setStatusState({ ...statusState, live: event.target.checked });
        break;
      default:
        return;
    }
    toggleProjectFilters({ name: FILTER_NAME_STATUS, value: value }, state.state, state.dispatch);
  };

  const [categoryState, setCategoryState] = React.useState({
    autonomous: false,
    connected: false,
    electric: false,
    shared: false
  });
  const handleChangeCategory = (value) => event => {
    switch (value) {
      case 'a':
        setCategoryState({ ...categoryState, autonomous: event.target.checked });
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
    toggleProjectFilters({ name: FILTER_NAME_CATEGORY, value: value }, state.state, state.dispatch);
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
    toggleProjectFilters({ name: FILTER_NAME_MODE, value: value }, state.state, state.dispatch);
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
    toggleProjectFilters({ name: FILTER_NAME_DISTRICT, value: value }, state.state, state.dispatch);
  };



  const { projects, visibleProjects, projectFilters, toggleProjectFilters, state } = props;

  if (state.state.project != null)
    return null;

  return (
    <Paper elevation={2} style={{
      position: 'absolute', top: '75px', left: '10px', bottom: '24px',
      width: '250px', overflow: 'auto'
    }}>
      {/*       {
        state.state.projectFilters.map(filter => {
          return (
            <span>{filter.name}-{filter.value}&nbsp;&nbsp;</span>
          );
        })
      } */}

      <List>
        <Box component="div" style={{ padding: '0px 15px 10px 15px', margin: '0', fontWeight: 'bold', fontSize: '1rem' }}>
          Total Projects: {state.state.visibleProjects.length}
        </Box>
        <ListItem className={classes.filterTitle}>Status</ListItem>
        <ListItem>
          <FormGroup>
            <Box>
              <FormControlLabel className={classes.filterCheckboxLabel}
                control={<Checkbox color='primary' active className={classes.filterCheckbox} checked={statusState.planning}
                  onChange={handleChangeStatus(1)} value="1" />} label="Planning" />
              <svg height="12" width="12" style={{ verticalAlign: 'middle' }}>
                <circle cx="6" cy="6" r="6" stroke="white" stroke-width="0" fill={STATUS_COLORS[STATUS_PLAN]} />
              </svg>
            </Box>
            <Box>
              <FormControlLabel className={classes.filterCheckboxLabel}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={statusState.implementation}
                  onChange={handleChangeStatus(2)} value="2" />} label="Implementation" />
              <svg height="12" width="12" style={{ verticalAlign: 'middle' }}>
                <circle cx="6" cy="6" r="6" stroke="white" stroke-width="0" fill={STATUS_COLORS[STATUS_DESIGN]} />
              </svg>
            </Box>
            <Box>
              <FormControlLabel className={classes.filterCheckboxLabel}
                control={<Checkbox color='primary' className={classes.filterCheckbox} checked={statusState.live}
                  onChange={handleChangeStatus(4)} value="4" />} label="Live" />
              <svg height="12" width="12" style={{ verticalAlign: 'middle' }}>
                <circle cx="6" cy="6" r="6" stroke="white" stroke-width="0" fill={STATUS_COLORS[STATUS_LIVE]} />
              </svg>
            </Box>
          </FormGroup>
        </ListItem>

        <ListItem className={classes.filterTitle}>Category</ListItem>
        <ListItem>
          <FormGroup>
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.autonomous}
                onChange={handleChangeCategory('a')} value="a" />} label="Autonomous" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.connected}
                onChange={handleChangeCategory('c')} value="c" />} label="Connected" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.electric}
                onChange={handleChangeCategory('e')} value="e" />} label="Electric" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={categoryState.shared}
                onChange={handleChangeCategory('s')} value="s" />} label="Shared" />
          </FormGroup>
        </ListItem>

        <ListItem className={classes.filterTitle}>Mode</ListItem>
        <ListItem>
          <FormGroup>
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={modeState.auto}
                onChange={handleChangeMode('a')} value="a" />} label="Auto" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={modeState.bike}
                onChange={handleChangeMode('b')} value="b" />} label="Bike" />
            <FormControlLabel className={classes.filterCheckboxLabel}
              control={<Checkbox color='primary' className={classes.filterCheckbox} checked={modeState.transit}
                onChange={handleChangeMode('t')} value="t" />} label="Transit" />
          </FormGroup>
        </ListItem>

        <ListItem className={classes.filterTitle}>District</ListItem>
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
        </ListItem>
      </List>



    </Paper>
  );
}

