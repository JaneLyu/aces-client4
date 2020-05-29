import React from "react";
import { BrowserRouter as Router, Route, Switch, Redirect, HashRouter } from "react-router-dom";
import { createBrowserHistory, createHashHistory } from "history";
import { ROOT_URL } from "../constants"

import LandingPage from "../views/LandingPage/LandingPage.js";
import VisionPage from "../views/VisionPage";
import PeoplePage from "../views/PeoplePage";
import LoginPage from "../views/LoginPage/LoginPage.js";
import ProjectsPage from "../views/ProjectsPage/ProjectsPage.js";
import DashboardProjects from "../views/Dashboard/DashboardProjects";
import DashboardUsers from "../views/Dashboard/DashboardUsers";
import TestPage from "../views/TestPage"
import SpatPage from "../views/SpatPage";

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
        <Route path={rootpath + "vision"} component={VisionPage} />
        <Route path={rootpath + "projects/:id"} component={ProjectsPage} />
        <Route path={rootpath + "projects"} component={ProjectsPage} />
        <Route path={rootpath + "federal"} component={SpatPage} />
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

        <Route path={rootpath + "test"} component={TestPage} />
        <Route path={rootpath} component={LandingPage} />
      </Switch>
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
