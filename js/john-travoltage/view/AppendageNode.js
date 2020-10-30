// Copyright 2013-2020, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the leg of the model.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Shape from '../../../../kite/js/Shape.js';
import merge from '../../../../phet-core/js/merge.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import SelfVoicingInputListener from '../../../../scenery-phet/js/accessibility/speaker/SelfVoicingInputListener.js';
import levelSpeakerModel from '../../../../scenery-phet/js/accessibility/speaker/levelSpeakerModel.js';
import FocusHighlightPath from '../../../../scenery/js/accessibility/FocusHighlightPath.js';
import DragListener from '../../../../scenery/js/listeners/DragListener.js';
import Image from '../../../../scenery/js/nodes/Image.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../scenery/js/nodes/Rectangle.js';
import AccessibleSlider from '../../../../sun/js/accessibility/AccessibleSlider.js';
import SelfVoicingUtterance from '../../../../utterance-queue/js/SelfVoicingUtterance.js';
import johnTravoltage from '../../johnTravoltage.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';
import Appendage from '../model/Appendage.js';
import Leg from '../model/Leg.js';

const towardsDoorknobString = johnTravoltageStrings.a11y.appendages.arm.directions.towardsDoorknob;
const awayFromDoorknobString = johnTravoltageStrings.a11y.appendages.arm.directions.awayFromDoorknob;
const towardsDoorknobPatternString = johnTravoltageStrings.a11y.appendages.arm.directions.towardsDoorknobPattern;
const awayFromDoorknobPatternString = johnTravoltageStrings.a11y.appendages.arm.directions.awayFromDoorknobPattern;
const fartherAwayPatternString = johnTravoltageStrings.a11y.appendages.arm.directions.fartherAwayPattern;
const selfVoicingObjectResponsePatternString = johnTravoltageStrings.a11y.selfVoicing.appendageObjectResponsePattern;
const grabbedAlertString = johnTravoltageStrings.a11y.selfVoicing.grabbedAlert;
const dragHintString = johnTravoltageStrings.a11y.selfVoicing.dragHint;
const selfVoicingContentHintString = johnTravoltageStrings.a11y.selfVoicing.contentHint;

// constants
const DIRECTION_DESCRIPTIONS = {
  CLOSER: towardsDoorknobString,
  FARTHER: awayFromDoorknobString
};

const DIRECTION_LANDMARK_PATTERN_DESCRIPTIONS = {
  CLOSER: towardsDoorknobPatternString,
  FARTHER: awayFromDoorknobPatternString
};

