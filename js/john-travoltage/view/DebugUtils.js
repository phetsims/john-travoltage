// Copyright 2013-2017, University of Colorado Boulder

/**
 * Utility for sampling positions and line segments for the model, which should be used in the JohnTravoltageView.
 * Clicking around the view will output the values to the console, which can then be used in model code.
 *
 * //Sample model points for bounds, vertices or pivots, see JohnTravoltageModel.bodyVertices.
 * DebugUtils.debugPositions( view );
 *
 * //Sample and print line segments, for creating force paths for electrons during spark traversal
 * DebugUtils.debugLineSegments( view );
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Shape = require( 'KITE/Shape' );

  var DebugUtils = {

    /**
     * Sample model points for bounds, see JohnTravoltageModel.bodyVertices
     * @param  {JohnTravoltageView} johnTravoltageView
     */
    debugPositions: function( johnTravoltageView ) {
      johnTravoltageView.touchArea = Shape.rectangle( 0, 0, 1000, 1000 );
      johnTravoltageView.mouseArea = Shape.rectangle( 0, 0, 1000, 1000 );
      var string = '';
      johnTravoltageView.addInputListener( {
        down: function( event ) {
          var pt = event.pointer.point;
          var global = johnTravoltageView.globalToLocalPoint( pt );
          var a = 'new Vector2(' + global.x + ',' + global.y + '),\n';

          string = string + a;
          console.log( string );
        }
      } );
    },

    /**
     * Utility to create force lines by clicking in the view
     * @param  {JohnTravoltageView} johnTravoltageView
     */
    debugLineSegments: function( johnTravoltageView ) {
      johnTravoltageView.touchArea = Shape.rectangle( 0, 0, 1000, 1000 );
      johnTravoltageView.mouseArea = Shape.rectangle( 0, 0, 1000, 1000 );
      var string = '';
      var p1 = null;
      johnTravoltageView.addInputListener( {
        down: function( event ) {
          var pt = event.pointer.point;
          var global = johnTravoltageView.globalToLocalPoint( pt );
          if ( p1 ) {
            string = string + 'new LineSegment(' + p1.x + ',' + p1.y + ',' + global.x + ',' + global.y + '),\n';
            console.log( string );
            p1 = null;
          }
          else {
            p1 = global;
          }
        }
      } );
    }
  };

  johnTravoltage.register( 'DebugUtils', DebugUtils );

  return DebugUtils;
} );