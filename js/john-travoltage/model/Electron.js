// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge has a position and box2d instance.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ObservableVector2 = require( 'DOT/ObservableVector2' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );

  // constants
  var count = 0;

  //If this value is 1.0, there is no friction.  The value is what the velocity is multiplied by at every step.
  var frictionFactor = 0.98;

  function Electron( x, y, model, tandem ) {
    count++;
    this.id = count;
    this.positionProperty = new ObservableVector2( x, y );

    //The velocity an electron has when it comes from the carpet into the leg.
    this.velocity = new Vector2( -50, -100 );
    this.model = model;
    this.exiting = false;//mutable but not observable

    //Segment the electron is traveling towards
    this.segment = null;

    //Store some values that are used in an inner loop
    this.maxSpeed = 500;
    this.maxForceSquared = 100000000;

    tandem.addInstance( this );

    this.tandem = tandem;
  }

  //Radius of the electron
  Electron.radius = 8;

  return inherit( Object, Electron, {
    stepInSpark: function( dt ) {
      var electron = this;
      //move to closest line segment
      if ( !this.segment ) {

        this.segment = _.min( this.model.forceLines, function( forceLine ) { return forceLine.p0.distanceSquared( electron.positionProperty.get() ); } );

        //If the closest path is the same as the last one, it means we have reached the end of the road
        if ( this.lastSegment === this.segment ) {

          //Don't remove immediately or it will be concurrentmodificationexception in iterator
          this.model.electronsToRemove.push( electron );
          return;
        }
      }
      //move at constant velocity toward the segment
      var target = this.segment.p1;
      var current = this.positionProperty.get();
      var delta = target.minus( current );

      //Arrived at destination, go to the next segment
      if ( delta.magnitude() <= 100 * dt ) {
        this.lastSegment = this.segment;
        this.segment = null;
      }
      else {

        //Send toward the end point on the segment, but with some randomness to make it look more realistic.
        //If the electron moves outside the body, it will be corrected in JohnTravoltageModel.moveElectronInsideBody
        this.velocity = Vector2.createPolar( 200, delta.angle() + (Math.random() - 0.5) );
        this.positionProperty.set( this.velocity.timesScalar( dt ).plus( this.positionProperty.get() ) );
      }
    },
    step: function( dt ) {
      if ( this.exiting ) {
        this.stepInSpark( dt );
      }
      else {
        this.stepInBody( dt );
      }
    },
    dispose: function() {
      this.tandem.removeInstance( this );
    },
    stepInBody: function( dt ) {

      //Performance is critical in this method, so avoid es5 which can be slower
      var position = this.positionProperty.get();

      var x1 = position.x;
      var y1 = position.y;

      var netForceX = 0;
      var netForceY = 0;

      //Compute the net force on each electron from pairwise repulsion.  This stabilizes the motion and pushes
      //the electrons to the outer boundary of the bodies
      //This is an expensive O(n^2) inner loop, so highly optimized and uses Number instead of Vector2 in a number of locations
      var length = this.model.electrons.length;
      for ( var i = 0; i < length; i++ ) {
        var electron = this.model.electrons.get( i );

        //Skipping some interactions speeds things up and also gives a good sense of more randomness
        if ( electron !== this && Math.random() < 0.4 ) {

          //Using direct get method instead of ES5 getter to improve performance in this inner loop
          //ES5 getter shows up as expensive in this inner loop (7% out of 30%), so skip it and only get the position once
          var electronPosition = electron.positionProperty.get();

          var deltaVectorX = electronPosition.x - position.x;
          var deltaVectorY = electronPosition.y - position.y;

          //If the electrons are directly on top of one another (can be caused by moving them inside the body bounds when a spark is cancelled), then skip this computation
          if ( deltaVectorX && deltaVectorY ) {

            //Good luck tuning these magic numbers!
            //Tuning the power to a smaller number increases long range interactions.
            //Tuning the coefficient to a higher number increases the strength of interaction at any distance.
            var scale = 12000 / Math.pow( electronPosition.distance( position ), 3 );
            var fx = deltaVectorX * scale;
            var fy = deltaVectorY * scale;
            var forceMagnitudeSquared = fx * fx + fy * fy;
            if ( forceMagnitudeSquared > this.maxForceSquared ) {
              fx = fx / this.maxForceSquared;
              fy = fy / this.maxForceSquared;
            }
            netForceX = netForceX - fx;
            netForceY = netForceY - fy;
          }
        }
      }

      var vx2 = this.velocity.x + netForceX * dt;
      var vy2 = this.velocity.y + netForceY * dt;

      var d = Math.sqrt( vx2 * vx2 + vy2 * vy2 );

      if ( d > this.maxSpeed ) {
        vx2 = vx2 / d * this.maxSpeed;
        vy2 = vy2 / d * this.maxSpeed;
      }
      vx2 = vx2 * frictionFactor;
      vy2 = vy2 * frictionFactor;

      var x2 = x1 + vx2 * dt;
      var y2 = y1 + vy2 * dt;

      //Skipping notifications here because nobody needs to observe the velocity values, and this is faster (no allocation)
      this.velocity.setXY( vx2, vy2 );

      var segments = this.model.getLineSegments();
      var numSegments = segments.length;
      var bounced = false;
      for ( i = 0; i < numSegments; i++ ) {
        var segment = segments[ i ];
        if ( Util.lineSegmentIntersection( x1, y1, x2, y2, segment.x1, segment.y1, segment.x2, segment.y2 ) ) {

          var normal = segment.normalVector;

          //reflect velocity, but lose some of the energy in the bounce to help keep the electrons near the walls and help them lose energy quicker
          //The Safari 6.0 heisenbug exhibits here if you use es5, so use property.get() instead
          this.velocity = this.velocity.minus( normal.times( 2 * normal.dot( this.velocity ) ) ).timesScalar( 0.8 );
          bounced = true;
          break;
        }
      }
      //See if it crossed a barrier, and reflect it
      if ( !bounced ) {

        //Note, this does not send notifications because it is setting the x,y values on the vector itself
        this.positionProperty.x = x2;
        this.positionProperty.y = y2;
      }

      //Notify observers anyways so the electron will redraw at the right leg angle
      this.positionProperty.notifyObserversStatic();
    }
  } );
} );