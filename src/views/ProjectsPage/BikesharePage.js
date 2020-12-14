import React, { Component } from "react";
import { render } from 'react-dom';
import { useParams } from "react-router-dom";

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import styles from "assets/jss/material-kit-react/views/projectsPage.js";
import { Paper, ButtonBase } from '@material-ui/core';
import Box from '@material-ui/core/Box';

import { Store } from "../../store/store"
import {
  fetchBikeshareStationData, fetchProjectsGeom, toggleProjectFilters, viewProjects, viewOneProject,
  setBikeshareNetworkViewport, toggleGeomVisibility, toggleMapStyle, fetchBikeshareData
} from "../../store/actions"

import moment from "moment"
//import MapGL, { Source, Layer, NavigationControl, ScaleControl, Popup } from "react-map-gl";
import MapGL, { Popup, Source, Layer, NavigationControl } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import * as Constants from "../../constants"


const useStyles = makeStyles(styles);

export default function BikesharePage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const { state, dispatch } = React.useContext(Store);
  const { id } = useParams();
  const [popupInfo, setPopupInfo] = React.useState();
  const [mapCursorStyle, setMapCursorStyle] = React.useState();

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

  const onMapStyleClick = event => {
    //console.log("toggle map style");
    toggleMapStyle(state, dispatch);
  }

  const onViewportChange = vp => {
    setBikeshareNetworkViewport(vp, state, dispatch);
  }

  const renderPopup = () => {
    return (
      popupInfo &&
      <Popup
        longitude={popupInfo.geometry.coordinates[0]}
        latitude={popupInfo.geometry.coordinates[1]}
        closeButton={true}
        closeOnClick={false}
        onClose={() => setPopupInfo(null)}
      >
        <div style={{paddingTop: '8px'}}>
          <p style={{ fontSize: '0.9rem' }}><strong>{popupInfo.properties.name}</strong></p>
          <p style={{ fontSize: '0.75rem' }}>
            Bikes available:&nbsp;&nbsp;<strong>{popupInfo.properties.free_bikes}</strong><br/>
            Spaces available:&nbsp;&nbsp;<strong>{popupInfo.properties.empty_slots}</strong>
          </p>
          <span style={{ fontSize: '0.6rem', fontStyle: 'italic' }}>
            Last updated {moment(popupInfo.properties.timestamp).format("M/D/YYYY, h:mm:ss a")}
          </span>
        </div>
      </Popup>
    );
  }

  const handleLayerClick = event => {
    const feature = event.features[0];
    if (!feature) return;

    setPopupInfo(feature)
  };

  const handleLayerHover = event => {
    setMapCursorStyle("pointer");

  };

  const handleLayerLeave = event => {
    setMapCursorStyle();
  };

  const handleMapLoad = event => {
    console.log("===== Mapbox load (bikeshare)");
  };

  const handleMapClick = event => {
    if (!event.features || !event.features[0]) {
      setPopupInfo(null);
    }
  };

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
        <Box display="flex" p={0} style={{ width: '100%' }}>
          <Box p={0} style={{ width: '100%', height: 'calc(100vh - ' + Constants.HEADER_HEIGHT + 'px)', overflow: 'hidden' }}>
            <MapGL {...state.bikeshareNetworkViewport}
              style={{ width: '100%', height: '100%' }}
              cursorStyle={mapCursorStyle}
              mapStyle={state.mapStyle}
              accessToken={Constants.MAPBOX_TOKEN}
              onViewportChange={onViewportChange}
              onLoad={handleMapLoad} onClick={handleMapClick}
            >
              <Source id="bikeshare-source"
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.bikeshareNetwork ? state.bikeshareNetwork.stations : []
                }}
              />
              <Layer {...stationMarkerLayer}
                onClick={handleLayerClick} onHover={handleLayerHover} onLeave={handleLayerLeave} />
              {renderPopup()}
              <NavigationControl showCompass showZoom position='top-right' />
              {
                state.bikeshareNetwork &&
                <div style={{
                  position: 'absolute', padding: '15px', top: '2px', left: '0px',
                  background: 'white', boxShadow: '2px 2px 2px rgba(0,0,0,0.3)',
                  margin: '10px', borderRadius: '5px'
                }}>
                  <div>
                    <strong style={{ fontSize: '1.5rem' }}>{state.bikeshareNetwork.name}</strong>
                    {
                      state.bikeshareNetwork.location && 
                      <div style={{ fontSize: '1rem', fontStyle: 'italic' }}>{state.bikeshareNetwork.location.city}</div>
                    }
                  </div>
                  <div style={{ fontSize: '1.2rem', marginTop: '10px' }}>
                    <strong>{state.bikeshareNetwork.stations.length}</strong>
                    {" bikeshare station" + (state.bikeshareNetwork.stations.length > 1 ? "s" : "")}
                  </div>
                </div>
              }
            </MapGL>

            {/* <MapGL
              {...state.bikeshareNetworkViewport}
              width="100%"
              height="100%"
              mapStyle={state.mapStyle}
              onViewportChange={onViewportChange}
              mapboxApiAccessToken={Constants.MAPBOX_TOKEN}
              interactiveLayerIds={[stationMarkerLayer.id]}
              onClick={handleMapOnClick} onLoad={handleMapLoad}
            >
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
                right: '0px'
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
            </MapGL> */}
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
  id: 'bikeshare-markers',
  //type: 'symbol',
  type: 'circle',
  source: 'bikeshare-source',
  paint: {
    'circle-color': ['step', ['get', 'free_bikes'], '#ED0B5A', 2, '#FECC00', 6, '#16E127'],
    'circle-radius': 6,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#fff'
  }
};
