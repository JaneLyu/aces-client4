import * as Constants from "../constants"
import { API, Auth } from "aws-amplify";


// payload: projects, geojson, project data is features array; by properties.id
const PROJECTS_URL = Constants.STATIC_ROOT_URL + "json/projects_data.json";
export const fetchProjectsData = async dispatch => {
  //console.log(FETCH_PROJECTS_DATA + " action started");

  /*const data = await fetch(PROJECTS_URL);
  const dataJSON = await data.json();*/

  const data = await API.get("projects", "/projects/all");
  return dispatch({
    type: Constants.FETCH_PROJECTS_DATA,
    //payload: dataJSON.features
    payload: data
  });
};

// geojson, array of features, 1 per project; by properties.id
const GEOM_URL = Constants.STATIC_ROOT_URL + "json/projects_geom0.json";
export const fetchProjectsGeom = async dispatch => {
  const data = await fetch(GEOM_URL);

  const dataJSON = await data.json();
  return dispatch({
    type: Constants.FETCH_PROJECTS_GEOM,
    payload: dataJSON.features
  });
};

export const fetchBikeshareData = async dispatch => {
  let networks = [];
  try {
    await fetch("http://api.citybik.es/v2/networks")
      .then(response => response.json())
      .then(data => networks = data.networks)
  } catch (e) {
    console.log(e);
  }

  return dispatch({
    type: Constants.FETCH_BIKESHARE_DATA,
    payload: networks
  });
};

export const fetchBikeshareStationData = async (networkId, state, dispatch) => {
  /* const network = state.bikeshares.find(function (element) {
    return element.properties.id === networkId;
  });
 */
  console.log("GET http://api.citybik.es/v2/networks/" + networkId);

  let networkData;
  try {
    await fetch("http://api.citybik.es/v2/networks/" + networkId)
      .then(response => response.json())
      .then(data => networkData = data.network)
  } catch (e) {
    console.log(e);
  }

  return dispatch({
    type: Constants.FETCH_BIKESHARE_STATION_DATA,
    payload: networkData
  });
};

export const setBikeshareNetworkViewport = (viewport, state, dispatch) => {
  let dispatchObj = {
    type: Constants.SET_BIKESHARE_NETWORK_VIEWPORT,
    payload: viewport
  };
  return dispatch(dispatchObj);
};

// param: {filter name, filter data}
// payload: projectFilters
export const toggleProjectFilters = (filter, state, dispatch) => {
  // find filter from list
  // add or remove filter
  const filterActive = state.projectFilters.find(function (element) {
    return element.name == filter.name && element.value == filter.value;
  });

  let dispatchObj = {
    type: Constants.ADD_PROJECT_FILTER,
    payload: filter
  };

  if (filterActive != undefined) {
    dispatchObj = {
      type: Constants.REMOVE_PROJECT_FILTER,
      payload: state.projectFilters.filter(function (element) {
        return element.name != filter.name || element.value != filter.value;
      })
    }
  }

  return dispatch(dispatchObj);
};

// reset project filters
// payload: projectFilters ([])


// view project (fetch project data)
// param: project id
// payload: project
export const viewOneProject = (projectId, state, dispatch) => {
  if (state.project != null && state.project.properties.id == projectId)
    return { type: '', payload: null };

  // future: fetch project data from server
  var project = state.projects.find(function (element) {
    return element.properties.id == projectId;
  });

  let dispatchObj = {
    type: Constants.VIEW_ONE_PROJECT,
    payload: project
  };
  return dispatch(dispatchObj);
};

export const viewProjects = (state, dispatch) => {
  let dispatchObj = {
    type: Constants.VIEW_PROJECTS,
    payload: null
  };
  return dispatch(dispatchObj);
};

export const setViewport = (viewport, state, dispatch) => {
  let dispatchObj = {
    type: Constants.SET_VIEWPORT,
    payload: viewport
  };
  return dispatch(dispatchObj);
};

export const toggleMapStyle = (state, dispatch) => {
  let dispatchObj = {
    type: Constants.TOGGLE_MAP_STYLE,
    payload: null
  };
  return dispatch(dispatchObj);
};

// projectId = 0 for hide all
export const toggleGeomVisibility = (projectId, state, dispatch) => {
  let dispatchObj = {
    type: Constants.TOGGLE_GEOM_VISIBILITY,
    payload: projectId
  };
  return dispatch(dispatchObj);
};

// login
// param: user
// payload: user


// logout
// param: -
// payload: null user


// 


//const SPAT_DATA_URL = 'https://transportationops.org/sites/transops/themes/transops/js/spat-pins.json';
const SPAT_DATA_URL = Constants.STATIC_ROOT_URL + "json/spat-pins.json";
export const fetchSpatData = async dispatch => {
  const data = await fetch(SPAT_DATA_URL);
  const dataJSON = await data.json();
  return dispatch({
    type: Constants.FETCH_SPAT_DATA,
    payload: dataJSON
  });
};

export const setSpatViewport = (viewport, state, dispatch) => {
  let dispatchObj = {
    type: Constants.SET_SPAT_VIEWPORT,
    payload: viewport
  };
  return dispatch(dispatchObj);
};

