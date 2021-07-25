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
import { Store } from "../../store/store"
import { resetProjectsView } from "../../store/actions"

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
  
  const { state, dispatch } = React.useContext(Store);
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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const isProjectsPage = () => {
    let path = window.location.href;
    return !(path.includes("/admin/") || path.includes("/dashboard/")) &&
      (path.includes(Constants.ROOT_URL + "projects") || path.includes(Constants.ROOT_URL + "federal/nocoe") ||
        path.includes(Constants.ROOT_URL + "federal/usdot"));
  };

  const handleProjectsClick = event => {
    resetProjectsView(state, dispatch);
  };

  return (
    <CustomDropdown
      left
      noLiPadding
      buttonText={Constants.ACES_LABEL + " Initiatives"}
      buttonProps={{
        className: classes.navLink,
        color: "transparent"
      }}
      dropdownList={[
        <Link to={Constants.ROOT_URL} className={classes.dropdownLink} onClick={handleProjectsClick}>Florida</Link>,
        { divider: true },
        { header: true, content: <span>Federal</span> },
        <Link to={Constants.ROOT_URL + "federal/nocoe"} className={classes.dropdownLink}>&nbsp;&nbsp;&nbsp;&nbsp;NOCoE</Link>,
        <Link to={Constants.ROOT_URL + "federal/usdot"} className={classes.dropdownLink}>&nbsp;&nbsp;&nbsp;&nbsp;US DOT</Link>
      ]}
    />
  );
}
