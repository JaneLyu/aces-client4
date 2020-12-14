import React, { Component } from "react";
import { render } from 'react-dom';
import MapGL, { Source, Layer, NavigationControl, ScaleControl, Popup } from "react-map-gl";
import { useParams } from "react-router-dom";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import styles from "assets/jss/material-kit-react/views/projectsPage.js";

import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { Paper, ButtonBase } from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { IconButton, Button } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import MailIcon from '@material-ui/icons/Mail';
import MenuIcon from '@material-ui/icons/Menu';
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Card from "components/Card/Card.js";
import { pink, red, lightBlue, grey, lightGreen, blueGrey } from "@material-ui/core/colors";
import { SearchIcon, Satellite, Map as MapIcon } from '@material-ui/icons';
import Box from '@material-ui/core/Box';

import { Store } from "../store/store"
import {
  fetchSpatData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject,
  setSpatViewport, toggleGeomVisibility, toggleMapStyle
} from "../store/actions"

import * as Constants from "../constants"


const useStyles = makeStyles(styles);

export default function USDOTPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { state, dispatch } = React.useContext(Store);


  return (
    <Box>
      <div style={{
        position: 'relative', width: '100%', height: Constants.HEADER_HEIGHT + "px", overflow: 'hidden', boxShadow:
          "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)"
      }}>
        <Header
          color="dark"
          fixed
          brand={Constants.ACES_BRAND}
          rightLinks={<HeaderLinks {...props} />}
          {...rest}
        />
      </div>

      <div>
        <Box p={0} style={{ width: '100%', padding: '20px 20px 20px 20px', overflow: 'hidden' }}>
          <Box display="flex" style={{padding: '0px 0 10px 0'}}>
            <span style={{ fontSize: '25px', fontWeight: 'bold' }}>Operational Connected Vehicle Deployments in the U.S.</span>
            <a href="https://www.transportation.gov/research-and-technology/operational-connected-vehicle-deployments-us" 
            target="_blank" rel="noopener noreferrer" style={{ marginLeft: '20px' }}>
              <img src={Constants.STATIC_ROOT_URL + 'images/external_link.png'} style={{ width: '20px', marginBottom: '5px' }} />
            </a>
          </Box>
          <div style={{fontStyle: 'italic'}}>Last updated: Tuesday, June 2, 2020</div>
          <Box p={0} style={{ width: '100%', overflow: 'hidden' }}>
            <img src="https://www.transportation.gov/sites/dot.gov/files/2020-05/CV%20Deployment%20Map%205-2020_0.JPG" 
            style={{ maxWidth: '100%', height: 'auto' }} />
          </Box>
        </Box>

      </div>


    </Box >

  );

}



const unclusteredSymbolLayer = {
  id: 'unclustered-point',
  type: 'symbol',
  layout: {
    'icon-image': ['concat', 'maki-marker-stroked-15-', [
      'match',
      ['get', 'status'],
      "deployed", 3,
      "underway", 4,
      0
    ]],
    //'icon-image': 'maki-marker-stroked-15-1',
    'icon-size': 1.5,
    'icon-anchor': 'bottom',
    //'icon-ignore-placement': true,
    'icon-allow-overlap': true,
    //'text-field': ['get', 'status'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
    //'text-anchor': 'top',
    //'text-offset': [0,-.2],
    'text-variable-anchor': ['top', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
    'text-radial-offset': 0.15,
    'text-optional': true,
  },
};

const unclusteredPointLayer = {
  id: 'unclustered-point',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'visibility': 'visible'
  },
  paint: {
    'circle-color': [
      'match',
      ['get', 'status'],
      "deployed", "red",
      "underway", "blue",
      "yellow"
    ],
    'circle-radius': 6,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};

