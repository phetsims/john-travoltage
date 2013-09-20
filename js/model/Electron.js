// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge has a position and box2d instance.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Electron( x, y, world ) {
    PropertySet.call( this, {
      position: new Vector2( x, y )
    } );

    //create physical model of pointcharge
//    var bodyDef = new Box2D.Dynamics.b2BodyDef();
//    var b2Body = Box2D.Dynamics.b2Body;
//    var fixDef = new Box2D.Dynamics.b2FixtureDef();
//    fixDef.density = 1.0;
//    fixDef.friction = 0;
//    fixDef.restitution = 0;

    //create some objects
//    bodyDef.type = b2Body.b2_dynamicBody;
//    fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape( 1 //radius
//    );
//    bodyDef.position.x = x;
//    bodyDef.position.y = y;

//    var body = world.CreateBody( bodyDef );
//    //to remove oscillation, friction
//    body.m_linearDamping = 0.05;
//    body.CreateFixture( fixDef );
//
//    this.box2DInstance = body;
  }

  //statics
  Electron.radius = 8;
  Electron.charge = -1;

  return inherit( PropertySet, Electron, {
    step: function( globalModel ) {
//      var self = this;
//      var position = new Vector2( self.box2DInstance.m_xf.position.x, self.box2DInstance.m_xf.position.y );
//      //check if we in arm or leg, we must rotate this to keep charge inside arm/leg
//      if ( position.x > globalModel.leg.position.x && position.y > globalModel.leg.position.y ) {
//        position = globalModel.leg.rotationCenter.plus( position.minus( globalModel.leg.rotationCenter ).rotated( globalModel.leg.rotationAngle ) );
//      }
//      else if ( position.x > globalModel.arm.position.x && position.y > globalModel.arm.position.y ) {
//        position = globalModel.arm.rotationCenter.plus( position.minus( globalModel.arm.rotationCenter ).rotated( globalModel.arm.rotationAngle ) );
//      }
//
//      this.position = position;
    }

  } );
} );