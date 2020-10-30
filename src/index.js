import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';

import React, { useReducer, useContext } from "react";
import ReactDOM from "react-dom";
import App from "./components/App"
import { StoreProvider } from "./store/store";
import { UserProvider } from "./context/UserContext";

import "assets/scss/material-kit-react.scss?v=1.8.0";

import { Amplify } from 'aws-amplify';
import config from './config';

Amplify.configure({
  Auth: {
    mandatorySignIn: false,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    identityPoolId: config.cognito.IDENTITY_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  },
  Storage: {
    region: config.s3.REGION,
    bucket: config.s3.BUCKET,
    identityPoolId: config.cognito.IDENTITY_POOL_ID
  },
  API: {
    endpoints: [
      {
        name: "projects",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
      {
        name: "users",
        endpoint: config.apiGateway.URL,
        region: config.apiGateway.REGION
      },
    ]
  }
});


ReactDOM.render(
  <UserProvider>
    <StoreProvider>
      <App />
    </StoreProvider>
  </UserProvider>,
  document.getElementById("root")
);