class AppendageNode extends Node {
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
   */
  constructor( appendage, image, dx, dy, angleOffset, rangeMap, tandem, options ) {

    options = merge( {
      cursor: 'pointer',

      // pdom
      labelTagName: 'label',
      appendLabel: true,
      containerTagName: 'div',
      keyboardMidPointOffset: 0, // adjust center position of accessible slider, to align important positions at center

      // {string|null} - hint spoken to guide the user toward an interaction
      selfVoicingHint: null,

      // {string|null} - a custom label for the appendage, if different from the usual labelContent
      selfVoicingLabel: null
    }, options );

    super( options );

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

    this.previousSwipePosition = null;

    // @public {string|null} - the lable for the appendage in the self-voicing
    // case
    this.selfVoicingLabel = options.selfVoicingLabel;

    // when the model is reset, reset the flags that track previous interactions with the appendage and reset
    // descriptions, no need to dispose this listener since appendages exist for life of sim
    this.model.appendageResetEmitter.addListener( () => {
      this.initializePosition( this.model.angleProperty.get() );

      // now reset aria-valuetext (not including change in direction)
      this.resetAriaValueText();
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
    this.imageNode.addInputListener( new DragListener( {
      tandem: tandem.createTandem( 'dragHandler' ),
      allowTouchSnag: true,
      start: event => {
        appendage.isDraggingProperty.set( true );
        appendage.borderVisibleProperty.set( false );
      },
      drag: event => {

        // in full screen mode, the borders will sometimes not be made invisible in IE11 from
        // the start handler, so make sure it goes away here
        if ( appendage.borderVisibleProperty.get() ) {
          appendage.borderVisibleProperty.set( false );
        }

        lastAngle = currentAngle;
        const globalPoint = this.imageNode.globalToParentPoint( event.pointer.point );
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
          angle = this.wrapAngle( angle );
          currentAngle = angle;
          appendage.angleProperty.set( angle );
        }
      },
      end: () => {

        // when we are done dragging with the mouse, place back in tab order
        this.focusable = true;

        appendage.isDraggingProperty.set( false );
      }
    } ) );

    // changes visual position
    appendage.angleProperty.link( angle => {
      this.imageNode.resetTransform();
      this.imageNode.translate( appendage.position.x - dx, appendage.position.y - dy );
      this.imageNode.rotateAround( appendage.position.plus( new Vector2( 0, 0 ) ), angle - angleOffset );
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

    // pdom
    this.focusHighlight = new FocusHighlightPath( Shape.circle( 0, 0, this.imageNode.width / 2 ), {
      tandem: tandem.createTandem( 'focusCircle' )
    } );

    this.addInputListener( {

      // prevent user from manipulating with both keybaord and mouse at the same time
      // no need to dispose, listener AppendageNodes should exist for life of sim
      blur: event => {

        // on blur, reset flags for another round of interaction and the only description should be the
        // landmark or region
        this.initializePosition( appendage.angleProperty.get() );

        // now reset aria-valuetext (not including change in direction)
        this.resetAriaValueText();
      }
    } );

    const a11ySliderOptions = {
      keyboardStep: this.keyboardMotion.step,
      shiftKeyboardStep: this.keyboardMotion.step,
      pageKeyboardStep: 2,
      constrainValue: newValue => {
        lastAngle = currentAngle;

        currentAngle = this.a11yPositionToAngle( newValue );
        return newValue;
      },
      startDrag: () => {

        this.keyboardDragging = true;
        appendage.borderVisibleProperty.set( false );

        appendage.isDraggingProperty.set( true );
      },
      endDrag: () => {
        this.keyboardDragging = false;

        appendage.isDraggingProperty.set( false );
      },
      a11yCreateAriaValueText: ( formattedValue, sliderValue, oldSliderValue ) => this.createAriaValueText( sliderValue, oldSliderValue ),
      roundToStepSize: true
    };

    // set up a bidirectional Property to handle updates to angle and slider position
    const sliderProperty = new DynamicProperty( new Property( appendage.angleProperty ), {
      bidirectional: true,
      map: angle => this.a11yAngleToPosition( angle ),
      inverseMap: position => this.a11yPositionToAngle( position )
    } );

    this.initializeAccessibleSlider(
      sliderProperty,
      new Property( new Range( this.keyboardMotion.min, this.keyboardMotion.max ) ),
      new BooleanProperty( true ), // always enabled
      a11ySliderOptions
    );

    // update the center of the focus highlight when
    appendage.angleProperty.link( angle => {
      this.focusHighlight.center = this.imageNode.center;
    } );

    this.initializePosition();

    // prototype code related to the self-voicing work
    if ( phet.chipper.queryParameters.supportsSelfVoicing ) {

      // describe changes to the arm/leg as the angle changes (during a
      // drag operation) - polite so that it doesn't cancel itself during
      // rapid changes
      const appendageUtterance = new SelfVoicingUtterance( {
        cancelSelf: false,
        cancelOther: false,
        alertStableDelay: 400
      } );

      // describe position of the appendage if we receive a down event but the
      // appendage does not move
      let angleOnStart = null;
      appendage.isDraggingProperty.lazyLink( isDragging => {
        if ( isDragging ) {
          angleOnStart = appendage.angleProperty.get();

          appendageUtterance.alert = this.getSelfVoicingObjectResponse( true );
          phet.joist.sim.selfVoicingUtteranceQueue.addToBack( appendageUtterance );
        }
        else if ( angleOnStart !== appendage.angleProperty.get() ) {
          appendageUtterance.alert = this.getSelfVoicingObjectResponse( true );
          phet.joist.sim.selfVoicingUtteranceQueue.addToBack( appendageUtterance );
        }
      } );

      this.addInputListener( new SelfVoicingInputListener( {
        onFocusIn: () => {
          const response = this.getSelfVoicingObjectResponse( true );
          phet.joist.sim.selfVoicingUtteranceQueue.addToBack( response );
        },
        highlightTarget: this
      } ) );

      // when we receive a click event from a 'double tap', describe to the
      // user how to drag the appendage
      this.addInputListener( {
        click: event => {
          const response = levelSpeakerModel.collectResponses( dragHintString );
          phet.joist.sim.selfVoicingUtteranceQueue.addToBack( response );
        }
      } );
    }
  }

  /**
   * Get the "object response" (response describing the slider itself) when a change
   * is made to it for the self-voicing feature.
   * @private
   *
   * @param {boolean} includeLabel
   */
  getSelfVoicingObjectResponse( includeLabel ) {

    let objectResponse;
    if ( includeLabel ) {
      objectResponse = StringUtils.fillIn( selfVoicingObjectResponsePatternString, {
        label: this.selfVoicingLabel || this.labelContent,
        valueText: this.ariaValueText
      } );
    }
    else {
      objectResponse = this.ariaValueText;
    }

    return levelSpeakerModel.collectResponses( objectResponse, null, selfVoicingContentHintString );
  }


  /**
   * Retrieve the accurate text for a11y display based on the slider property values.
   *
   * @public (a11y)
   * @param  {Number} position         the new slider input value
   * @param  {Number} previousPosition the old slider input value
   * @param  {boolean} [includeDirection] - override about whether or not to include direction information
   * @returns {String}                  the generated text for the slider
   */
  getTextFromPosition( position, previousPosition, includeDirection ) {
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

    return valueDescription;
  }

  /**
   * Get a description of the value of the hand position, with an associated numerical value.
   * @param position
   * @param previousPosition
   * @param includeDirection
   * @returns {string}
   * @private
   */
  createAriaValueText( position, previousPosition, includeDirection ) {
    return this.getTextFromPosition( position, previousPosition, includeDirection );
  }

  /**
   * Get the mapped a11y position from the current model Property tracking the angle.
   * @returns {number} - integer value
   * @public
   */
  a11yAngleToPosition( angle ) {
    return Utils.roundSymmetric( this.linearFunction( angle ) );
  }

  /**
   * Get the angle from the a11y position of the slider, converting the integer to some floating angle
   * @returns {number}
   * @public
   */
  a11yPositionToAngle( position ) {
    return this.linearFunction.inverse( position );
  }

  /**
   * On construction and reset, reset flags that are used to calculate descriptions from interaction history.
   * @private
   */
  initializePosition() {

    // reset the movement direction so the next interaction will immediately get the direction
    this.movementDirection = null;
  }

  /**
   * Reset the aria-valuetext independently of the changing value - useful when setting the value text on blur
   * or reset. If the AccessibleSlider Property changes after calling this, beware that it will override what is
   * set here.
   *
   * @private
   */
  resetAriaValueText() {
    const sliderValue = this.a11yAngleToPosition( this.model.angleProperty.get() );
    this.ariaValueText = this.createAriaValueText( sliderValue, sliderValue );
  }

  /**
   * Get a description of the movement direction, if the appendage changes directions during movement. Direction
   *
   * @param {number} position
   * @param {number} previousPosition
   * @private
   */
  getDirectionDescription( position, previousPosition, landmarkDescription, region ) {
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

  /**
   * Part of prototype self-voicing. When the user initiates a gesture (anywhere on the screen)
   * that will initiate drag of the appendageNode.
   *
   * @public (called by SwipeListener)
   */
  swipeStart() {
    this.model.isDraggingProperty.set( true );
    this.model.borderVisibleProperty.set( false );

    const response = levelSpeakerModel.collectResponses( grabbedAlertString );
    phet.joist.sim.selfVoicingUtteranceQueue.addToBack( response );
  }

  /**
   * Part of the prototype self-voicing feature. User has initiated a gesture on the screen
   * to drag this Node. Moves this appendage based on how far along the screen the user
   * moves their finger. Just drags the appendage back and forth as the user drags their
   * finger left/right or up/down.
   * @public (called by SwipeListener)
   *
   * @param {SceneryEvent} event
   */
  swipeMove( event ) {

    // the leg is constrained to the bottom two quadrants
    const useBottomQuadrants = this.model instanceof Leg;

    const nextPosition = event.pointer.point;
    if ( this.previousSwipePosition ) {
      const swipeDelta = nextPosition.minus( this.previousSwipePosition );
      const angleDelta = swipeDelta.magnitude / Math.PI / 30;
      const swipeAngle = swipeDelta.angle;

      let nextAngle = this.model.angleProperty.get();

      // this kind of thing would probably be useful elsewhere if we continue with this
      const swipeRight = Utils.equalsEpsilon( Math.abs( swipeAngle ), 0, Math.PI / 4 );
      const swipeLeft = Utils.equalsEpsilon( Math.abs( swipeAngle ), Math.PI, Math.PI / 4 );
      const swipeUp = Utils.equalsEpsilon( swipeAngle, -Math.PI / 2, Math.PI / 4 );
      const swipeDown = Utils.equalsEpsilon( swipeAngle, Math.PI / 2, Math.PI / 4 );

      // likely a horizontal swipe, move right by swiping right
      if ( swipeRight ) {
        nextAngle = useBottomQuadrants ? nextAngle - angleDelta : nextAngle + angleDelta;
      }
      else if ( swipeLeft ) {
        nextAngle = useBottomQuadrants ? nextAngle + angleDelta : nextAngle - angleDelta;
      }
      else if ( swipeDown ) {
        nextAngle = nextAngle + angleDelta;
      }
      else if ( swipeUp ) {
        nextAngle = nextAngle - angleDelta;
      }

      // the leg is constrained to bottom quadrants
      if ( useBottomQuadrants ) {
        nextAngle = Utils.clamp( nextAngle, 0, Math.PI );
      }
      else {
        nextAngle = this.wrapAngle( nextAngle );
      }

      this.model.angleProperty.set( nextAngle );
    }

    this.previousSwipePosition = nextPosition;
  }

  /**
   * Wrap the angle around the range for the angleProperty - useful because
   * the arm can go around in a full circle.
   * @public
   *
   * @param {number} angle
   * @returns {number}
   */
  wrapAngle( angle ) {
    let wrappedAngle = angle;

    if ( !this.model.angleProperty.range.contains( angle ) ) {
      const max = this.model.angleProperty.range.max;
      const min = this.model.angleProperty.range.min;

      if ( wrappedAngle < min ) {
        wrappedAngle = max - Math.abs( min - wrappedAngle );
      }
      else if ( wrappedAngle > max ) {
        wrappedAngle = min + Math.abs( max - wrappedAngle );
      }
    }

    return wrappedAngle;
  }

  /**
   * Part of the self-voicing prototype. User has ended a drag of the appendage.
   * @public (called by SwipeListener)
   *
   * @param {SceneryEvent} event
   */
  swipeEnd( event ) {
    this.model.isDraggingProperty.set( false );
    this.previousSwipePosition = null;

    const releasedUtterance = new SelfVoicingUtterance( {
      alert: 'Released',

      // this utterance often follows electron information, don't interrupt that
      // before speaking this alert
      cancelOther: false
    } );
    phet.joist.sim.selfVoicingUtteranceQueue.addToBack( releasedUtterance );
  }


  /**
   * Prevents the leg from rotation all the way around (because it looks weird)
   * @param  {number} angle - radians
   * @returns {number} angle - radians
   * @private
   */
  static limitLegRotation( angle ) {
    if ( angle < -Math.PI / 2 ) {
      angle = Math.PI;
    }
    else if ( angle > -Math.PI / 2 && angle < 0 ) {
      angle = 0;
    }
    return angle;
  }

  /**
   * Compute the distance (in radians) between angles a and b.
   * @param {number} a - first angle (radians)
   * @param {number} b - second angle (radians)
   * @private
   * @static
   */
  static distanceBetweenAngles( a, b ) {
    const diff = Math.abs( a - b ) % ( Math.PI * 2 );
    return Math.min( Math.abs( diff - Math.PI * 2 ), diff );
  }

  /**
   * Determines the position description based on where the position falls in the supplied rangeMap.
   * @a11y
   * @private
   * @static
   *
   * @param {number} position - input value for the accessible input
   * @param {Object} [rangeMap] - a map that will determine the correct description from a provided input value
   * @returns {Object} region - {range, text}
   */
  static getRegion( position, rangeMap ) {
    let region;

    _.forEach( rangeMap, map => {
      if ( position >= map.range.min && position <= map.range.max ) {
        region = map;
        return false;
      }
    } );

    return region;
  }

  /**
   * Get a description of the appendage that can be used in multiple places, something like
   * "close to doorknob" or
   * "very far from doorknob"
   *
   * @public
   * @static
   * @a11y
   *
   * @param  {number} position - integer position of the appendage, mapped from angle, see AppendageNode.linearFunction
   * @param  {Object} rangeMap - a map that will provide the correct description from the provided input value
   * @returns {string} - a lower case string, generally to be inserted into another context
   */
  static getPositionDescription( position, rangeMap ) {
    const newRegion = AppendageNode.getRegion( Utils.roundSymmetric( position ), rangeMap );
    return newRegion.text.toLowerCase();
  }

  /**
   * If the appendage is at a critical position, returns a 'landmark' description that will always be read to the user.
   * Otherwise, return an empty string.
   * @static
   * @private
   * @a11y
   *
   * @param  {number} position
   * @param  {Object} landmarkMap {value, text}
   * @returns {string}
   */
  static getLandmarkDescription( position, landmarkMap ) {
    let message = '';

    _.forEach( landmarkMap, landmark => {
      if ( position === landmark.value ) {
        message = landmark.text;
        return false;
      }
    } );

    return message;
  }

  /**
   * Gets wheter or not the landmark description should include an indication of movement direction
   * if the user lands on it after changing direction. Determined by a flag in AppendageRangeMaps.js,
   * see that file for more information.
   *
   * @param  {number} position
   * @param  {Object} landmarkMap
   * @returns {boolean}
   * @private
   */
  static getLandmarkIncludesDirection( position, landmarkMap ) {
    let includeDirection;

    _.forEach( landmarkMap, landmark => {
      if ( position === landmark.value ) {
        includeDirection = landmark.includeDirection;
        return false;
      }
    } );

    return includeDirection;
  }

  /**
   * Get whether or not the region description should include an indication of movement direction
   * when the user is moving away from the doorknob and lands in the region.  Determined by a flag in
   * AppendageRangeMaps, see that file for more information.
   *
   * @param  {position} position
   * @param  {Object} regionMap
   * @returns {boolean}
   * @private
   */
  static getAddFurtherOnAway( position, regionMap ) {
    let includeFartherAway = false;

    _.forEach( regionMap, region => {
      if ( region.range.contains( position ) && region.addFartherAway ) {
        includeFartherAway = region.addFartherAway;
        return false;
      }
    } );

    return includeFartherAway;
  }
}

johnTravoltage.register( 'AppendageNode', AppendageNode );

AccessibleSlider.mixInto( AppendageNode );

export default AppendageNode;