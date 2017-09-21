// Copyright 2013-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var JohnTravoltageKeyboardHelpContent = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JohnTravoltageKeyboardHelpContent' );
  var JohnTravoltageScreen = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageScreen' );
  var platform = require( 'PHET_CORE/platform' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var johnTravoltageTitleString = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  //Workaround for #30
  var newChild = document.createElement( 'audio' );
  newChild.style.display = 'none';
  document.body.appendChild( newChild );

  // make sure that the audio element above cannot be found by AT, and is out of tab navigation order for Firefox
  newChild.setAttribute( 'aria-hidden', true );
  newChild.tabIndex = -1;

  var tandem = Tandem.createRootTandem();

  // help content to describe keyboard interactions
  var keyboardHelpContent = new JohnTravoltageKeyboardHelpContent( Tandem.createStaticTandem( 'keyboardHelpContent' ) );

  var simOptions = {
    credits: {
      leadDesign: 'Noah Podolefsky, Carl Wieman, Sam Reid',
      softwareDevelopment: 'Sam Reid',
      team: 'Wendy Adams, Jesse Greenberg, Trish Loeblein, Emily Moore, Ariel Paul, Kathy Perkins, Taliesin Smith',
      contributors: 'Jonathan Hung, Justin Obara (Inclusive Design Research Centre)',
      qualityAssurance: 'Steele Dalton, Bryce Griebenow, Ben Roberts, Oliver Orejola',
      graphicArts: 'Mariah Hermsmeyer, Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team ' +
              'to convert this simulation to HTML5.'
    },
    accessibility: !platform.mobileSafari, // disable accessibility on mobile Safari until accessibility works on that platform
    keyboardHelpNode: keyboardHelpContent
  };

  //Create and start the sim
  SimLauncher.launch( function() {
    new Sim( johnTravoltageTitleString, [
      new JohnTravoltageScreen( tandem.createTandem( 'johnTravoltageScreen' ) )
    ], simOptions ).start();
  } );
} );