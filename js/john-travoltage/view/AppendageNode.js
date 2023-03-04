// Copyright 2013-2023, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for an appendage in this sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */

import DynamicProperty from '../../../../axon/js/DynamicProperty.js';
import Property from '../../../../axon/js/Property.js';
import Range from '../../../../dot/js/Range.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import merge from '../../../../phet-core/js/merge.js';
import { DragListener, FocusHighlightPath, Image, Node, Rectangle } from '../../../../scenery/js/imports.js';
import AccessibleSlider from '../../../../sun/js/accessibility/AccessibleSlider.js';
import johnTravoltage from '../../johnTravoltage.js';


class AppendageNode extends AccessibleSlider( Node, 0 ) {

  /**
   * @param {Appendage} appendage the body part to display
   * @param {Image} image
   * @param {number} dx
   * @param {number} dy
   * @param {number} angleOffset the angle about which to rotate
   * @param {Array} rangeMap - an array of objects of the format {range: {max: Number, min: Number}, text: String}. This
   *                           is used to map a position value to text to use for the valueText of the related slider.
   * @param {LinearFunction} angleToPDOMValueFunction - maps the angle for the appendage to the value that is
   *                                                    represented by that angle in the PDOM, converting radians
   *                                                    into a more user friendly value range.
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @mixes AccessibleSlider
   */
  constructor( appendage, image, dx, dy, angleOffset, rangeMap, angleToPDOMValueFunction, tandem, options ) {

    const appendageNodeHelper = new AppendageNodeHelper( rangeMap, angleToPDOMValueFunction );

    options = merge( {
      cursor: 'pointer',

      // {function} - Extra callback with functionality for the end of drag for the AppendageNode
      onDragEnd: () => {},

      // {function(number):number} - Called during drag, constrains the angle of rotation during mouse dragging
      limitRotation: angle => angle,

      // pdom
      labelTagName: 'label',
      appendLabel: true,
      containerTagName: 'div',
      labelContent: null,

      // the range of motion is mapped around these values
      pdomRange: new Range( -15, 15 ),

      // voicing
      voicingNameResponse: null
    }, options );

    options = merge( {
      keyboardStep: 1,
      shiftKeyboardStep: 1,
      pageKeyboardStep: 2,
      constrainValue: newValue => {
        lastAngle = currentAngle;

        currentAngle = appendageNodeHelper.a11yPositionToAngle( newValue );
        return newValue;
      },
      startDrag: () => {

        appendage.borderVisibleProperty.set( false );

        appendage.isDraggingProperty.set( true );
      },
      endDrag: () => {

        appendage.isDraggingProperty.set( false );

        // optional callback on end of drag
        options.onDragEnd();
      },
      a11yCreateAriaValueText: ( formattedValue, sliderValue, oldSliderValue ) => appendageNodeHelper.createAriaValueText( sliderValue, oldSliderValue ),
      roundToStepSize: true
    }, options );

    // @protected - set up a bidirectional Property to handle updates to angle and slider position
    const sliderProperty = new DynamicProperty( new Property( appendage.angleProperty ), {
      bidirectional: true,

      map: angle => appendageNodeHelper.a11yAngleToPosition( angle ),
      inverseMap: position => appendageNodeHelper.a11yPositionToAngle( position )
    } );

    const pdomValueMin = Utils.toFixedNumber( angleToPDOMValueFunction.evaluate( appendage.angleProperty.range.min ), 0 );
    const pdomValueMax = Utils.toFixedNumber( angleToPDOMValueFunction.evaluate( appendage.angleProperty.range.max ), 0 );
    const sliderMin = Math.min( pdomValueMin, pdomValueMax );
    const sliderMax = Math.max( pdomValueMin, pdomValueMax );

    options.valueProperty = sliderProperty;
    options.enabledRangeProperty = new Property( new Range( sliderMin, sliderMax ) );

    const boundsRequiredOptionKeys = _.pick( options, Node.REQUIRES_BOUNDS_OPTION_KEYS );
    options = _.omit( options, Node.REQUIRES_BOUNDS_OPTION_KEYS );

    super( options );

    // @private
    this.model = appendage;
    this.rangeMap = rangeMap;

    // @private {LinearFunction}
    this.angleToPDOMValueFunction = angleToPDOMValueFunction;

    // @public (a11y) - {Object} arm region when a discharge starts
    this.regionAtDischarge = null;

    this.appendageNodeHelper = appendageNodeHelper;

    // when the model is reset, reset the flags that track previous interactions with the appendage and reset
    // descriptions, no need to dispose this listener since appendages exist for life of sim
    this.model.appendageResetEmitter.addListener( () => {

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
      tandem: tandem.createTandem( 'dragListener' ),
      allowTouchSnag: true,
      start: event => {
        appendage.isDraggingProperty.set( true );
        appendage.borderVisibleProperty.set( false );

        // voicing - on down speak the name and interaction hint
        this.voicingSpeakFullResponse();
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

        // optionally limit rotation of the appendage
        angle = options.limitRotation( angle );

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

        // when we are done dragging with the mouse, place back in traversal order
        this.focusable = true;

        appendage.isDraggingProperty.set( false );

        // optional callback on end of drag
        options.onDragEnd();
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

    // pdom
    this.focusHighlight = new FocusHighlightPath( Shape.circle( 0, 0, this.imageNode.width / 2 ), {
      tandem: tandem.createTandem( 'focusCircle' )
    } );

    this.addInputListener( {

      // prevent user from manipulating with both keybaord and mouse at the same time
      // no need to dispose, listener AppendageNodes should exist for life of sim
      blur: event => {

        // now reset aria-valuetext (not including change in direction)
        this.resetAriaValueText();
      }
    } );

    // @protected - set up a bidirectional Property to handle updates to angle and slider position
    this.sliderProperty = sliderProperty;

    // update the center of the focus highlight when
    appendage.angleProperty.link( angle => {
      this.focusHighlight.center = this.imageNode.center;
    } );

    this.sliderProperty.link( ( value, previousValue ) => {

      // the Voicing object response is the same as the aria-valuetext, but we calculate it directly here rather than
      // using the ariaValuetext getter of AccessibleValueHandler to avoid a dependency on listener order on the
      // sliderProperty which is used to generate the aria-valuetext itself.
      this.voicingObjectResponse = this.appendageNodeHelper.createAriaValueText( value, previousValue );
    } );

    this.mutate( boundsRequiredOptionKeys );
  }

  /**
   * Get the mapped a11y position from the current model Property tracking the angle.
   * @returns {number} - integer value
   * @public
   */
  a11yAngleToPosition( angle ) {
    return this.appendageNodeHelper.a11yAngleToPosition( angle );
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
    this.ariaValueText = this.appendageNodeHelper.createAriaValueText( sliderValue, sliderValue );
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
   * @param  {number} position - integer position of the appendage, mapped from angle
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
      }
    } );

    return message;
  }
}

