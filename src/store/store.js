import React from "react";
import { LinearInterpolator, WebMercatorViewport } from 'react-map-gl';
import bbox from '@turf/bbox';
import * as Constants from "../constants";
import GEOJSON_FL from "../assets/json/florida";

export const Store = React.createContext("");


const spatInitialViewport = {
  latitude: 38.84706035607122,
  longitude: -96.57421875,
  zoom: 3.5,
  bearing: 0,
  pitch: 0,
  transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
};

const statewideProjectViewport = {
  latitude: 30.437003, // +/- 0.04
  longitude: -84.274687, // +/- 0.06
  zoom: 3.5,
  bearing: 0,
  pitch: 0,
  transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
};

const initialState = {
  isLoading: true,

  userProfile: null,
  users: [],
  projects: [],
  projectsVisible: true,
  projectGeoms: [],
  projectFilters: [],
  visibleProjects: [],
  project: null,
  viewport: Constants.MAPBOX_INITIAL_VIEWPORT,
  projectsViewport: null,
  mapStyle: Constants.MAPBOX_STYLE_STREET,
  mapMarkerFilter: Constants.MAPBOX_MARKER_BASE_FILTER,
  mapMarkerPaint: Constants.MAPBOX_SYMBOL_PAINT_MAP,
  mapMarkerFocusFilter: Constants.MAPBOX_MARKER_FOCUS_BASE_FILTER,
  mapMarkerFocusPaint: Constants.MAPBOX_SYMBOL_FOCUS_PAINT_MAP,
  mapGeomPointFilter: ['all', Constants.MAPBOX_GEOM_POINT_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
  mapGeomPointPaint: Constants.MAPBOX_GEOM_POINT_PAINT_MAP,
  mapGeomLineFilter: ['all', Constants.MAPBOX_GEOM_LINE_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
  mapGeomLinePaint: Constants.MAPBOX_GEOM_LINE_PAINT_MAP,
  mapGeomPolygonFilter: ['all', Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
  mapGeomPolygonPaint: Constants.MAPBOX_GEOM_POLYGON_PAINT_MAP,

  spatViewport: spatInitialViewport,
  spatList: [],

  bikeshares: [],
  bikeshareStations: [],
  bikesharesVisible: false,
  bikeshareNetwork: null,
  bikeshareNetworkViewport: Constants.MAPBOX_INITIAL_VIEWPORT,

  fuelStationVisible: false,
  fuelStationsTotal: 0,
  fuelStations: [],
  fuelStationCity: null,
  fuelStationViewport: Constants.MAPBOX_INITIAL_VIEWPORT,
};


function getLoadingStatus(state) {
  var loading = true;

  if (state) {
    if (state.projects && state.projects.length > 0
      //&& state.bikeshareStations && state.bikeshareStations.length > 0
      //&& state.fuelStations && state.fuelStations.length > 0
    ) {
      loading = false;
    }
  }

  return loading;
}


function processSpatData(data) {
  let processed = [];
  if (!data) return processed;

  data.map((spat, index) => {
    processed.push({
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [spat.coords.lng, spat.coords.lat]
      },
      properties: {
        status: spat.status,
        location: spat.location,
        timeline: spat.timeline,
        description: spat.description,
        contact: spat.contact
      }
    });
  });

  return processed;
}

function processProjectData(data) {
  if (!data) return [];

  let filtered = data.filter((proj, index) => {
    return proj.active;
  });
  //let filtered = data;

  let projects = filtered.map((proj, index) => {
    let p = Object.assign({}, proj.location);
    //p["type"] = "Feature";
    p["properties"] = proj;
    p.properties["id"] = proj.projectId;
    p.properties["name"] = proj.shortTitle;
    p.properties["status"] = parseInt(proj.status);
    if (p.properties.statewide) {
      p.properties.geom = JSON.parse(JSON.stringify(GEOJSON_FL));
      p.geometry.coordinates = [];
    }
    return p;
  });

  // sort order: type, statewide (true or false/empty), n-s (latitude high to low, location coord[1])
  projects.sort(function (a, b) {
    return (a.properties.status - b.properties.status ||
      ((a.properties.statewide && b.properties.statewide) || (!a.properties.statewide && !b.properties.statewide) ? 0 
        : a.properties.statewide ? -1 : 1) ||
      ((a.properties.statewide)
        ? a.properties.name.localeCompare(b.properties.name)
        : b.properties.location.geometry.coordinates[1] - a.properties.location.geometry.coordinates[1])
      //a.properties.name.localeCompare(b.properties.name)
    );
  });

  return projects;
}

// data is array of stations
function processBikeshareData(data) {
  if (!data) return [];

  // filter out zero slot stations (demo)
  let filtered = data.filter((station) => {
    return station.empty_slots > 0 && !station.name.startsWith("TEST ");
  });

  let stations = filtered.map((station, index) => {
    let n = {};
    n["type"] = "Feature";
    n["geometry"] = {
      "type": "Point",
      "coordinates": [station.longitude, station.latitude]
    };
    n["properties"] = station;
    return n;
  });

  //console.log(stations);
  return stations;
}
// data: array of networks
function processBikeshareData2(data) {
  if (!data) return [];

  //console.log(data);

  // filter us only
  /*   let filtered = data.filter((network, index) => {
      return network.location.country.toLowerCase() === "us";
    }); */

  // filter florida only
  let filtered = data.filter((network, index) => {
    return network.location.city.toLowerCase().endsWith(", fl");
  });

  //console.log(filtered.length + " filtered networks")

  let networks = filtered.map((network, index) => {
    let n = {};
    n["type"] = "Feature";
    n["geometry"] = {
      "type": "Point",
      "coordinates": [network.location.longitude, network.location.latitude]
    };
    n["properties"] = network;
    n.properties["city"] = network.location.city;
    n.properties["dataType"] = "bikeshare"; // TODO

    return n;
  });

  //console.log(networks);

  return networks;
}

function processBikeshareStationData(data) {
  if (!data) return null;

  //console.log(data.stations.length);

  let network = { ...data };

  // filter out zero slot stations (demo)
  let filtered = network.stations.filter((station, index) => {
    return station.empty_slots > 0;
  });

  let stations = filtered.map((station, index) => {
    let n = {};
    n["type"] = "Feature";
    n["geometry"] = {
      "type": "Point",
      "coordinates": [station.longitude, station.latitude]
    };
    n["properties"] = station;

    return n;
  });

  network["stations"] = stations;

  //console.log(network.stations.length);

  return network;
}

function processFuelStationData(data) {
  if (!data || !data.fuel_stations) return null;

  console.log("total stations: " + data.fuel_stations.length);

  let processed = [];
  // group by city
  processed = data.fuel_stations.map((station) => {
    let s = {};
    s["type"] = "Feature";
    s["geometry"] = {
      "type": "Point",
      "coordinates": [station.longitude, station.latitude]
    };
    s["properties"] = station;

    return s;
  });

  return processed;
}
function processFuelStationData_Grouped(data) {
  if (!data || !data.fuel_stations) return null;

  console.log("total stations: " + data.fuel_stations.length);

  let processed = {
    "total": data.total_results,
    "cities": []
  };
  let cityNames = [];
  let groupedStations = {};

  // group by city
  data.fuel_stations.forEach((station) => {
    let s = {};
    s["type"] = "Feature";
    s["geometry"] = {
      "type": "Point",
      "coordinates": [station.longitude, station.latitude]
    };
    s["properties"] = station;

    var city = station.city;
    var state = station.state;
    if (!groupedStations[city]) {
      cityNames.push(city);

      groupedStations[city] = {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [station.longitude, station.latitude]
        },
        "properties": {
          "name": city,
          "state": state,
          "dataType": "fuel",
          "stations": []
        }
      };
    }

    groupedStations[city].properties.stations.push(s);
  });

  cityNames.forEach((cityName) => {
    /* try {
      groupedStations[cityName].properties.bounds = bbox(groupedStations[cityName]);
    } catch (e) {
      console.log(e);
    } */
    processed.cities.push(groupedStations[cityName]);
  });

  //console.log(processed);

  return processed;
}


function reducer(state, action) {
  var newFilters;
  let newVp;
  let newState;

  //console.log('reducer: ' + action.type);

  switch (action.type) {
    case Constants.FETCH_PROJECTS_DATA:
      let projects = processProjectData(action.payload);
      let geoms = [];

      projects.forEach((proj) => {
        if (proj.properties.geom && proj.properties.geom.features.length > 0) {
          proj.properties.geom.features.forEach((geo) => {
            let g = geo;
            g.properties["id"] = proj.properties.id;
            g.properties["name"] = proj.properties.name;
            g.properties["status"] = proj.properties.status;
            geoms.push(g);
          });
        }
      });

      //console.log(projects);
      //console.log(geoms);

      newState = {
        ...state, projects: projects, visibleProjects: projects, projectGeoms: geoms
      };

      newState.isLoading = getLoadingStatus(newState);
      //console.log("project data done; isloading: " + newState.isLoading);

      return newState;
    case Constants.FETCH_PROJECTS_GEOM:
      // payload = projects
      return {
        ...state, projectGeoms: action.payload
      };
    case Constants.SET_VIEWPORT:
      return {
        ...state, viewport: action.payload
      };
    /*     case Constants.FETCH_BIKESHARE_DATA:
          let networks = processBikeshareData(action.payload);
          return {
            ...state, bikeshares: networks
          }; */
    case Constants.FETCH_BIKESHARE_DATA:
      let stations = processBikeshareData(action.payload);

      newState = {
        ...state, bikeshareStations: stations
      };
      newState.isLoading = getLoadingStatus(newState);
      //console.log("bikeshare data done; isloading: " + newState.isLoading);     

      return newState;
    case Constants.FETCH_BIKESHARE_STATION_DATA:
      let network = processBikeshareStationData(action.payload);
      newVp = state.bikeshareNetworkViewport;

      //console.log('reducer: ' + action.type + ' - ' + network.stations.length);
      //return state;

      // update viewport
      if (network) {
        if (network.stations.length > 0) {
          const geoms = {
            "type": "FeatureCollection",
            "features": network.stations
          };
          // calculate bbox of geom
          const [minLng, minLat, maxLng, maxLat] = bbox(geoms);
          //console.log("bbox minLng: " + minLng);
          //console.log("bbox maxLng: " + maxLng);
          //console.log("bbox minLat: " + minLat);
          //console.log("bbox maxLat: " + maxLat);

          const futureVp = {
            ...state.bikeshareNetworkViewport,
            width: window.innerWidth,
            height: window.innerHeight
          }

          //console.log(futureVp);


          // construct a viewport instance from the current state
          let vp = null;
          try {
            vp = new WebMercatorViewport(futureVp);
            const { longitude, latitude, zoom } = vp.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
              padding: 100
            });
            newVp = {
              ...state.bikeshareNetworkViewport,
              longitude,
              latitude,
              zoom: Math.min(zoom, 12),
              /*transitionInterpolator: new LinearInterpolator({
                around: [event.offsetCenter.x, event.offsetCenter.y]
              }),*/
              transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
            }
          } catch (err) {
            console.error(err);
          }
        } else {
          newVp = {
            latitude: network.location.latitude,
            longitude: network.location.longitude,
            zoom: 12,
            bearing: 0,
            pitch: 0,
            transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
          }
        }
      }
      return {
        ...state, bikeshareNetwork: network, bikeshareNetworkViewport: newVp
      };
    case Constants.SET_BIKESHARE_NETWORK_VIEWPORT:
      return {
        ...state, bikeshareNetworkViewport: action.payload
      };
    case Constants.FETCH_FUELING_DATA:
      let fuelData = processFuelStationData(action.payload);

      newState = {
        ...state, fuelStations: fuelData
      };
      newState.isLoading = getLoadingStatus(newState);
      //console.log("fueling data done; isloading: " + newState.isLoading);     

      return newState;
    case Constants.SET_FUELING_CITY:
      let cityData = state.fuelStations.find(function (element) {
        return element.properties.name === action.payload;
      });
      //console.log(cityData);
      newVp = state.fuelStationViewport;

      if (cityData) {
        const geoms = {
          "type": "FeatureCollection",
          "features": cityData.properties.stations
        };
        //const [minLng, minLat, maxLng, maxLat] = cityData.properties.bounds;
        const [minLng, minLat, maxLng, maxLat] = bbox(geoms);
        //console.log("bbox minLng: " + minLng);
        //console.log("bbox maxLng: " + maxLng);
        //console.log("bbox minLat: " + minLat);
        //console.log("bbox maxLat: " + maxLat);

        const futureVp = {
          ...newVp,
          width: window.innerWidth,
          height: window.innerHeight
        }

        //console.log(futureVp);

        // construct a viewport instance from the current state
        let vp = null;
        try {
          vp = new WebMercatorViewport(futureVp);
          const { longitude, latitude, zoom } = vp.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
            padding: 100
          });
          newVp = {
            ...newVp,
            longitude,
            latitude,
            zoom: Math.min(zoom, 12),
            //zoom,
            /*transitionInterpolator: new LinearInterpolator({
              around: [event.offsetCenter.x, event.offsetCenter.y]
            }),*/
            transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
          }
        } catch (err) {
          console.error(err);
        }
      }

      return {
        ...state, fuelStationCity: cityData, fuelStationViewport: newVp
      };
    case Constants.SET_FUELING_VIEWPORT:
      return {
        ...state, fuelStationViewport: action.payload
      };
    case Constants.TOGGLE_MAP_STYLE:
      var mapStyle = (state.mapStyle === Constants.MAPBOX_STYLE_STREET) ?
        Constants.MAPBOX_STYLE_SATELLITE : Constants.MAPBOX_STYLE_STREET;

      var symbolPaint = (state.mapStyle === Constants.MAPBOX_STYLE_STREET) ?
        Constants.MAPBOX_SYMBOL_PAINT_SATELLITE : Constants.MAPBOX_SYMBOL_PAINT_MAP;

      var geomPointPaint = (state.mapStyle === Constants.MAPBOX_STYLE_STREET) ?
        Constants.MAPBOX_GEOM_POINT_PAINT_SATELLITE : Constants.MAPBOX_GEOM_POINT_PAINT_MAP;

      var geomLinePaint = (state.mapStyle === Constants.MAPBOX_STYLE_STREET) ?
        Constants.MAPBOX_GEOM_LINE_PAINT_SATELLITE : Constants.MAPBOX_GEOM_LINE_PAINT_MAP;

      var geomPolygonPaint = (state.mapStyle === Constants.MAPBOX_STYLE_STREET) ?
        Constants.MAPBOX_GEOM_POLYGON_PAINT_SATELLITE : Constants.MAPBOX_GEOM_POLYGON_PAINT_MAP;

      return {
        ...state,
        mapStyle: mapStyle,
        mapMarkerPaint: symbolPaint,
        mapGeomLinePaint: geomLinePaint,
        mapGeomPointPaint: geomPointPaint,
        mapGeomPolygonPaint: geomPolygonPaint
      };
    case Constants.TOGGLE_GEOM_VISIBILITY:
      let projId = action.payload;
      //console.log(action.type + ' ' + action.payload);
      if (projId) {
        return {
          ...state,
          mapMarkerFocusFilter: ["==", ["get", "id"], projId],
          mapGeomPointFilter: ["all", Constants.MAPBOX_GEOM_POINT_BASE_FILTER, ["==", ["get", "id"], projId]],
          mapGeomLineFilter: ["all", Constants.MAPBOX_GEOM_LINE_BASE_FILTER, ["==", ["get", "id"], projId]],
          mapGeomPolygonFilter: ["all", Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, ["==", ["get", "id"], projId]]
        };
      }
      return {
        ...state,
        mapMarkerFocusFilter: Constants.MAPBOX_MARKER_FOCUS_BASE_FILTER,
        mapGeomPointFilter: ['all', Constants.MAPBOX_GEOM_POINT_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
        mapGeomLineFilter: ['all', Constants.MAPBOX_GEOM_LINE_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
        mapGeomPolygonFilter: ['all', Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
      };
    case Constants.VIEW_PROJECTS:
      return {
        ...state,
        project: null,
        viewport: state.projectsViewport || Constants.MAPBOX_INITIAL_VIEWPORT,
        mapMarkerFilter: Constants.MAPBOX_MARKER_BASE_FILTER,
        mapMarkerFocusFilter: Constants.MAPBOX_MARKER_FOCUS_BASE_FILTER,
        mapGeomPointFilter: ['all', Constants.MAPBOX_GEOM_POINT_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
        mapGeomLineFilter: ['all', Constants.MAPBOX_GEOM_LINE_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
        mapGeomPolygonFilter: ['all', Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
      };
    case Constants.VIEW_ONE_PROJECT:
      // payload = project
      // update viewport (zoom to geom)
      let proj = action.payload;
      return {
        ...state,
        project: action.payload,
        projectsViewport: state.viewport,
        viewport: getProjectViewport(proj, state),
        mapMarkerFilter: ["all", Constants.MAPBOX_MARKER_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]],
        mapGeomPointFilter: ["all", Constants.MAPBOX_GEOM_POINT_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]],
        mapGeomLineFilter: ["all", Constants.MAPBOX_GEOM_LINE_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]],
        mapGeomPolygonFilter: ["all", Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]]
      };
    case Constants.RESET_PROJECTS_VIEW:
      // set aces view, reset filters, reset viewport
      return {
        ...state,
        projectsVisible: true, bikesharesVisible: false, fuelStationVisible: false,
        projectFilters: [], visibleProjects: Array.from(state.projects),
        project: null,
        viewport: Constants.MAPBOX_INITIAL_VIEWPORT,
      };

    case Constants.ADD_PROJECT_FILTER:
      // payload = filter
      newFilters = [...state.projectFilters, action.payload];
      return {
        ...state,
        projectFilters: newFilters,
        visibleProjects: filterProjects(state.projects, newFilters),
        //bikesharesVisible: filterBikeshares(newFilters),
        //fuelStationVisible: filterFuelStations(newFilters)
      };
      return state;
    case Constants.REMOVE_PROJECT_FILTER:
      // payload = updated filters
      return {
        ...state,
        projectFilters: action.payload,
        visibleProjects: filterProjects(state.projects, action.payload),
        //bikesharesVisible: filterBikeshares(action.payload),
        //fuelStationVisible: filterFuelStations(action.payload)
      };
    case Constants.RESET_PROJECT_FILTERS:
      // payload = null
      return {
        ...state,
        filters: [],
        visibleProjects: Array.from(state.projects),
        //bikesharesVisible: true,
        //fuelStationVisible: true
      };

    case Constants.FETCH_SPAT_DATA:
      let data = processSpatData(action.payload);
      return {
        ...state, spatList: data
      };
    case Constants.SET_SPAT_VIEWPORT:
      return {
        ...state, spatViewport: action.payload
      };
    case Constants.TOGGLE_PROJECTS_VISIBILITY:
      var newVis = !state.projectsVisible;
      return {
        ...state, projectsVisible: newVis, bikesharesVisible: !newVis, fuelStationVisible: !newVis
      };
    case Constants.TOGGLE_BIKESHARE_VISIBILITY:
      var newVis = !state.bikesharesVisible;
      return {
        ...state, projectsVisible: !newVis, bikesharesVisible: newVis, fuelStationVisible: !newVis
      };
    case Constants.TOGGLE_FUEL_VISIBILITY:
      var newVis = !state.fuelStationVisible;
      return {
        ...state, projectsVisible: !newVis, bikesharesVisible: !newVis, fuelStationVisible: newVis
      };

    default:
      return state;
  }
}

