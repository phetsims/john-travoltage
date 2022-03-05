// Copyright 2013-2022, University of Colorado Boulder

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
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */

import { Shape } from '../../../../kite/js/imports.js';
import johnTravoltage from '../../johnTravoltage.js';

const DebugUtils = {

  /**
   * Sample model points for bounds, see JohnTravoltageModel.bodyVertices
   * @param  {JohnTravoltageView} johnTravoltageView
   */
  debugPositions( johnTravoltageView ) {
    johnTravoltageView.touchArea = Shape.rectangle( 0, 0, 1000, 1000 );
    johnTravoltageView.mouseArea = Shape.rectangle( 0, 0, 1000, 1000 );
    let string = '';
    johnTravoltageView.addInputListener( {
      down: event => {
        const pt = event.pointer.point;
        const global = johnTravoltageView.globalToLocalPoint( pt );
        const a = `new Vector2(${global.x},${global.y}),\n`;

        string = string + a;
        console.log( string );
      }
    } );
  },

  /**
   * Utility to create force lines by clicking in the view
   * @param  {JohnTravoltageView} johnTravoltageView
   */
  debugLineSegments( johnTravoltageView ) {
    johnTravoltageView.touchArea = Shape.rectangle( 0, 0, 1000, 1000 );
    johnTravoltageView.mouseArea = Shape.rectangle( 0, 0, 1000, 1000 );
    let string = '';
    let p1 = null;
    johnTravoltageView.addInputListener( {
      down: event => {
        const pt = event.pointer.point;
        const global = johnTravoltageView.globalToLocalPoint( pt );
        if ( p1 ) {
          string = `${string}new LineSegment(${p1.x},${p1.y},${global.x},${global.y}),\n`;
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

export default DebugUtils;