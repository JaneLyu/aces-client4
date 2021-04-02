import * as Constants from "../constants"
import { API, Auth } from "aws-amplify";


// payload: projects, geojson, project data is features array; by properties.id
export const fetchProjectsData = async dispatch => {
  console.log("***** " + Constants.FETCH_PROJECTS_DATA);

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
  console.log("***** " + Constants.FETCH_BIKESHARE_DATA);

  var stations = [];
  try {
    fetch("https://api.citybik.es/v2/networks")
      .then(response => response.json())
      .then(data => {
        var filtered = data.networks.filter((network) => {
          return network.location.city.toLowerCase().endsWith(", fl");
        });
        return filtered;
      })
      .then(async networks => {
        await Promise.all(networks.map((network) => {
          return fetch("https://api.citybik.es/v2/networks/" + network.id)
            .then(response => response.json())
        }))
          .then(responses => {
            responses.forEach(res => {
              if (res.network && res.network.stations && res.network.stations.length > 0) {
                stations = stations.concat(res.network.stations)
              }
            })
            //console.log(stations);

            return dispatch({
              type: Constants.FETCH_BIKESHARE_DATA,
              payload: stations
            });
          });
      });
  } catch (e) {
    console.log(e);
  }
};
/* export const fetchBikeshareData = async dispatch => {
  console.log("***** " + Constants.FETCH_BIKESHARE_DATA);

  let networks = [];
  try {
    await fetch("https://api.citybik.es/v2/networks")
      .then(response => response.json())
      .then(data => networks = data.networks)
  } catch (e) {
    console.log(e);
  }

  return dispatch({
    type: Constants.FETCH_BIKESHARE_DATA,
    payload: networks
  });
}; */

export const fetchBikeshareStationData = async (networkId, state, dispatch) => {
  console.log("***** " + Constants.FETCH_BIKESHARE_STATION_DATA + ": " + networkId);

  let networkData;
  try {
    await fetch("https://api.citybik.es/v2/networks/" + networkId)
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


export const fetchFuelStationData = async dispatch => {
  console.log("***** " + Constants.FETCH_FUELING_DATA);

  let stations = [];
  try {
    await fetch("https://developer.nrel.gov/api/alt-fuel-stations/v1.json?api_key="
      + Constants.NREL_TOKEN + "&access=public&fuel_type=ELEC&ev_charging_level=2%2Cdc_fast&state=US-FL&status=E")
      .then(response => response.json())
      .then(data => stations = data)
  } catch (e) {
    console.log(e);
  }

  return dispatch({
    type: Constants.FETCH_FUELING_DATA,
    payload: stations
  });
};

export const setFuelStationCity = async (cityId, state, dispatch) => {
  console.log("***** " + Constants.SET_FUELING_CITY);

  return dispatch({
    type: Constants.SET_FUELING_CITY,
    payload: cityId
  });
};

export const setFuelStationViewport = (viewport, state, dispatch) => {
  let dispatchObj = {
    type: Constants.SET_FUELING_VIEWPORT,
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

export const resetProjectsView = (state, dispatch) => {
  let dispatchObj = {
    type: Constants.RESET_PROJECTS_VIEW,
    payload: null
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


//const SPAT_DATA_URL = 'https://transportationops.org/sites/transops/themes/transops/js/spat-pins.json';
const SPAT_DATA_URL = Constants.STATIC_ROOT_URL + "json/spat-pins.json";
export const fetchSpatData = async dispatch => {
  let spatData;
  try {
    await fetch(SPAT_DATA_URL)
      .then(response => response.json())
      .then(data => spatData = data)
  } catch (e) {
    console.log(e);
  }
  return dispatch({
    type: Constants.FETCH_SPAT_DATA,
    payload: spatData
  });
};

export const setSpatViewport = (viewport, state, dispatch) => {
  let dispatchObj = {
    type: Constants.SET_SPAT_VIEWPORT,
    payload: viewport
  };
  return dispatch(dispatchObj);
};


export const toggleProjectsVisibility = (state, dispatch) => {
  let dispatchObj = {
    type: Constants.TOGGLE_PROJECTS_VISIBILITY,
    payload: null
  };
  return dispatch(dispatchObj);
};

export const toggleBikeshareVisibility = (state, dispatch) => {
  let dispatchObj = {
    type: Constants.TOGGLE_BIKESHARE_VISIBILITY,
    payload: null
  };
  return dispatch(dispatchObj);
};

export const toggleFuelVisibility = (state, dispatch) => {
  let dispatchObj = {
    type: Constants.TOGGLE_FUEL_VISIBILITY,
    payload: null
  };
  return dispatch(dispatchObj);
};

