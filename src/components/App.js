import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import { createBrowserHistory, createHashHistory } from "history";
import { ROOT_URL } from "../constants"

import LandingPage from "../views/LandingPage/LandingPage.js";
import VisionPage from "../views/VisionPage";
import PeoplePage from "../views/PeoplePage";
import LoginPage from "../views/LoginPage/LoginPage.js";
import ProjectsPage from "../views/ProjectsPage/ProjectsPage.js";
import BikesharePage from "../views/ProjectsPage/BikesharePage.js";
import FuelStationPage from "../views/ProjectsPage/FuelStationPage.js";
import DashboardProjects from "../views/Dashboard/DashboardProjects";
import DashboardUsers from "../views/Dashboard/DashboardUsers";
import SpatPage from "../views/SpatPage";
import USDOTPage from "../views/USDOTPage";

// context
import { useUserState } from "../context/UserContext";

export default function App() {
  // global
  var { isAuthenticated, isAdmin } = useUserState();
  //var hist = createBrowserHistory();
  var hist = createHashHistory();

  let rootpath = "/";

  return (
    <HashRouter history={hist} basename={ROOT_URL} >
      <Switch>
        <Route path={rootpath + "about"} component={VisionPage} />
        <Route path={rootpath + "projects/:id"} component={ProjectsPage} />
        <Route path={rootpath + "bikeshare/:id"} component={BikesharePage} />
        <Route path={rootpath + "fueling/:id"} component={FuelStationPage} />
        <Route path={rootpath + "projects"} component={ProjectsPage} />
        <Route path={rootpath + "bikeshare"} component={ProjectsPage} />
        <Route path={rootpath + "federal/nocoe"} component={SpatPage} />
        <Route path={rootpath + "federal/usdot"} component={USDOTPage} />
        <Route path={rootpath + "people"} component={PeoplePage} />

        <PublicRoute path={rootpath + "login"} component={LoginPage} />
        <Route exact path={rootpath + "dashboard"}>
          <Redirect to={rootpath + "dashboard/projects"} />
        </Route>
        <PrivateRoute path={rootpath + "dashboard/users/:id"} component={DashboardUsers} />
        <PrivateRoute path={rootpath + "dashboard/users"} component={DashboardUsers} />
        <PrivateRoute path={rootpath + "dashboard/projects/:id"} component={DashboardProjects} />
        <PrivateRoute path={rootpath + "dashboard/projects"} component={DashboardProjects} />
        <PrivateRoute path={rootpath + "dashboard"} component={DashboardProjects} />

        <Route path={rootpath} component={ProjectsPage} />
      </Switch>
      {/* <Redirect from={ROOT_URL} to={rootpath + "projects"} />
      <Redirect from={ROOT_URL + "#"} to={rootpath + "projects"} /> */}
    </HashRouter>
  );

  // #######################################################################

  function PrivateRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            React.createElement(component, props)
          ) : (
              <Redirect
                to={{
                  pathname: rootpath + "login",
                  state: {
                    from: props.location,
                  },
                }}
              />
            )
        }
      />
    );
  }

  function PublicRoute({ component, ...rest }) {
    return (
      <Route
        {...rest}
        render={props =>
          isAuthenticated ? (
            <Redirect
              to={{
                pathname: rootpath + "dashboard/projects",
              }}
            />
          ) : (
              React.createElement(component, props)
            )
        }
      />
    );
  }
}
