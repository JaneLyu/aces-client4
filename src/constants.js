export const HEADER_TITLE = 'FL A&middot;C&middot;E&middot;S';

let root_url;
if (process.env.REACT_APP_ENVIRONMENT === 'ghpages') {
  root_url = "/aces2/";
} else {
  root_url = "/";
}
export const ROOT_URL = "/";
export const STATIC_ROOT_URL = root_url;


//export const ACES_LABEL = "A⋅C⋅E⋅S";
export const ACES_LABEL = "ACES";
export const ACES_BRAND = "" + ACES_LABEL + " Activity Viewer";
export const HEADER_HEIGHT = 60; // px


export const MAPBOX_TOKEN = "pk.eyJ1IjoieWh1YW5nNyIsImEiOiJjazJocjliaWEwdnd6M2hxZ2FnNHM3cDkwIn0.UQxOTkmbQTAv-e9El4zLKQ";
//export const MAPBOX_STYLE_STREET = "mapbox://styles/yhuang7/ck6nudp1h1am11intobzjm1em";
export const MAPBOX_STYLE_STREET = "mapbox://styles/yhuang7/ckbmj7s1o1gps1hmh1eny04eh"; // streets2
//export const MAPBOX_STYLE_SATELLITE = "mapbox://styles/yhuang7/ck7sem6mk2mi61imk9yqls0un";
export const MAPBOX_STYLE_SATELLITE = "mapbox://styles/yhuang7/ckbmkf85r1hzc1iqixkmp0bw5"; // satellite2
export const MAPBOX_TRANSITION_DURATION = 0;

export const MAPBOX_MARKER_BASE_FILTER = ['!', ['has', 'point_count']];
export const MAPBOX_MARKER_FOCUS_BASE_FILTER = ["==", ["get", "id"], 0];
export const MAPBOX_GEOM_BASE_FILTER = ["==", ["get", "id"], 0];
export const MAPBOX_GEOM_POINT_BASE_FILTER = ["==", ["geometry-type"], "Point"];
export const MAPBOX_GEOM_LINE_BASE_FILTER = ["==", ["geometry-type"], "LineString"];
export const MAPBOX_GEOM_POLYGON_BASE_FILTER = ["==", ["geometry-type"], "Polygon"];

export const MAPBOX_GEOM_COLOR_MAP = '#0063FF'; // blue
export const MAPBOX_GEOM_COLOR_SATELLITE = '#7D00FF'; // red
export const MAPBOX_GEOM_OPACITY_MAP = 0.4;
export const MAPBOX_GEOM_OPACITY_SATELLITE = 0.8;

export const MAPBOX_SYMBOL_PAINT_MAP = {
  'icon-opacity': 0.6,
  'text-color': '#222222',
  'text-halo-color': 'white',
  'text-halo-width': 1,
  'text-opacity': 1,
};
export const MAPBOX_SYMBOL_FOCUS_PAINT_MAP = {
  'icon-opacity': 1,
  'text-color': 'black',
  'text-halo-color': 'white',
  'text-halo-width': 0.5,
  'text-opacity': 1,
};
export const MAPBOX_SYMBOL_PAINT_SATELLITE = {
  'text-color': 'white',
  'text-halo-color': 'black',
  'text-halo-width': 0,
};

export const MAPBOX_GEOM_POINT_PAINT_MAP = {
  'circle-color': MAPBOX_GEOM_COLOR_MAP,
  'circle-radius': ['step', ['zoom'], 5, 9, 10],
  'circle-stroke-width': 2,
  'circle-stroke-color': 'white',
  'circle-opacity': 1
};
export const MAPBOX_GEOM_POINT_PAINT_SATELLITE = {
  'circle-color': MAPBOX_GEOM_COLOR_SATELLITE,
  'circle-radius': ['step', ['zoom'], 5, 9, 10],
  'circle-stroke-width': 2,
  'circle-stroke-color': 'white',
  'circle-opacity': 1
};

export const MAPBOX_GEOM_LINE_PAINT_MAP = {
  'line-width': 5,
  'line-color': MAPBOX_GEOM_COLOR_MAP,
  'line-opacity': MAPBOX_GEOM_OPACITY_MAP,
};
export const MAPBOX_GEOM_LINE_PAINT_SATELLITE = {
  'line-width': 5,
  'line-color': MAPBOX_GEOM_COLOR_SATELLITE,
  'line-opacity': MAPBOX_GEOM_OPACITY_SATELLITE,

};

