// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var
    SimLauncher = require( 'JOIST/SimLauncher' ),
    Sim = require( 'JOIST/Sim' ),
    JohnTravoltageScreen = require( 'JOHN_TRAVOLTAGE/JohnTravoltageScreen' ),
    title = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.name' );

  //Workaround for #30
  var newChild = document.createElement( 'audio' );
  newChild.style.display = 'none';
  document.body.appendChild( newChild );

  var simOptions = {
    credits: {
      leadDesign: 'Noah Podolefsky, Carl Wieman, Sam Reid',
      softwareDevelopment: 'Sam Reid',
      team: 'Wendy Adams, Trish Loeblein, Ariel Paul, Kathy Perkins',
      graphicArts: 'Sharon Siman-Tov',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team\n' +
              'to convert this simulation to HTML5.'
    }
  };

  //Create and start the sim
  SimLauncher.launch( function() {
    new Sim( title, [ new JohnTravoltageScreen() ], simOptions ).start();
  } );
} );