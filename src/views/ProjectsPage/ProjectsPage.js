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
  fetchProjectsData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject,
  setViewport, toggleGeomVisibility, toggleMapStyle, fetchBikeshareData
} from "../../store/actions"
import DetailsPanel from "./DetailsPanel";
import ResultsPanel from "./ResultsPanel";

import * as Constants from "../../constants"


const useStyles = makeStyles(styles);

export default function ProjectsPage(props) {
  const classes = useStyles();
  const { ...rest } = props;

  const { state, dispatch } = React.useContext(Store);

  let params = useParams();
  let projectId;

  if (params.id != undefined && state.projects.length > 0) {
    projectId = params.id;
    if (projectId && (state.project == null || state.project.properties.id != projectId)) {
      console.log("show project details: " + projectId);
      viewOneProject(projectId, state, dispatch);
    }
  }

  if (!projectId && state.project != null) {
    viewProjects(state, dispatch);
  }

  const filtersProps = {
    projects: state.projects,
    visibleProjects: state.visibleProjects,
    projectFilters: state.projectFilters,
    state: { state, dispatch },
    toggleProjectFilters
  };
  const detailsProps = {
    state: { state, dispatch },
    viewProjects
  };
  const resultsProps = {
    projects: state.projects,
    visibleProjects: state.visibleProjects,
    state: { state, dispatch },
    viewOneProject,
    ...rest
  };


  const geomBaseFilter = ["==", ["get", "id"], projectId];
  const polygonBaseFilter = ["==", ["geometry-type"], "Polygon"];
  const lineBaseFilter = ["==", ["geometry-type"], "LineString"];
  const pointBaseFilter = ["==", ["geometry-type"], "Point"];

  const [geomPolygonFilter, setGeomPolygonFilter] = React.useState(["all", polygonBaseFilter, geomBaseFilter]);
  const [geomLineFilter, setGeomLineFilter] = React.useState(["all", lineBaseFilter, geomBaseFilter]);
  const [geomPointFilter, setGeomPointFilter] = React.useState(["all", pointBaseFilter, geomBaseFilter]);

  React.useEffect(
    () => {
      state.projects.length === 0 && fetchProjectsData(dispatch)
      //&& fetchProjectsGeom(dispatch);
    },
    [state.projects]
  );

  React.useEffect(
    () => {
      state.bikeshares.length === 0 && fetchBikeshareData(dispatch)
    },
    []
  );


  const mbProjectSourceRef = React.useRef();
  const mbPolygonSourceRef = React.useRef();
  const mapboxRef = React.useRef();
  const mbBikeshareSourceRef = React.useRef();

  const handleMapOnClick = event => {
    if (!event.features || event.features.length === 0) return;
    const feature = event.features[0];

    // bikeshare
    if (feature.properties && feature.properties.dataType === "bikeshare") {
      // fetch station data
      props.history.push(Constants.ROOT_URL + "bikeshare/" + feature.properties.id);
      return;
    }

    if (!feature.properties.cluster) {
      // clicked on project
      //console.log('view project ' + feature.properties.id);

      // change only if not viewing project details
      if (!projectId) {
        props.history.push(Constants.ROOT_URL + "projects/" + feature.properties.id);
      }

      return;
    }

    // clicked on cluster circle
    const clusterId = feature.properties.cluster_id;

    const projectSource = mbProjectSourceRef.current.getSource();
    projectSource.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) {
        return;
      }

      let vp = {
        ...state.viewport,
        longitude: feature.geometry.coordinates[0],
        latitude: feature.geometry.coordinates[1],
        zoom: zoom + 1,
        transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
      };

      setViewport(vp, state, dispatch);
    });
  };


  const [hoveredProject, setHoveredProject] = React.useState(0);

  const handleMapOnHover = event => {
    // bikeshare
    if (event.features && event.features.length > 0 &&
      event.features[0].properties && event.features[0].properties.dataType === "bikeshare") {
      return;
    }

    //console.log(projectId)
    if (projectId) {
      return;
    }

    // projects
    if (!event.features || event.features.length <= 0 ||
      !event.features[0].properties || !event.features[0].properties.id) {
      // not over project icon, hide any visible geom
      if (hoveredProject != 0) {
        //_setGeomVisibility(hoveredProject, false);
        toggleGeomVisibility(0, state, dispatch);
        //console.log('hide geoms');
        setHoveredProject(0);
      }
    } else {
      // over project icon, show geom
      let projectId = event.features[0].properties.id;

      if (hoveredProject != projectId) {
        //console.log('show geom project ' + projectId);
        //_setGeomVisibility(projectId, true);
        toggleGeomVisibility(projectId, state, dispatch);
        setHoveredProject(projectId);
      }
    }
  }

  const onViewportChange = vp => {
    setViewport(vp, state, dispatch);
  }

  const onMapStyleClick = event => {
    //console.log("toggle map style");
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
          <Box p={0} style={{ width: state.project != null ? '50vw' : '100%', height: 'calc(100vh - 65px)', overflow: 'hidden' }}>
            <MapGL
              {...state.viewport}
              width="100%"
              height="100%"
              mapStyle={state.mapStyle}
              onViewportChange={onViewportChange}
              mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
              interactiveLayerIds={[projectSymbolLayer.id, bikeshareSymbolLayer.id]}
              onClick={handleMapOnClick} onHover={handleMapOnHover}
            >
              <Source
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
              </Source>

              <Source
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: !projectId && state.bikesharesVisible && state.bikeshares
                }}
                cluster={false}
                ref={mbBikeshareSourceRef}
              >
                <Layer {...bikeshareSymbolLayer} />
              </Source>

              <div style={{
                position: 'absolute', padding: '10px', top: '2px',
                right: (true /*projectId > 0*/) ? '0px' : 'calc(20vw + 10px)'
              }}>
                <NavigationControl />
              </div>

            </MapGL>
          </Box>
          <DetailsPanel {...detailsProps} />
        </Box>

        {/* <ResultsPanel {...resultsProps} /> */}
        <FilterPanel {...filtersProps} />

        <Paper elevation={2} style={{
          position: 'absolute', bottom: (projectId) ? '34px' : '24px',
          left: (projectId) ? '10px' : 'calc(200px + 20px)',
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


const clusterLayer = {
  id: 'clusters',
  type: 'circle',
  source: 'projectdata',
  filter: ['has', 'point_count'],
  paint: {
    //'circle-color': ['step', ['get', 'point_count'], '#51bbd6', 5, '#f1f075', 15, '#f28cb1'],
    'circle-color': '#9ABFC2',
    //'circle-radius': ['step', ['get', 'point_count'], 20, 10, 30, 20, 40],
    'circle-radius': ['step', ['get', 'point_count'], 15, 10, 25, 20, 35],
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};

const clusterCountLayer = {
  id: 'cluster-count',
  type: 'symbol',
  source: 'projectdata',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 16
  }
};

const projectSymbolLayer = {
  id: 'project-symbols',
  type: 'symbol',
  source: 'projectdata',
  layout: {
    'icon-image': ['concat', 'maki-marker-stroked-15-', ['get', 'status']],
    //'icon-image': 'maki-marker-stroked-15-1',
    'icon-size': 1.5,
    'icon-anchor': 'bottom',
    //'icon-ignore-placement': true,
    'icon-allow-overlap': true,
    'text-field': ['get', 'name'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 12,
    //'text-anchor': 'top',
    //'text-offset': [0,-.2],
    'text-variable-anchor': ['top', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
    'text-radial-offset': 0.15,
    'text-optional': true,
  },
};

const bikeshareSymbolLayer = {
  id: 'bikeshare-symbols',
  type: 'symbol',
  source: 'bikeshare',
  layout: {
    'icon-image': 'bicycle-share',
    //'icon-size': 1.5,
    'icon-anchor': 'bottom',
    //'icon-ignore-placement': true,
    'icon-allow-overlap': true,
    'text-field': ['get', 'name'],
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
  source: 'bikeshares',
  filter: ['!', ['has', 'point_count']],
  layout: {
    'visibility': 'visible'
  },
  paint: {
    'circle-color': 'red',
    'circle-radius': 6,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};


const geomPolygonLayer = {
  type: 'fill',
  source: 'projectgeom',
};
const geomPointLayer = {
  type: 'circle',
  source: 'projectgeom',
};
const geomLineLayer = {
  source: 'projectgeom',
  type: 'line',
};