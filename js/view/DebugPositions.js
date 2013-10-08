// Copyright 2002-2013, University of Colorado Boulder

//REVIEW provide more details. How would I use this if I needed to change one or more of the many very-precise values that appear in code?
/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Shape = require( 'KITE/Shape' );

  function DebugPositions() {}

  DebugPositions.prototype = {

    //Sample model points for bounds, see JohnTravoltageModel.bodyVertices
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

    //Utility to create force lines by clicking in the view
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
  return DebugPositions;
} );