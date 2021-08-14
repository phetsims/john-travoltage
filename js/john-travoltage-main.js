// Copyright 2013-2021, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import PreferencesConfiguration from '../../joist/js/preferences/PreferencesConfiguration.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import vibrationManager from '../../tappi/js/vibrationManager.js';
import JohnTravoltageScreen from './john-travoltage/JohnTravoltageScreen.js';
import johnTravoltageStrings from './johnTravoltageStrings.js';

const johnTravoltageTitleString = johnTravoltageStrings[ 'john-travoltage' ].title;

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
  },
  hasKeyboardHelpContent: true,

  // include a PreferencesDialog, with defaults specified in package.json
  preferencesConfiguration: new PreferencesConfiguration(),

  // protoypal vibration feedback, see https://github.com/phetsims/john-travoltage/issues/337
  vibrationManager: vibrationManager
};

//Create and start the sim
simLauncher.launch( () => {
  new Sim( johnTravoltageTitleString, [
    new JohnTravoltageScreen( tandem.createTandem( 'johnTravoltageScreen' ) )
  ], simOptions ).start();
} );