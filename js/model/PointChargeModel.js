// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge have location amd box2d instance
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function PointChargeModel( x, y, world ) {
    PropertySet.call( this, {
      location: new Vector2( x, y )
    } );

    var bodyDef = new Box2D.Dynamics.b2BodyDef();
    var b2Body = Box2D.Dynamics.b2Body;
    var fixDef = new Box2D.Dynamics.b2FixtureDef();
    fixDef.density = 1.0;
    fixDef.friction = 0;
    fixDef.restitution = 0;

    //create some objects
    bodyDef.type = b2Body.b2_dynamicBody;
    fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape( 1 //radius
    );
    bodyDef.position.x = x;
    bodyDef.position.y = y;

    var body = world.CreateBody( bodyDef );
    //to remove oscillation, friction
    body.m_linearDamping = 0.05;
    body.CreateFixture( fixDef );

    this.box2DInstance = body;
  }

  //statics
  PointChargeModel.radius = 8;
  PointChargeModel.charge = -1;

  return inherit( PropertySet, PointChargeModel, {
    getCenter: function() {
      return new Vector2( this.location.x + this.radius, this.location.y + this.radius );
    },
    step: function( globalModel ) {
      var self = this;
      var location = new Vector2( self.box2DInstance.m_xf.position.x, self.box2DInstance.m_xf.position.y );
      //check if we in arm or leg, we must rotate this
      if ( location.x > globalModel.leg.location.x && location.y > globalModel.leg.location.y ) {
        location = globalModel.leg.rotationCenter.plus( location.minus( globalModel.leg.rotationCenter ).rotated( globalModel.leg.rotationAngle ) );
      }
      else if ( location.x > globalModel.arm.location.x && location.y > globalModel.arm.location.y ) {
        location = globalModel.arm.rotationCenter.plus( location.minus( globalModel.arm.rotationCenter ).rotated( globalModel.arm.rotationAngle ) );
      }

      this.location = location;
    }

  } );
} );