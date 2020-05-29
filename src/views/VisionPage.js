import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
import Camera from "@material-ui/icons/Camera";
import Palette from "@material-ui/icons/Palette";
import Favorite from "@material-ui/icons/Favorite";
// core components
import Header from "components/Header/Header.js";
import Footer from "components/Footer/Footer.js";
import Button from "components/CustomButtons/Button.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import NavPills from "components/NavPills/NavPills.js";
import Parallax from "components/Parallax/Parallax.js";

import profile from "assets/img/faces/christian.jpg";

import studio1 from "assets/img/examples/studio-1.jpg";
import studio2 from "assets/img/examples/studio-2.jpg";
import studio3 from "assets/img/examples/studio-3.jpg";
import studio4 from "assets/img/examples/studio-4.jpg";
import studio5 from "assets/img/examples/studio-5.jpg";
import work1 from "assets/img/examples/olu-eletu.jpg";
import work2 from "assets/img/examples/clem-onojeghuo.jpg";
import work3 from "assets/img/examples/cynthia-del-rio.jpg";
import work4 from "assets/img/examples/mariya-georgieva.jpg";
import work5 from "assets/img/examples/clem-onojegaw.jpg";

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
          height: 200,
          color: "dark"
        }}
        {...rest}
      />
      <Parallax small filter image={require("assets/img/profile-bg.jpg")} />
      <div className={classNames(classes.main, classes.mainRaised)}>
        <div>
          <div className={classes.container}>
            <GridContainer justify="center">
              <GridItem xs={12} sm={12} md={6}>
                <div className={classes.profile}>
                  <div className={classes.name}>
                    <h3 className={classes.title} style={{color: 'white'}}>Vision</h3>
                  </div>
                </div>
              </GridItem>
            </GridContainer>
            <div className={classes.description}>
              <p>
                <h5 className={classes.description}>
                  <br/>
            <p>Lorem ipsum dolor sit amet, vix ea blandit suavitate incorrupte, petentium necessitatibus vis te, 
            eu cetero aperiam reformidans usu. Ne moderatius assueverit scripserit mei. Mel ei veri nusquam, 
            quo at diceret elaboraret. Eius mutat facete at duo.</p>
            
            <p>Aperiam sententiae id qui, nec prodesset disputationi ut, quo ea justo iriure. Choro temporibus an vim. 
            Te usu iudicabit hendrerit liberavisse, ea errem simul est, ne legere vivendo reprehendunt vis. Te eius 
            antiopam consectetuer mea, vix ad debet euripidis interpretaris. Ei tation urbanitas constituam vel, purto 
            eros prompta et sed.</p>
            
            <p>Cu omnium indoctum complectitur mel, ex vel sint quodsi lobortis, te esse moderatius definiebas sea. 
            Eum vidit facilisi et. In vim doctus tacimates corrumpit, no sea assentior constituto, vis et magna luptatum. 
            At posse aliquip vel. Malis scriptorem persequeris mei ut, sententiae voluptatibus vel ex.</p>
            
            <p>Sea ut dolorum ullamcorper. Sit sonet putant possim ad. Utinam ponderum repudiare mel an, adhuc constituto 
            necessitatibus at pro. Sed nihil possit ex.</p>
            
            <p>Option fastidii ocurreret quo ea, laudem labores ne ius. Duo et zril everti officiis, modus dolores 
            definitiones no qui, deserunt concludaturque per ne. Consul nominavi sapientem mei in, in vim salutatus 
            rationibus posidonium. Ei duo graeci mentitum voluptua, his nonumy malorum persecuti cu, vix congue mnesarchum ne. 
            Mea putent nominati neglegentur id, malis reprimique eos ne, no sonet possit graecis eos.</p>
          
                      <p>Lorem ipsum dolor sit amet, vix ea blandit suavitate incorrupte, petentium necessitatibus vis te, 
            eu cetero aperiam reformidans usu. Ne moderatius assueverit scripserit mei. Mel ei veri nusquam, 
            quo at diceret elaboraret. Eius mutat facete at duo.</p>
            
            <p>Aperiam sententiae id qui, nec prodesset disputationi ut, quo ea justo iriure. Choro temporibus an vim. 
            Te usu iudicabit hendrerit liberavisse, ea errem simul est, ne legere vivendo reprehendunt vis. Te eius 
            antiopam consectetuer mea, vix ad debet euripidis interpretaris. Ei tation urbanitas constituam vel, purto 
            eros prompta et sed.</p>
            
            <p>Cu omnium indoctum complectitur mel, ex vel sint quodsi lobortis, te esse moderatius definiebas sea. 
            Eum vidit facilisi et. In vim doctus tacimates corrumpit, no sea assentior constituto, vis et magna luptatum. 
            At posse aliquip vel. Malis scriptorem persequeris mei ut, sententiae voluptatibus vel ex.</p>
            
            <p>Sea ut dolorum ullamcorper. Sit sonet putant possim ad. Utinam ponderum repudiare mel an, adhuc constituto 
            necessitatibus at pro. Sed nihil possit ex.</p>
            
            <p>Option fastidii ocurreret quo ea, laudem labores ne ius. Duo et zril everti officiis, modus dolores 
            definitiones no qui, deserunt concludaturque per ne. Consul nominavi sapientem mei in, in vim salutatus 
            rationibus posidonium. Ei duo graeci mentitum voluptua, his nonumy malorum persecuti cu, vix congue mnesarchum ne. 
            Mea putent nominati neglegentur id, malis reprimique eos ne, no sonet possit graecis eos.</p>
                        <p>Lorem ipsum dolor sit amet, vix ea blandit suavitate incorrupte, petentium necessitatibus vis te, 
            eu cetero aperiam reformidans usu. Ne moderatius assueverit scripserit mei. Mel ei veri nusquam, 
            quo at diceret elaboraret. Eius mutat facete at duo.</p>
            
            <p>Aperiam sententiae id qui, nec prodesset disputationi ut, quo ea justo iriure. Choro temporibus an vim. 
            Te usu iudicabit hendrerit liberavisse, ea errem simul est, ne legere vivendo reprehendunt vis. Te eius 
            antiopam consectetuer mea, vix ad debet euripidis interpretaris. Ei tation urbanitas constituam vel, purto 
            eros prompta et sed.</p>
            
            <p>Cu omnium indoctum complectitur mel, ex vel sint quodsi lobortis, te esse moderatius definiebas sea. 
            Eum vidit facilisi et. In vim doctus tacimates corrumpit, no sea assentior constituto, vis et magna luptatum. 
            At posse aliquip vel. Malis scriptorem persequeris mei ut, sententiae voluptatibus vel ex.</p>
            
            <p>Sea ut dolorum ullamcorper. Sit sonet putant possim ad. Utinam ponderum repudiare mel an, adhuc constituto 
            necessitatibus at pro. Sed nihil possit ex.</p>
            
            <p>Option fastidii ocurreret quo ea, laudem labores ne ius. Duo et zril everti officiis, modus dolores 
            definitiones no qui, deserunt concludaturque per ne. Consul nominavi sapientem mei in, in vim salutatus 
            rationibus posidonium. Ei duo graeci mentitum voluptua, his nonumy malorum persecuti cu, vix congue mnesarchum ne. 
            Mea putent nominati neglegentur id, malis reprimique eos ne, no sonet possit graecis eos.</p>
                        <p>Lorem ipsum dolor sit amet, vix ea blandit suavitate incorrupte, petentium necessitatibus vis te, 
            eu cetero aperiam reformidans usu. Ne moderatius assueverit scripserit mei. Mel ei veri nusquam, 
            quo at diceret elaboraret. Eius mutat facete at duo.</p>
            
            <p>Aperiam sententiae id qui, nec prodesset disputationi ut, quo ea justo iriure. Choro temporibus an vim. 
            Te usu iudicabit hendrerit liberavisse, ea errem simul est, ne legere vivendo reprehendunt vis. Te eius 
            antiopam consectetuer mea, vix ad debet euripidis interpretaris. Ei tation urbanitas constituam vel, purto 
            eros prompta et sed.</p>
            
            <p>Cu omnium indoctum complectitur mel, ex vel sint quodsi lobortis, te esse moderatius definiebas sea. 
            Eum vidit facilisi et. In vim doctus tacimates corrumpit, no sea assentior constituto, vis et magna luptatum. 
            At posse aliquip vel. Malis scriptorem persequeris mei ut, sententiae voluptatibus vel ex.</p>
            
            <p>Sea ut dolorum ullamcorper. Sit sonet putant possim ad. Utinam ponderum repudiare mel an, adhuc constituto 
            necessitatibus at pro. Sed nihil possit ex.</p>
            
            <p>Option fastidii ocurreret quo ea, laudem labores ne ius. Duo et zril everti officiis, modus dolores 
            definitiones no qui, deserunt concludaturque per ne. Consul nominavi sapientem mei in, in vim salutatus 
            rationibus posidonium. Ei duo graeci mentitum voluptua, his nonumy malorum persecuti cu, vix congue mnesarchum ne. 
            Mea putent nominati neglegentur id, malis reprimique eos ne, no sonet possit graecis eos.</p>

            <br/><br/><br/>
          </h5>
              </p>
            </div>
            
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
