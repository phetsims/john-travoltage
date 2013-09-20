// Copyright 2002-2013, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
  'JOIST/SimLauncher',
  'SCENERY/nodes/Text',
  'SCENERY/nodes/Rectangle',
  'Strings',
  'JOIST/Sim',
  'model/JohnTravoltageModel',
  'view/JohnTravoltageView',
  'JohnTravoltageImages',
  'JohnTravoltageScreen'
], function( SimLauncher, Text, Rectangle, Strings, Sim, JohnTravoltageModel, JohnTravoltageView, JohnTravoltageImages, JohnTravoltageScreen ) {
  'use strict';

  //Create and start the sim
  SimLauncher.launch( JohnTravoltageImages, function() {
    new Sim( Strings['johnTravoltage.name'], [new JohnTravoltageScreen()] ).start();
  } );
} );