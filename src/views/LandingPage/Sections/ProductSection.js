import React from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

// @material-ui/icons
import Chat from "@material-ui/icons/Chat";
import Info from "@material-ui/icons/Info";
import VerifiedUser from "@material-ui/icons/VerifiedUser";
import Fingerprint from "@material-ui/icons/Fingerprint";
// core components
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import InfoArea from "components/InfoArea/InfoArea.js";

import styles from "assets/jss/material-kit-react/views/landingPageSections/productStyle.js";

const useStyles = makeStyles(styles);

export default function ProductSection() {
  const classes = useStyles();
  return (
    <div className={classes.section}>
      <GridContainer justify="center">
        <GridItem xs={12} sm={12} md={8}>
          <h2 className={classes.title}>Latest Developments</h2>
          <h5 className={classes.description}>
            Lorem ipsum dolor sit amet, vix ea blandit suavitate incorrupte, petentium necessitatibus vis te, 
            eu cetero aperiam reformidans usu. Ne moderatius assueverit scripserit mei. Mel ei veri nusquam, 
            quo at diceret elaboraret. Eius mutat facete at duo.
            
            Aperiam sententiae id qui, nec prodesset disputationi ut, quo ea justo iriure. Choro temporibus an vim. 
            Te usu iudicabit hendrerit liberavisse, ea errem simul est, ne legere vivendo reprehendunt vis. Te eius 
            antiopam consectetuer mea, vix ad debet euripidis interpretaris. Ei tation urbanitas constituam vel, purto 
            eros prompta et sed.
            
            Cu omnium indoctum complectitur mel, ex vel sint quodsi lobortis, te esse moderatius definiebas sea. 
            Eum vidit facilisi et. In vim doctus tacimates corrumpit, no sea assentior constituto, vis et magna luptatum. 
            At posse aliquip vel. Malis scriptorem persequeris mei ut, sententiae voluptatibus vel ex.
            
            Sea ut dolorum ullamcorper. Sit sonet putant possim ad. Utinam ponderum repudiare mel an, adhuc constituto 
            necessitatibus at pro. Sed nihil possit ex.
            
            Option fastidii ocurreret quo ea, laudem labores ne ius. Duo et zril everti officiis, modus dolores 
            definitiones no qui, deserunt concludaturque per ne. Consul nominavi sapientem mei in, in vim salutatus 
            rationibus posidonium. Ei duo graeci mentitum voluptua, his nonumy malorum persecuti cu, vix congue mnesarchum ne. 
            Mea putent nominati neglegentur id, malis reprimique eos ne, no sonet possit graecis eos.
          </h5>
        </GridItem>
      </GridContainer>
    </div>
  );
}
