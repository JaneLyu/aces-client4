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

export default function SpatPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { state, dispatch } = React.useContext(Store);

  const [popupInfo, setPopupInfo] = React.useState();


  React.useEffect(
    () => {
      state.spatList.length === 0 && fetchSpatData(dispatch);
    },
    [state.spatList]
  );

  const mbProjectSourceRef = React.useRef();

  const handleMapOnClick = event => {
    const feature = event.features[0];
    if (!feature) return;

    setPopupInfo(feature)
  };

  const onViewportChange = vp => {
    if (popupInfo) return;

    setSpatViewport(vp, state, dispatch);
  }

  const onMapStyleClick = event => {
    console.log("toggle map style");
    toggleMapStyle(state, dispatch);
  }

  const renderPopup = () => {
		// TODO: dangerouslySetInnerHTML, DOMPurify
    return (
      popupInfo &&
      <Popup
        tipSize={4}
        anchor="bottom"
        longitude={popupInfo.geometry.coordinates[0]}
        latitude={popupInfo.geometry.coordinates[1]}
        closeOnClick={true}
        captureScroll={true}
        onClose={() => setPopupInfo(null)}
      >
        <div style={{ width: '240px', height: '300px', overflow: 'auto' }}>
          <p style={{fontSize: '10px'}}><strong>Location:</strong>&nbsp;&nbsp;{popupInfo.properties.location}</p>
          <p style={{fontSize: '10px'}}><strong>Timeline:</strong>&nbsp;&nbsp;{popupInfo.properties.timeline}</p>
          <p style={{fontSize: '10px'}}><strong>Description:</strong>&nbsp;&nbsp;{popupInfo.properties.description}</p>
          <p style={{fontSize: '10px'}}><strong>Contact:</strong>&nbsp;&nbsp;<span dangerouslySetInnerHTML={{ __html: popupInfo.properties.contact }} /></p>
        </div>
      </Popup>
    );
  }

  return (
    <Box>
      <div style={{
        position: 'relative', width: '100%', height: "65px", overflow: 'hidden', boxShadow:
          "0 4px 18px 0px rgba(0, 0, 0, 0.12), 0 7px 10px -5px rgba(0, 0, 0, 0.15)"
      }}>
        <Header
          color="dark"
          fixed
          brand="FL A&middot;C&middot;E&middot;S"
          rightLinks={<HeaderLinks {...props} />}
          {...rest}
        />
      </div>

      <div>
        <Box display="flex" p={0} style={{ width: '100%' }}>
          <Box p={0} style={{ width: '100%', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
            <MapGL
              {...state.spatViewport}
              width="100%"
              height="100%"
              mapStyle={state.mapStyle}
              onViewportChange={onViewportChange}
              mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
              interactiveLayerIds={[unclusteredSymbolLayer.id]}
              onClick={handleMapOnClick}
            >
              <Source
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.spatList
                }}
                cluster={false}
                clusterMaxZoom={14}
                clusterRadius={20}
                ref={mbProjectSourceRef}
              >
                <Layer {...unclusteredSymbolLayer} paint={state.mapMarkerPaint} />
              </Source>

              {
                renderPopup()
              }

              <div style={{
                position: 'absolute', padding: '10px', top: '2px', right: '0px'
              }}>
                <NavigationControl />
              </div>

            </MapGL>
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
      "deployed", 4,
      "underway", 1,
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