// return boolean show/hide
// bikeshares are live, connected+shared, bike
function filterBikeshares(filters) {
  let statusMatch = false;
  let categoryMatch = false;
  let modeMatch = false;

  let statusFilters = filters.filter(function (element) {
    return element.name === 'status';
  });
  statusMatch = statusFilters.length === 0 || statusFilters.some(e => e.value === Constants.PROJECT_TYPE_DEPLOYMENT);

  let categoryFilters = filters.filter(function (element) {
    return element.name === 'category';
  });
  categoryMatch = categoryFilters.length === 0 ||
    categoryFilters.some(e => e.value.toLowerCase() === 'c' || e.value.toLowerCase() === 's');

  let modeFilters = filters.filter(function (element) {
    return element.name == 'mode';
  });
  modeMatch = modeFilters.length === 0 || modeFilters.some(e => e.value.toLowerCase() == 'b');

  return statusMatch && categoryMatch && modeMatch;
}

// return boolean show/hide
// fuel stations are deployment, electic, auto
function filterFuelStations(filters) {
  let statusMatch = false;
  let categoryMatch = false;
  let modeMatch = false;

  let statusFilters = filters.filter(function (element) {
    return element.name === 'status';
  });
  statusMatch = statusFilters.length === 0 ||
    statusFilters.some(e => e.value === Constants.PROJECT_TYPE_DEPLOYMENT);

  let categoryFilters = filters.filter(function (element) {
    return element.name === 'category';
  });
  categoryMatch = categoryFilters.length === 0 ||
    categoryFilters.some(e => e.value.toLowerCase() === 'e');

  let modeFilters = filters.filter(function (element) {
    return element.name == 'mode';
  });
  modeMatch = modeFilters.length === 0 || modeFilters.some(e => e.value.toLowerCase() == 'a');

  return statusMatch && categoryMatch && modeMatch;
}

