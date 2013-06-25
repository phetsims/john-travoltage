// Copyright 2002-2013, University of Colorado

/**
 * Main entry point for the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sam Reid (PhET Interactive Simulations)
 */
require( [
  'PHETCOMMON/util/ImagesLoader',
  'SCENERY/nodes/Text',
  'SCENERY/nodes/Rectangle',
  'Strings',
  'JOIST/Sim',
  'model/JohnTravoltageModel',
  'view/JohnTravoltagePlayArea'
], function( ImagesLoader, Text, Rectangle, Strings, Sim, JohnTravoltageModel, JohnTravoltagePlayArea ) {
  'use strict';

  var ImagesLoaderInstance = new ImagesLoader( function( loader ) {

    //Create and start the sim
    var sim = new Sim( Strings['johnTravoltage.name'], [
      {
        name: Strings['johnTravoltage.name'],
        icon: new Rectangle( 0, 0, 50, 50, {} ),
        createModel: function() {return new JohnTravoltageModel( 834, 504 );},
        createView: function( model ) {return new JohnTravoltagePlayArea( model );},
        backgroundColor: "#9ddcf8"
      }
    ] ).start();

  } );
} );
