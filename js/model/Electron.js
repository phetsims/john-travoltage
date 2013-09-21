// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge has a position and box2d instance.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  function Electron( x, y, model ) {
    PropertySet.call( this, {
      position: new Vector2( x, y ),
      velocity: new Vector2( 0, -100 )
    } );
    this.model = model;
  }

  //statics
  Electron.radius = 8;
  Electron.charge = -1;

  return inherit( PropertySet, Electron, {
    step: function( dt, globalModel ) {
      var i = 0;
      var x1 = this.position.x;
      var y1 = this.position.y;

      var netForceX = 0;
      var netForceY = 0;
      for ( i = 0; i < this.model.electrons.length; i++ ) {
        var electron = this.model.electrons.get( i );
        if ( electron !== this ) {
          var deltaVectorX = electron.position.x - this.position.x;
          var deltaVectorY = electron.position.y - this.position.y;
          var scale = 5.0 / Math.pow( electron.position.distance( this.position ), 1.5 );
          netForceX = netForceX - deltaVectorX * scale;
          netForceY = netForceY - deltaVectorY * scale;
        }
      }

      this.velocity = new Vector2( this.velocity.x + netForceX, this.velocity.y + netForceY );
//      console.log( this.velocity.magnitude() );
      if ( this.velocity.magnitude() > 100 ) {
        this.velocity = this.velocity.timesScalar( 100.0 / this.velocity.magnitude() );
      }
      this.velocity = this.velocity.timesScalar( 0.95 );
      if ( isNaN( this.velocity.x ) ) {
        debugger;
      }
      if ( isNaN( this.velocity.y ) ) {
        debugger;
      }

      var x2 = x1 + this.velocity.x * dt;
      var y2 = y1 + this.velocity.y * dt;

      var segments = this.model.getLineSegments();
      var bounced = false;
      for ( i = 0; i < segments.length; i++ ) {
        var segment = segments[i];
        if ( Util.lineSegmentIntersection( x1, y1, x2, y2, segment.x1, segment.y1, segment.x2, segment.y2 ) ) {

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

        //A bit of randomness to the motion
        this.velocity = this.velocity.rotated( (Math.random() - 0.5) * 0.2 );
      }
    }
  } );
} );