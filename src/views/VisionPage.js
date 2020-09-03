import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Parallax from "components/Parallax/Parallax.js";

import * as Constants from "../constants"

import styles from "assets/jss/material-kit-react/views/profilePage.js";

const useStyles = makeStyles(styles);

export default function VisionPage(props) {
  const classes = useStyles();
  const { ...rest } = props;
  const imageClasses = classNames(
    classes.imgRaised,
    classes.imgRoundedCircle,
    classes.imgFluid
  );
  const navImageClasses = classNames(classes.imgRounded, classes.imgGallery);
  return (
    <div>
      <Header
        color="transparent"
        brand="FL A&middot;C&middot;E&middot;S"
        rightLinks={<HeaderLinks {...props} />}
        fixed
        changeColorOnScroll={{
          height: 150,
          color: "dark"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/hero1c.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div className={classes.name}>
                    {/* <h3 className={classes.title} style={{ color: 'white' }}>About</h3> */}
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <div style={{textAlign: 'center', paddingTop: '10px'}}>
              <h3>About Florida {Constants.ACES_LABEL}</h3>
            </div>
            <div style={{padding: '10px 40px 40px 40px', fontSize: '1rem', color: 'black'}}>
              <p className={classes.visionParagraph}>
The dramatic and disruptive transformation of the transportation system through the 
development and adoption of Automated, Connected, Electric and Shared (ACES) transportation 
systems is currently underway. Advanced technology is and will continue to impact development 
of vehicles, infrastructure, communities, commerce and the economy. For example, at the 
national level, the U.S. Department of Transportation (DOT) continues to coordinate and 
develop policies, programs and pilots focused on connected automated transportation. The U.S. 
DOT also recently published Preparing for 
the <a href="https://www.transportation.gov/av/3/preparing-future-transportation-automated-vehicles-3"
target="_blank" rel="noopener noreferrer">Future of Transportation: Automated Vehicles 3.0</a> (AV 3.0) 
that provides policy guidance and guidelines for working with the DOT on automated surface 
transportation systems.</p>

<p className={classes.visionParagraph}>
The Florida Department of Transportation (FDOT) is also leading the way with 
the <a href="https://www.fdot.gov/traffic/its/projects-deploy/cv/connected-vehicles"
target="_blank" rel="noopener noreferrer">Florida Connected Vehicle Initiative</a>. FDOT’s 
mission includes improving safety, reducing congestion and leveraging advanced technologies. 
Florida leads a number of Transportation Systems Management and Operations (TSM&O) 
initiatives that incorporate ACES elements.
</p>

<p className={classes.visionParagraph}>
Beginning in 2013, FDOT, the Tampa Hillsborough Expressway Authority (THEA), 
and many other public, private and university partners organized the first 
Florida Automated Vehicle (FAV) Summit in Tampa Florida. The goal of the Summit 
is to showcase Florida and its progress in preparing for and advancing 
Automated-Connected-Electric-Shared (ACES) vehicles, transportation system technology 
and supporting planning and policy efforts. The Summit has continued each year with 
venues in Orlando (2014), Jacksonville (2015) and Tampa (2016, 2017, and 2018). In 2019, 
the FAV Summit will be held in Miami, and the national Automated Vehicle Symposium (AVS) 
organized by the Transportation Research Board (TRB) and the Association for 
Unmanned Vehicle Systems International (AUVSI). 
</p>

<p className={classes.visionParagraph}>
In addition to the leadership provided by FDOT and THEA, other agencies are playing 
prime roles in the advancement of ACES technologies, including (but not limited to) 
the Florida’s Turnpike Enterprise (FTE), Central Florida Expressway Authority (CFX), 
Miami Dade Expressway Authority (MDX), Jacksonville Transportation Authority (JTA), 
City of Gainesville, City of Tampa, Gainesville Regional Transit, Hillsborough Area 
Regional Transit Authority, and more. Cities, counties, transit agencies, and 
metropolitan planning organizations (MPOs) are hungry for data, tools, and guidance 
about how to incorporate planning for ACES technologies into their work. Private sector 
players are also active in Florida with new demonstrations, pilots, deployments and 
developments being launched regularly. One example is the Babcock Ranch sustainable city 
in Charlotte County, near Fort Myers.
</p>

<p className={classes.visionParagraph}>
Technologies are evolving quickly, and it is difficult yet critical to maintain 
coordination and develop greater collaboration among these and other research, 
development, testing, deployment, demonstration and educational initiatives in the 
ACES arena. Therefore, the concept of a Florida Automated, Connected, Electric and 
Shared (ACES) Transportation System Roadmap has been developed. The Florida ACES 
Roadmap is intended to: develop an initial inventory of past, current and planned 
ACES initiatives within Florida; provide an educational/technology transfer forum and 
graphical interface to share data, findings and best practices between and among 
transportation agencies, the private sector and colleges and universities; 
to leverage expertise and funding across multiple jurisdictions and sectors; to 
encourage and expand communication, cooperation and collaboration; and to ultimately 
facilitate the rapid development, implementation, and evaluation of appropriate and 
optimized ACES technologies according to desired performance measures.  
</p>

            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
