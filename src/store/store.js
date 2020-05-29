import React from "react";
import { LinearInterpolator, WebMercatorViewport } from 'react-map-gl';
import bbox from '@turf/bbox';

import * as Constants from "../constants"
import { dashboardUsers as peopleDB } from "../views/Dashboard/data"

export const Store = React.createContext("");


/* project filters (multiple per filter possible, '|' delimited)
  category: aces
  mode: auto, bike, transit
  status: planning, implementation, active
  district: 1-7, turnpike, central office
*/
const initialViewport = {
  latitude: 28.15,
  longitude: -84.5,
  zoom: 6,
  bearing: 0,
  pitch: 0,
  transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
};

const spatInitialViewport = {
  latitude: 38.84706035607122,
  longitude: -96.57421875,
  zoom: 3.5,
  bearing: 0,
  pitch: 0,
  transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
};

const initialState = {
  userProfile: null,
  users: [],
  projects: [],
  projectGeoms: [],
  projectFilters: [],
  visibleProjects: [],
  project: null,
  viewport: initialViewport,
  mapStyle: Constants.MAPBOX_STYLE_STREET,
  mapMarkerFilter: Constants.MAPBOX_MARKER_BASE_FILTER,
  mapMarkerPaint: Constants.MAPBOX_SYMBOL_PAINT_MAP,
  mapGeomPointFilter: ['all', Constants.MAPBOX_GEOM_POINT_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
  mapGeomPointPaint: Constants.MAPBOX_GEOM_POINT_PAINT_MAP,
  mapGeomLineFilter: ['all', Constants.MAPBOX_GEOM_LINE_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
  mapGeomLinePaint: Constants.MAPBOX_GEOM_LINE_PAINT_MAP,
  mapGeomPolygonFilter: ['all', Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
  mapGeomPolygonPaint: Constants.MAPBOX_GEOM_POLYGON_PAINT_MAP,

  spatViewport: spatInitialViewport,
  spatList: [],

};


function processSpatData(data) {
  let processed = [];

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

function processProjectData(projects) {
  projects.sort((a, b) => {
    if (a.properties.name < b.properties.name)
      return -1;
    if (a.properties.name > b.properties.name)
      return 1;
    return 0;
  });

  return projects.map((proj, index) => {

    // img url
    var imgURL = proj.properties.desc_photo;
    if (imgURL && !imgURL.toLowerCase().startsWith('http')) {
      proj.properties.desc_photo = Constants.STATIC_ROOT_URL + proj.properties.desc_photo;
    }

    // people
    var num = 2 + Math.floor(Math.random() * 8);
    let ppeople = [];
    while(ppeople.length < num) {
      var rnd = Math.floor(Math.random() * peopleDB.length);
      var person = peopleDB[rnd];
      const match = ppeople.find(function (element) {
        return element.id == person.id;
      });
      if (!match)
        ppeople.push(person);
    }
    proj.properties['people'] = ppeople;

    // datasets
    let lineseries = [];
    for (let i = 0; i < 7; i++) {
      lineseries.push(Math.floor(Math.random() * 50));
    }
    let linechartData = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      series: [lineseries]
    }

    let barseries = [];
    for (let i = 0; i < 12; i++) {
      barseries.push(50 + Math.floor(Math.random() * 950));
    }
    let barchartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      series: [barseries]
    }
    proj.properties['datasets'] = [linechartData, barchartData];

    return proj;
  });
}

function processProjectData2(data) {

  let projects = data.map((proj, index) => {
    let p = Object.assign({}, proj.location);
    //p["type"] = "Feature";
    p["properties"] = proj;
    p.properties["id"] = proj.projectId;
    p.properties["name"] = proj.title;

    // img url
    /*var imgURL = proj.properties.desc_photo;
    if (imgURL && !imgURL.toLowerCase().startsWith('http')) {
      proj.properties.desc_photo = Constants.STATIC_ROOT_URL + proj.properties.desc_photo;
    }*/

    // people
    var num = 2 + Math.floor(Math.random() * 8);
    let ppeople = [];
    while(ppeople.length < num) {
      var rnd = Math.floor(Math.random() * peopleDB.length);
      var person = peopleDB[rnd];
      const match = ppeople.find(function (element) {
        return element.id == person.id;
      });
      if (!match)
        ppeople.push(person);
    }
    p.properties['people'] = ppeople;

    // datasets
    let lineseries = [];
    for (let i = 0; i < 7; i++) {
      lineseries.push(Math.floor(Math.random() * 50));
    }
    let linechartData = {
      labels: ["M", "T", "W", "T", "F", "S", "S"],
      series: [lineseries]
    }

    let barseries = [];
    for (let i = 0; i < 12; i++) {
      barseries.push(50 + Math.floor(Math.random() * 950));
    }
    let barchartData = {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mai",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
      ],
      series: [barseries]
    }
    p.properties['datasets'] = [linechartData, barchartData];

    return p;
  });

  projects.sort((a, b) => {
    if (a.properties.name < b.properties.name)
      return -1;
    if (a.properties.name > b.properties.name)
      return 1;
    return 0;
  });

  console.log(projects);

  return projects;
}


function reducer(state, action) {
  var newFilters;

  //console.log('reducer: ' + action.type);

  switch (action.type) {
    case Constants.FETCH_PROJECTS_DATA:
      // payload = projects

      let projects = processProjectData2(action.payload);
      let geoms = projects.map((proj, index) => {
        // TODO: merge features
        let g = proj.properties.geom.features[0];
        g.properties["id"] = proj.properties.id;
        g.properties["name"] = proj.properties.name;
        g.properties["status"] = proj.properties.status;
        return g;
      });
      console.log(geoms);

      return {
        ...state, projects: projects, visibleProjects: Array.from(projects), projectGeoms: geoms
      };
    case Constants.FETCH_PROJECTS_GEOM:
      // payload = projects
      return {
        ...state, projectGeoms: action.payload
      };
    case Constants.SET_VIEWPORT:
      return {
        ...state, viewport: action.payload
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
      console.log(action.type + ' ' + action.payload);
      if (projId) {
        return {
          ...state,
          mapGeomPointFilter: ["all", Constants.MAPBOX_GEOM_POINT_BASE_FILTER, ["==", ["get", "id"], projId]],
          mapGeomLineFilter: ["all", Constants.MAPBOX_GEOM_LINE_BASE_FILTER, ["==", ["get", "id"], projId]],
          mapGeomPolygonFilter: ["all", Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, ["==", ["get", "id"], projId]]
        };
      }
      return {
        ...state,
        mapGeomPointFilter: ['all', Constants.MAPBOX_GEOM_POINT_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
        mapGeomLineFilter: ['all', Constants.MAPBOX_GEOM_LINE_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
        mapGeomPolygonFilter: ['all', Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, Constants.MAPBOX_GEOM_BASE_FILTER],
      };
    case Constants.VIEW_PROJECTS:
      // reset viewport
      let newVp = {
        ...state.viewport,
        latitude: initialViewport.latitude,
        longitude: initialViewport.longitude,
        zoom: initialViewport.zoom,
        bearing: initialViewport.bearing,
        pitch: initialViewport.pitch
      };
      return {
        ...state,
        project: null,
        viewport: newVp,
        mapMarkerFilter: Constants.MAPBOX_MARKER_BASE_FILTER,
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
        viewport: getProjectViewport(proj.properties.id, state),
        mapMarkerFilter: ["all", Constants.MAPBOX_MARKER_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]],
        mapGeomPointFilter: ["all", Constants.MAPBOX_GEOM_POINT_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]],
        mapGeomLineFilter: ["all", Constants.MAPBOX_GEOM_LINE_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]],
        mapGeomPolygonFilter: ["all", Constants.MAPBOX_GEOM_POLYGON_BASE_FILTER, ["==", ["get", "id"], proj.properties.id]]
      };
    case Constants.ADD_PROJECT_FILTER:
      // payload = filter
      newFilters = [...state.projectFilters, action.payload];
      return {
        ...state,
        projectFilters: newFilters,
        visibleProjects: filterProjects(state.projects, newFilters)
      };
      return state;
    case Constants.REMOVE_PROJECT_FILTER:
      // payload = updated filters
      return {
        ...state,
        projectFilters: action.payload,
        visibleProjects: filterProjects(state.projects, action.payload)
      };
    case Constants.RESET_PROJECT_FILTERS:
      // payload = null
      return {
        ...state,
        filters: [],
        visibleProjects: Array.from(state.projects)
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

    default:
      return state;
  }
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

  projects.forEach(project => {
    let statusMatch = statusFilters.length == 0;
    let categoryMatch = categoryFilters.length == 0;
    let modeMatch = modeFilters.length == 0;
    let districtMatch = districtFilters.length == 0;

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

    if (statusMatch && categoryMatch && modeMatch && districtMatch) {
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
    case Constants.FILTER_NAME_STATUS: // number
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
    default:
      break;
  }
  return false;
}


function getProjectViewport(projectId, state) {
  // find project geom
  var feature = state.projectGeoms.find(function (element) {
    return element.properties.id == projectId;
  });

  if (feature == undefined)
    return { ...state.viewport };

  // calculate bbox of geom
  const [minLng, minLat, maxLng, maxLat] = bbox(feature);

  // assume new viewport is half width
  const futureVp = {
    ...state.viewport,
    width: state.viewport.width / 2
  }

  // construct a viewport instance from the current state
  let vp = null;
  try {
    vp = new WebMercatorViewport(futureVp);
  } catch (err) {
    console.error(err);
  }

  if (vp == null) return;

  const { longitude, latitude, zoom } = vp.fitBounds([[minLng, minLat], [maxLng, maxLat]], {
    padding: 40
  });

  return ({
    ...state.viewport,
    //width: state.viewport.width,
    //height: state.viewport.height,
    longitude,
    latitude,
    zoom,
    /*transitionInterpolator: new LinearInterpolator({
      around: [event.offsetCenter.x, event.offsetCenter.y]
    }),*/
    transitionDuration: Constants.MAPBOX_TRANSITION_DURATION
  });
}


export function StoreProvider(props) {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const value = { state, dispatch };
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