// todo: optimize
// within filter group, match any filter
function filterProjects(projects, filters) {
  let filtered = [];

  let statusFilters = filters.filter(function (element) {
    return element.name == 'status';
  });
  let categoryFilters = filters.filter(function (element) {
    return element.name == 'category';
  });
  let modeFilters = filters.filter(function (element) {
    return element.name == 'mode';
  });
  let districtFilters = filters.filter(function (element) {
    return element.name == 'district';
  });
  let scopeFilters = filters.filter(function (element) {
    return element.name == 'scope';
  });

  projects.forEach(project => {
    let statusMatch = statusFilters.length == 0;
    let categoryMatch = categoryFilters.length == 0;
    let modeMatch = modeFilters.length == 0;
    let districtMatch = districtFilters.length == 0;
    let scopeMatch = scopeFilters.length == 0;

    // 'and' among filter groups; 'or' within filter group
    for (let i = 0; i < statusFilters.length; i++) {
      let filter = statusFilters[i];
      if (projectIsMatch(project, filter)) {
        statusMatch = true;
        break;
      }
    }
    for (let i = 0; i < categoryFilters.length; i++) {
      let filter = categoryFilters[i];
      if (projectIsMatch(project, filter)) {
        categoryMatch = true;
        break;
      }
    }
    for (let i = 0; i < modeFilters.length; i++) {
      let filter = modeFilters[i];
      if (projectIsMatch(project, filter)) {
        modeMatch = true;
        break;
      }
    }
    for (let i = 0; i < districtFilters.length; i++) {
      let filter = districtFilters[i];
      if (projectIsMatch(project, filter)) {
        districtMatch = true;
        break;
      }
    }
    for (let i = 0; i < scopeFilters.length; i++) {
      let filter = scopeFilters[i];
      if (projectIsMatch(project, filter)) {
        scopeMatch = true;
        break;
      }
    }

    if (statusMatch && categoryMatch && modeMatch && districtMatch && scopeMatch) {
      filtered.push(project);
    }
  });

  return filtered;
}

