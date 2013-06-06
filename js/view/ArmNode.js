// Copyright 2002-2013, University of Colorado

/**
 * Scenery display object (scene graph node) for the arm of the model.
 @author Vasily Shakhov (Mlearner)
 */

define( function( require ) {
  'use strict';
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  function ArmNode( model ) {
    var self = this;

    // super constructor
    Node.call( this, { cursor: 'pointer' } );

    this.x = model.location.x;
    this.y = model.location.y;

    var armDragHandler = new SimpleDragHandler( {
                                                  //When dragging across it in a mobile device, pick it up
                                                  allowTouchSnag: true,
                                                  start: function( args, args1 ) {
                                                  },
                                                  end: function() {
                                                  },
                                                  //Translate on drag events
                                                  translate: function( args ) {
                                                    //TODO not working!
                                                    //When dragging, calculate angle
                                                    // cos(a) = AB * AC / (|AB| * |AC|)
                                                    var vector = new Vector2( args.position.x - args.oldPosition.x, args.position.y - args.oldPosition.y );

                                                    var deltaAngle = vector.angle();
                                                    model.rotationAngle += deltaAngle;
                                                    self.rotateAround( model.rotationCenter, deltaAngle );
                                                    //args.position
                                                  }
                                                } );

    this.addInputListener( armDragHandler );

    // add the Balloon image
    this.addChild( new Image( 'images/arm.png' ) );

    //changes visual position
    model.link( 'rotationAngle', function updateLocation( angle ) {


    } );

  }

  inherit( Node, ArmNode ); // prototype chaining

  return ArmNode;
} );