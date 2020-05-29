import React from "react";
import * as Constants from "../constants"
import { dashboardUsers } from "../views/Dashboard/data"

var UserStateContext = React.createContext();
var UserDispatchContext = React.createContext();

function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      var isAdmin = action.payload && action.payload.toLowerCase() === "admin";

      // fetch user profile
      var match = dashboardUsers[Math.floor(Math.random() * dashboardUsers.length)];

      return { ...state, isAuthenticated: true, isAdmin: isAdmin, profile: { ...match }};
    case "SIGN_OUT_SUCCESS":
      return { ...state, isAuthenticated: false, isAdmin: false, profile: null };
    default: {
      //throw new Error(`Unhandled action type: ${action.type}`);
      console.error(`Unhandled action type: ${action.type}`);
    }
  }
}

const initialUserState = {
  isAuthenticated: !!localStorage.getItem("auth_token"),
  //isAuthenticated: false,
  isAdmin: !!localStorage.getItem("auth_token") && localStorage.getItem("auth_token") === 'admin',
  //isAdmin: false,
  profile: dashboardUsers[Math.floor(Math.random() * dashboardUsers.length)]
}
function UserProvider({ children }) {
  var [state, dispatch] = React.useReducer(userReducer, initialUserState);

  return (
    <UserStateContext.Provider value={state}>
      <UserDispatchContext.Provider value={dispatch}>
        {children}
      </UserDispatchContext.Provider>
    </UserStateContext.Provider>
  );
}

function useUserState() {
  var context = React.useContext(UserStateContext);
  if (context === undefined) {
    throw new Error("useUserState must be used within a UserProvider");
  }
  return context;
}

function useUserDispatch() {
  var context = React.useContext(UserDispatchContext);
  if (context === undefined) {
    throw new Error("useUserDispatch must be used within a UserProvider");
  }
  return context;
}

export { UserProvider, useUserState, useUserDispatch, loginUser, signOut };

// ###########################################################

function loginUser(dispatch, login, password, history, setIsLoading, setError) {
  console.log("logging in: " + login)

  setError(false);
  //setIsLoading(true);

  //if (!!login && !!password) {
  if (!!login) {
    //setTimeout(() => {
    localStorage.setItem('auth_token', login)
    setError(null);
    //setIsLoading(false);
    dispatch({ type: 'LOGIN_SUCCESS', payload: login });

    history.push(Constants.ROOT_URL + "dashboard/projects");
    //}, 1000);
  } else {
    dispatch({ type: "LOGIN_FAILURE", payload: login });
    setError(true);
    setIsLoading(false);
  }
}

function signOut(dispatch, history) {
  //console.log("sign out")
  localStorage.removeItem("auth_token");
  dispatch({ type: "SIGN_OUT_SUCCESS", payload: null });
  history.push(Constants.ROOT_URL + "login");
}
