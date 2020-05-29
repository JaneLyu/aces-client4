/*eslint-disable*/
import React, { Fragment } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import Icon from "@material-ui/core/Icon";

import {
  Box, Checkbox, FormGroup, FormControlLabel, FormControl, Paper, Divider,
  ListSubheader, ListItemIcon, Card, CardActionArea, CardContent, CardMedia, List, ListItem
} from "@material-ui/core";

import { ROOT_URL } from "../../constants"

//import { Store } from "../../store/store"
//import { toggleProjectFilters, viewProject } from "../../store/actions"

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    //paddingTop: '56.25%', // 16:9
  },

  card: {
    //width: '30%',
    margin: theme.spacing(0),
    //display: 'flex',
    //flexDirection: 'column',
  },
  cardActionArea: {
    flexGrow: 1,
    display: 'flex',
    //flexDirection: 'column'
  },
  header: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    width: '100%',
  },
  headerTitle: {
    color: theme.palette.secondary.contrastText,
  },
  headerSubheader: {
    color: theme.palette.secondary.contrastText,
  },
  content: {
    //flexGrow: 1,
  }

}));

export default function ResultsPanel(props) {
  const classes = useStyles();

  const { projects, visibleProjects, viewOneProject, state } = props;

  if (state.state.project != null)
    return null;

  const handleProjectClick = (project) => {
    props.history.push(ROOT_URL + "projects/" + project.properties.id);
  };

  return (
    <Paper elevation={2} style={{
      width: '20vw', position: 'absolute', top: '75px', right: '10px', bottom: '24px',
      overflow: 'auto'
    }}>
      <List style={{ boxShadow: '0', padding: '0', margin: '5px 0 0 0' }}>
        {
          visibleProjects.map((proj, index) => {
            return (
              <Fragment>
                {index > 0 ? <Divider /> : ''}
                <ListItem style={{ boxShadow: '0', padding: '5px 10px', margin: '0' }} key={proj.properties.id}>

                  <Card elevation={0} className={classes.card} style={{ boxShadow: '0', padding: '0', margin: '0', borderRadius: '0', width: '100%' }}>
                    <CardActionArea className={classes.cardActionArea} onClick={() => handleProjectClick(proj)}>
                      <div style={{ display: 'inline', margin: '5px', boxShadow: '0px 0px 4px rgba(0, 0, 0, 0.5)', width: '90px', height: '70px' }}>
                        <img src={proj.properties.desc_photo} style={{ width: '90px', height: '100%' }} />
                      </div>
                      <CardContent className={classes.content} style={{ width: '100%', padding: '0', margin: '10px', fontWeight: 'bold' }}>
                        {proj.properties.name}
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              </Fragment>
            );
          })
        }
      </List>



    </Paper>
  );
}

