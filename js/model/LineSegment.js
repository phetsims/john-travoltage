// Copyright 2002-2013, University of Colorado Boulder

/**
 * Simple line segment model.  Immutable, and all derived values are computed in advance for performance.
 * If you mutate the line, the derived values will be wrong.
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Vector2 = require( 'DOT/Vector2' );

  function LineSegment( x1, y1, x2, y2 ) {
    if ( typeof x1 === 'number' ) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
    }

    //Support for LineSegment(Vector2,Vector2)
    else {
      this.x1 = x1.x;
      this.y1 = x1.y;
      this.x2 = y1.x;
      this.y2 = y1.y;
    }

    this.normalVector = new Vector2( this.x2 - this.x1, this.y2 - this.y1 ).perpendicular().normalized();
    this.vector = new Vector2( this.x2 - this.x1, this.y2 - this.y1 );
    this.p0 = new Vector2( this.x1, this.y1 );
    this.p1 = new Vector2( this.x2, this.y2 );
  }

  return LineSegment;
} );