class AppendageNodeHelper {
  constructor( rangeMap, angleToPDOMValueFunction ) {
    this.rangeMap = rangeMap;
    this.angleToPDOMValueFunction = angleToPDOMValueFunction;
  }

  /**
   * Retrieve the accurate text for a11y display based on the slider property values.
   *
   * @private
   * @param  {Number} position         the new slider input value
   * @param  {Number} previousPosition the old slider input value
   * @returns {String}                  the generated text for the slider
   */
  getTextFromPosition( position, previousPosition ) {
    let valueDescription;

    // generate descriptions that could be used depending on movement
    const newRegion = AppendageNode.getRegion( position, this.rangeMap.regions );
    const landmarkDescription = AppendageNode.getLandmarkDescription( position, this.rangeMap.landmarks );

    if ( landmarkDescription ) {

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
   * @returns {string}
   * @public
   */
  createAriaValueText( position, previousPosition ) {
    return this.getTextFromPosition( position, previousPosition );
  }


  /**
   * Get the mapped a11y position from the current model Property tracking the angle.
   * @returns {number} - integer value
   * @public
   */
  a11yAngleToPosition( angle ) {
    return Utils.roundSymmetric( this.angleToPDOMValueFunction.evaluate( angle ) );
  }

  /**
   * Get the angle from the a11y position of the slider, converting the integer to some floating angle
   * @returns {number}
   * @public
   */
  a11yPositionToAngle( position ) {
    return this.angleToPDOMValueFunction.inverse( position );
  }
}

johnTravoltage.register( 'AppendageNode', AppendageNode );

export default AppendageNode;