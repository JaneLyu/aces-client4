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
      <Parallax small filter image={require("assets/img/hero.jpg")} />
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
In addition to the public and private sectors, faculty and students from Florida universities, 
colleges and high schools have always been important constituents of the FAV Summit and are 
working on various ACES related projects in Florida and beyond. Academic research and education, 
starting with high schools and earlier, are important to assuring that we are prepared for the 
technological wave of change in our transportation system. Some current known examples 
of Florida agency and university efforts related to ACES technologies include (but are not limited to):
</p>

<ul className={classes.visionList}>
      <li className={classes.visionListItem}>
	<strong>FAMU</strong>: Current projects include microscopic traffic simulation and driving simulator studies 
      related to connected/automated Vehicles (CAV). Part of Central Florida Automated Vehicle 
      Proving Ground Partnership.
      </li>

      <li className={classes.visionListItem}>
	<strong>FAU</strong>: Current projects include connected vehicle (CV) 
      driving simulator and virtual reality (VR) pedestrian simulator for testing CV 
      communications (between vehicles and infrastructure) in multimodal urban networks (FAU). 
      Recently completed NSF project to develop vehicular networking on-board/roadside unit 
      containing hardware and software necessary to easily research and develop wireless systems 
      for the next generation of transportation technology, including navigation sensors, 
      human-machine interface (HMI) components, and RS-232, USB, and Wi-Fi.
      </li>

      <li className={classes.visionListItem}>
      <strong>FIU</strong>: Current projects include "Performance Measurement 
      and Management Using Connected and Automated Vehicle Data" (U.S. DOT STRIDE UTC); 
      "Utilization of Connected Vehicle Data to Support Traffic Management Decisions" (FDOT); 
      "Framework to Support Transportation Agency ITS Infrastructure and ITS Legacy Decisions 
      with Consideration of Connected Vehicle Deployment and Automated Vehicle Initiatives" 
      (NCHRP); “Testing of a Vision-Based Warning System on Transit Vehicles" (FDOT); 
      and "Potential Implications of Automated Vehicles on Travel Behavior" (FDOT).
      </li>

      <li className={classes.visionListItem}>
      <strong>FPU</strong>: Part of Central Florida Automated Vehicle Proving Ground Partnership and SunTrax.
      </li>

      <li className={classes.visionListItem}>
      	<strong>FSU</strong>: See FAMU above. 
      </li>

      <li className={classes.visionListItem}>
      	<strong>UCF</strong>: Part of U.S. DOT designated AV Proving 
            Grounds Pilot Central Florida Automated Vehicle Proving Ground 
            Partnership (FDOT, FTE Lynx, CFX and the City of Orlando).
      </li>

      <li className={classes.visionListItem}>
      	<strong>UF</strong>: Projects include I-STREET (FDOT); “Autonomous Shuttle to 
            Connect UF Campus to Downtown Gainesville” (FDOT and City of Gainesville); 
            AV/CV Applications (City of Jacksonville); and Data Analytics Platform (FDOT D5).
      </li>

      <li className={classes.visionListItem}>
      	<strong>UNF</strong>: Working with FAMU-FSU on CAV simulation.
      </li>

<li className={classes.visionListItem}>
	<strong>USF</strong>: Projects include U.S. DOT designated Tampa CV Pilot 
      (THEA, City of Tampa, HART, FDOT); Tampa Bay Smart Cities Alliance (City of Tampa); 
      FTA Safety Research and Demonstration Program (RRD) CV deployments; HART AV Deployment 
      Downtown Tampa (HART); USF Campus AV Shuttle Planning Study (Hillsborough County); 
      Campus Automated Connected Testbed (in development); Campus Automated Shuttle 
      Service Deployment Initiative (U.S. DOT); Smartphone Based Connected Bicycle 
      Prototype Development for Sustainable Multimodal Transportation System (U.S. DOT); 
      Enhancing Cybersecurity in Public Transportation (FDOT); “Autonomous Vehicle (AV) and 
      Alternative Fuel Vehicle (AFV) Florida Market Penetration Rate and VMT Assessment Study” (FDOT); 
      and "Pathway to a Driverless Highway Transportation System: A Behavior Analysis and Trajectory 
      Control Approach" (NSF).
</li>

<li className={classes.visionListItem}>
	<strong>Hillsborough Community College (HCC)</strong>: Supporting THEA CV Pilot through 
      installation of after-market in-vehicle devices.
</li>
</ul>

<p className={classes.visionParagraph}>
While each of the above is discrete in scope and participants, each project will 
provide new information to advance the implementation of ACES technology.  
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
