// Copyright 2013-2017, University of Colorado Boulder
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
  var Appendage = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Appendage' );
  var FocusHighlightPath = require( 'SCENERY/accessibility/FocusHighlightPath' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Property = require( 'AXON/Property' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Sound = require( 'VIBE/Sound' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // a11y strings
  var towardsDoorknobString = JohnTravoltageA11yStrings.towardsDoorknobString.value;
  var awayFromDoorknobString = JohnTravoltageA11yStrings.awayFromDoorknobString.value;
  var towardsDoorknobPatternString = JohnTravoltageA11yStrings.towardsDoorknobPatternString.value;
  var awayFromDoorknobPatternString = JohnTravoltageA11yStrings.awayFromDoorknobPatternString.value;
  var fartherAwayPatternString = JohnTravoltageA11yStrings.fartherAwayPatternString.value;
  var negativePatternString = JohnTravoltageA11yStrings.negativePatternString.value;
  var positionTemplateString = JohnTravoltageA11yStrings.positionTemplateString.value;

  // constants
  var DIRECTION_DESCRIPTIONS = {
    CLOSER: towardsDoorknobString,
    FARTHER: awayFromDoorknobString
  };

  var DIRECTION_LANDMARK_PATTERN_DESCRIPTIONS = {
    CLOSER: towardsDoorknobPatternString,
    FARTHER: awayFromDoorknobPatternString
  };

  // audio
  var limitBonkAudio = require( 'audio!JOHN_TRAVOLTAGE/limit-bonk.mp3' );

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
      appendLabel: true,
      containerTagName: 'div',
      keyboardMidPointOffset: 0 // adjust center position of accessible slider, to align important locations at center
    }, options );

    Node.call( this, options );

    // @private
    this.model = appendage;
    this.dragging = false;
    this.keyboardMidPointOffset = options.keyboardMidPointOffset;
    this.rangeMap = rangeMap;

    // @public (a11y, read-only), description for this arm, publicly visible so that it can be used elsewhere
    this.positionDescription = '';

    // @public (a11y, read-only) purely for debugging
    this.valueTextProperty = new Property( '' );

    // @public (a11y, read-only) - arm description will change depending on how the appendage moves through the regions
    this.currentRegion = null;

    // @public (a11y) - {Object} arm region when a discharge starts
    this.regionAtDischarge = null;

    // @public (a11y) - {number} arm position when discharge starts
    this.positionAtDischarge = null;

    // when the model is reset, reset the flags that track previous interactions with the appendage and reset
    // descriptions, no need to dispose this listener since appendages exist for life of sim
    this.model.appendageResetEmitter.addListener( function() {
      self.initializePosition( self.model.angleProperty.get() );      
    } );

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
    this.imageNode.addInputListener( new SimpleDragHandler( {
      tandem: tandem.createTandem( 'dragHandler' ),
      allowTouchSnag: true,
      start: function( event ) {

        // if the appendage has focus, blur when it is picked up
        self.focused && self.blur();

        // if the appendage is picked up with the mouse, it should not be keyboard focusable until dropped
        self.focusable = false;

        appendage.borderVisibleProperty.set( false );
        self.dragging = true;
      },
      drag: function( event ) {

        // in full screen mode, the borders will sometimes not be made invisible in IE11 from 
        // the start handler, so make sure it goes away here
        if ( appendage.borderVisibleProperty.get() ) {
          appendage.borderVisibleProperty.set( false );
        }

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
    this.focusHighlight = new FocusHighlightPath( Shape.circle( 0, 0, this.imageNode.width / 2 ), {
      tandem: tandem.createTandem( 'focusCircle' )
    } );

    // @private limit ranges of input for the leg
    this.keyboardMotion = {
      min: appendage instanceof Leg ? -7 : -15, 
      max: appendage instanceof Leg ? 7 : 15,
      step: 1,
      totalRange: appendage instanceof Leg ? 15 : 30
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
                          new LinearFunction( angleMotion.min, angleMotion.max, this.keyboardMotion.min, this.keyboardMotion.max );

    // set the initial input range values
    var rangeValue = AppendageNode.angleToPosition( appendage.angleProperty.get(), this.linearFunction, this.keyboardMidPointOffset );
    this.setInputValue( rangeValue );

    this.setAccessibleAttribute( 'min', this.keyboardMotion.min );
    this.setAccessibleAttribute( 'max', this.keyboardMotion.max );
    this.setAccessibleAttribute( 'step', this.keyboardMotion.step );

    // Due to the variability of input and changes event firing across browsers, it is necessary to track if the input
    // event was fired and if not, to handle the change event instead. If both events fire, the input event will fire
    // first. AppendageNodes exist for life of sim, no need to dispose.
    // see: https://wiki.fluidproject.org/pages/viewpage.action?pageId=61767683
    var keyboardEventHandled = false;
    this.addAccessibleInputListener( {
      input: function( event ) {

        // update the input value from the DOM element
        // TODO: This can be removed once https://github.com/phetsims/john-travoltage/issues/271 is done
        self.inputValue = event.target.value;
        self.rotateAppendage();
        keyboardEventHandled = true;
        self.dragging = true;
      },
      change: function( event ) {
        
        // TODO: This can be removed once https://github.com/phetsims/john-travoltage/issues/271 is done
        self.inputValue = event.target.value;
        if ( !keyboardEventHandled ) {
          self.rotateAppendage();
        }
        keyboardEventHandled = false;
        self.dragging = true;
      },
      blur: function( event ) {
        self.dragging = false;

        // on blur, reset flags for another round of interaction and the only description should be the
        // landmark or region
        self.initializePosition( appendage.angleProperty.get() ); 
      }
    } );

    // Updates the accessibility content with changes in the model
    appendage.angleProperty.lazyLink( function( angle, previousAngle ) {
      self.updatePosition( angle, previousAngle );
    } );
    this.initializePosition( appendage.angleProperty.get() );

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
      this.model.angleProperty.set( AppendageNode.positionToAngle( Number( this.inputValue ), this.linearFunction, this.keyboardMidPointOffset ) );
      this.model.borderVisibleProperty.set( false );
    },

    /**
     * When the angle changes, update the value of the accessible range slider which represents this node for
     * accessibility.  Only one description should be included at any given time, with the following priority
     * - region description for initial description (on load/reset, we should always hear the default region)
     * - landmark description (cricial locations for the appendage)
     * - direction description (closer vs fartherther away from 0)
     * - progress description (movement progress through the current region)
     * @private
     * @a11y
     * @param {number} angle - in radians
     * @param {number} oldAngle - in radians
     */
    updatePosition:  function( angle, oldAngle ) {
      var valueDescription;
      var previousPosition;
      var isLeg = this.model instanceof Leg;      
      var position = AppendageNode.angleToPosition( angle, this.linearFunction, this.keyboardMidPointOffset );

      if ( oldAngle ) {
        previousPosition = AppendageNode.angleToPosition( oldAngle, this.linearFunction, this.keyboardMidPointOffset );
      }

      // generate descriptions that could be used depending on movement
      var newRegion = AppendageNode.getRegion( position, this.rangeMap.regions );
      var landmarkDescription = AppendageNode.getLandmarkDescription( position, this.rangeMap.landmarks );
      var directionDescription = this.getDirectionDescription( position, previousPosition, landmarkDescription, newRegion );

      if ( !isLeg && directionDescription ) {

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

      this.setValueAndText( position, valueDescription, newRegion );

      this.focusHighlight.center = this.imageNode.center;
      this.currentRegion = newRegion;
    },

    /**
     * On construction and reset, all we want is the region and the 
     * @param  {[type]} angle [description]
     * @return {[type]}       [description]
     */
    initializePosition: function( angle ) {

      // convert the angle to a position that can be used in description content
      var position = AppendageNode.angleToPosition( angle, this.linearFunction, this.keyboardMidPointOffset );      
      var newRegion = AppendageNode.getRegion( position, this.rangeMap.regions );
      var landmarkDescription = AppendageNode.getLandmarkDescription( position, this.rangeMap.landmarks );

      var valueDescription = landmarkDescription || newRegion.text;
      this.setValueAndText( position, valueDescription, newRegion );

      // reset the movement direction so the next interaction will immediately get the direction
      this.model.movementDirection = null;
      this.currentRegion = null;

      this.focusHighlight.center = this.imageNode.center;
      this.currentRegion = newRegion;
    },

    /**
     * Sets the accessible input value and associated description for this node's accessible content.
     * 
     * @private
     * @param {number}
     * @param {string}
     * @param {Object}
     */
    setValueAndText: function( position, description, region ) {

      // get value with 'negative' so VoiceOver reads it correctly
      var positionWithNegative = this.getValueWithNegativeString( position );      
      var valueText = StringUtils.fillIn( positionTemplateString, {
        value: positionWithNegative,
        description: description
      } );

      this.setInputValue( position );
      this.setAccessibleAttribute( 'aria-valuetext', valueText );

      // the public position description should always be the region description
      this.positionDescription = region.text.toLowerCase();
      this.valueTextProperty.set( valueText );
    },

    /**
     * If the position is negative, return a version of the value with 'negative' string added.  This is required for VoiceOver
     * to read the value correctly, see https://github.com/phetsims/john-travoltage/issues/238
     *
     * @public
     * @param {number} position - the accesssible input value for this node's accessible contenet
     * @return {string}
     */
    getValueWithNegativeString: function( position ) {
      var returnValue = position;
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
      var deltaPosition = Math.abs( previousPosition ) - Math.abs( position );
      var newDirection = deltaPosition > 0 ? Appendage.MOVEMENT_DIRECTIONS.CLOSER : Appendage.MOVEMENT_DIRECTIONS.FARTHER;

      var description = '';
      var stringPattern;

      if ( AppendageNode.getAddFurtherOnAway( position, this.rangeMap.regions ) && newDirection === Appendage.MOVEMENT_DIRECTIONS.FARTHER ) {

        // regardless if the direction changes, some regions need to add "Further away..." when moving away
        description = StringUtils.fillIn( fartherAwayPatternString, { description: region.text.toLowerCase() } );
      }
      else if ( this.model.movementDirection !== newDirection ) {
        if ( AppendageNode.getLandmarkIncludesDirection( position, this.rangeMap.landmarks ) ) {
          assert && assert( landmarkDescription, 'there should be a landmark description in this case' );

          stringPattern = DIRECTION_LANDMARK_PATTERN_DESCRIPTIONS[ newDirection ];
          description = StringUtils.fillIn( stringPattern, { description: landmarkDescription.toLowerCase() } );
        }
        else if ( region.range.getLength() > 0 ) {
          description = DIRECTION_DESCRIPTIONS[ newDirection ];
        }
      }

      this.model.movementDirection = newDirection;

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
     * @returns {Object} region - {range, text}
     */
    getRegion: function( position, rangeMap ) {
      var region;

      _.forEach( rangeMap, function( map ) {
        if ( position >= map.range.min && position <= map.range.max ) {
          region = map;
          return false;
        }
      } );

      return region;
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
     * @return {string}             
     */
    getLandmarkDescription: function( position, landmarkMap ) {
      var message = '';

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
     * @return {boolean}            
     */
    getLandmarkIncludesDirection: function( position, landmarkMap ) {
      var includeDirection;

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
     * @return {boolean}          
     */
    getAddFurtherOnAway: function( position, regionMap ) {
      var includeFartherAway = false;

      _.forEach( regionMap, function( region ) {
        if ( region.range.contains( position ) && region.addFartherAway ) {
          includeFartherAway = region.addFartherAway;
          return false;
        }
      } );

      return includeFartherAway;
    }
  } );
} );
