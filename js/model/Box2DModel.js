// Copyright 2002-2013, University of Colorado Boulder

/**
 * Box2D physical model. Calculates position of electrons within physical body.
 * Calculates electical force and then motion along forcelines, when discharge happens
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Box2DModel( verts, forceLines ) {
    PropertySet.call( this, {
      isSpark: false
    } );

//    fixDef.shape = new B2PolygonShape();
//    for ( var i = 0; i < verts.length - 1; i++ ) {
//      //create ground
//      var vert1 = new B2Vec2( verts[i][0], verts[i][1] );
//      var vert2 = new B2Vec2( verts[i + 1][0], verts[i + 1][1] );
//
//      fixDef.shape = new B2PolygonShape();
//      fixDef.shape.SetAsEdge( vert1, vert2 );
//      //fixDef.shape.SetAsBox(10, 0.5);
//      var body = this.world.CreateBody( bodyDef );
//      body.CreateFixture( fixDef );
//    }
    //forcelines lines - when spark happens we use it to calculate motion of electrons
    this.forceLines = forceLines;
  }

  return inherit( PropertySet, Box2DModel, {
    step: function( globalModel ) {
      //calculate all forces on particles
//      this.applyForces( globalModel );
//      this.world.Step( 1 / 2, 32, 2 ); //frame-rate, velocity iterations, position iterations
//      //more about this params and using http://box2d.org/manual.pdf paragraph 2.4
//      //clear forces
//      this.world.ClearForces();
    },
    //apply forces to each particle
    applyForces: function( globalModel ) {
//      var self = this;
//      //if spark - we use forcelines, else electical field from other particles
//      if ( this.isSpark ) {
//        globalModel.electrons.forEach( function( entry ) {
//          //find closest forceline and calculate force
//          var force = self.getDischargeForce( entry.box2DInstance );
//          entry.box2DInstance.ApplyForce( force, entry.box2DInstance.GetWorldCenter() );
//          //if near finger - remove particle
//          if ( globalModel.arm.getFingerposition().distance( entry.position ) < 30 ) {
//            entry.removed = true;
//          }
//        } );
//      }
//      else {
//        globalModel.electrons.forEach( function( entry ) {
//          //sum of forces from other particles
//          var force = self.calculateSumOfForces( entry.box2DInstance, globalModel.electrons );
//          entry.box2DInstance.ApplyForce( force, entry.box2DInstance.GetWorldCenter() );
//        } );
//      }

    },
    //get sum of electrical forces to body from other particles
    calculateSumOfForces: function( body, particles ) {
//      var self = this;
//      var sumVector = new B2Vec2();
//      particles.forEach( function( entry ) {
//        if ( body !== entry.box2DInstance ) {
//          sumVector.Add( self.getForce( body, entry.box2DInstance ) );
//        }
//      } );
//      return sumVector;
      return {};
    },
    //get single force between two particles
    getForce: function( body, entry ) {
//      var k = 5;
//      var force = new B2Vec2( 0, 0 );
//      var distanceVector = body.GetWorldCenter().Copy();
//      distanceVector.Subtract( entry.GetWorldCenter() );
//      var distanceLength = distanceVector.Length();
//      if ( distanceLength > 1 ) {
//        distanceVector.Multiply( 1000 * k / Math.pow( distanceLength, 2.5 ) );
//        var max = 0.05;
//        if ( distanceVector.Length() > max ) {
//          distanceVector.Multiply( max / distanceVector.Length() );
//        }
//        return distanceVector;
//      }
//      else {
//        force.Multiply( 1000 );
//        return force;
//      }
      return {};
    },
    //when we got spark, electrons moved to finger
    //calculate force along forceline
    getDischargeForce: function( body ) {
      var bodyPosition = new Vector2( body.m_xf.position.x, body.m_xf.position.y );
      //get closest forceline nad apply force to particle
      var closest = this.getClosestForceLine( bodyPosition );
      var vec = new Vector2( closest[2], closest[3] ).minus( bodyPosition );
      var k = 30;
      var v = vec.times( (k / Math.pow( vec.magnitude(), 1 )) / vec.magnitude() );
      var max = 10;
      if ( v.magnitude() > max ) {
        v = vec.times( (max) / vec.magnitude() );
      }

      return v.times( 1000 );
    },
    //find closest forceline
    getClosestForceLine: function( position ) {
      var closest = null;
      var closestDist = Number.POSITIVE_INFINITY;
      for ( var i = 0; i < this.forceLines.length; i++ ) {
        var dist = new Vector2( this.forceLines[i][0], this.forceLines[i][1] ).distance( position );
        if ( dist < closestDist ) {
          closest = this.forceLines[i];
          closestDist = dist;
        }
      }
      return closest;
    }
  } );
} );