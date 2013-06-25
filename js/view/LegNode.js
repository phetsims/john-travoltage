// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the leg of the model.
 @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  function LegNode( model, scene ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = model.location.x;
    this.y = model.location.y;

    this.model = model;

    this.addInputListener( {
      down: function( event ) {
        scene.rotationObject = self;
      }
    } );

    // add the Balloon image
    this.addChild( new Image( 'images/leg.png' ) );

    //changes visual position
    model.link( 'rotationAngle', function updateLocation( angle ) {
      self.rotation = angle;
      //save angle history
      model.angleHistory[0] = model.angleHistory[1];
      model.angleHistory[2] = model.angleHistory[2];
      model.angleHistory[2] = angle;
    } );

  }

  inherit( Node, LegNode ); // prototype chaining

  return LegNode;
} );