export const MAPBOX_GEOM_POLYGON_PAINT_MAP = {
  'fill-color': MAPBOX_GEOM_COLOR_MAP,
  'fill-opacity': MAPBOX_GEOM_OPACITY_MAP,
  'fill-outline-color': 'white',
};
export const MAPBOX_GEOM_POLYGON_PAINT_SATELLITE = {
  'fill-color': MAPBOX_GEOM_COLOR_SATELLITE,
  'fill-opacity': MAPBOX_GEOM_OPACITY_SATELLITE / 2,
  'fill-outline-color': 'white',
};

export const MAPBOX_INITIAL_VIEWPORT = {
  latitude: 27.9,
  longitude: -84.8,
  zoom: 6.1, //6.2,
  bearing: 0,
  pitch: 0,
  transitionDuration: MAPBOX_TRANSITION_DURATION
};


export const NREL_TOKEN = "FfZup1v4iecWbIY61fLkhgvql6eEdZzYiCcoQeXQ";
//export const NREL_TOKEN = "DEMO_KEY";


// zoom levels from 0, meters / pixel
export const mapboxZP20 = [73551, 36775, 18387, 9194, 4597, 2298, 1149, 575, 287, 144, 72, 36, 18, 9, 4.5, 2.2, 1.1];
export const flHeight = 721000;
export const flWidth = 582000;

export const PROJECT_TYPE_PLAN = 1;
export const PROJECT_TYPE_DESIGN = 2;
export const PROJECT_TYPE_EVALUATION = 3;
export const PROJECT_TYPE_DEPLOYMENT = 4;
export const PROJECT_TYPE_DATA = 5;
export const PROJECT_TYPE_OTHER = 6;

export const PROJECT_SCOPE_STATEWIDE = 1;
export const PROJECT_SCOPE_LOCAL = 2;

export const FILTER_NAME_TYPE = 'status';
export const FILTER_NAME_CATEGORY = 'category';
export const FILTER_NAME_MODE = 'mode';
export const FILTER_NAME_DISTRICT = 'district';
export const FILTER_NAME_SCOPE = 'scope';

//export const PROJECT_TYPE_COLORS = ['#ccc', '#9A00F0', '#FFD417', '#7373ff', '#00DC13', '#a3a3a3'];
//export const PROJECT_TYPE_COLORS = ['#ccc', '#F609B1', '#FFD000', '#7373ff', '#4EF609', '#a3a3a3'];
export const PROJECT_TYPE_COLORS = [
  '#ccc', 
  '#e33565', // planning
  '#f1c84c', // design
  '#4494e2', // evaluation
  '#61e565', // deployment
  '#a872d9', // data
  '#aab5be' // other
];


// actions
export const LOGIN_USER = 'LOGIN_USER';
export const LOGOUT_USER = 'LOGOUT_USER';

export const ADD_PROJECT_FILTER = 'ADD_PROJECT_FILTER';
export const REMOVE_PROJECT_FILTER = 'REMOVE_PROJECT_FILTER';
export const RESET_PROJECT_FILTERS = 'RESET_PROJECT_FILTERS';

export const SET_VIEWPORT = 'SET_VIEWPORT';
export const TOGGLE_MAP_STYLE = 'TOGGLE_MAP_STYLE';
export const TOGGLE_GEOM_VISIBILITY = 'TOGGLE_GEOM_VISIBILITY';

export const RESET_PROJECTS_VIEW = 'RESET_PROJECTS_VIEW';
export const VIEW_PROJECTS = 'VIEW_PROJECTS';
export const VIEW_ONE_PROJECT = 'VIEW_ONE_PROJECT';

export const FETCH_PROJECTS_DATA = 'FETCH_PROJECTS_DATA';
export const FETCH_PROJECTS_GEOM = 'FETCH_PROJECTS_GEOM';
export const FETCH_USERS_DATA = 'FETCH_USERS_DATA';

export const FETCH_SPAT_DATA = 'FETCH_SPAT_DATA';
export const SET_SPAT_VIEWPORT = 'SET_SPAT_VIEWPORT';

export const FETCH_BIKESHARE_DATA = 'FETCH_BIKESHARE_DATA';
export const FETCH_BIKESHARE_STATION_DATA = 'FETCH_BIKESHARE_STATION_DATA';
export const SET_BIKESHARE_NETWORK_VIEWPORT = 'SET_BIKESHARE_NETWORK_VIEWPORT';

export const FETCH_FUELING_DATA = 'FETCH_FUELING_DATA';
export const SET_FUELING_CITY = 'SET_FUELING_CITY';
export const SET_FUELING_VIEWPORT = 'SET_FUELING_VIEWPORT';

export const TOGGLE_PROJECTS_VISIBILITY = 'TOGGLE_PROJECTS_VISIBILITY';
export const TOGGLE_BIKESHARE_VISIBILITY = 'TOGGLE_BIKESHARE_VISIBILITY';
export const TOGGLE_FUEL_VISIBILITY = 'TOGGLE_FUEL_VISIBILITY';
