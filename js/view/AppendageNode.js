// Copyright 2002-2013, University of Colorado Boulder

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
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
  var Leg = require( 'JOHN_TRAVOLTAGE/model/Leg' );

  /**
   * @param {Leg|Arm} appendage the body part to display
   * @param {Image} image
   * @param {Number} dx
   * @param {Number} dy
   * @param {Number} angleOffset the angle about which to rotate
   * @constructor
   */
  function AppendageNode( appendage, image, dx, dy, angleOffset ) {
    var appendageNode = this;

    Node.call( this, { cursor: 'pointer'} );

    this.model = appendage;
    var angle = 0;

    // add the image
    var imageNode = new Image( image );
    this.addChild( imageNode );

    imageNode.addInputListener( new SimpleDragHandler( {
      clickOffset: null, // x-offset between initial click and thumb's origin
      allowTouchSnag: true,
      start: function( event ) {
        this.clickOffset = imageNode.globalToParentPoint( event.pointer.point ).minus( imageNode.translation );
        appendageNode.border.visible = false;
        appendageNode.dragging = true;
      },
      drag: function( event ) {
        var globalPoint = imageNode.globalToParentPoint( event.pointer.point );
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle();

        //Limit leg to approximately "half circle" so it cannot spin around, see #63
        if ( appendage instanceof Leg ) {
          if ( angle < -Math.PI / 2 ) {
            angle = Math.PI;
          }
          else if ( angle > -Math.PI / 2 && angle < 0 ) {
            angle = 0;
          }
        }

        appendage.angle = angle;
      },
      end: function() {
        appendageNode.dragging = false;
      }
    } ) );

    //changes visual position
    appendage.angleProperty.link( function updatePosition( angle ) {
      imageNode.resetTransform();
      imageNode.translate( appendage.position.x - dx, appendage.position.y - dy );
      imageNode.rotateAround( appendage.position.plus( new Vector2( 0, 0 ) ), angle - angleOffset );
    } );

    this.border = new Rectangle( this.bounds.minX, this.bounds.minY, this.width, this.height, 10, 10, {
      stroke: 'green',
      lineWidth: 2,
      lineDash: [ 10, 10 ],
      pickable: false
    } );
    this.addChild( this.border );

    //For debugging
    var debugging = false;
    if ( debugging ) {
      var origin = new Circle( 22, {fill: '#080909', x: appendage.position.x, y: appendage.position.y, pickable: false} );
      this.addChild( origin );

      var mousePosition = new Circle( 7, {fill: 'blue', x: 0, y: 0, pickable: false} );
      this.addChild( mousePosition );
    }
  }

  return inherit( Node, AppendageNode );
} );