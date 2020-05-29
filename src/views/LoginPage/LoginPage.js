import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import { InputAdornment, CircularProgress, Icon, TextField } from "@material-ui/core";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import { withRouter } from "react-router-dom";
import { useUserDispatch, loginUser } from "../../context/UserContext";


import styles from "assets/jss/material-kit-react/views/loginPage.js";
const useStyles = makeStyles(styles);

export default function LoginPage(props) {

  const classes = useStyles();
  const { ...rest } = props;

  // global
  var userDispatch = useUserDispatch();

  // local
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [activeTabId, setActiveTabId] = React.useState(0);
  const [nameValue, setNameValue] = React.useState("");
  const [loginValue, setLoginValue] = React.useState("");
  const [passwordValue, setPasswordValue] = React.useState("");

  const handleLoginChange = event => {
    setLoginValue(event.target.value);
  };
  const handlePasswordChange = event => {
    setPasswordValue(event.target.value);
  };

  const handleLoginSubmit = event => {
    loginUser(userDispatch, loginValue, passwordValue, props.history, setIsLoading, setError)
  };

  return (
    <div>
      <Header
        absolute
        color="dark"
        brand="FL A&middot;C&middot;E&middot;S"
        rightLinks={<HeaderLinks {...props} />}
        {...rest}
      />
      <div>
        <div className={classes.container} style={{minHeight: 'calc(100vh - 100px)'}}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={6}>
              <Card>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h3>Login</h3>

                  </CardHeader>
                  <CardBody>
                    {/* <CustomInput
                      labelText="Email..."
                      id="email"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      value={loginValue}
                      onChange={handleLoginChange}
                    />
                    <CustomInput
                      labelText="Password"
                      id="pass"
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                      value={passwordValue}
                      onChange={handlePasswordChange}
                    /> */}
                    <TextField
                      id="email"
                      InputProps={{
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        )
                      }}
                      value={loginValue}
                      onChange={handleLoginChange}
                      margin="normal"
                      placeholder="Email Address"
                      type="email"
                      fullWidth
                    />

                    <TextField
                      id="password"
                      InputProps={{
                        type: "password",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Icon className={classes.inputIconsColor}>
                              lock_outline
                            </Icon>
                          </InputAdornment>
                        ),
                        autoComplete: "off"
                      }}
                      value={passwordValue}
                      onChange={handlePasswordChange}
                      margin="normal"
                      placeholder="Password"
                      type="password"
                      fullWidth
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    {isLoading ? (
                      <CircularProgress size={26} className={classes.loginLoader} />
                    ) : (
                        <Button
                          disabled={
                            loginValue.length === 0 //|| passwordValue.length === 0
                          }
                          onClick={handleLoginSubmit}
                          //variant="contained"
                          color="primary"
                          size="large"
                        >
                          Login
                        </Button>
                      )}
                    <Button simple
                      color="primary"
                      size="large"
                      className={classes.forgetButton}
                    >
                      Forgot Password
                </Button>

                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer />
      </div>
    </div>
  );
}
