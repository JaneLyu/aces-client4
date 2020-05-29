/*eslint-disable*/
import React from "react";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
// react components for routing our app without refresh
import { Link, NavLink } from "react-router-dom";

import classNames from "classnames";

// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import { List, ListItem, Avatar } from "@material-ui/core";

// @material-ui/icons
import { Apps, CloudDownload, AccountCircle, Person, Settings } from "@material-ui/icons";

// core components
import CustomDropdown from "components/CustomDropdown/CustomDropdown.js";
import { Button } from "components/CustomButtons/Button";

import * as Constants from "../../constants"

import { useUserState, useUserDispatch, loginUser, signOut } from "../../context/UserContext";


import styles from "assets/jss/material-kit-react/components/headerLinksStyle.js";

const useStyles = makeStyles(styles);

const useStyles2 = makeStyles(theme => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  active: {
    backgroundColor: '#F3A240'
  },
}));

export default function HeaderLinks(props) {
  const classes = useStyles();
  const classes2 = useStyles2();

  const [openProfile, setOpenProfile] = React.useState(null);
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };


  const { isAuthenticated, isAdmin, profile } = useUserState();
  const userDispatch = useUserDispatch();

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      props.history.push(Constants.ROOT_URL + "dashboard/projects");
    } else {
      props.history.push(Constants.ROOT_URL + "login");
    }
  };


  return (
    <List className={classes.list}>
      <ListItem className={classes.listItem}>
        <NavLink to={Constants.ROOT_URL + "vision"} className={classes.navLink}
          activeStyle={{ fontWeight: 'bold', borderBottom: 'solid 2px #fff' }}>Vision</NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={Constants.ROOT_URL + "projects"} className={classes.navLink}
          activeStyle={{ fontWeight: 'bold', borderBottom: 'solid 2px #fff' }}>Projects</NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={Constants.ROOT_URL + "federal"} className={classes.navLink}
          activeStyle={{ fontWeight: 'bold', borderBottom: 'solid 2px #fff' }}>Federal Initiatives</NavLink>
      </ListItem>
      <ListItem className={classes.listItem}>
        <NavLink to={Constants.ROOT_URL + "people"} className={classes.navLink}
          activeStyle={{ fontWeight: 'bold', borderBottom: 'solid 2px #fff' }}>People</NavLink>
      </ListItem>

      <ListItem className={classes.listItem}>
        <IconButton style={{ padding: '0', margin: '7px 0 10px 30px' }} onClick={handleAvatarClick}>
          {
            isAuthenticated ? (
              isAdmin ? <Avatar className={classes2.avatar} style={{ backgroundColor: '#FF8C00' }}>A</Avatar>
                : <Avatar src={Constants.STATIC_ROOT_URL + 'images/user' + profile.id + '.jpg'}
                  className={classes2.avatar}></Avatar>
            )
              : <Avatar className={classes2.avatar}><Person /></Avatar>
          }
        </IconButton>
      </ListItem>
    </List>
  );
}
