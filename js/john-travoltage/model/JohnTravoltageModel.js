// Copyright 2013-2022, University of Colorado Boulder

/**
 * Model for John Travoltage.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner.com)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Emitter from '../../../../axon/js/Emitter.js';
import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import PhetioGroup from '../../../../tandem/js/PhetioGroup.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import johnTravoltage from '../../johnTravoltage.js';
import Arm from './Arm.js';
import Electron from './Electron.js';
import Leg from './Leg.js';
import LineSegment from './LineSegment.js';

// constants
const MAX_ELECTRONS = 100;
const FOOT_ON_CARPET_MIN_ANGLE = 1; // in radians, empirically determined
const FOOT_ON_CARPET_MAX_ANGLE = 2.4; // in radians, empirically determined

class JohnTravoltageModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {

    this.electronsToRemove = [];

    //vertices of path, border of body, sampled using a listener in DebugUtils - the charges in
    //this sim are constrained to this shape
    this.bodyVertices = [ new Vector2( 422.21508828250404, 455.370786516854 ),
      new Vector2( 403.10754414125205, 424.5521669341895 ),
      new Vector2( 379.68539325842704, 328.3980738362762 ),
      new Vector2( 357.4959871589086, 335.17817014446234 ),
      new Vector2( 309.4189406099519, 448.5906902086678 ),
      new Vector2( 322.362760834671, 473.86195826645275 ),
      new Vector2( 284.14767255216697, 461.5345104333869 ),
      new Vector2( 327.9101123595506, 341.95826645264856 ),
      new Vector2( 281.6821829855538, 296.34670947030503 ),
      new Vector2( 286.6131621187801, 202.65810593900486 ),
      new Vector2( 318.66452648475126, 147.800963081862 ),
      new Vector2( 349.48314606741576, 118.83146067415731 ),
      new Vector2( 387.08186195826653, 110.20224719101125 ),
      new Vector2( 407.42215088282506, 75.06902086677371 ),
      new Vector2( 425.9133226324238, 75.06902086677371 ),
      new Vector2( 439.4735152487962, 85.54735152487964 ),
      new Vector2( 433.9261637239166, 118.21508828250404 ),
      new Vector2( 420.9823434991975, 126.2279293739968 ),
      new Vector2( 403.7239165329053, 128.07704654895667 ),
      new Vector2( 393.2455858747994, 142.25361155698238 ),
      new Vector2( 408.0385232744784, 171.22311396468703 ),
      new Vector2( 423.44783306581064, 221.14927768860358 ),
      new Vector2( 487.5505617977529, 217.45104333868383 ),
      new Vector2( 485.701444622793, 228.54574638844306 ),
      new Vector2( 432.07704654895673, 240.25682182985557 ),
      new Vector2( 392.0128410914928, 224.23113964687002 ),
      new Vector2( 390.7800963081863, 280.9373996789728 ),
      new Vector2( 404.34028892455865, 319.1524879614768 ),
      new Vector2( 414.81861958266455, 404.2118780096309 ),
      new Vector2( 435.15890850722315, 433.18138041733556 ),
      new Vector2( 464.1284109149278, 433.79775280898883 ) ];

    // outline of the entire image of johns body excluding the draggable arm and leg - used
    // to determine if pointer is currently over the body shape for accessibility prototyping
    this.touchableBodyVertices = [
      new Vector2( 267.6994577846631, 311.2625871417506 ),
      new Vector2( 267.1045701006972, 219.64988381099923 ),
      new Vector2( 305.7722695584818, 136.96049573973664 ),
      new Vector2( 340.2757552285051, 108.40588690937257 ),
      new Vector2( 366.45081332300543, 99.48257164988381 ),
      new Vector2( 379.53834237025563, 100.07745933384972 ),
      new Vector2( 404.5236250968242, 63.78931061192873 ),
      new Vector2( 443.7862122385748, 68.54841208365607 ),
      new Vector2( 459.25329202168865, 80.44616576297443 ),
      new Vector2( 452.11463981409764, 90.55925639039503 ),
      new Vector2( 447.95042602633623, 123.2780790085205 ),
      new Vector2( 433.6731216111542, 139.9349341595662 ),
      new Vector2( 397.3849728892332, 141.12470952749806 ),
      new Vector2( 395.60030983733543, 252.3687064291247 ),
      new Vector2( 403.9287374128583, 287.4670797831139 ),
      new Vector2( 338.4910921766073, 295.2006196746708 ),
      new Vector2( 336.1115414407436, 423.6963594113091 ),
      new Vector2( 316.4802478698684, 457.60495739736643 ),
      new Vector2( 339.6808675445391, 476.04647560030986 ),
      new Vector2( 333.73199070488, 492.10844306738966 ),
      new Vector2( 271.2687838884586, 481.40046475600315 ),
      new Vector2( 271.8636715724245, 448.08675445391174 ),
      new Vector2( 309.9364833462433, 358.2587141750581 ),
      new Vector2( 267.6994577846631, 310.6676994577847 )
    ];

    //lines, to which electrons moves, when spark happened
    this.forceLines = [
      new LineSegment( 300.6483412322275, 443.79905213270143, 341.41421800947865, 338.97251184834124 ),
      new LineSegment( 341.41421800947865, 335.33270142180095, 373.44454976303314, 204.29952606635067 ),
      new LineSegment( 423.6739336492891, 438.703317535545, 406.2028436018957, 406.6729857819905 ),
      new LineSegment( 406.2028436018957, 405.2170616113744, 393.0995260663507, 330.2369668246445 ),
      new LineSegment( 392.37156398104264, 327.3251184834123, 375.6284360189573, 253.80094786729856 ),
      new LineSegment( 377.08436018957343, 212.30710900473932, 395.28341232227484, 205.02748815165873 ),
      new LineSegment( 398.92322274881514, 206.48341232227486, 418.5781990521327, 225.4104265402843 ),
      new LineSegment( 418.5781990521327, 225.4104265402843, 516.8530805687203, 219.58672985781985 ),
      new LineSegment( 417.85023696682464, 100.9289099526066, 385.81990521327015, 127.13554502369666 ),
      new LineSegment( 379.9962085308057, 134.41516587677722, 366.89289099526064, 167.17345971563978 ),
      new LineSegment( 369.8047393364929, 172.26919431279617, 392.37156398104264, 195.563981042654 ),
      new LineSegment( 317.3914691943128, 255.98483412322273, 355.9734597156398, 222.4985781990521 )
    ];

    // vertices of the carpet shape in the background, determined with the listeners in DebugUtils
    this.carpetVertices = [
      new Vector2( 126.67410358565739, 492.91474103585665 ),
      new Vector2( 233.76573705179285, 446.4063745019921 ),
      new Vector2( 580.7426294820718, 447.01832669322715 ),
      new Vector2( 520.1593625498009, 495.3625498007969 )
    ];

    this.doorknobPosition = new Vector2( 548.4318903113076, 257.5894162536105 );

    //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    this.sparkVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'sparkVisibleProperty' )
    } );

    // true when a reset is in progress
    this.resetInProgressProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'resetInProgressProperty' )
    } );

    this.electronGroup = new PhetioGroup( tandem => {
      const segment = new LineSegment( 424.0642054574639, 452.28892455858755, 433.3097913322633, 445.5088282504014 );
      const v = segment.vector;
      const rand = dotRandom.nextDouble() * v.magnitude;

      const point = segment.p0.plus( v.normalized().times( rand ) );
      return new Electron( point.x, point.y, this, { tandem: tandem } );
    }, [], {
      tandem: tandem.createTandem( 'electronGroup' ),
      phetioType: PhetioGroup.PhetioGroupIO( Electron.ElectronIO )
    } );

    this.arm = new Arm( tandem.createTandem( 'arm' ) );
    this.leg = new Leg( tandem.createTandem( 'leg' ) );
    this.legAngleAtPreviousStep = this.leg.angleProperty.get();

    // @public (read-only) - closed shape for the body that contains electrons, from body vertices above
    this.bodyShape = JohnTravoltageModel.createObjectShape( this.bodyVertices );

    // @public (read-only) - closed shape for the carpet in this sim
    this.carpetShape = JohnTravoltageModel.createObjectShape( this.carpetVertices );

    // @public - shape for the body, used to explore haptic feedback which is presented whenever
    // a pointer interacts with this shape - has no impact on electron motion
    this.touchableBodyShape = JohnTravoltageModel.createObjectShape( this.touchableBodyVertices );

    // @public - emitters for reset and step events
    this.stepEmitter = new Emitter( {
      parameters: [ {
        valueType: 'number'
      } ]
    } );

    // @public - emitter called when the reset all button is pressed
    this.resetEmitter = new Emitter( {
      tandem: tandem.createTandem( 'resetEmitter' )
    } );

    // @public (a11y) - emitter for when an electron discharge finishes or is canceled
    this.dischargeEndedEmitter = new Emitter( {
      tandem: tandem.createTandem( 'dischargeEndedEmitter' )
    } );

    // @public (a11y) - emits an event when the discharge starts
    this.dischargeStartedEmitter = new Emitter( {
      tandem: tandem.createTandem( 'dischargeStartedEmitter' )
    } );

    // @public {number} - Number of electrons that left the body in a particular discharge event, resets to 0
    this.numberOfElectronsDischarged = 0;

    // updates the number of electrons discharged in a discharge event
    let numberOfElectronsOnDischargeStart = 0;
    this.dischargeStartedEmitter.addListener( () => {
      numberOfElectronsOnDischargeStart = this.electronGroup.count;
    } );
    this.dischargeEndedEmitter.addListener( () => {
      this.numberOfElectronsDischarged = numberOfElectronsOnDischargeStart - this.electronGroup.count;
    } );

    //--------------------------------------------------------------------------
    // The following Properties are being used to explore haptic feedback, they
    // are to be used in prototypes and view representations are hidden behind
    // query parameters
    //--------------------------------------------------------------------------

    // TODO: consider an encapsulation for these "touching" Properties
    // @public - true when a pointer is down over the body
    this.touchingBodyProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'touchingBodyProperty' )
    } );

    // @public - true when a pointer is down over the carpet
    this.touchingCarpetProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'touchingCarpetProperty' )
    } );

    this.touchingArmProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'touchingArmProperty' )
    } );

    this.touchingLegProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'touchingLegProperty' )
    } );

    // TODO: consider moving such an emitter to utteranceQueue if this is useful
    this.utteranceAddedEmitter = new Emitter( {
      parameters: [ { name: 'utterance', phetioType: StringIO } ],
      tandem: tandem.createTandem( 'utterance' )
    } );

    //If leg dragged across carpet, add electron.  Lazy link so that it won't add an electron when the sim starts up.
    //The number of electrons accumulated only depends on the total angle subtended
    let lastAngle = this.leg.angleProperty.get();
    let accumulatedAngle = 0;
    const accumulatedAngleThreshold = Math.PI / 16;
    this.leg.angleProperty.lazyLink( angle => {
      if ( angle > FOOT_ON_CARPET_MIN_ANGLE &&
           angle < FOOT_ON_CARPET_MAX_ANGLE &&
           this.electronGroup.count < MAX_ELECTRONS &&
           !phet.joist.sim.isSettingPhetioStateProperty.value ) { // PhET-iO state handles creating its own electrons

        accumulatedAngle += Math.abs( angle - lastAngle );

        while ( accumulatedAngle > accumulatedAngleThreshold ) {
          if ( this.electronGroup.count < MAX_ELECTRONS ) {
            this.electronGroup.createNextElement();
          }
          accumulatedAngle -= accumulatedAngleThreshold;
        }
      }
      lastAngle = angle;
    } );

    // reset angle counting variables when the sim is reset - does not need to be disposed
    this.resetEmitter.addListener( () => {
      lastAngle = this.leg.angleProperty.initialValue;
      accumulatedAngle = 0;

      // reset the number of electrons discharged for next discharge event
      this.numberOfElectronsDischarged = 0;
    } );

    const array = [];
    for ( let i = 0; i < this.bodyVertices.length - 1; i++ ) {
      const current = this.bodyVertices[ i ];
      const next = this.bodyVertices[ i + 1 ];
      array.push( new LineSegment( current.x, current.y, next.x, next.y ) );
    }

    const lineSegment = new LineSegment( this.bodyVertices[ this.bodyVertices.length - 1 ].x, this.bodyVertices[ this.bodyVertices.length - 1 ].y, this.bodyVertices[ 0 ].x, this.bodyVertices[ 0 ].y );
    array.push( lineSegment );
    this.lineSegments = array;
  }


  /**
   * Reset the model when "Reset All" is pressed.
   * @public
   */
  reset() {

    // Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    this.resetInProgressProperty.set( true );
    this.resetEmitter.emit();
    this.sparkVisibleProperty.reset();
    this.arm.reset();
    this.leg.reset();
    this.electronGroup.clear();
    this.resetInProgressProperty.set( false );
  }

  /**
   * Main step function for the model, called by animation loop in Sim.
   * @param  {number} dt - seconds
   * @public
   */
  step( dt ) {

    //Clamp dt, since navigating to another tab and back gives the particles an apparent burst of energy, see #25
    if ( dt > 2 / 60 ) {
      dt = 2 / 60;
    }

    // Test for spark.  Check every step so that newly added electrons can be assigned to exit if the threshold is still exceeded, see #27
    // If the finger is touching the doorknob, discharge everything
    const distToKnob = this.arm.getFingerPosition().distance( this.doorknobPosition );

    // Minimum distance the finger can be to the knob, if pointed directly at it.  Sampled at runtime by printing angles.  Must be adjusted if the doorknob position is adjusted.
    const actualMin = 15;

    const query = this.electronGroup.count / distToKnob;
    const threshold = 10 / actualMin;

    const electronThresholdExceeded = query > threshold;
    if ( electronThresholdExceeded ) {
      this.sparkCreationDistToKnob = distToKnob;

      //Mark all electrons for exiting
      for ( let j = 0; j < this.electronGroup.count; j++ ) {
        this.electronGroup.getElement( j ).exiting = true;
      }
    }

    // If we are under the threshold, consider stopping the spark, but only if no electrons are close to the finger
    else {

      // Stop the spark, but only if the finger has moved further enough from the doorknob
      // Use an increased threshold to model the more conductive path once the spark has started
      if ( this.sparkCreationDistToKnob && distToKnob > this.sparkCreationDistToKnob + 10 ) {
        for ( let k = 0; k < this.electronGroup.count; k++ ) {
          const electron = this.electronGroup.getElement( k );

          //Tune the distance threshold to make sure the spark will shut off more quickly when the finger moved far from the doorknob, but not soo small that electrons can leak out of the body, see #27
          if ( electron.positionProperty.get().distance( this.doorknobPosition ) > 100 ) {
            const wasExiting = electron.exiting;
            electron.exiting = false;

            //Choose a new nearest segment when traveling toward finger again
            electron.segment = null;
            electron.lastSegment = null;

            //Ensure the electron is within the bounds of the body
            if ( wasExiting ) {
              this.moveElectronInsideBody( electron );
            }
          }
        }
      }
    }

    // Step the model
    const length = this.electronGroup.count;
    for ( let i = 0; i < length; i++ ) {
      this.electronGroup.getElement( i ).step( dt );
    }
    const wasSpark = this.sparkVisibleProperty.get();
    if ( this.electronsToRemove.length ) {
      this.sparkVisibleProperty.set( true );
    }
    if ( !wasSpark && this.sparkVisibleProperty.get() ) {

      // spark is just turning visible, notify that a dischage has started
      this.dischargeStartedEmitter.emit();
    }

    while ( this.electronsToRemove.length ) {
      this.electronGroup.disposeElement( this.electronsToRemove.pop() );
    }

    if ( this.electronGroup.count === 0 || _.filter( this.electronGroup.getArray(), exiting ).length === 0 ) {

      // Make sure the spark shows at least one frame for a single electron exiting, see #55
      if ( wasSpark ) {
        this.sparkVisibleProperty.set( false );
        delete this.sparkCreationDistToKnob;

        this.dischargeEndedEmitter.emit();
      }
    }

    this.leg.angularVelocityProperty.set( ( this.leg.angleProperty.get() - this.legAngleAtPreviousStep ) / dt );
    this.legAngleAtPreviousStep = this.leg.angleProperty.get();

    this.stepEmitter.emit( dt );
  }

  /**
   * Electrons can get outside of the body when moving to the spark.  This code moves an electron back inside
   * if this happens.
   * @param  {Electron} electron
   * @public
   */
  moveElectronInsideBody( electron ) {
    const pt = electron.positionProperty.get();

    //Adjacent segments share vertices, so use a point just before the vertex to find the closest segment, see https://github.com/phetsims/john-travoltage/issues/50
    const closestSegment = _.minBy( this.lineSegments, lineSegment => Utils.distToSegmentSquared( pt, lineSegment.pre0, lineSegment.pre1 ) );
    const vector = pt.minus( closestSegment.center );
    if ( vector.dot( closestSegment.normal ) > 0 ) {
      //put it 1px inside the segment
      electron.positionProperty.set( closestSegment.center.plus( closestSegment.normal.times( -1 ) ) );
    }
  }

  /**
   * @param point
   * @returns {boolean}
   * @public
   */
  bodyContainsPoint( point ) {
    return this.bodyShape.containsPoint( point );
  }

  // statics

  /**
   * Create a shape that defines an object. Vertices are provided and generally determined by inspection with the
   * DebugUtils.debugPositions.
   * @private
   * @static
   *
   * @returns {Shape}
   */
  static createObjectShape( vertices ) {
    const objectShape = new Shape();
    objectShape.moveTo( vertices[ 0 ].x, vertices[ 0 ].y );
    for ( let i = 0; i < vertices.length; i++ ) {
      objectShape.lineTo( vertices[ i ].x, vertices[ i ].y );
    }
    objectShape.close();

    return objectShape;
  }
}


// max number of electrons that can be inside the body
JohnTravoltageModel.MAX_ELECTRONS = MAX_ELECTRONS;

// min and max angle where foot is on carpet, in radians
JohnTravoltageModel.FOOT_ON_CARPET_MIN_ANGLE = FOOT_ON_CARPET_MIN_ANGLE;
JohnTravoltageModel.FOOT_ON_CARPET_MAX_ANGLE = FOOT_ON_CARPET_MAX_ANGLE;

//Function to determine if electrons are exiting.
const exiting = e => e.exiting;

johnTravoltage.register( 'JohnTravoltageModel', JohnTravoltageModel );

export default JohnTravoltageModel;