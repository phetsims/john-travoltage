// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function AppendageNode( model, appendage, image, dx, dy, angleOffset, scene ) {
    var appendageNode = this;

    Node.call( this, { cursor: 'pointer'} );

    this.model = appendage;
    var angle = 0;

    // add the image
    var legImageNode = new Image( image );
    this.addChild( legImageNode );

    model.on( 'reset', function() {appendageNode.border.visible = true;} );

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
//        mousePosition.translation = globalPoint;
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle();
        appendage.angle = angle;
      },
      end: function() {
      },
      translate: function() { /* do nothing, override default behavior */ }
    } ) );

    //changes visual position
    appendage.angleProperty.link( function updatePosition( angle ) {
      legImageNode.resetTransform();
      legImageNode.translate( appendage.position.x - dx, appendage.position.y - dy );
      legImageNode.rotateAround( appendage.position.plus( new Vector2( 0, 0 ) ), angle - angleOffset );
    } );

    this.border = new Rectangle( this.bounds.minX, this.bounds.minY, this.width, this.height, 10, 10, {
      stroke: 'green',
      lineWidth: 2,
      lineDash: [ 10, 10 ],
      pickable: false
    } );
    this.addChild( this.border );

    //For debugging
//    var origin = new Circle( 22, {fill: '#080909', x: appendage.position.x, y: appendage.position.y, pickable: false} );
//    this.addChild( origin );
//
//    var mousePosition = new Circle( 7, {fill: 'blue', x: 0, y: 0, pickable: false} );
//    this.addChild( mousePosition );
  }

  return inherit( Node, AppendageNode );
} );