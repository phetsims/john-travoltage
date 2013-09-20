// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge has a position and box2d instance.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';


  var x = {
    util1: function() {console.log( 'util1' )},
    util2: function() {
      this.util1();
    }
  };
  x.util2();

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Electron( x, y, model ) {
    PropertySet.call( this, {
      position: new Vector2( x, y ),
      velocity: new Vector2( 0, -40 )
    } );
    this.model = model;
  }

  //statics
  Electron.radius = 8;
  Electron.charge = -1;

  return inherit( PropertySet, Electron, {
    step: function( dt, globalModel ) {
      var x1 = this.position.x;
      var y1 = this.position.y;

      var x2 = x1 + this.velocity.x * dt;
      var y2 = y1 + this.velocity.y * dt;

      var segments = this.model.getLineSegments();
      var bounced = false;
      for ( var i = 0; i < segments.length; i++ ) {
        var segment = segments[i];
        if ( this.intersection( x1, y1, x2, y2, segment.x1, segment.y1, segment.x2, segment.y2 ) ) {

          var normal = segment.getNormalVector();
          //reflect velocity
          var newVelocity = this.velocity.minus( normal.times( 2 * normal.dot( this.velocity ) ) );
          this.velocity = newVelocity;
          bounced = true;
          break;
        }
      }
      //See if it crossed a barrier, and reflect it
      //TODO: prevent allocations?
      if ( !bounced ) {
        this.position = new Vector2( x2, y2 );
      }
    },

    //Computes the intersection of two line segments. Algorithm taked from Paul Bourke, 1989:
    //http://astronomy.swin.edu.au/~pbourke/geometry/lineline2d/
    //Ported from MathUtil.java on 9/20/2013 by @samreid
    //line a goes from point 1->2 and line b goes from 3->4
    //TODO: Move to DOT/util
    intersection: function( x1, y1, x2, y2, x3, y3, x4, y4 ) {
      var numA = ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 );
      var numB = ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 );
      var denom = ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 );

      // If denominator is 0, the lines are parallel or coincident
      if ( denom == 0 ) {
        return null;
      }
      else {
        var ua = numA / denom;
        var ub = numB / denom;

        // ua and ub must both be in the range 0 to 1 for the segments to have an intersection pt.
        if ( !( ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1 ) ) {
          return null;
        }
        else {
          var x = x1 + ua * ( x2 - x1 );
          var y = y1 + ua * ( y2 - y1 );
          return new Vector2( x, y );
        }
      }
    }
  } );
} );