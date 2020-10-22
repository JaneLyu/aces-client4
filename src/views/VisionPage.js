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
            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
              <h3>About Florida {Constants.ACES_LABEL}</h3>
            </div>
            <div style={{ padding: '10px 40px 40px 40px', fontSize: '1rem', color: 'black' }}>
              <p className={classes.visionParagraph}>

                The dramatic and disruptive transformation of the transportation system through the development and adoption of Automated, 
                Connected, Electric and Shared (ACES) transportation systems is currently underway. The U.S. DOT also recently 
                published <a href="https://www.transportation.gov/sites/dot.gov/files/2020-02/EnsuringAmericanLeadershipAVTech4.pdf" 
                target="_blank" rel="noopener noreferrer">Ensuring American Leadership in Automated
                Vehicle Technologies</a> (AV 4.0) that stresses "the importance of ensuring America’s continued leadership
                in emerging technologies, including Automated Vehicles (AVs). With the development of AVs,
                America has the potential to once again transform the future of transportation, while also
                increasing economic growth and overall productivity. AVs—if developed properly- also have the
                potential to make our roadways safer by reducing crashes caused by human error, including crashes
                involving impaired or distracted drivers."
              </p>

              <p className={classes.visionParagraph}>
                The Florida Department of Transportation (FDOT) is also leading the way with 
                the <a href="https://www.fdot.gov/traffic/its/projects-deploy/cv/connected-vehicles" 
                target="_blank" rel="noopener noreferrer">Florida Connected Vehicle Initiative</a>. FDOT’s
                mission includes improving safety, reducing congestion, and leveraging advanced technologies.
                Florida leads a number of Transportation Systems Management and Operations (TSM&O) initiatives
                that incorporate ACES elements.
              </p>

              <p className={classes.visionParagraph}>
                The overarching goal of this project is to lay the groundwork for and begin the development of a
                Florida Automated, Connected, Electric and Shared (ACES) Transportation System Roadmap. The Roadmap
                development process, and associated products, will improve communication, collaboration and
                coordination, will leverage investments and position Florida as a leader in the planning,
                development, deployment, and evaluation of emerging technologies in order to improve the safety
                and mobility of people and goods. The project will also "lift all boats" by raising and sharing
                awareness, capabilities, and expertise of the transportation professionals in our state.
              </p>

              <p className={classes.visionParagraph}>
                The objectives of this project are to: develop an initial inventory of past, current and planned
                ACES initiatives within Florida; provide an educational/technology transfer forum and graphical
                interface to share data, findings and best practices between and among transportation agencies,
                the private sector and colleges and universities; to leverage expertise and funding across multiple
                jurisdictions and sectors; to encourage and expand communication, cooperation and collaboration;
                and to ultimately facilitate the rapid development, implementation, and evaluation of appropriate
                and optimized ACES technologies according to desired performance measures.
              </p>

              <p style={{fontSize: '1rem'}}>
                <strong>Project Leadership</strong>
              </p>

              <p style={{fontSize: '1rem'}}>
                Project Manager: <a href="https://www.linkedin.com/in/raj-ponnaluri-pe-phd-ptoe-pmp-a356809/"
                  target="_blank" rel="noopener noreferrer">Raj Ponnaluri, Ph.D., P.E., PTOE, PMP</a>
              </p>
              <p style={{fontSize: '1rem'}}>
                Principal Investigator: <a href="https://www.cutr.usf.edu/2017/12/pei-sung-lin-its-program-director/"
                  target="_blank" rel="noopener noreferrer">Pei-Sung Lin, Ph.D., P.E., PTOE, FITE</a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
