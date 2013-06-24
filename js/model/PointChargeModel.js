// Copyright 2002-2013, University of Colorado

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge have location and value.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );

  var PointChargeModel = Fort.Model.extend(
    {
      defaults: {
        location: null
      },
      init: function( x, y, world ) {
        this.location = new Vector2( x, y );

        var bodyDef = new Box2D.Dynamics.b2BodyDef();
        var b2Body = Box2D.Dynamics.b2Body;
        var fixDef = new Box2D.Dynamics.b2FixtureDef();
        fixDef.density = 1.0;
        fixDef.friction = 0;
        fixDef.restitution = 0;

        //create some objects
        bodyDef.type = b2Body.b2_dynamicBody;
        fixDef.shape = new Box2D.Collision.Shapes.b2CircleShape( 7 //radius
        );
        bodyDef.position.x = x;
        bodyDef.position.y = y;
        var body = world.CreateBody( bodyDef );
        body.CreateFixture( fixDef );

        this.box2DInstance = body;

      },
      getCenter: function() {
        return new Vector2( this.location.x + this.radius, this.location.y + this.radius );
      },
      step : function() {
        var self = this;
        this.location = new Vector2(self.box2DInstance.m_xf.position.x,self.box2DInstance.m_xf.position.y);
      }

    }, {
      radius: 8,
      charge: -1
    } );

  return PointChargeModel;
} )
;
