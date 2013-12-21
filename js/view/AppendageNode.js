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

  //Compute the distance (in radians) between angles a and b, using an inlined dot product (inlined to remove allocations)
  var distanceBetweenAngles = function( a, b ) {
    var dotProduct = Math.cos( a ) * Math.cos( b ) + Math.sin( a ) * Math.sin( b );
    return Math.acos( dotProduct );
  };

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

    var lastAngle = appendage.angle;
    var currentAngle = appendage.angle;
    imageNode.addInputListener( new SimpleDragHandler( {
      clickOffset: null, // x-offset between initial click and thumb's origin
      allowTouchSnag: true,
      start: function( event ) {
        this.clickOffset = imageNode.globalToParentPoint( event.pointer.point ).minus( imageNode.translation );
        appendageNode.border.visible = false;
        appendageNode.dragging = true;
      },
      drag: function( event ) {
        lastAngle = currentAngle;
        var globalPoint = imageNode.globalToParentPoint( event.pointer.point );
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle();
        currentAngle = angle;

        //Limit leg to approximately "half circle" so it cannot spin around, see #63
        if ( appendage instanceof Leg ) {
          if ( angle < -Math.PI / 2 ) {
            angle = Math.PI;
          }
          else if ( angle > -Math.PI / 2 && angle < 0 ) {
            angle = 0;
          }
        }

        //if clamped at one of the upper angles, only allow the right direction of movement to change the angle, so it won't skip halfway around
        //Use 3d cross products to compute direction
        //Inline the vector creations and dot product for performance
        var z = Math.cos( currentAngle ) * Math.sin( lastAngle ) - Math.sin( currentAngle ) * Math.cos( lastAngle );

        if ( appendage.angle === Math.PI && z < 0 ) {
          //noop, at the left side
        }
        else if ( appendage.angle === 0 && z > 0 ) {
          //noop, at the right side
        }
        else if ( distanceBetweenAngles( appendage.angle, angle ) > Math.PI / 3 ) {
          //noop, too big a leap, may correspond to the user reversing direction after a leg is stuck against threshold
        }
        else {
          appendage.angle = angle;
        }

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