// Copyright 2013-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */
define( require => {
  'use strict';

  // modules
  const JohnTravoltageKeyboardHelpContent = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JohnTravoltageKeyboardHelpContent' );
  const JohnTravoltageScreen = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageScreen' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );
  const vibrationManager = require( 'TAPPI/vibrationManager' );

  // strings
  const johnTravoltageTitleString = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  //Workaround for #30
  var newChild = document.createElement( 'audio' );
  newChild.style.display = 'none';
  document.body.appendChild( newChild );

  // make sure that the audio element above cannot be found by AT, and is out of tab navigation order for Firefox
  newChild.setAttribute( 'aria-hidden', true );
  newChild.tabIndex = -1;

  var tandem = Tandem.rootTandem;

  // help content to describe keyboard interactions
  var keyboardHelpContent = new JohnTravoltageKeyboardHelpContent();

  var simOptions = {
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
    accessibility: true,
    keyboardHelpNode: keyboardHelpContent,
    supportsEnhancedSound: true,
    supportsSound: true,

    // protoypal vibration feedback, see https://github.com/phetsims/john-travoltage/issues/337
    vibrationManager: vibrationManager
  };

  //Create and start the sim
  SimLauncher.launch( function() {
    new Sim( johnTravoltageTitleString, [
      new JohnTravoltageScreen( tandem.createTandem( 'johnTravoltageScreen' ) )
    ], simOptions ).start();
  } );
} );