// Copyright 2013-2019, University of Colorado Boulder

/**
 * Model for John Travoltage.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function( require ) {
  'use strict';

  // modules
  var Arm = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Arm' );
  var BooleanIO = require( 'TANDEM/types/BooleanIO' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var DerivedProperty = require( 'AXON/DerivedProperty' );
  var DerivedPropertyIO = require( 'AXON/DerivedPropertyIO' );
  var Electron = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Electron' );
  var ElectronIO = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/ElectronIO' );
  var Emitter = require( 'AXON/Emitter' );
  var Group = require( 'TANDEM/Group' );
  var Shape = require( 'KITE/Shape' );
  var GroupIO = require( 'TANDEM/GroupIO' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  var LineSegment = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/LineSegment' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var MAX_ELECTRONS = 100;
  var FOOT_ON_CARPET_MIN_ANGLE = 1; // in radians, empirically determined
  var FOOT_ON_CARPET_MAX_ANGLE = 2.4; // in radians, empirically determined

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function JohnTravoltageModel( tandem ) {
    var self = this;

    this.electronsToRemove = [];

    //vertices of path, border of body, sampled using a listener in DebugUtils
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
      new Vector2( 233.76573705179285, 446.4063745019921),
      new Vector2( 580.7426294820718, 447.01832669322715),
      new Vector2( 520.1593625498009, 495.3625498007969)
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

    this.electrons = new Group( 'electron', {
      prototype: {
        create: tandem => {
          var segment = new LineSegment( 424.0642054574639, 452.28892455858755, 433.3097913322633, 445.5088282504014 );
          var v = segment.vector;
          var rand = phet.joist.random.nextDouble() * v.magnitude;

          var point = segment.p0.plus( v.normalized().times( rand ) );
          return new Electron( point.x, point.y, this, { tandem: tandem } );
        }
      }
    }, {
      tandem: tandem.createTandem( 'electrons' ),
      phetioType: GroupIO( ElectronIO )
    } );

    // Anytime an electron is removed, we want to dispose it.
    this.electrons.addItemRemovedListener( electron => electron.dispose() );

    this.arm = new Arm( tandem.createTandem( 'arm' ) );
    this.leg = new Leg( tandem.createTandem( 'leg' ) );
    this.legAngleAtPreviousStep = this.leg.angleProperty.get();

    // @public (read-only) - closed shape for the body that contains electrons, from body vertices above
    this.bodyShape = new Shape();
    this.bodyShape.moveTo( this.bodyVertices[ 0 ].x, this.bodyVertices[ 0 ].y );
    for ( let i = 0; i < this.bodyVertices.length; i++ ) {
      this.bodyShape.lineTo( this.bodyVertices[ i ].x, this.bodyVertices[ i ].y );
    }
    this.bodyShape.close();

    // @public (read-only) - closed shape for the carpet in this sim
    this.carpetShape = new Shape();
    this.carpetShape.moveTo( this.carpetVertices[ 0 ].x, this.carpetVertices[ 0 ].y );
    for ( let i = 0; i < this.carpetVertices.length; i++ ) {
      this.carpetShape.lineTo( this.carpetVertices[ i ].x, this.carpetVertices[ i ].y );
    }
    this.carpetShape.close();

    // true when the foot is in contact with the carpet
    this.shoeOnCarpetProperty = new DerivedProperty( [ this.leg.angleProperty ],
      angle => angle > FOOT_ON_CARPET_MIN_ANGLE && angle < FOOT_ON_CARPET_MAX_ANGLE, {
        phetioType: DerivedPropertyIO( BooleanIO ),
        tandem: tandem.createTandem( 'shoeOnCarpetProperty' )
      } );

    // @public - emitters for reset and step events
    this.stepEmitter = new Emitter();

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

    // @public - true when a pointer is down over the body
    this.touchingBodyProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'touchingBodyProperty' )
    } );

    // @public - true when a pointer is down over the carpet
    this.touchingCarpetProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'touchingCarpetProperty' )
    } );

    //If leg dragged across carpet, add electron.  Lazy link so that it won't add an electron when the sim starts up.
    //The number of electrons accumulated only depends on the total angle subtended
    var lastAngle = this.leg.angleProperty.get();
    var accumulatedAngle = 0;
    var accumulatedAngleThreshold = Math.PI / 16;
    this.leg.angleProperty.lazyLink( function( angle ) {
      if ( angle > FOOT_ON_CARPET_MIN_ANGLE &&
           angle < FOOT_ON_CARPET_MAX_ANGLE &&
           self.electrons.length < MAX_ELECTRONS ) {

        accumulatedAngle += Math.abs( angle - lastAngle );

        while ( accumulatedAngle > accumulatedAngleThreshold ) {
          if ( self.electrons.length < MAX_ELECTRONS ) {
            self.electrons.createNextGroupMember();
          }
          accumulatedAngle -= accumulatedAngleThreshold;
        }
      }
      lastAngle = angle;
    } );

    // reset angle counting variables when the sim is reset - does not need to be disposed
    this.resetEmitter.addListener( function() {
      lastAngle = self.leg.angleProperty.initialValue;
      accumulatedAngle = 0;
    } );

    var array = [];
    for ( let i = 0; i < this.bodyVertices.length - 1; i++ ) {
      var current = this.bodyVertices[ i ];
      var next = this.bodyVertices[ i + 1 ];
      array.push( new LineSegment( current.x, current.y, next.x, next.y ) );
    }

    var lineSegment = new LineSegment( this.bodyVertices[ this.bodyVertices.length - 1 ].x, this.bodyVertices[ this.bodyVertices.length - 1 ].y, this.bodyVertices[ 0 ].x, this.bodyVertices[ 0 ].y );
    array.push( lineSegment );
    this.lineSegments = array;
  }

  //Function to determine if electrons are exiting.
  var exiting = function( e ) {return e.exiting;};

  johnTravoltage.register( 'JohnTravoltageModel', JohnTravoltageModel );

  return inherit( Object, JohnTravoltageModel, {

    /**
     * Reset the model when "Reset All" is pressed.
     * @public
     */
    reset: function() {

      // Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
      this.resetInProgressProperty.set( true );
      this.resetEmitter.emit();
      this.sparkVisibleProperty.reset();
      this.arm.reset();
      this.leg.reset();
      this.electrons.clear();
      this.resetInProgressProperty.set( false );
    },

    /**
     * Main step function for the model, called by animation loop in Sim.
     * @param  {number} dt - seconds
     * @public
     */
    step: function( dt ) {

      //Clamp dt, since navigating to another tab and back gives the particles an apparent burst of energy, see #25
      if ( dt > 2 / 60 ) {
        dt = 2 / 60;
      }

      // Test for spark.  Check every step so that newly added electrons can be assigned to exit if the threshold is still exceeded, see #27
      // If the finger is touching the doorknob, discharge everything
      var distToKnob = this.arm.getFingerPosition().distance( this.doorknobPosition );

      // Minimum distance the finger can be to the knob, if pointed directly at it.  Sampled at runtime by printing angles.  Must be adjusted if the doorknob position is adjusted.
      var actualMin = 15;

      var query = this.electrons.length / distToKnob;
      var threshold = 10 / actualMin;

      var electronThresholdExceeded = query > threshold;
      if ( electronThresholdExceeded ) {
        this.sparkCreationDistToKnob = distToKnob;

        //Mark all electrons for exiting
        for ( var j = 0; j < this.electrons.length; j++ ) {
          this.electrons.get( j ).exiting = true;
        }
      }

      // If we are under the threshold, consider stopping the spark, but only if no electrons are close to the finger
      else {

        // Stop the spark, but only if the finger has moved further enough from the doorknob
        // Use an increased threshold to model the more conductive path once the spark has started
        if ( this.sparkCreationDistToKnob && distToKnob > this.sparkCreationDistToKnob + 10 ) {
          for ( var k = 0; k < this.electrons.length; k++ ) {
            var electron = this.electrons.get( k );

            //Tune the distance threshold to make sure the spark will shut off more quickly when the finger moved far from the doorknob, but not soo small that electrons can leak out of the body, see #27
            if ( electron.positionProperty.get().distance( this.doorknobPosition ) > 100 ) {
              var wasExiting = electron.exiting;
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
      var length = this.electrons.length;
      for ( var i = 0; i < length; i++ ) {
        this.electrons._array[ i ].step( dt );
      }
      var wasSpark = this.sparkVisibleProperty.get();
      if ( this.electronsToRemove.length ) {
        this.sparkVisibleProperty.set( true );
      }
      if ( !wasSpark && this.sparkVisibleProperty.get() ) {

        // spark is just turning visible, notify that a dischage has started
        this.dischargeStartedEmitter.emit();
      }

      while ( this.electronsToRemove.length ) {
        this.electrons.remove( this.electronsToRemove.pop() );
      }

      if ( this.electrons.length === 0 || _.filter( this.electrons._array, exiting ).length === 0 ) {

        // Make sure the spark shows at least one frame for a single electron exiting, see #55
        if ( wasSpark ) {
          this.sparkVisibleProperty.set( false );
          delete this.sparkCreationDistToKnob;

          this.dischargeEndedEmitter.emit();
        }
      }

      this.leg.angularVelocityProperty.set( ( this.leg.angleProperty.get() - this.legAngleAtPreviousStep ) / dt );
      this.legAngleAtPreviousStep = this.leg.angleProperty.get();

      this.stepEmitter.emit();
    },

    /**
     * Electrons can get outside of the body when moving to the spark.  This code moves an electron back inside
     * if this happens.
     * @param  {Electron} electron
     */
    moveElectronInsideBody: function( electron ) {
      var pt = electron.positionProperty.get();

      //Adjacent segments share vertices, so use a point just before the vertex to find the closest segment, see https://github.com/phetsims/john-travoltage/issues/50
      var closestSegment = _.minBy( this.lineSegments, function( lineSegment ) {
        return Util.distToSegmentSquared( pt, lineSegment.pre0, lineSegment.pre1 );
      } );
      var vector = pt.minus( closestSegment.center );
      if ( vector.dot( closestSegment.normal ) > 0 ) {
        //put it 1px inside the segment
        electron.positionProperty.set( closestSegment.center.plus( closestSegment.normal.times( -1 ) ) );
      }
    },

    bodyContainsPoint: function( point ) {
      return this.bodyShape.containsPoint( point );
    }
  }, {

    // statics

    // max number of electrons that can be inside the body
    MAX_ELECTRONS: MAX_ELECTRONS,

    // min and max angle where foot is on carpet, in radians
    FOOT_ON_CARPET_MIN_ANGLE: FOOT_ON_CARPET_MIN_ANGLE,
    FOOT_ON_CARPET_MAX_ANGLE: FOOT_ON_CARPET_MAX_ANGLE
  } );
} );
