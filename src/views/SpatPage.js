import React, { Component } from "react";
import { render } from 'react-dom';
import { useParams } from "react-router-dom";
//import MapGL, { Source, Layer, NavigationControl, ScaleControl, Popup } from "react-map-gl";
import MapGL, { Popup, Source, Layer, NavigationControl } from '@urbica/react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import DOMPurify from 'dompurify';

import { makeStyles, useTheme } from "@material-ui/core/styles";
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";

import styles from "assets/jss/material-kit-react/views/projectsPage.js";
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
  const [mapCursorStyle, setMapCursorStyle] = React.useState();

  React.useEffect(
    () => {
      state.spatList.length === 0 && fetchSpatData(dispatch);
    },
    [state.spatList]
  );

  const onViewportChange = vp => {
    setSpatViewport(vp, state, dispatch);
  }

  const renderPopup = () => {
    return (
      popupInfo &&
      <Popup
        longitude={popupInfo.geometry.coordinates[0]}
        latitude={popupInfo.geometry.coordinates[1]}
        closeButton={true}
        closeOnClick={false}
        maxWidth="400px"
        onClose={() => setPopupInfo(null)}
      >
        <div style={{ overflow: 'auto', marginTop: '8px' }}>
          <p style={{ fontSize: '0.7rem' }}><strong>Location:</strong>&nbsp;&nbsp;{popupInfo.properties.location}</p>
          <p style={{ fontSize: '0.7rem' }}><strong>Timeline:</strong>&nbsp;&nbsp;{popupInfo.properties.timeline}</p>
          <p style={{ fontSize: '0.7rem' }}><strong>Description:</strong>&nbsp;&nbsp;
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(popupInfo.properties.description) }} /></p>
          <p style={{ fontSize: '0.7rem' }}><strong>Contact:</strong>&nbsp;&nbsp;
            <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(popupInfo.properties.contact) }} /></p>
        </div>
      </Popup>
    );
  }

  const handleLayerClick = event => {
    //console.log("layer click");
    //console.log(event);
    const feature = event.features[0];
    if (!feature) return;

    setPopupInfo(feature)
    //event.originalEvent.stopPropagation();
  };

  const handleLayerHover = event => {
    setMapCursorStyle("pointer");
  };

  const handleLayerLeave = event => {
    setMapCursorStyle();
  };

  const handleMapLoad = event => {
    console.log("===== Mapbox load (spat)");
  };

  const handleMapClick = event => {
    //console.log("map click");
    //console.log(event);
    if (!event.features || !event.features[0]) {
      //setPopupInfo(null);
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
        <Box p={0} style={{ width: '100%', padding: '20px 20px 20px 20px' }}>
          <Box display="flex" style={{ padding: '0px 0 10px 0' }}>
            <span style={{ fontSize: '25px', fontWeight: 'bold' }}>NOCoE SPaT Challenge</span>
            <a href="https://transportationops.org/spatchallenge" target="_blank" rel="noopener noreferrer"
              style={{ marginLeft: '20px' }}>
              <img src={Constants.STATIC_ROOT_URL + 'images/external_link.png'} style={{ width: '20px', marginBottom: '5px' }} />
            </a>
          </Box>

          <Box p={0} style={{ width: '100%', height: 'calc(100vh - 140px)', overflow: 'hidden' }}>
            <MapGL {...state.spatViewport}
              style={{ width: '100%', height: '100%' }}
              cursorStyle={mapCursorStyle}
              mapStyle={Constants.MAPBOX_STYLE_STREET}
              accessToken={Constants.MAPBOX_TOKEN}
              onViewportChange={onViewportChange}
              onLoad={handleMapLoad} onClick={handleMapClick}
            >
              <Source id="spatsource"
                type="geojson"
                data={{
                  type: 'FeatureCollection',
                  features: state.spatList
                }}
              />
              <Layer {...spatSympbolLayer} paint={state.mapMarkerPaint}
                onClick={handleLayerClick} onHover={handleLayerHover} onLeave={handleLayerLeave} />

              {renderPopup()}

              <NavigationControl showCompass showZoom position='top-right' />

              <div style={{
                position: 'absolute', padding: '10px', top: '2px', left: '0px',
                background: 'white', boxShadow: '2px 2px 2px rgba(0,0,0,0.3)',
                margin: '10px', fontSize: '0.8rem', borderRadius: '5px'
              }}>
                <div>
                  <img src={require('assets/img/maki-marker-stroked-15-c.svg')} style={{ marginRight: '5px' }} />
                  SPaT deployment underway
                </div>
                <div>
                  <img src={require('assets/img/maki-marker-stroked-15-4.svg')} style={{ marginRight: '5px' }} />
                  SPaT deployment operational
                </div>
              </div>

            </MapGL>
          </Box>
        </Box>
      </div>
    </Box >
  );
}

const spatSympbolLayer = {
  id: 'spatsymbols',
  source: 'spatsource',
  type: 'symbol',
  layout: {
    'icon-image': ['concat', 'maki-marker-stroked-15-', [
      'match',
      ['get', 'status'],
      "deployed", '4',
      "underway", 'c',
      ''
    ]],
    //'icon-image': 'maki-marker-stroked-15-1',
    'icon-size': 1.5,
    //'icon-anchor': 'bottom',
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

