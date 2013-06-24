/**
 * Copyright 2002-2013, University of Colorado
 * Author: Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );

  var b2Vec2 = Box2D.Common.Math.b2Vec2, b2BodyDef = Box2D.Dynamics.b2BodyDef, b2Body = Box2D.Dynamics.b2Body, b2FixtureDef = Box2D.Dynamics.b2FixtureDef, b2Fixture = Box2D.Dynamics.b2Fixture, b2World = Box2D.Dynamics.b2World, b2MassData = Box2D.Collision.Shapes.b2MassData, b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape, b2CircleShape = Box2D.Collision.Shapes.b2CircleShape, b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

  var Box2DModel = Fort.Model.extend(
    {
      defaults: {},
      init: function( verts ) {
        this.world = new b2World( new b2Vec2( 0, 0 ), true ); //gravity, allow sleep

        var fixDef = new b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0;
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
      },
      step: function( particles ) {
        this.applyForces( particles );
        this.world.Step( 1 / 2, 10, 10 ); //frame-rate, velocity iterations, position iterations
        this.world.ClearForces();
      },
      applyForces: function( particles ) {
        var self = this;
        particles.forEach( function( entry ) {
          var f = self.calculateSumOfForces( entry.box2DInstance, particles );
          entry.box2DInstance.ApplyForce( f, entry.box2DInstance.GetWorldCenter() );
        } );
      },
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
      getForce: function( body, entry ) {
        var k = 5;
        var force = new b2Vec2( 0, 0 );
        var distanceVector = body.GetWorldCenter().Copy();
        distanceVector.Subtract( entry.GetWorldCenter() );
        var distanceLength = distanceVector.Length();
        if ( distanceLength > 1 ) {
          distanceVector.Multiply( k / Math.pow( distanceLength, 2.5 ) );
          var max = 0.05;
          if ( distanceVector.Length() > max ) {
            distanceVector.Multiply( max / distanceVector.Length() );
          }
          force = distanceVector;
        }
        force.Multiply( 1000 );
        return force;
      }
    } );

  return Box2DModel;
} );
