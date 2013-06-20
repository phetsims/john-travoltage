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

  function LegNode( model ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = model.location.x;
    this.y = model.location.y;


    this.addInputListener( {
      down: function( event ) {
      },

      // mouseup or touchend (pointer lifted from over the node)
      up: function( event ) {
      },

      // mousemove (fired AFTER enter/exit events if applicable)
      move: function( event ) {

      }
    } );

    // add the Balloon image
    this.addChild( new Image( 'images/leg.png' ) );

    //changes visual position
    model.link( 'rotationAngle', function updateLocation( angle ) {


    } );

  }

  inherit( Node, LegNode ); // prototype chaining

  return LegNode;
} );