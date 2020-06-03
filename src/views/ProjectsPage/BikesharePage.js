import React, { Component } from "react";
import { render } from 'react-dom';
import MapGL, { Source, Layer, NavigationControl, ScaleControl } from "react-map-gl";
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
import FilterPanel from "./FilterPanel";

import { Store } from "../../store/store"
import {
  fetchBikeshareStationData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject,
  setBikeshareNetworkViewport, toggleGeomVisibility, toggleMapStyle, fetchBikeshareData
} from "../../store/actions"
import DetailsPanel from "./DetailsPanel";
import ResultsPanel from "./ResultsPanel";

import * as Constants from "../../constants"


const useStyles = makeStyles(styles);

export default function BikesharePage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const { state, dispatch } = React.useContext(Store);
  const { id } = useParams();

  React.useEffect(
    () => {
      //console.log("network id: " + id);
      //state.bikeshares.length > 0 && 
      fetchBikeshareStationData(id, state, dispatch)
    },
    []
  );

  const mbBikeshareSourceRef = React.useRef();

  const handleMapOnClick = event => {
    if (!event.features || event.features.length === 0) return;
    const feature = event.features[0];

    // bikeshare
    if (feature.properties && feature.properties.dataType === "bikeshare") {
      // fetch station data
      //props.history.push(Constants.ROOT_URL + "bikeshare/" + feature.properties.id);
      return;
    }

  };

  const onViewportChange = vp => {
    setBikeshareNetworkViewport(vp, state, dispatch);
  }

  const onMapStyleClick = event => {
    console.log("toggle map style");
    toggleMapStyle(state, dispatch);
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
              {...state.bikeshareNetworkViewport}
              width="100%"
              height="100%"
              mapStyle={state.mapStyle}
              onViewportChange={onViewportChange}
              mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
              interactiveLayerIds={[stationMarkerLayer.id]}
              onClick={handleMapOnClick}
            >
              {/* <Source
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.projectGeoms
                }}
                ref={mbPolygonSourceRef}
              >
                <Layer {...geomPointLayer} filter={state.mapGeomPointFilter} paint={state.mapGeomPointPaint} />
                <Layer {...geomPolygonLayer} filter={state.mapGeomPolygonFilter} paint={state.mapGeomPolygonPaint} />
                <Layer {...geomLineLayer} filter={state.mapGeomLineFilter} paint={state.mapGeomLinePaint} />
              </Source>

              <Source
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.visibleProjects
                }}
                cluster={false}
                clusterMaxZoom={14}
                clusterRadius={20}
                ref={mbProjectSourceRef}
              >
                <Layer {...projectSymbolLayer} filter={state.mapMarkerFilter} paint={state.mapMarkerPaint} />
              </Source> */}

              <Source
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.bikeshareNetwork ? state.bikeshareNetwork.stations : []
                }}
                cluster={false}
                ref={mbBikeshareSourceRef}
              >
                <Layer {...stationMarkerLayer} />
              </Source>

              <div style={{
                position: 'absolute', padding: '10px', top: '2px',
                right: (true /*projectId > 0*/) ? '0px' : 'calc(20vw + 10px)'
              }}>
                <NavigationControl />
              </div>

              {
                state.bikeshareNetwork &&
                <div style={{
                  position: 'absolute', padding: '20px', top: '2px', left: '0px',
                  background: 'white', boxShadow: '2px 2px 2px rgba(0,0,0,0.3)',
                  margin: '20px', fontSize: '13px', borderRadius: '5px'
                }}>
                  <div style={{ fontSize: '25px', fontWeight: 'bold' }}>
                    {state.bikeshareNetwork.name}{state.bikeshareNetwork.location && " (" + state.bikeshareNetwork.location.city + ")"}
                  </div>
                  <div style={{ fontSize: '20px', marginTop: '10px' }}>
                    {state.bikeshareNetwork.stations.length + " station" + (state.bikeshareNetwork.stations.length > 1 ? "s" : "")}
                  </div>
                </div>
              }

            </MapGL>
          </Box>
        </Box>

        <Paper elevation={2} style={{
          position: 'absolute', bottom: '24px', left: '10px',
          width: '75px', height: '75px', borderRadius: '5px', overflow: 'hidden'
        }}>
          {
            state.mapStyle == Constants.MAPBOX_STYLE_STREET
              ?
              <ButtonBase onClick={onMapStyleClick}>
                <img src={Constants.STATIC_ROOT_URL + 'images/mini-satellite2.png'} width="75px" />
                <span style={{
                  position: 'absolute', bottom: '5px', left: '5px', color: 'white',
                  fontSize: '1em', fontWeight: 'bold'
                }}>Satellite</span>
              </ButtonBase>

              :
              <ButtonBase onClick={onMapStyleClick}>
                <img src={Constants.STATIC_ROOT_URL + 'images/mini-map2.png'} width="75px" />
                <span style={{
                  position: 'absolute', bottom: '5px', left: '5px', color: 'white',
                  fontSize: '1em', fontWeight: 'bold'
                }}>Map</span>
              </ButtonBase>
          }
        </Paper>

      </div>


    </Box >

  );

}

const stationMarkerLayer = {
  id: 'bikeshare-station-markers',
  //type: 'symbol',
  type: 'circle',
  source: 'bikeshare',
  paint: {
    'circle-color': ['step', ['get', 'free_bikes'], '#ED0B5A', 3, '#FECC00', 6, '#16E127'],
    'circle-radius': 5,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};
