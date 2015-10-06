// Copyright 2002-2013, University of Colorado Boulder

/**
 * Simple line segment model.  Immutable, and all derived values are computed in advance for performance.
 * If you mutate the line, the derived values will be wrong.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * Create a LineSegment from Number,Number,Number,Number or Vector2,Vector2
   *
   * @param {Number|Vector2} x1
   * @param {Number|Vector2} y1
   * @param {Number|undefined} x2
   * @param {Number|undefined} y2
   * @constructor
   */
  function LineSegment( x1, y1, x2, y2 ) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.normalVector = new Vector2( this.x2 - this.x1, this.y2 - this.y1 ).perpendicular().normalized();
    this.vector = new Vector2( this.x2 - this.x1, this.y2 - this.y1 );
    this.p0 = new Vector2( this.x1, this.y1 );
    this.p1 = new Vector2( this.x2, this.y2 );
    var epsilon = 0.01;
    this.pre0 = this.p0.blend( this.p1, epsilon );
    this.pre1 = this.p0.blend( this.p1, 1 - epsilon );
  }

  return inherit( Object, LineSegment, {

    //No need for speed, only used in debugging
    get center() { return new Vector2( (this.x1 + this.x2) / 2, (this.y1 + this.y2) / 2 ); },

    //No need for speed, only used in debugging
    get normal() { return new Vector2( this.x2 - this.x1, this.y2 - this.y1 ).normalized().perpendicular();}
  } );
} );