// Copyright 2016, University of Colorado Boulder

/**
 * KeyNode representing the arrow keys.  Default is a rounded triangle centered in
 * a square key.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var KeyNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/keys/KeyNode' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );

  // constants
  var DEFAULT_ARROW_HEIGHT = 10;
  var DEFAULT_ARROW_WIDTH = 1 / 2 * Math.sqrt( 3 ) * DEFAULT_ARROW_HEIGHT; // for equilateral triangle

  /**
   * @param {string} direction - direction of arrow, one of 'up'|'down'|'left'|'right'
   * @param {Object} options
   * @constructor
   */
  function ArrowKeyNode( direction, options ) {

    options = _.extend( {

      // options for the arrow
      arrowFill: 'black',
      arrowStroke: 'black',
      arrowLineJoin: 'round',
      arrowLineWidth: 3,
      arrowHeight: DEFAULT_ARROW_HEIGHT,
      arrowWidth: DEFAULT_ARROW_WIDTH,

      // placement in the key icon
      align: 'center'
    }, options );

    var arrowHeight = options.arrowHeight;
    var arrowWidth = options.arrowWidth;
    var arrowLineJoin = options.arrowLineJoin;
    var arrowLineWidth = options.arrowLineWidth;
    var arrowFill = options.arrowFill;
    var arrowStroke = options.arrowStroke;

    // draw the arrow shape - default shape pointing up
    var arrowShape = new Shape();
    arrowShape.moveTo( arrowHeight / 2, 0 ).lineTo( arrowHeight, arrowWidth + 0 ).lineTo( 0, arrowWidth + 0 ).close();

    // draw the arrow
    var pathOptions = {
      fill: arrowFill,
      stroke: arrowStroke,
      lineJoin: arrowLineJoin,
      lineWidth: arrowLineWidth
    };
    var arrowPath = new Path( arrowShape, pathOptions );

    if ( direction === 'up' ) {
      arrowPath.rotate( 0 ); // default arrow shape points up
    }
    else if ( direction === 'down' ) {
      arrowPath.rotate( Math.PI );
    }
    else if ( direction === 'left' ) {
      arrowPath.rotate( -Math.PI / 2 );
    }
    else if ( direction === 'right' ) {
      arrowPath.rotate( Math.PI / 2 );
    }
    else {
      throw new Error( 'unsupported direction: ' + direction );
    }

    // place in the key
    KeyNode.call( this, arrowPath, options );
  }

  johnTravoltage.register( 'ArrowKeyNode', ArrowKeyNode );

  return inherit( KeyNode, ArrowKeyNode );

} );