// ';' delimited
function projectIsMatch(project, filter) {
  var projectData;
  var vals;

  switch (filter.name) {
    case Constants.FILTER_NAME_CATEGORY: // one or more
      projectData = project.properties.category;
      //vals = projectData.toLowerCase().split(';');
      vals = projectData;
      if (vals.includes(filter.value.toLowerCase()))
        return true;
      break;
    case Constants.FILTER_NAME_TYPE: // number
      if (filter.value == project.properties.status)
        return true;
      break;
    case Constants.FILTER_NAME_MODE: // one or more
      projectData = project.properties.mode;
      //vals = projectData.toLowerCase().split(';');
      vals = projectData;
      if (vals.includes(filter.value.toLowerCase()))
        return true;
      break;
    case Constants.FILTER_NAME_DISTRICT: // one or more
      projectData = project.properties.district;
      //vals = projectData.toLowerCase().split(';');
      vals = projectData;
      if (vals && vals.includes(filter.value.toLowerCase()))
        return true;
      break;
    case Constants.FILTER_NAME_SCOPE:
      projectData = project.properties.statewide;
      if (filter.value == Constants.PROJECT_SCOPE_STATEWIDE && projectData)
        return true;
      if (filter.value == Constants.PROJECT_SCOPE_LOCAL && !projectData)
        return true;
      break;
    default:
      break;
  }
  return false;
}


function getProjectViewport(project, state) {
  var features = state.projectGeoms.filter(function (element) {
    return element.properties.id == project.properties.id;
  });
  if (features.length === 0) return { ...state.viewport };

  const [minLng, minLat, maxLng, maxLat] = bbox({
    type: 'FeatureCollection',
    features: features
  });

  // assume new viewport is half width
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
      padding: project.properties.statewide ? 20 : 80,
    });
    newVp = {
      ...state.viewport,
      //longitude: longitude + (maxLng - minLng) / 1.5,
      longitude: longitude,
      latitude: latitude,
      //zoom: Math.min(zoom, 12),
      zoom,
      /*transitionInterpolator: new LinearInterpolator({
        around: [event.offsetCenter.x, event.offsetCenter.y]
      }),*/
      transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
    }
  } catch (err) {
    console.error(err);
  }

  if (!newVp) newVp = state.viewport;

  return newVp;
}


export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
