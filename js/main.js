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
  'view/JohnTravoltageTabView',
  'JohnTravoltageImages'
], function( SimLauncher, Text, Rectangle, Strings, Sim, JohnTravoltageModel, JohnTravoltageTabView, JohnTravoltageImages ) {
  'use strict';

  //Create and start the sim
  SimLauncher.launch( JohnTravoltageImages, function() {
    new Sim( Strings['johnTravoltage.name'], [
      {
        name: Strings['johnTravoltage.name'],
        createModel: function() {return new JohnTravoltageModel( 834, 504 );},
        createView: function( model ) {return new JohnTravoltageTabView( model );},
        backgroundColor: "#9ddcf8"
      }
    ] ).start();
  } );
} );