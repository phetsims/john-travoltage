// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
  'JOIST/SimLauncher',
  'JOHN_TRAVOLTAGE/Strings',
  'JOIST/Sim',
  'JOHN_TRAVOLTAGE/JohnTravoltageScreen'
], function( SimLauncher, Strings, Sim, JohnTravoltageScreen ) {
  'use strict';

  //Workaround for #30
  document.body.appendChild( document.createElement( 'audio' ) );

  //Create and start the sim
  SimLauncher.launch( function() {
    new Sim( Strings['johnTravoltage.name'], [new JohnTravoltageScreen()] ).start();
  } );
} );