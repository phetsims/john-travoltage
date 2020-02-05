// Copyright 2013-2019, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */
define( require => {
  'use strict';

  // modules
  const AccessibleSlider = require( 'SUN/accessibility/AccessibleSlider' );
  const Appendage = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Appendage' );
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  const Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  const LinearFunction = require( 'DOT/LinearFunction' );
  const merge = require( 'PHET_CORE/merge' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Property = require( 'AXON/Property' );
  const Range = require( 'DOT/Range' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const Shape = require( 'KITE/Shape' );
  const SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Utils = require( 'DOT/Utils' );
  const Vector2 = require( 'DOT/Vector2' );

  // a11y strings
  const towardsDoorknobString = JohnTravoltageA11yStrings.towardsDoorknob.value;
  const awayFromDoorknobString = JohnTravoltageA11yStrings.awayFromDoorknob.value;
  const towardsDoorknobPatternString = JohnTravoltageA11yStrings.towardsDoorknobPattern.value;
  const awayFromDoorknobPatternString = JohnTravoltageA11yStrings.awayFromDoorknobPattern.value;
  const fartherAwayPatternString = JohnTravoltageA11yStrings.fartherAwayPattern.value;
  const negativePatternString = JohnTravoltageA11yStrings.negativePattern.value;
  const positionTemplateString = JohnTravoltageA11yStrings.positionTemplate.value;

  // constants
  const DIRECTION_DESCRIPTIONS = {
    CLOSER: towardsDoorknobString,
    FARTHER: awayFromDoorknobString
  };

  const DIRECTION_LANDMARK_PATTERN_DESCRIPTIONS = {
    CLOSER: towardsDoorknobPatternString,
    FARTHER: awayFromDoorknobPatternString
  };

  /**
   * @param {Appendage} appendage the body part to display
   * @param {Image} image
   * @param {number} dx
   * @param {number} dy
   * @param {number} angleOffset the angle about which to rotate
   * @param {Array} rangeMap - an array of objects of the format {range: {max: Number, min: Number}, text: String}. This
   *                           is used to map a position value to text to use for the valueText of the related slider.
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @mixes AccessibleSlider
   * @constructor
   */
  function AppendageNode( appendage, image, dx, dy, angleOffset, rangeMap, tandem, options ) {
    const self = this;

    options = merge( {
      cursor: 'pointer',

      // a11y
      labelTagName: 'label',
      appendLabel: true,
      containerTagName: 'div',
      keyboardMidPointOffset: 0 // adjust center position of accessible slider, to align important locations at center
    }, options );

    Node.call( this, options );

    // @private
    this.model = appendage;
    this.keyboardDragging = false;
    this.keyboardMidPointOffset = options.keyboardMidPointOffset;
    this.rangeMap = rangeMap;

    // @public (a11y, read-only) - the current movement direciton of the appendage
    this.movementDirection = null;

    // @public (a11y) - {Object} arm region when a discharge starts
    this.regionAtDischarge = null;

    // @public (a11y) - {number} arm position when discharge starts
    this.positionAtDischarge = null;

    // when the model is reset, reset the flags that track previous interactions with the appendage and reset
    // descriptions, no need to dispose this listener since appendages exist for life of sim
    this.model.appendageResetEmitter.addListener( function() {
      self.initializePosition( self.model.angleProperty.get() );

      // now reset aria-valuetext (not including change in direction)
      self.resetAriaValueText();
    } );

    // @private add the image
    this.imageNode = new Image( image, {
      tandem: tandem.createTandem( 'imageNode' )
    } );

    this.addChild( this.imageNode );

    let lastAngle = appendage.angleProperty.get();
    let currentAngle = appendage.angleProperty.get();

    // no need for dispose - exists for life of sim
    let angle = 0;
    this.imageNode.addInputListener( new SimpleDragHandler( {
      tandem: tandem.createTandem( 'dragHandler' ),
      allowTouchSnag: true,
      start: function( event ) {

        // if the appendage has focus, blur when it is picked up
        self.focused && self.blur();

        // if the appendage is picked up with the mouse, it should not be keyboard focusable until dropped
        self.focusable = false;

        appendage.isDraggingProperty.set( true );

        appendage.borderVisibleProperty.set( false );
      },
      drag: function( event ) {

        // in full screen mode, the borders will sometimes not be made invisible in IE11 from
        // the start handler, so make sure it goes away here
        if ( appendage.borderVisibleProperty.get() ) {
          appendage.borderVisibleProperty.set( false );
        }

        lastAngle = currentAngle;
        const globalPoint = self.imageNode.globalToParentPoint( event.pointer.point );
        angle = globalPoint.minus( new Vector2( appendage.position.x, appendage.position.y ) ).angle;

        //Limit leg to approximately "half circle" so it cannot spin around, see #63
        if ( appendage instanceof Leg ) {
          angle = AppendageNode.limitLegRotation( angle );
        }

        // if clamped at one of the upper angles, only allow the right direction of movement to change the angle, so it won't skip halfway around
        // Use 3d cross products to compute direction
        // Inline the vector creations and dot product for performance
        const z = Math.cos( currentAngle ) * Math.sin( lastAngle ) - Math.sin( currentAngle ) * Math.cos( lastAngle );

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
          if ( !appendage.angleProperty.range.contains( angle ) ) {
            const max = appendage.angleProperty.range.max;
            const min = appendage.angleProperty.range.min;

            if ( angle < min ) {
              angle = max - Math.abs( min - angle );
            }
            else if ( angle > max ) {
              angle = min + Math.abs( max - angle );
            }
          }
          currentAngle = angle;
          appendage.angleProperty.set( angle );
        }

      },
      end: function() {

        // when we are done dragging with the mouse, place back in tab order
        self.focusable = true;

        appendage.isDraggingProperty.set( false );
      }
    } ) );

    // @public {Shape} (vibration) - Shape of the appendage used for hit testing)
    this.hitShape = Shape.bounds( this.imageNode.bounds );

    // changes visual position
    appendage.angleProperty.link( function( angle ) {
      self.imageNode.resetTransform();
      self.imageNode.translate( appendage.position.x - dx, appendage.position.y - dy );
      self.imageNode.rotateAround( appendage.position.plus( new Vector2( 0, 0 ) ), angle - angleOffset );
      self.hitShape = Shape.bounds( self.imageNode.bounds );
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

    // @private limit ranges of input for the leg
    this.keyboardMotion = {
      min: appendage instanceof Leg ? -7 : -15,
      max: appendage instanceof Leg ? 7 : 15,
      step: 1,
      totalRange: appendage instanceof Leg ? 15 : 30
    };

    // @private - angles for each of the appendages that determine limitations to rotation
    this.angleMotion = {
      min: appendage instanceof Leg ? Math.PI : appendage.angleProperty.range.min,
      max: appendage instanceof Leg ? 0 : appendage.angleProperty.range.max
    };

    // @private - linear function that will map appendage angle to input value for accessibility, rotation of the arm
    // is inversely mapped to the range of the keyboard input.  The arm has an offset that does not fit in this mapping,
    // but it is more convenient to use these maps since the drag handler set position in range of -PI to PI.
    this.linearFunction = new LinearFunction(
      this.angleMotion.min,
      this.angleMotion.max,
      this.keyboardMotion.min,
      this.keyboardMotion.max
    );

    // a11y
    this.focusHighlight = new FocusHighlightPath( Shape.circle( 0, 0, this.imageNode.width / 2 ), {
      tandem: tandem.createTandem( 'focusCircle' )
    } );

    // prevent user from manipulating with both keybaord and mouse at the same time
    // no need to dispose, listener AppendageNodes should exist for life of sim
    this.addInputListener( {
      blur: function( event ) {

        // on blur, reset flags for another round of interaction and the only description should be the
        // landmark or region
        self.initializePosition( appendage.angleProperty.get() );

        // now reset aria-valuetext (not including change in direction)
        self.resetAriaValueText();
      }
    } );

    const a11ySliderOptions = {
      keyboardStep: this.keyboardMotion.step,
      shiftKeyboardStep: this.keyboardMotion.step,
      pageKeyboardStep: 2,
      constrainValue: function( newValue ) {
        lastAngle = currentAngle;

        currentAngle = self.a11yPositionToAngle( newValue );
        return newValue;
      },
      startDrag: function() {

        self.keyboardDragging = true;
        appendage.borderVisibleProperty.set( false );

        appendage.isDraggingProperty.set( true );
      },
      endDrag: function() {
        self.keyboardDragging = false;

        appendage.isDraggingProperty.set( false );
      },
      a11yCreateAriaValueText: function( formattedValue, sliderValue, oldSliderValue ) {
        return self.getTextFromPosition( sliderValue, oldSliderValue );
      },
      roundToStepSize: true
    };

    // set up a bidirectional Property to handle updates to angle and slider position
    const sliderProperty = new DynamicProperty( new Property( appendage.angleProperty ), {
      bidirectional: true,
      map: function( angle ) {
        return self.a11yAngleToPosition( angle );
      },
      inverseMap: function( position ) {
        return self.a11yPositionToAngle( position );
      }
    } );

    this.initializeAccessibleSlider(
      sliderProperty,
      new Property( new Range( this.keyboardMotion.min, this.keyboardMotion.max ) ),
      new BooleanProperty( true ), // always enabled
      a11ySliderOptions
    );

    // update the center of the focus highlight when
    appendage.angleProperty.link( function( angle ) {
      self.focusHighlight.center = self.imageNode.center;
    } );

    this.initializePosition();
  }

  johnTravoltage.register( 'AppendageNode', AppendageNode );

  inherit( Node, AppendageNode, {

    /**
     * Retrieve the accurate text for a11y display based on the slider property values.
     *
     * @public (a11y)
     * @param  {Number} position         the new slider input value
     * @param  {Number} previousPosition the old slider input value
     * @param  {boolean} [includeDirection] - override about whether or not to include direction information
     * @returns {String}                  the generated text for the slider
     */
    getTextFromPosition: function( position, previousPosition, includeDirection ) {
      let valueDescription;
      const isLeg = this.model instanceof Leg;

      // default, always include direction information
      includeDirection = includeDirection || true;

      // generate descriptions that could be used depending on movement
      const newRegion = AppendageNode.getRegion( position, this.rangeMap.regions );
      const landmarkDescription = AppendageNode.getLandmarkDescription( position, this.rangeMap.landmarks );

      let directionDescription = null;
      if ( previousPosition ) {
        directionDescription = this.getDirectionDescription( position, previousPosition, landmarkDescription, newRegion );
      }

      if ( !isLeg && directionDescription && includeDirection ) {

        // if we change directions of movement (relative to the doorknob or center of carpet, that gets next priority)
        valueDescription = directionDescription;
      }
      else if ( landmarkDescription ) {

        // if we are ever on a critical landmark, that description should take priority
        valueDescription = landmarkDescription;
      }
      else if ( newRegion ) {

        // fall back to default region description
        valueDescription = newRegion.text;
      }

      // get value with 'negative' so VoiceOver reads it correctly
      const positionWithNegative = this.getValueWithNegativeString( position );

      return StringUtils.fillIn( positionTemplateString, {
        value: positionWithNegative,
        description: valueDescription
      } );
    },

    /**
     * Get the mapped a11y position from the current model Property tracking the angle.
     * @returns {number} - integer value
     */
    a11yAngleToPosition: function( angle ) {
      return Utils.roundSymmetric( this.linearFunction( angle ) );
    },

    /**
     * Get the angle from the a11y position of the slider, converting the integer to some floating angle
     * @returns {number}
     */
    a11yPositionToAngle: function( position ) {
      return this.linearFunction.inverse( position );
    },

    /**
     * On construction and reset, reset flags that are used to calculate descriptions from interaction history.
     * @private
     */
    initializePosition: function() {

      // reset the movement direction so the next interaction will immediately get the direction
      this.movementDirection = null;
    },

    /**
     * Reset the aria-valuetext independently of the changing value - useful when setting the value text on blur
     * or reset. If the AccessibleSlider Property changes after calling this, beware that it will override what is
     * set here.
     *
     * @private
     */
    resetAriaValueText: function() {
      const sliderValue = this.a11yAngleToPosition( this.model.angleProperty.get() );
      this.ariaValueText = this.getTextFromPosition( sliderValue, sliderValue );
    },

    /**
     * If the position is negative, return a version of the value with 'negative' string added.  This is required for VoiceOver
     * to read the value correctly, see https://github.com/phetsims/john-travoltage/issues/238
     *
     * @public
     * @param {number} position - the accesssible input value for this node's accessible contenet
     * @returns {string}
     */
    getValueWithNegativeString: function( position ) {
      let returnValue = position;
      if ( returnValue < 0 ) {
        returnValue = StringUtils.fillIn( negativePatternString, { value: Math.abs( returnValue ) } );
      }

      return returnValue;
    },

    /**
     * Get a description of the movement direction, if the appendage changes directions during movement. Direction
     *
     * @param  {number} position
     * @param  {number} previousPosition
     */
    getDirectionDescription: function( position, previousPosition, landmarkDescription, region ) {
      const deltaPosition = Math.abs( previousPosition ) - Math.abs( position );
      let newDirection = null;
      if ( deltaPosition ) {
        newDirection = deltaPosition > 0 ? Appendage.MOVEMENT_DIRECTIONS.CLOSER : Appendage.MOVEMENT_DIRECTIONS.FARTHER;
      }

      let description = '';
      let stringPattern;

      if ( AppendageNode.getAddFurtherOnAway( position, this.rangeMap.regions ) && newDirection === Appendage.MOVEMENT_DIRECTIONS.FARTHER ) {

        // regardless if the direction changes, some regions need to add "Further away..." when moving away
        description = StringUtils.fillIn( fartherAwayPatternString, { description: AppendageNode.getPositionDescription( position, this.rangeMap.regions ) } );
      }
      else if ( newDirection && ( this.movementDirection !== newDirection ) ) {
        if ( AppendageNode.getLandmarkIncludesDirection( position, this.rangeMap.landmarks ) ) {
          assert && assert( landmarkDescription, 'there should be a landmark description in this case' );

          stringPattern = DIRECTION_LANDMARK_PATTERN_DESCRIPTIONS[ newDirection ];
          description = StringUtils.fillIn( stringPattern, { description: landmarkDescription.toLowerCase() } );
        }
        else if ( region.range.getLength() > 0 ) {
          description = DIRECTION_DESCRIPTIONS[ newDirection ];
        }
      }

      this.movementDirection = newDirection;

      return description;
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
      const diff = Math.abs( a - b ) % ( Math.PI * 2 );
      return Math.min( Math.abs( diff - Math.PI * 2 ), diff );
    },

    /**
     * Determines the position description based on where the position falls in the supplied rangeMap.
     * @a11y
     * @private
     * @static
     *
     * @param {number} position - input value for the accessible input
     * @param {rangeMap} [Object] - a map that will determine the correct description from a provided input value
     * @returns {Object} region - {range, text}
     */
    getRegion: function( position, rangeMap ) {
      let region;

      _.forEach( rangeMap, function( map ) {
        if ( position >= map.range.min && position <= map.range.max ) {
          region = map;
          return false;
        }
      } );

      return region;
    },

    /**
     * Get a description of the appendage that can be used in multiple places, something like
     * "close to doorknob" or
     * "very far from doorknob"
     *
     * @public
     * @static
     * @a11y
     *
     * @param  {number} position - integer location of the appendage, mapped from angle, see AppendageNode.linearFunction
     * @param  {Object} rangeMap - a map that will provide the correct description from the provided input value
     * @returns {string} - a lower case string, generally to be inserted into another context
     */
    getPositionDescription: function( position, rangeMap ) {
      const newRegion = AppendageNode.getRegion( Utils.roundSymmetric( position ), rangeMap );
      return newRegion.text.toLowerCase();
    },

    /**
     * If the appendage is at acritical location, returns a 'landmark' description that will always be read to the user.
     * Otherwise, return an empty string.
     * @static
     * @private
     * @a11y
     *
     * @param  {number} position
     * @param  {Object} landmarkMap {value, text}
     * @returns {string}
     */
    getLandmarkDescription: function( position, landmarkMap ) {
      let message = '';

      _.forEach( landmarkMap, function( landmark ) {
        if ( position === landmark.value ) {
          message = landmark.text;
          return false;
        }
      } );

      return message;
    },

    /**
     * Gets wheter or not the landmark description should include an indication of movement direction
     * if the user lands on it after changing direction. Determined by a flag in AppendageRangeMaps.js,
     * see that file for more information.
     *
     * @param  {number} position
     * @param  {Object} landmarkMap
     * @returns {boolean}
     */
    getLandmarkIncludesDirection: function( position, landmarkMap ) {
      let includeDirection;

      _.forEach( landmarkMap, function( landmark ) {
        if ( position === landmark.value ) {
          includeDirection = landmark.includeDirection;
          return false;
        }
      } );

      return includeDirection;
    },

    /**
     * Get whether or not the region description should include an indication of movement direction
     * when the user is moving away from the doorknob and lands in the region.  Determined by a flag in
     * AppendageRangeMaps, see that file for more information.
     *
     * @param  {position} position
     * @param  {Object} regionMap
     * @returns {boolean}
     */
    getAddFurtherOnAway: function( position, regionMap ) {
      let includeFartherAway = false;

      _.forEach( regionMap, function( region ) {
        if ( region.range.contains( position ) && region.addFartherAway ) {
          includeFartherAway = region.addFartherAway;
          return false;
        }
      } );

      return includeFartherAway;
    }
  } );

  AccessibleSlider.mixInto( AppendageNode );

  return AppendageNode;
} );
