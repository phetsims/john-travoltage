// Copyright 2013-2015, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Input = require( 'SCENERY/input/Input' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  //Compute the distance (in radians) between angles a and b, using an inlined dot product (inlined to remove allocations)
  var distanceBetweenAngles = function( a, b ) {
    var dotProduct = Math.cos( a ) * Math.cos( b ) + Math.sin( a ) * Math.sin( b );
    return Math.acos( dotProduct );
  };

  var radiansToScale = function ( radian, stepsInScale, radianOffset ) {
    var radianWithOffset = radian - radianOffset;
    var scaleValue = ( radianWithOffset ) * ( ( stepsInScale / 2 ) / Math.PI );

    return Math.round( scaleValue );
  };

  var scaleToRadians = function ( scaleValue, stepsInScale, radianOffset ) {
    var radian = scaleValue * ( Math.PI / ( stepsInScale / 2 ) );
    var radianWithOffset = radian + radianOffset;

    return radianWithOffset;
  };

  var scalePositionTransformation = function ( totalSteps, value ) {
    return ( totalSteps / 2 ) - value;
  };

  var angleToPosition = function ( appendageAngle, motionRange, maxPosition, radianOffset ) {
    var scaleValue = radiansToScale( appendageAngle, motionRange, radianOffset );
    var position = scalePositionTransformation( motionRange, scaleValue );
    return position > maxPosition ? position % maxPosition : position;
  };

  var positionToAngle = function ( position, motionRange, radianOffset ) {
    var scaleValue = scalePositionTransformation( motionRange, position );

    return scaleToRadians( scaleValue, motionRange, radianOffset );
  };

  var getPositionMessage = function ( position, template, rangeMap ) {
    var compiled = _.template( template );
    var message = '';

    _.forEach(rangeMap, function (map) {
      if (position >= map.range.min && position <= map.range.max) {
        message = map.text;
        return false;
      }
    });

    return compiled( { position: position, message: message } );
  };

  /**
   * @param {Leg|Arm} appendage the body part to display
   * @param {Image} image
   * @param {Number} dx
   * @param {Number} dy
   * @param {Number} angleOffset the angle about which to rotate
   * @param {Array} rangeMap - an array of objects of the format {range: {max: Number, min: Number}, text: String}. This
   *                           is used to map a position value to text to use for the valueText of the related slider.
   * @param {Object} options -  optional configuration such as "keyboardMidPointOffset"; which is used to adjust the
   *                 centre position of the HTML slider for keyboard accessibility. For example it can be used to
   *                 align the doorknob as the centre position of the arm slider.
   * @constructor
   */
  function AppendageNode( appendage, image, dx, dy, angleOffset, rangeMap, options ) {
    var appendageNode = this;

    Node.call( this, { cursor: 'pointer' } );

    this.model = appendage;
    var angle = 0;
    options = _.extend( { keyboardMidPointOffset: 0 }, options );

    // add the image
    var imageNode = new Image( image );
    this.addChild( imageNode );

    var lastAngle = appendage.angle;
    var currentAngle = appendage.angle;
    this.dragging = false;

    var limitLegRotation = function( angle ) {
      if ( angle < -Math.PI / 2 ) {
        angle = Math.PI;
      }
      else if ( angle > -Math.PI / 2 && angle < 0 ) {
        angle = 0;
      }
      return angle;
    };

    imageNode.addInputListener( new SimpleDragHandler( {
      allowTouchSnag: true,
      start: function( event ) {
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
          angle = limitLegRotation( angle );
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
        else if ( distanceBetweenAngles( appendage.angle, angle ) > Math.PI / 3 && ( appendage.angle === 0 || appendage.angle === Math.PI ) ) {
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
      var origin = new Circle( 22, {
        fill: '#080909',
        x: appendage.position.x,
        y: appendage.position.y,
        pickable: false
      } );
      this.addChild( origin );

      var mousePosition = new Circle( 7, { fill: 'blue', x: 0, y: 0, pickable: false } );
      this.addChild( mousePosition );
    }

    // Add accessible content for the appendageType
    this.setAccessibleContent( {
      createPeer: function( accessibleInstance ) {
        var appendageType = 'hand';

        var keyboardMotion = {
          min: 0,
          max: 100,
          step: 1,
          totalRange: 100
        };

        if( appendage instanceof Leg ) {
          appendageType = 'foot';
          keyboardMotion.max = 30;
          keyboardMotion.totalRange = 60;
        }

        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();

        var domElement = document.createElement( 'input' );
        domElement.setAttribute( 'role', 'slider' );
        domElement.setAttribute( 'type', 'range' );
        domElement.id = appendageType + '-slider-' + uniqueId;
        // Safari seems to require that a range input has a width, otherwise it will not be keyboard accessible.
        domElement.style.width = "1px";

        domElement.setAttribute( 'min', keyboardMotion.min );
        domElement.setAttribute( 'max', keyboardMotion.max );
        domElement.setAttribute( 'step', keyboardMotion.step );
        domElement.value = angleToPosition( appendage.angle, keyboardMotion.totalRange, keyboardMotion.max, options.keyboardMidPointOffset );

        // updates the model with changes from the PDOM
        domElement.addEventListener( 'input', function ( event ) {
          appendage.angle = positionToAngle( domElement.value, keyboardMotion.totalRange, options.keyboardMidPointOffset );
        } );

        // Updates the PDOM with changes in the model
        appendage.angleProperty.link( function updatePosition( angle ) {
          var position = angleToPosition( appendage.angle, keyboardMotion.totalRange, keyboardMotion.max, options.keyboardMidPointOffset );
          domElement.value = position;
          domElement.setAttribute( 'aria-valuetext', getPositionMessage(position, 'Position ${ position }: ${ message }', rangeMap) );
        } );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );
  }

  johnTravoltage.register( 'AppendageNode', AppendageNode );

  return inherit( Node, AppendageNode );
} );
