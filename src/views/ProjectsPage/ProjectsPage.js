import React, { Component } from "react";
import { render } from 'react-dom';
import { useParams } from "react-router-dom";

// @material-ui/core components
import { makeStyles, useTheme } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';

import styles from "assets/jss/material-kit-react/views/projectsPage.js";

import { Box, Paper, ButtonBase, ButtonGroup, Button } from '@material-ui/core';

import FilterPanel from "./FilterPanel";

import { Store } from "../../store/store"
import {
  fetchProjectsData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject,
  setViewport, toggleGeomVisibility, toggleMapStyle, fetchBikeshareData, fetchFuelStationData,
  toggleProjectsVisibility, toggleBikeshareVisibility, toggleFuelVisibility
} from "../../store/actions"
import DetailsPanel from "./DetailsPanel";
//import ResultsPanel from "./ResultsPanel";
import MapGL, { Popup, Source, Layer, NavigationControl } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import moment from "moment"

import * as Constants from "../../constants"


const useStyles = makeStyles(styles);

export default function ProjectsPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const { state, dispatch } = React.useContext(Store);
  const [mapCursorStyle, setMapCursorStyle] = React.useState();
  const [hoveredProject, setHoveredProject] = React.useState();
  const [bikesharePopupInfo, setBikesharePopupInfo] = React.useState();
  const [chargingPopupInfo, setChargingPopupInfo] = React.useState();
  //const [activeProject, setActiveProject] = React.useState();
  //const [mapVp, setMapVp] = React.useState(Constants.MAPBOX_INITIAL_VIEWPORT);
  const mapRef = React.useRef(null);

  let params = useParams();
  let projectId;

  if (params.id != undefined && state.projects.length > 0) {
    projectId = params.id;
    if (projectId && (state.project == null || state.project.properties.id != projectId)) {
      //console.log("show project details: " + projectId);
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
    //state: { state, dispatch },
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


  React.useEffect(
    () => {
      state.projects.length === 0 && fetchProjectsData(dispatch)
    },
    [state.projects]
  );

  React.useEffect(
    () => {
      state.bikeshareStations.length === 0 && fetchBikeshareData(dispatch)
    },
    [state.bikeshareStations]
  );

  React.useEffect(
    () => {
      state.fuelStations.length === 0 && fetchFuelStationData(dispatch)
    },
    [state.fuelStations]
  );


  const handleProjectsLayerClick = event => {
    const feature = event.features[0];
    if (!feature) return;

    /*     setActiveProject(feature);
        console.log(feature);
    
        var id = feature.properties.id;
        var features = state.projectGeoms.filter(function (element) {
          return element.properties.id == id;
        });
    
        const [minLng, minLat, maxLng, maxLat] = bbox({
          type: 'FeatureCollection',
          features: features
        });
    
        const futureVp = {
          ...state.viewport,
          width: window.innerWidth / 2,
          height: window.innerHeight
        }
        //console.log("innerWidth: " + window.innerWidth);
        //console.log("innerWidth: " + window.innerHeight);
    
        let newVp;
        try {
          var vp = new WebMercatorViewport(futureVp);
          const { longitude, latitude, zoom } = vp.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
            padding: 100
          });
          newVp = {
            longitude: longitude,
            latitude: latitude,
            //zoom: Math.min(zoom, 12),
            zoom
          }
        } catch (err) {
          console.error(err);
        }
        if (newVp) setMapVp(newVp); */

    if (feature.properties.id) {
      props.history.push(Constants.ROOT_URL + "projects/" + feature.properties.id);
      //console.log("project: " + feature.properties.id);
    }
  };
  const handleProjectsLayerHover = event => {
    if (projectId) return;

    setMapCursorStyle("pointer");

    const feature = event.features[0];
    if (!feature) return;

    let id = feature.properties.id;
    if (hoveredProject !== id) {
      //console.log('show geom: ' + id);
      toggleGeomVisibility(id, state, dispatch);
      setHoveredProject(id);
    }
  };
  const handleProjectsLayerLeave = event => {
    if (projectId) return;

    setMapCursorStyle();

    if (hoveredProject) {
      //console.log('hide geom');
      toggleGeomVisibility(0, state, dispatch);
      setHoveredProject(null);
    }
  };

  const handleChargingLayerClick = event => {
    const feature = event.features[0];
    if (!feature) return;

    setChargingPopupInfo(feature);
  };

  const handleBikeshareLayerClick = event => {
    const feature = event.features[0];
    if (!feature) return;

    setBikesharePopupInfo(feature);
  };

  const handleLayerHover = event => {
    setMapCursorStyle("pointer");
  };
  const handleLayerLeave = event => {
    setMapCursorStyle();
  };

  const handleMapClick = event => {
    if (!event.features || !event.features[0]) {
      //clearPopupInfo();
    }
  };

  const clearPopupInfo = () => {
    setBikesharePopupInfo(null);
    setChargingPopupInfo(null);
  };

  const renderPopup = () => {
    let popupInfo;

    if (state.bikesharesVisible && bikesharePopupInfo) {
      popupInfo = bikesharePopupInfo;
      return (
        <Popup
          longitude={popupInfo.geometry.coordinates[0]}
          latitude={popupInfo.geometry.coordinates[1]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => clearPopupInfo()}
        >
          <div style={{ paddingTop: '8px' }}>
            <p style={{ fontSize: '0.9rem' }}><strong>{popupInfo.properties.name}</strong></p>
            <p style={{ fontSize: '0.75rem' }}>
              Bikes available:&nbsp;&nbsp;<strong>{popupInfo.properties.free_bikes}</strong><br />
            Spaces available:&nbsp;&nbsp;<strong>{popupInfo.properties.empty_slots}</strong>
            </p>
            <span style={{ fontSize: '0.6rem', fontStyle: 'italic' }}>
              Last updated {moment(popupInfo.properties.timestamp).format("M/D/YYYY, h:mm:ss a")}
            </span>
          </div>
        </Popup>
      );
    }

    if (state.fuelStationVisible && chargingPopupInfo) {
      popupInfo = chargingPopupInfo;
      return (
        <Popup
          longitude={popupInfo.geometry.coordinates[0]}
          latitude={popupInfo.geometry.coordinates[1]}
          closeButton={true}
          closeOnClick={false}
          onClose={() => clearPopupInfo()}
        >
          <div style={{ paddingTop: '8px' }}>
            <p style={{ fontSize: '0.9rem' }}><strong>{popupInfo.properties.station_name}</strong></p>
            <p style={{ fontSize: '0.75rem' }}>
              {popupInfo.properties.street_address}<br />
              {popupInfo.properties.city + ", " + popupInfo.properties.state + " " + popupInfo.properties.zip}
            </p>
            <p style={{ fontSize: '0.75rem' }}>
              {popupInfo.properties.station_phone}
            </p>
            <span style={{ fontSize: '0.6rem', fontStyle: 'italic' }}>
              Last updated {moment(popupInfo.properties.updated_at).format("M/D/YYYY, h:mm:ss a")}
            </span>
          </div>
        </Popup>
      );
    }

    return null;
  }


  const onViewportChange = vp => {
    setViewport(vp, state, dispatch);
  }

  const onMapStyleClick = event => {
    //console.log("toggle map style");
    toggleMapStyle(state, dispatch);
  }

  const handleMapLoad = event => {
    //console.log("===== Mapbox load (projects)");
  };

  const handleACESViewClick = event => {
    if (state.projectsVisible) return;

    toggleProjectsVisibility(state, dispatch);
    clearPopupInfo();
  };
  const handleBikeshareViewClick = event => {
    if (state.bikesharesVisible) return;

    toggleBikeshareVisibility(state, dispatch);
    clearPopupInfo();
  };
  const handleFuelViewClick = event => {
    if (state.fuelStationVisible) return;

    toggleFuelVisibility(state, dispatch);
    clearPopupInfo();
  };

  const handleGoBack = event => {
    //console.log("go back");
    props.history.goBack();
    //setActiveProject(null);
    //setMapVp(Constants.MAPBOX_INITIAL_VIEWPORT);
  };

  return (
    <Box>
      {
        state.isLoading &&
        <div style={{ position: 'absolute', top: 'calc(50vh - 32px)', left: 'calc(50vw - 32px)' }}>
          <img src={require('assets/img/loading.gif')} />
        </div>
      }

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
        {
          !state.isLoading &&
          <Box display="flex" p={0} style={{ width: '100%' }}>
            <Box p={0} style={{ overflow: 'hidden' }}>
              <MapGL
                {...state.viewport}
                style={{ width: projectId ? '50vw' : '100vw', height: 'calc(100vh - ' + Constants.HEADER_HEIGHT + 'px)' }}
                cursorStyle={mapCursorStyle}
                mapStyle={state.mapStyle}
                accessToken={Constants.MAPBOX_TOKEN}
                onViewportChange={onViewportChange}
                onClick={handleMapClick} onLoad={handleMapLoad}
                ref={mapRef}
              >
                <Source id="charging-source"
                  type="geojson"
                  data={{
                    type: 'FeatureCollection',
                    features: !projectId && state.fuelStationVisible && state.fuelStations
                  }}
                />
                <Layer id="charging-markers" {...chargingMarkerLayer}
                  onClick={handleChargingLayerClick} onHover={handleLayerHover} onLeave={handleLayerLeave} />

                {renderPopup()}

                <Source id="bikeshare-source"
                  type="geojson"
                  data={{
                    type: 'FeatureCollection',
                    features: !projectId && state.bikesharesVisible && state.bikeshareStations
                  }}
                />
                <Layer id="bikeshare-markers" {...bikeshareMarkerLayer}
                  onClick={handleBikeshareLayerClick} onHover={handleLayerHover} onLeave={handleLayerLeave} />

                <Source id="projectgeoms-source"
                  type="geojson"
                  data={{
                    type: 'FeatureCollection',
                    features: state.projectsVisible && state.projectGeoms
                  }}
                />
                <Layer id="projectgeoms-points" {...geomPointLayer} filter={state.mapGeomPointFilter} paint={state.mapGeomPointPaint} />
                <Layer id="projectgeoms-polygons" {...geomPolygonLayer} filter={state.mapGeomPolygonFilter} paint={state.mapGeomPolygonPaint} />
                <Layer id="projectgeoms-lines" {...geomLineLayer} filter={state.mapGeomLineFilter} paint={state.mapGeomLinePaint} />

                <Source id="projects-source"
                  type="geojson"
                  data={{
                    type: 'FeatureCollection',
                    features: state.projectsVisible && state.visibleProjects
                  }}
                />
                <Layer id="projects-markers" {...projectsMarkerLayer} filter={state.mapMarkerFilter} paint={state.mapMarkerPaint}
                  onClick={handleProjectsLayerClick} onHover={handleProjectsLayerHover} onLeave={handleProjectsLayerLeave} />
                <Layer id="projects-markers-focus" {...projectsMarkerFocusLayer} filter={state.mapMarkerFocusFilter}
                  paint={state.mapMarkerFocusPaint} />

                <NavigationControl showCompass showZoom position='top-right' />
              </MapGL>
            </Box>
            <DetailsPanel {...detailsProps} />
          </Box>
        }

        {
          !state.isLoading && !projectId && state.projectsVisible && <FilterPanel {...props} />
        }

        {
          !state.isLoading && !projectId &&
          <ButtonGroup size="small" variant="contained" aria-label="contained primary button group" elevation={2}
            style={{ position: 'absolute', top: (Constants.HEADER_HEIGHT + 12) + 'px', left: '10px', backgroundColor: 'white' }}>
            <Button onClick={handleACESViewClick} style={{
              backgroundColor: state.projectsVisible ? '#031A43' : '#f8f8f8',
              color: state.projectsVisible ? 'white' : '#888'
            }}>
              {Constants.ACES_LABEL}
            </Button>
            <Button onClick={handleBikeshareViewClick} style={{
              backgroundColor: state.bikesharesVisible ? '#031A43' : '#f8f8f8',
              color: state.bikesharesVisible ? 'white' : '#888'
            }}>Bikeshare</Button>
            <Button onClick={handleFuelViewClick} style={{
              backgroundColor: state.fuelStationVisible ? '#031A43' : '#f8f8f8',
              color: state.fuelStationVisible ? 'white' : '#888'
            }}>Charging</Button>
          </ButtonGroup>
        }

        {
          !projectId && (state.bikesharesVisible || state.fuelStationVisible) &&
          <Paper elevation={2} style={{ position: 'absolute', top: (Constants.HEADER_HEIGHT + 55) + 'px', left: '10px', width: '200px' }}>
            {
              state.bikesharesVisible &&
              <div style={{ padding: '8px 10px 5px 10px', margin: '0' }}>
                <div style={{ fontSize: '0.95rem', fontWeight: 'bold' }}>
                  {state.bikeshareStations.length + " Station" + (state.bikeshareStations.length > 1 ? "s" : "")}
                </div>
                <div style={{ padding: '4px 0 0 6px', fontSize: '0.8rem' }}>
                  <svg width="10px" height="10px">
                    <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0" fill="#16F45F" />
                  </svg>
                  &nbsp;&nbsp;<span>more than 3 bikes available</span>
                </div>
                <div style={{ padding: '4px 0 0 6px', fontSize: '0.8rem' }}>
                  <svg width="10px" height="10px">
                    <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0" fill="#0E8F3A" />
                  </svg>
                  &nbsp;&nbsp;<span>1 to 3 bikes available</span>
                </div>
                <div style={{ padding: '4px 0 0 6px', fontSize: '0.8rem' }}>
                  <svg width="10px" height="10px">
                    <circle cx="5" cy="5" r="5" stroke="white" stroke-width="0" fill="#ED0B5A" />
                  </svg>
                  &nbsp;&nbsp;<span>no bike available</span>
                </div>

              </div>
            }
            {
              state.fuelStationVisible &&
              <div style={{ padding: '8px 10px 5px 10px', margin: '0', fontSize: '0.95rem', fontWeight: 'bold' }}>
                {state.fuelStations.length + " Station" + (state.fuelStations.length > 1 ? "s" : "")}
              </div>
            }
          </Paper>
        }

        {
          !state.isLoading && projectId &&
          <Paper elevation={2} style={{ position: 'absolute', top: (Constants.HEADER_HEIGHT + 12) + 'px', left: '10px', backgroundColor: 'white' }}>
            <Button onClick={handleGoBack}>
              <ArrowBackIcon fontSize="small" />&nbsp;Back
            </Button>
          </Paper>
        }

        {
          !state.isLoading &&
          <Paper elevation={2} style={{
            position: 'absolute', bottom: (projectId) ? '34px' : '24px',
            left: (projectId || !state.projectsVisible) ? '10px' : 'calc(360px + 20px)',
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
        }

      </div>
    </Box >
  );
}


const chargingMarkerLayer = {
  type: 'circle',
  source: 'charging-source',
  paint: {
    'circle-color': '#2252D5',
    'circle-radius': 5,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};

const bikeshareMarkerLayer = {
  type: 'circle',
  source: 'bikeshare-source',
  paint: {
    'circle-color': ['step', ['get', 'free_bikes'], '#ED0B5A', 1, '#0E8F3A', 4, '#16F45F'],
    'circle-radius': 5,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};

const projectsMarkerLayer = {
  type: 'symbol',
  source: 'projects-source',
  layout: {
    'icon-image': ['concat', 'maki-marker-stroked-15-', ['get', 'status']],
    //'icon-size': 1.25,
    'icon-size': ['interpolate', ['linear'], ['zoom'], 6, 1.25, 12, 2.75 ],
    'icon-anchor': 'bottom',
    //'icon-ignore-placement': true,
    'icon-allow-overlap': true,
    'text-field': ['get', 'name'],
    'text-font': ['DIN Offc Pro Regular', 'Arial Unicode MS Regular'],
    //'text-size': 13,
    'text-size': ['interpolate', ['linear'], ['zoom'], 6, 12, 12, 16 ],
    //'text-size': ['step', ['zoom'], 0, 8, 12],  // show label at zoom level
    'text-anchor': 'bottom',
    //'text-offset': [0,-.2],
    //'text-variable-anchor': ['top', 'left', 'right', 'bottom', 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
    //'text-radial-offset': 1.75,
    'text-radial-offset': ['interpolate', ['linear'], ['zoom'], 6, 1.75, 12, 3 ],
    'text-optional': true,
  },
  paint: {
    //'icon-opacity': 0.1,
    //'text-color': 'red',
    //'text-halo-color': 'white',
    //'text-halo-width': 0,
  }
};

const projectsMarkerFocusLayer = {
  type: 'symbol',
  source: 'projects-source',
  layout: {
    'icon-image': ['concat', 'maki-marker-stroked-15-', ['get', 'status']],
    'icon-size': ['interpolate', ['linear'], ['zoom'], 6, 1.25, 12, 2.75 ],
    'icon-anchor': 'bottom',
    'icon-allow-overlap': true,
    'text-field': ['get', 'name'],
    'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': ['interpolate', ['linear'], ['zoom'], 6, 12, 12, 16 ],
    'text-anchor': 'bottom',
    //'text-variable-anchor': ['top', 'left', 'right', 'bottom', 'center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'],
    'text-radial-offset': ['interpolate', ['linear'], ['zoom'], 6, 1.75, 12, 3 ],
    'text-optional': true,
  },
  paint: {
    //'icon-opacity': 1,
    //'text-color': 'black',
    //'text-halo-color': 'white',
    //'text-halo-width': 0.5,
  }
};

const geomPolygonLayer = {
  type: 'fill',
  source: 'projectgeoms-source',
};
const geomPointLayer = {
  type: 'circle',
  source: 'projectgeoms-source',
};
const geomLineLayer = {
  source: 'projectgeoms-source',
  type: 'line',
};