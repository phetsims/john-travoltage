// Copyright 2013-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import JohnTravoltageScreen from './john-travoltage/JohnTravoltageScreen.js';
import JohnTravoltageStrings from './JohnTravoltageStrings.js';

const johnTravoltageTitleStringProperty = JohnTravoltageStrings[ 'john-travoltage' ].titleStringProperty;

//Workaround for #30
const newChild = document.createElement( 'audio' );
newChild.style.display = 'none';
document.body.appendChild( newChild );

// make sure that the audio element above cannot be found by AT, and is out of tab navigation order for Firefox
newChild.setAttribute( 'aria-hidden', true );
newChild.tabIndex = -1;

const tandem = Tandem.ROOT;

const simOptions = {
  credits: {
    leadDesign: 'Noah Podolefsky, Carl Wieman, Sam Reid',
    softwareDevelopment: 'Sam Reid, John Blanco',
    team: 'Wendy Adams, Jesse Greenberg, Trish Loeblein, Emily B. Moore, Ariel Paul, Kathy Perkins,<br>Taliesin Smith',
    qualityAssurance: 'Logan Bray, Steele Dalton, Bryce Griebenow, Clifford Hardin, Liam Mulhall, Oliver Orejola, Devon Quispe, Ben Roberts, Nancy Salpepi, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer, Sharon Siman-Tov',
    soundDesign: 'Ashton Morris, Mike Winters',
    contributors: 'Jonathan Hung, Justin Obara (Inclusive Design Research Centre)',
    thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team ' +
            'to convert this simulation to HTML5.'
  }
};

//Create and start the sim
simLauncher.launch( () => {
  new Sim( johnTravoltageTitleStringProperty, [
    new JohnTravoltageScreen( tandem.createTandem( 'johnTravoltageScreen' ) )
  ], simOptions ).start();
} );