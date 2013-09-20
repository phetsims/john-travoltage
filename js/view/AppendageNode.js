// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the leg of the model.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var JohnTravoltageImages = require( 'JOHN_TRAVOLTAGE/JohnTravoltageImages' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function AppendageNode( appendage, image, dx, dy, angleOffset, scene ) {
    var appendageNode = this;

    Node.call( this, { cursor: 'pointer'} );

    this.model = appendage;
    var angle = 0;

    // add the image
    var legImageNode = new Image( image );
    this.addChild( legImageNode );

    legImageNode.addInputListener( new SimpleDragHandler( {
      clickOffset: null, // x-offset between initial click and thumb's origin
      allowTouchSnag: true,
      start: function( event ) {
        this.clickOffset = legImageNode.globalToParentPoint( event.pointer.point ).minus( legImageNode.translation );
        appendageNode.border.visible = false;
      },
      drag: function( event ) {
        var globalPoint = legImageNode.globalToParentPoint( event.pointer.point );
//        console.log( globalPoint );
        mousePosition.translation = globalPoint;
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle();
        appendage.angle = angle;
      },
      end: function() {
      },
      translate: function() { /* do nothing, override default behavior */ }
    } ) );

    this.border = new Path( new Shape.roundRect( 0, 0, 140, 160, 10, 10 ), {
      x: appendage.position.x, y: appendage.position.y,
      stroke: '#f58220',
      lineWidth: 1,
      lineDash: [ 10, 10 ],
      pickable: false
    } );
    this.addChild( this.border );

    //changes visual position
    appendage.angleProperty.link( function updatePosition( angle ) {
      legImageNode.resetTransform();
      legImageNode.translate( appendage.position.x - dx, appendage.position.y - dy );
      legImageNode.rotateAround( appendage.position.plus( new Vector2( 0, 0 ) ), angle - angleOffset );
    } );

    //For debugging
    var origin = new Circle( 10, {fill: 'red', x: appendage.position.x, y: appendage.position.y, pickable: false} );
//    console.log( appendage.position.x, appendage.position.y );
    this.addChild( origin );

    var mousePosition = new Circle( 7, {fill: 'blue', x: 0, y: 0, pickable: false} );
    this.addChild( mousePosition );
  }

  return inherit( Node, AppendageNode ); // prototype chaining
} );