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
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Vector2 = require( 'DOT/Vector2' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var Util = require( 'DOT/Util' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var FocusOverlay = require( 'SCENERY/overlays/FocusOverlay' );
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );
  var Sound = require( 'VIBE/Sound' );
  var TandemSimpleDragHandler = require( 'TANDEM/scenery/input/TandemSimpleDragHandler' );

  // audio
  var limitBonkAudio = require( 'audio!JOHN_TRAVOLTAGE/limit-bonk' );

  /**
   * @param {Appendage} appendage the body part to display
   * @param {Image} image
   * @param {number} dx
   * @param {number} dy
   * @param {number} angleOffset the angle about which to rotate
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {Array} rangeMap - an array of objects of the format {range: {max: Number, min: Number}, text: String}. This
   *                           is used to map a position value to text to use for the valueText of the related slider.
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function AppendageNode( appendage, image, dx, dy, angleOffset, soundEnabledProperty, rangeMap, tandem, options ) {
    var self = this;

    options = _.extend( {
      cursor: 'pointer',

      // a11y
      tagName: 'input',
      inputType: 'range',
      ariaRole: 'slider',
      focusable: true,
      parentContainerTagName: 'div',
      keyboardMidPointOffset: 0, // adjust center position of accessible slider, to align important locations at center

    }, options );

    Node.call( this, options );

    // @private
    this.model = appendage;
    this.dragging = false;
    this.keyboardMidPointOffset = options.keyboardMidPointOffset;
    this.rangeMap = rangeMap;

    // @a11y @public (read-only), description for this arm, publicly visible so that it can be used elsewhere
    this.positionDescription = '';

    // @private add the image
    this.imageNode = new Image( image, {
      tandem: tandem.createTandem( 'imageNode' )
    } );
    this.addChild( this.imageNode );

    // create the sound that will be played when the motion range is reached
    var limitBonkSound = new Sound( limitBonkAudio );

    var lastAngle = appendage.angleProperty.get();
    var currentAngle = appendage.angleProperty.get();

    // no need for dispose - exists for life of sim
    var angle = 0;
    this.imageNode.addInputListener( new TandemSimpleDragHandler( {
      tandem: tandem.createTandem( 'dragHandler' ),
      allowTouchSnag: true,
      start: function( event ) {

        // if the appendage has focus, blur when it is picked up
        self.focussed && self.blur();

        // if the appendage is picked up with the mouse, it should not be keyboard focusable until dropped
        self.focusable = false;

        appendage.borderVisibleProperty.set( false );
        self.dragging = true;
      },
      drag: function( event ) {
        lastAngle = currentAngle;
        var globalPoint = self.imageNode.globalToParentPoint( event.pointer.point );
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle();
        currentAngle = angle;

        //Limit leg to approximately "half circle" so it cannot spin around, see #63
        if ( appendage instanceof Leg ) {
          angle = AppendageNode.limitLegRotation( angle );

          if ( JohnTravoltageQueryParameters.sonification !== 'none' && soundEnabledProperty.value ) {
            // play a sound when the range of motion is reached
            if ( ( angle === 0 && lastAngle > 0 ) ||
                 ( angle === Math.PI && lastAngle > 0 && lastAngle < Math.PI ) ) {
              limitBonkSound.play();
            }
          }
        }

        // if clamped at one of the upper angles, only allow the right direction of movement to change the angle, so it won't skip halfway around
        // Use 3d cross products to compute direction
        // Inline the vector creations and dot product for performance
        var z = Math.cos( currentAngle ) * Math.sin( lastAngle ) - Math.sin( currentAngle ) * Math.cos( lastAngle );

        if ( appendage.angleProperty.get() === Math.PI && z < 0 ) {
          // noop, at the left side
        }
        else if ( appendage.angleProperty.get() === 0 && z > 0 ) {
          // noop, at the right side
        }
        else if ( AppendageNode.distanceBetweenAngles( appendage.angleProperty.get(), angle ) > Math.PI / 3 && ( appendage.angleProperty.get() === 0 || appendage.angleProperty.get() === Math.PI ) ) {
          //noop, too big a leap, may correspond to the user reversing direction after a leg is stuck against threshold
        }
        else {
          appendage.angleProperty.set( angle );
        }

      },
      end: function() {
        self.dragging = false;

        // when we are done dragging with the mouse, place back in tab order
        self.focusable = true;
      }
    } ) );

    // changes visual position
    appendage.angleProperty.link( function( angle ) {
      self.imageNode.resetTransform();
      self.imageNode.translate( appendage.position.x - dx, appendage.position.y - dy );
      self.imageNode.rotateAround( appendage.position.plus( new Vector2( 0, 0 ) ), angle - angleOffset );
    } );

    // @public
    this.border = new Rectangle( this.bounds.minX, this.bounds.minY, this.width, this.height, 10, 10, {
      stroke: 'green',
      lineWidth: 2,
      lineDash: [ 10, 10 ],
      pickable: false,
      tandem: tandem.createTandem( 'border' )
    } );
    this.addChild( this.border );

    // link node visibility to Property - no need to dispose
    appendage.borderVisibleProperty.linkAttribute( this.border, 'visible' );

    // a11y
    this.focusHighlight = new Circle( this.imageNode.width / 2, {
      stroke: FocusOverlay.innerFocusColor,
      lineWidth: 5,
      tandem: tandem.createTandem( 'focusCircle' )
    } );

    // @private limit ranges of input for the leg
    this.keyboardMotion = {
      min: appendage instanceof Leg ? -15 : -30, 
      max: appendage instanceof Leg ? 15 : 30,
      step: 1,
      totalRange: appendage instanceof Leg ? 30 : 60
    };

    // angles for each of the appendages that determine limitations to rotation
    var angleMotion = {
      min: appendage instanceof Leg ? Math.PI : -Math.PI,
      max: appendage instanceof Leg ? 0 : Math.PI
    };

    // @private - linear function that will map appendage angle to input value for accessibility, rotation of the arm
    // is inversely mapped to the range of the keyboard input.  The arm has an offset that does not fit in this mapping,
    // but it is more convenient to use these maps since the drag handler set position in range of -PI to PI.
    this.linearFunction = appendage instanceof Leg ?
                          new LinearFunction( angleMotion.min, angleMotion.max, this.keyboardMotion.min, this.keyboardMotion.max ) :
                          new LinearFunction( angleMotion.min, angleMotion.max, this.keyboardMotion.max, this.keyboardMotion.min );

    // set the initial input range values
    var rangeValue = AppendageNode.angleToPosition( appendage.angleProperty.get(), this.linearFunction, this.keyboardMidPointOffset );
    this.setInputValue( rangeValue );

    this.setAccessibleAttribute( 'min', this.keyboardMotion.min );
    this.setAccessibleAttribute( 'max', this.keyboardMotion.max );
    this.setAccessibleAttribute( 'step', this.keyboardMotion.step );

    // set up a relationship between the appendage and the 'status' alert so that JAWS users can quickly navigate
    // to the status element after interacting with the appendage
    this.setAccessibleAttribute( 'aria-controls', AriaHerald.POLITE_STATUS_ELEMENT_ID );

    // Due to the variability of input and changes event firing across browsers, it is necessary to track if the input
    // event was fired and if not, to handle the change event instead. If both events fire, the input event will fire
    // first. AppendageNodes exist for life of sim, no need to dispose.
    // see: https://wiki.fluidproject.org/pages/viewpage.action?pageId=61767683
    var keyboardEventHandled = false;
    this.addAccessibleInputListener( {
      input: function( event ) {
        self.rotateAppendage();
        keyboardEventHandled = true;
        self.dragging = true;
      },
      change: function( event ) {
        if ( !keyboardEventHandled ) {
          self.rotateAppendage();
        }
        self.dragging = true;
      },
      blur: function( event ) {
        self.dragging = false;
      }
    } );

    // Updates the accessibility content with changes in the model
    appendage.angleProperty.link( this.updatePosition.bind( this ) );

    // prevent user from manipulating with both keybaord and mouse at the same time
    // no need to dispose, listener AppendageNodes should exist for life of sim
    this.addAccessibleInputListener( {
      focus: function( event ) {
        self.pickable = false;
      },
      blur: function( event ) {
        self.pickable = true;
      }
    } );
  }

  johnTravoltage.register( 'AppendageNode', AppendageNode );

  return inherit( Node, AppendageNode, {

    /**
     * Keyboard interaction treats the appendages like a linear range slider.  This function maps the slider range value
     * to the correct rotation
     * @private
     * @a11y
     */
    rotateAppendage: function() {
      this.model.angleProperty.set( AppendageNode.positionToAngle( this.inputValue, this.linearFunction, this.keyboardMidPointOffset ) );
      this.model.borderVisibleProperty.set( false );
    },

    /**
     * When the angle changes, update the value of the accessible range slider which represents this node for
     * accessibility.
     * @private
     * @a11y
     * @param {number} angle - radians
     */
    updatePosition:  function( angle ) {
      var position = AppendageNode.angleToPosition( angle, this.linearFunction, this.keyboardMidPointOffset );
      var positionDescription = AppendageNode.getPositionDescription( position, this.rangeMap.regions );

      // update the accessible input value and description text
      this.setInputValue( position );
      this.setAccessibleAttribute( 'aria-valuetext', StringUtils.format( JohnTravoltageA11yStrings.positionTemplateString, position, positionDescription ) );
      this.positionDescription = positionDescription;

      // updates the position of the focus highlight
      this.focusHighlight.center = this.imageNode.center;
    }
  }, {

    /**
     * Prevents the leg from rotation all the way around (because it looks weird)
     * @param  {number} angle - radians
     * @returns {nuber} angle - radians
     */
    limitLegRotation: function( angle ) {
      if ( angle < -Math.PI / 2 ) {
        angle = Math.PI;
      }
      else if ( angle > -Math.PI / 2 && angle < 0 ) {
        angle = 0;
      }
      return angle;
    },

    /**
     * Compute the distance (in radians) between angles a and b.
     * @param {number} a - first angle (radians)
     * @param {number} b - second angle (radians)
     * @private
     * @static
     */
    distanceBetweenAngles: function( a, b ) {
      var diff = Math.abs( a - b ) % ( Math.PI * 2 );
      return Math.min( Math.abs( diff - Math.PI * 2 ), diff );
    },

    /**
     * Calculates the position of an appendage based on its angle. Useful for setting the position of the accessible
     * input value.  An angle offset can be applied which is convenient here because the drag handler will always
     * restrict angles from -PI to PI.  This function lets us wrap around the negative values.
     * @accessibility
     * @private
     *
     * @param {number} appendageAngle - in radians
     * @param {LinearFunction} linearFunction - linear function that maps from angle to input value
     * @param {number} angleOffset - offset angle from mapping, in radians
     */
    angleToPosition: function( appendageAngle, linearFunction, angleOffset ) {
      var angleWithOffset = appendageAngle - angleOffset;
      
      // the drag handler is mapped from PI to -PI. If we wrap around PI, apply the offset
      if ( angleWithOffset < - Math.PI ) {
        angleWithOffset = angleWithOffset + 2 * Math.PI;
      }

      return Util.roundSymmetric( linearFunction( angleWithOffset ) );
    },

    /**
     * Map the position of the appendage from its accessible value to rotation angle.
     * @private
     * @static
     * @a11y
     * 
     * @param  {number} position - input value, value of the accessible input
     * @param  {LinearFunction} linearFunction - linear function that maps angle to accessible input value
     * @param  {number} angleOffset - angle of offset for the mapping, in radians
     * @return {number} in radians                
     */
    positionToAngle: function( position, linearFunction, angleOffset ) {
      return linearFunction.inverse( position ) + angleOffset;
    },

    /**
     * Determines the position description based on where the position falls in the supplied rangeMap.
     * @a11y
     * @private
     * @static
     *
     * @param {number} position - input value for the accessible input
     * @param {rangeMap} [Object] - a map that will determine the correct description from a provided input value
     */
    getPositionDescription: function( position, rangeMap ) {
      var message = '';

      _.forEach( rangeMap, function( map ) {
        if ( position >= map.range.min && position <= map.range.max ) {
          message = map.text;
          return false;
        }
      } );

      return message;
    }
  } );
} );
