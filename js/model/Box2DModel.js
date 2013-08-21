// Copyright 2002-2013, University of Colorado Boulder

/**
 * Box2D physical model. Calculates position of electrons within physical body.
 * Calculates electical force and then motion along forcelines, when discharge happens
 * Author: Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  var
    b2Vec2 = Box2D.Common.Math.b2Vec2,
    b2BodyDef = Box2D.Dynamics.b2BodyDef,
    b2Body = Box2D.Dynamics.b2Body,
    b2FixtureDef = Box2D.Dynamics.b2FixtureDef,
    b2World = Box2D.Dynamics.b2World,
    b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;

  function Box2DModel( verts, forceLines ) {
    PropertySet.call( this, {
      isSpark: false
    } );

    //creation of new world, full manual http://box2d.org/manual.pdf
    this.world = new b2World( new b2Vec2( 0, 0 ), true ); //gravity, allow sleep

    //params of border of the body
    var fixDef = new b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 100;
    fixDef.restitution = 0;

    var bodyDef = new b2BodyDef();

    //create body border
    bodyDef.type = b2Body.b2_staticBody;
    bodyDef.position.x = 255;
    bodyDef.position.y = -135;
    fixDef.shape = new b2PolygonShape();
    for ( var i = 0; i < verts.length - 1; i++ ) {
      //create ground
      var vert1 = new b2Vec2( verts[i][0], verts[i][1] );
      var vert2 = new b2Vec2( verts[i + 1][0], verts[i + 1][1] );

      fixDef.shape = new b2PolygonShape();
      fixDef.shape.SetAsEdge( vert1, vert2 );
      //fixDef.shape.SetAsBox(10, 0.5);
      var body = this.world.CreateBody( bodyDef );
      body.CreateFixture( fixDef );
    }
    //forcelines lines - when spark happens we use it to calculate motion of electrons
    this.forceLines = forceLines;
  }

  return inherit( PropertySet, Box2DModel, {
    step: function( globalModel ) {
      //calculate all forces on particles
      this.applyForces( globalModel );
      this.world.Step( 1 / 2, 32, 2 ); //frame-rate, velocity iterations, position iterations
      //more about this params and using http://box2d.org/manual.pdf paragraph 2.4
      //clear forces
      this.world.ClearForces();
    },
    //apply forces to each particle
    applyForces: function( globalModel ) {
      var self = this;
      //if spark - we use forcelines, else electical field from other particles
      if ( this.isSpark ) {
        globalModel.particles.forEach( function( entry ) {
          //find closest forceline and calculate force
          var force = self.getDischargeForce( entry.box2DInstance );
          entry.box2DInstance.ApplyForce( force, entry.box2DInstance.GetWorldCenter() );
          //if near finger - remove particle
          if ( globalModel.arm.getFingerLocation().distance( entry.location ) < 30 ) {
            entry.removed = true;
          }
        } );
      }
      else {
        globalModel.particles.forEach( function( entry ) {
          //sum of forces from other particles
          var force = self.calculateSumOfForces( entry.box2DInstance, globalModel.particles );
          entry.box2DInstance.ApplyForce( force, entry.box2DInstance.GetWorldCenter() );
        } );
      }

    },
    //get sum of electrical forces to body from other particles
    calculateSumOfForces: function( body, particles ) {
      var self = this;
      var sumVector = new b2Vec2();
      particles.forEach( function( entry ) {
        if ( body !== entry.box2DInstance ) {
          sumVector.Add( self.getForce( body, entry.box2DInstance ) );
        }
      } );
      return sumVector;
    },
    //get single force between two particles
    getForce: function( body, entry ) {
      var k = 5;
      var force = new b2Vec2( 0, 0 );
      var distanceVector = body.GetWorldCenter().Copy();
      distanceVector.Subtract( entry.GetWorldCenter() );
      var distanceLength = distanceVector.Length();
      if ( distanceLength > 1 ) {
        distanceVector.Multiply( 1000 * k / Math.pow( distanceLength, 2.5 ) );
        var max = 0.05;
        if ( distanceVector.Length() > max ) {
          distanceVector.Multiply( max / distanceVector.Length() );
        }
        return distanceVector;
      }
      else {
        force.Multiply( 1000 );
        return force;
      }
    },
    //when we got spark, electrons moved to finger
    //calculate force along forceline
    getDischargeForce: function( body ) {
      var bodyLocation = new Vector2( body.m_xf.position.x, body.m_xf.position.y );
      //get closest forceline nad apply force to particle
      var closest = this.getClosestForceLine( bodyLocation );
      var vec = new Vector2( closest[2], closest[3] ).minus( bodyLocation );
      var k = 30;
      var v = vec.times( (k / Math.pow( vec.magnitude(), 1 )) / vec.magnitude() );
      var max = 10;
      if ( v.magnitude() > max ) {
        v = vec.times( (max) / vec.magnitude() );
      }

      return v.times( 1000 );
    },
    //find closest forceline
    getClosestForceLine: function( location ) {
      var closest = null;
      var closestDist = Number.POSITIVE_INFINITY;
      for ( var i = 0; i < this.forceLines.length; i++ ) {
        var dist = new Vector2( this.forceLines[i][0], this.forceLines[i][1] ).distance( location );
        if ( dist < closestDist ) {
          closest = this.forceLines[i];
          closestDist = dist;
        }
      }
      return closest;
    }
  } );
} );