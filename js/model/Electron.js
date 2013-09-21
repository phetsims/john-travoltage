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

        //Skipping some interactions speeds things up and also gives a good sense of more randomness
//        if ( electron !== this && i % 2 === 0 ) {
        if ( electron !== this && Math.random() < 0.4 ) {
          var deltaVectorX = electron.position.x - this.position.x;
          var deltaVectorY = electron.position.y - this.position.y;

          //TODO: Good luck tuning these magic numbers!
          var scale = 5.0 / Math.pow( electron.position.distance( this.position ) * 2, 1.8 );
          var fx = deltaVectorX * scale;
          var fy = deltaVectorY * scale;
          var max = 5;
          if ( fx * fx + fy * fy > max * max ) {
            fx = fx / max;
            fy = fy / max;
          }
          netForceX = netForceX - fx;
          netForceY = netForceY - fy;
        }
      }

      var vx2 = this.velocity.x + netForceX;
      var vy2 = this.velocity.y + netForceY;

      var d = Math.sqrt( vx2 * vx2 + vy2 * vy2 );
      if ( d > 150 ) {
        vx2 = vx2 / d * 150;
        vy2 = vy2 / d * 150;
      }
      vx2 = vx2 * 0.99;
      vy2 = vy2 * 0.99;

//      this.velocity = new Vector2( this.velocity.x + netForceX, this.velocity.y + netForceY );
//      if ( this.velocity.magnitude() > 150 ) {
//        this.velocity = this.velocity.timesScalar( 150.0 / this.velocity.magnitude() );
//      }
//      this.velocity = this.velocity.timesScalar( 0.98 );

      var x2 = x1 + vx2 * dt;
      var y2 = y1 + vy2 * dt;

      //Skipping notifications here because nobody needs to observe the velocity values, and this is faster (no allocation)
      this.velocity.set( vx2, vy2 );

      var segments = this.model.getLineSegments();
      var bounced = false;
      for ( i = 0; i < segments.length; i++ ) {
        var segment = segments[i];
        if ( Util.lineSegmentIntersection( x1, y1, x2, y2, segment.x1, segment.y1, segment.x2, segment.y2 ) ) {

          var normal = segment.normalVector;
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
      else {
        //Notify observers anyways so the electron will redraw at the right leg angle
        this.positionProperty.notifyObserversUnsafe();
      }
    }
  } );
} );