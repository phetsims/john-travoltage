// Copyright 2013-2020, University of Colorado Boulder

/**
 * Simple line segment model.  Immutable, and all derived values are computed in advance for performance.
 * If you mutate the line, the derived values will be wrong.  This utility class does not need to be instrumented
 * for PhET-iO.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import johnTravoltage from '../../johnTravoltage.js';

class LineSegment {
  /**
   * Create a LineSegment from Number,Number,Number,Number
   *
   * @param {number} x1
   * @param {number} y1
   * @param {number} x2
   * @param {number} y2
   */
  constructor( x1, y1, x2, y2 ) {

    // @private
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    // @public (read-only)
    this.normalVector = new Vector2( this.x2 - this.x1, this.y2 - this.y1 ).perpendicular.normalized();
    this.vector = new Vector2( this.x2 - this.x1, this.y2 - this.y1 );
    this.p0 = new Vector2( this.x1, this.y1 );
    this.p1 = new Vector2( this.x2, this.y2 );

    const epsilon = 0.01;

    // @public (read-only)
    this.pre0 = this.p0.blend( this.p1, epsilon );
    this.pre1 = this.p0.blend( this.p1, 1 - epsilon );
  }


  /**
   * Get the center of this line segment.  Does not need to be fast, this is only used for debugging.
   * @returns {[type]} [description]
   */
  get center() { return new Vector2( ( this.x1 + this.x2 ) / 2, ( this.y1 + this.y2 ) / 2 ); }

  /**
   * Get a normal vector to this line segment.
   *
   * @returns {Vector2}
   */
  get normal() { return new Vector2( this.x2 - this.x1, this.y2 - this.y1 ).normalized().perpendicular; }
}

johnTravoltage.register( 'LineSegment', LineSegment );

export default LineSegment;