/*eslint-disable*/
import React, { Fragment, useState } from "react";
import classNames from "classnames";
import { useParams } from "react-router-dom";
import { API, Storage } from "aws-amplify";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Icon from "@material-ui/core/Icon";

// core components
import GridItem from "components/Grid/GridItem.js";
import GridContainer from "components/Grid/GridContainer.js";
import Card from "components/Card/Card.js";
import CardHeader from "components/Card/CardHeader.js";
import CardBody from "components/Card/CardBody.js";

import {
  Box, Checkbox, FormGroup, FormControlLabel, FormControl, Paper, Divider,
  LinearProgress, ListSubheader, ListItemIcon, Grid, FormLabel, Chip
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';

//import { Store } from "../../store/store"
//import { toggleProjectFilters, viewProject } from "../../store/actions"

import * as Constants from "../../constants"

import imagesStyle from "assets/jss/material-kit-react/imagesStyles.js";

import ChartistGraph from "react-chartist";
import {
  dailySalesChart,
  emailsSubscriptionChart,
  completedTasksChart
} from "../../variables/charts.js";

import { Store } from "../../store/store"

import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import DOMPurify from 'dompurify';


import {
  defaultFont,
  primaryColor,
  infoColor,
  successColor,
  warningColor,
  dangerColor
} from "assets/jss/material-kit-react.js";

const detailsPanelStyle = {
  defaultFontStyle: {
    ...defaultFont,
    fontSize: "14px"
  },
  defaultHeaderMargins: {
    marginTop: "20px",
    marginBottom: "10px"
  },
  quote: {
    padding: "10px 20px",
    margin: "0 0 20px",
    fontSize: "17.5px",
    borderLeft: "5px solid #eee"
  },
  quoteText: {
    margin: "0 0 10px",
    fontStyle: "italic"
  },
  quoteAuthor: {
    display: "block",
    fontSize: "80%",
    lineHeight: "1.42857143",
    color: "#777"
  },
  mutedText: {
    color: "#777"
  },
  primaryText: {
    color: primaryColor
  },
  infoText: {
    color: infoColor
  },
  successText: {
    color: successColor
  },
  warningText: {
    color: warningColor
  },
  dangerText: {
    color: dangerColor
  },
  smallText: {
    fontSize: "65%",
    fontWeight: "400",
    lineHeight: "1",
    color: "#777"
  },

  chipLabel: {
    margin: '0 8px 2px 0',
    //color: 'red'
  },

  successText: {
    //color: successColor[0]
  },
  upArrowCardCategory: {
    width: "16px",
    height: "16px"
  },
  stats: {
    //color: grayColor[0],
    display: "inline-flex",
    fontSize: "12px",
    lineHeight: "22px",
    "& svg": {
      top: "4px",
      width: "16px",
      height: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    },
    "& .fab,& .fas,& .far,& .fal,& .material-icons": {
      top: "4px",
      fontSize: "16px",
      position: "relative",
      marginRight: "3px",
      marginLeft: "3px"
    }
  },
  cardCategory: {
    //color: grayColor[0],
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    paddingTop: "10px",
    marginBottom: "0"
  },
  cardCategoryWhite: {
    //color: "rgba(" + hexToRgb(whiteColor) + ",.62)",
    margin: "0",
    fontSize: "14px",
    marginTop: "0",
    marginBottom: "0"
  },
  cardTitle: {
    //color: grayColor[2],
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      //color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  },
  cardTitleWhite: {
    color: 'white',
    marginTop: "0px",
    minHeight: "auto",
    fontWeight: "300",
    fontFamily: "'Roboto', 'Helvetica', 'Arial', sans-serif",
    marginBottom: "3px",
    textDecoration: "none",
    "& small": {
      //color: grayColor[1],
      fontWeight: "400",
      lineHeight: "1"
    }
  }
};


const useStyles = makeStyles(detailsPanelStyle);

export default function DetailsPanel(props) {
  const { id } = useParams();
  const classes = useStyles();
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const [currId, setCurrId] = useState();
  const [imageFileURL, setImageFileURL] = useState();
  const [showCustomImage, setShowCustomImage] = useState(false);
  const [dataFileURL, setDataFileURL] = useState();

  const { state, dispatch } = React.useContext(Store);

  /* const { state } = props;

  if (state.state.project == null)
    return null; */

  //let pprops = state.state.project ? state.state.project.properties : null;
  let pprops = state.project ? state.project.properties : null;

  if (!pprops) return null;


  const getStatusLabel = status => {
    switch (status) {
      case Constants.PROJECT_TYPE_PLAN:
        return "Planning"
      case Constants.PROJECT_TYPE_DESIGN:
        return "Design"
      case Constants.PROJECT_TYPE_EVALUATION:
        return "Evaluation"
      case Constants.PROJECT_TYPE_DEPLOYMENT:
        return "Deployment"
      case Constants.PROJECT_TYPE_DATA:
        return "Data"
      case Constants.PROJECT_TYPE_OTHER:
        return "Other"
    }
    return '';
  }
  const getCategoryLabel = category => {
    switch (category) {
      case 'a':
        return "Automated";
      case 'c':
        return "Connected";
      case 'e':
        return "Electric";
      case 's':
        return "Shared";
    }
    return null;
  }
  const getModeLabel = mode => {
    switch (mode) {
      case 'a':
        return "Auto";
      case 't':
        return "Transit";
      case 'b':
        return "Bike";
    }
    return null;
  }


  //let pcategories = pprops.category.toLowerCase().split(';');
  let pcategories = pprops.category;

  //let pmodes = pprops.mode.toLowerCase().split(';');
  let pmodes = pprops.mode;

  // TODO: state change (via viewport) causes onload to fire at every map movement
  async function onLoad() {
    //console.log("onload: " + pprops.id);

    if (!currId || currId != pprops.id) {
      setCurrId(pprops.id);
      try {
        if (pprops.imageFiles /*&& !imageFileURL*/) {
          console.log("get image file");
          const imagef = await Storage.get(pprops.imageFiles, {
            identityId: pprops.userId
          });
          setImageFileURL(imagef);
        }

        if (pprops.dataFiles /*&& !dataFileURL*/) {
          console.log("get data file");
          const dataf = await Storage.get(pprops.dataFiles, {
            identityId: pprops.userId
          });
          setDataFileURL(dataf);
        }

        //setEditorState(EditorState.createWithContent(convertFromRaw(description)));
      } catch (e) {
        //console.log("error onload");
        setImageFileURL(null);
        setDataFileURL(null);
      }
    } else {
      //console.log("same project");
      //setImageFileURL(null);
      //setDataFileURL(null);
    }
  }

  onLoad();

  function formatFilename(str) {
    return str.replace(/^\w+-/, "");
  }

  function createDescriptionMarkup() {
    var clean = DOMPurify.sanitize(draftToHtml(pprops.description));
    return { __html: clean };
  }

  return (
    <Paper style={{
      width: '50vw', height: 'calc(100vh - ' + Constants.HEADER_HEIGHT + 'px)', overflow: 'auto', padding: '0px 20px 50px 20px',
      boxShadow: '-5px 0px 5px 0px #888888'
    }} >
      <div className={classes.title} style={{ fontWeight: 'bold', fontSize: '1.5rem', lineHeight: '1.75rem', padding: '20px 0px 10px 0px' }}>
        {pprops ? pprops.title : ''}
      </div>

      {
        pprops.statewide &&
        <Grid container spacing={1} alignItems="flex-start" style={{ padding: '0px 0px 10px 0px' }}>
          <Grid item>
            <img src={require('assets/img/statewide_icon.png')} height="16px" />
            <span style={{ paddingLeft: '10px', fontSize: '1rem', color: '#005ca2', fontWeight: 'bold' }}>
              Statewide Initiative
            </span>
          </Grid>
        </Grid>
      }

      {
        pprops.lead && pprops.lead.name && <h4 style={{ margin: '20px 0px 0px 0px', fontWeight: 'bold' }}>Project Lead</h4>
      }
      {
        pprops.lead && pprops.lead.name &&
        <Grid container style={{ padding: '10px 20px' }}>
          <Grid item>
            <div style={{ fontFamily: 'Arial, Helvetica, sans-serif', color: 'black' }}>
              {pprops.lead.name}
              {
                pprops.lead.email &&
                <span style={{ marginLeft: '30px' }}>
                  <a href={"mailto:" + pprops.lead.email}>{pprops.lead.email}</a>
                </span>
              }
            </div>
          </Grid>
        </Grid>
      }

      {/*       <Grid container spacing={1} direction="row" justify="space-between" alignItems="center">
        <Grid item>
          <svg height="15" width="15" style={{}}>
            <circle cx="7.5" cy="7.5" r="7.5" stroke="white" stroke-width="0" fill={Constants.PROJECT_TYPE_COLORS[pprops.status]} />
          </svg>
          <span style={{ paddingLeft: '10px', color: '#666666', fontWeight: 'bold', fontSize: '1.15rem' }}>
            {getStatusLabel(pprops.status)}
          </span>
        </Grid>
        <Grid item>
          <div style={{ width: '', height: '', backgroundColor: '', padding: '0px', textAlign: '' }}>
            {
              ["a", "c", "e", "s"].map((cat, i) =>
                (pprops.category.includes(cat))
                  ? <img src={require('assets/img/aces_' + cat + '2_on.svg')} />
                  : <img src={require('assets/img/aces_' + cat + '2_off.svg')} />
              )
            }
          </div>
        </Grid>
      </Grid> */}

      {
        <h4 style={{ margin: '20px 0px 0 0px', fontWeight: 'bold' }}>Abstract / Project Information</h4>
      }
      <Grid container spacing={1} style={{ padding: '10px 20px 0px 20px' }}>
        <Grid item>
          <div style={{}} dangerouslySetInnerHTML={createDescriptionMarkup()}></div>
        </Grid>
      </Grid>

      {
        <h4 style={{ margin: '20px 0px 0 0px', fontWeight: 'bold' }}>ACES Category</h4>
      }
      <Grid container spacing={1} style={{ padding: '10px 20px' }}>
        <Grid item>
          <div>
            {
              ["a", "c", "e", "s"].map((cat, i) =>
                (pprops.category.includes(cat))
                  ? <img src={require('assets/img/aces_' + cat + '2_on.svg')} />
                  : <img src={require('assets/img/aces_' + cat + '2_off.svg')} />
              )
            }
          </div>
        </Grid>
      </Grid>

      {
        <h4 style={{ margin: '20px 0px 0 0px', fontWeight: 'bold' }}>Project Type</h4>
      }
      <Grid container spacing={1} style={{ padding: '10px 20px' }}>
        <Grid item>
          <svg height="15" width="15">
            <circle cx="7.5" cy="7.5" r="7.5" stroke="white" stroke-width="0" fill={Constants.PROJECT_TYPE_COLORS[pprops.status]} />
          </svg>
          <span style={{ paddingLeft: '10px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
            {getStatusLabel(pprops.status)}
          </span>
        </Grid>
      </Grid>

      {
        pprops && pprops.imageFiles && imageFileURL && <h4 style={{ margin: '20px 0px 0 0px', fontWeight: 'bold' }}>Images</h4>
      }
      {
        pprops && pprops.imageFiles && imageFileURL &&
        <Grid container spacing={1} style={{ padding: '10px 20px' }}>
          <Grid item>
            <div style={{ margin: '' }}>
              <img src={imageFileURL} key={imageFileURL} style={{ maxWidth: '100%' }} />
            </div>
          </Grid>
        </Grid>
      }

      {
        dataFileURL && pprops.dataFiles &&
        <h4 style={{ margin: '30px 0px 20px 0px', fontWeight: 'bold' }}>Project Data</h4>
      }
      {
        dataFileURL && pprops.dataFiles &&
        <GridContainer>
          <GridItem>
            <Card>
              <CardHeader color="success">
                File
              </CardHeader>
              <CardBody>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={dataFileURL}
                >
                  {formatFilename(pprops.dataFiles)}
                </a>
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      }

      {
        <h4 style={{ margin: '20px 0px 0 0px', fontWeight: 'bold' }}>Last Update</h4>
      }
      <Grid container spacing={1} style={{ padding: '10px 20px' }}>
        <Grid item>
          {pprops.updatedAt &&
            <span style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
              {new Date(pprops.updatedAt).toLocaleDateString()}
            </span>
          }
        </Grid>
      </Grid>

    </Paper>
  );
}

