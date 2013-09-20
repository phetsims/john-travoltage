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
  var JohnTravoltageImages = require( 'JohnTravoltageImages' );
  var Circle = require( 'SCENERY/nodes/Circle' );

  function LegNode( leg, scene ) {
    var legNode = this;

    // super constructor
    var dx = 25;
    var dy = 28;
    Node.call( this, { cursor: 'pointer'} );

    this.model = leg;
    var angle = 0;

    // add the image
    var legImageNode = new Image( JohnTravoltageImages.getImage( 'leg.png' ) );
    this.addChild( legImageNode );

    legImageNode.addInputListener( new SimpleDragHandler( {
      clickOffset: null, // x-offset between initial click and thumb's origin
      allowTouchSnag: true,
      start: function( event ) {
        this.clickOffset = legImageNode.globalToParentPoint( event.pointer.point ).minus( legImageNode.translation );
        legNode.border.visible = false;
      },
      drag: function( event ) {
        var globalPoint = legImageNode.globalToParentPoint( event.pointer.point );
        mousePosition.translation = globalPoint;
        angle = globalPoint.minus( new Vector2( leg.position.x, leg.position.y ) ).angle();
        leg.angle = angle;
      },
      end: function() {
      },
      translate: function() { /* do nothing, override default behavior */ }
    } ) );

    this.border = new Path( new Shape.roundRect( 0, 0, 140, 160, 10, 10 ), {
      x: leg.position.x, y: leg.position.y,
      stroke: '#f58220',
      lineWidth: 1,
      lineDash: [ 10, 10 ],
      pickable: false
    } );
    this.addChild( this.border );

    //changes visual position
    leg.angleProperty.link( function updatePosition( angle ) {
      legImageNode.resetTransform();
      legImageNode.translate( leg.position.x - dx, leg.position.y - dy );
      legImageNode.rotateAround( leg.position.plus( new Vector2( 0, 0 ) ), angle - Math.PI / 2 * 0.7 );
    } );

    //For debugging
    var origin = new Circle( 10, {fill: 'red', x: leg.position.x, y: leg.position.y} );
    console.log( leg.position.x, leg.position.y );
    this.addChild( origin );

    var mousePosition = new Circle( 7, {fill: 'blue', x: 0, y: 0} );
    this.addChild( mousePosition );
  }

  return inherit( Node, LegNode ); // prototype chaining
} );