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

  return inherit( PropertySet, Electron, {
    stepInSpark: function( dt ) {
      var electron = this;
      //move to closest line segment
      if ( !this.segment ) {

        //TODO: precompute the getP0
        this.segment = _.sortBy( this.model.forceLines, function( forceLine ) { return forceLine.getP0().distance( electron.position ); } )[0];

        //If the closest path is the same as the last one, it means we have reached the end of the road
        if ( this.lastSegment === this.segment ) {

          //Don't remove immediately or it will be concurrentmodificationexception in iterator
          this.model.electronsToRemove.push( electron );
          return;
        }
      }
      //move at constant velocity toward the segment
      var target = this.segment.getP1();
      var current = this.position;
      var delta = target.minus( current );

      //Arrived at destination, go to the next segment
      if ( delta.magnitude() <= 100 * dt ) {
        this.lastSegment = this.segment;
        this.segment = null;
      }
      else {

        //Send toward the end point on the segment, but with a bit of randomness to make it seem a bit more realistic
        this.velocity = Vector2.createPolar( 200, delta.angle() + (Math.random() - 0.5) * 0.5 );
        this.position = this.velocity.timesScalar( dt ).plus( this.position );
      }
    },
    step: function( dt ) {
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
          //TODO: tune to get some particles in the middle, I guess that means turning up the repulsion
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
          this.velocity = this.velocity.minus( normal.times( 2 * normal.dot( this.velocity ) ) );
          bounced = true;
          break;
        }
      }
      //See if it crossed a barrier, and reflect it
      if ( !bounced ) {
        this.position.set( x2, y2 );
      }

      //Notify observers anyways so the electron will redraw at the right leg angle
      this.positionProperty.notifyObserversUnsafe();
    }
  } );
} );