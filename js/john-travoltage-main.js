// Copyright 2013-2020, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import Sim from '../../joist/js/Sim.js';
import SimLauncher from '../../joist/js/SimLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import vibrationManager from '../../tappi/js/vibrationManager.js';
import johnTravoltageStrings from './johnTravoltageStrings.js';
import JohnTravoltageScreen from './john-travoltage/JohnTravoltageScreen.js';
import JohnTravoltageKeyboardHelpContent from './john-travoltage/view/JohnTravoltageKeyboardHelpContent.js';

const johnTravoltageTitleString = johnTravoltageStrings[ 'john-travoltage' ].title;

//Workaround for #30
const newChild = document.createElement( 'audio' );
newChild.style.display = 'none';
document.body.appendChild( newChild );

// make sure that the audio element above cannot be found by AT, and is out of tab navigation order for Firefox
newChild.setAttribute( 'aria-hidden', true );
newChild.tabIndex = -1;

const tandem = Tandem.ROOT;

// help content to describe keyboard interactions
const keyboardHelpContent = new JohnTravoltageKeyboardHelpContent();

const simOptions = {
  credits: {
    leadDesign: 'Noah Podolefsky, Carl Wieman, Sam Reid',
    softwareDevelopment: 'Sam Reid, John Blanco',
    team: 'Wendy Adams, Jesse Greenberg, Trish Loeblein, Emily B. Moore, Ariel Paul, Kathy Perkins,<br>Taliesin Smith',
    qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ben Roberts, Oliver Orejola, Kathryn Woessner',
    graphicArts: 'Mariah Hermsmeyer, Sharon Siman-Tov',
    soundDesign: 'Ashton Morris, Mike Winters',
    contributors: 'Jonathan Hung, Justin Obara (Inclusive Design Research Centre)',
    thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team ' +
            'to convert this simulation to HTML5.'
  },
  keyboardHelpNode: keyboardHelpContent,

  // protoypal vibration feedback, see https://github.com/phetsims/john-travoltage/issues/337
  vibrationManager: vibrationManager
};

//Create and start the sim
SimLauncher.launch( function() {
  new Sim( johnTravoltageTitleString, [
    new JohnTravoltageScreen( tandem.createTandem( 'johnTravoltageScreen' ) )
  ], simOptions ).start();
} );