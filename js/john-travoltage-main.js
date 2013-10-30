// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
  'JOIST/SimLauncher',
  'JOIST/Sim',
  'JOHN_TRAVOLTAGE/JohnTravoltageScreen',
  'string!JOHN_TRAVOLTAGE/travoltage.name'
], function( SimLauncher, Sim, JohnTravoltageScreen, title ) {
  'use strict';

  //Workaround for #30
  var newChild = document.createElement( 'audio' );
  newChild.style.display = 'none';
  document.body.appendChild( newChild );

  var simOptions = {
    credits: {
      leadDesign: 'Noah Podolefsky, Carl Wieman, Sam Reid',
      softwareDevelopment: 'Sam Reid',
      designTeam: 'Ariel Paul, Kathy Perkins, Trish Loeblein, Sharon Simon-Tov',
      interviews: 'Ariel Paul, Wendy Adams',
      thanks: 'Thanks to Mobile Learner Labs for working with the PhET development team\n' +
              'to convert this simulation to HTML5.'
    }
  };

  //Create and start the sim
  SimLauncher.launch( function() {
    new Sim( title, [new JohnTravoltageScreen()], simOptions ).start();
  } );
} );