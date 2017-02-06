// Copyright 2013-2015, University of Colorado Boulder

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
  var Leg = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Leg' );
  var Electron = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Electron' );
  var LineSegment = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/LineSegment' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sound = require( 'VIBE/Sound' );
  var Vector2 = require( 'DOT/Vector2' );
  var Util = require( 'DOT/Util' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Emitter = require( 'AXON/Emitter' );
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Property = require( 'AXON/Property' );
  var NumberProperty = require( 'AXON/NumberProperty' );

  // phet-io modules
  var TJohnTravoltageModel = require( 'ifphetio!PHET_IO/simulations/john-travoltage/TJohnTravoltageModel' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  // audio
  var shockOuchAudio = require( 'audio!JOHN_TRAVOLTAGE/shock-ouch' );
  var shockAudio = require( 'audio!JOHN_TRAVOLTAGE/shock' );

  // constants
  var MAX_ELECTRONS = 100;
  var FOOT_ON_CARPET_MIN_ANGLE = 1; // in radians, empirically determined
  var FOOT_ON_CARPET_MAX_ANGLE = 2.4; // in radians, empirically determined

  /**
   *
   * @param {Tandem} tandem
   * @constructor
   */
  function JohnTravoltageModel( tandem ) {
    this.tandem = tandem;
    var self = this;

    this.electronsToRemove = [];

    //vertices of path, border of body, sampled using a listener in DebugPositions
    //If you regenerate these, also fix: lineSegmentIndexForSleeve below
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

    this.doorknobPosition = new Vector2( 548.4318903113076, 257.5894162536105 );

    //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    this.sparkProperty = new BooleanProperty( false, {  // TODO: What is sparkVisible vs sparkProperty
      tandem: tandem.createTandem( 'sparkProperty' )
    } );
    this.sparkVisibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'sparkVisibleProperty' )
    } );
    this.legAngularVelocityProperty = new NumberProperty( 0, { // TODO: move to leg
      tandem: tandem.createTandem( 'legAngularVelocityProperty' ),
      phetioValueType: TNumber( { units: 'radians/second' } )
    } );

    // true when the foot is being dragged and is in contact with the carpet
    this.shoeOnCarpetProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'shoeOnCarpetProperty' )
    } );

    this.soundProperty = new BooleanProperty( true, {
      tandem: tandem.createTandem( 'soundProperty' )
    } );
    Property.preventGetSet( this, 'sound' ); // TODO: Remove this line
    Property.preventGetSet( this, 'spark' ); // TODO: Remove this line
    Property.preventGetSet( this, 'sparkVisible' ); // TODO: Remove this line
    Property.preventGetSet( this, 'legAngularVelocity' ); // TODO: Remove this line
    Property.preventGetSet( this, 'shoeOnCarpet' ); // TODO: Remove this line

    this.sparkVisibleProperty.link( function( sparkVisible ) {
      if ( sparkVisible && self.soundProperty.get() ) {
        self.sounds[ Math.floor( phet.joist.random.nextDouble() * 2 ) ].play();
      }
    } );

    this.electrons = new ObservableArray();
    this.arm = new Arm( tandem.createTandem( 'arm' ) );
    this.leg = new Leg( tandem.createTandem( 'leg' ) );
    this.legAngleAtPreviousStep = this.leg.angleProperty.get();

    // @public - emitters for reset and step events
    this.stepEmitter = new Emitter();
    this.resetEmitter = new Emitter();

    // @public (a11y) - emitter for when an electron discharge finishes or is canceled
    this.dischargeEndedEmitter = new Emitter();

    // TODO: (from jbphet) - IMO, sounds should be in the view, not here.  Sonification was done in the view, these
    // TODO: should be moved to the view for consistency.
    this.sounds = [
      new Sound( shockOuchAudio ),
      new Sound( shockAudio )
    ];

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
          self.addElectron();
          accumulatedAngle -= accumulatedAngleThreshold;
        }
        lastAngle = angle;
      }
    } );

    var array = [];
    for ( var i = 0; i < this.bodyVertices.length - 1; i++ ) {
      var current = this.bodyVertices[ i ];
      var next = this.bodyVertices[ i + 1 ];
      array.push( new LineSegment( current.x, current.y, next.x, next.y ) );
    }
    //TODO: store, do not reallocate
    var lineSegment = new LineSegment( this.bodyVertices[ this.bodyVertices.length - 1 ].x, this.bodyVertices[ this.bodyVertices.length - 1 ].y, this.bodyVertices[ 0 ].x, this.bodyVertices[ 0 ].y );
    array.push( lineSegment );
    this.lineSegments = array;
    this.lineSegmentIndexForSleeve = 22;

    this.electronGroupTandem = this.tandem.createGroupTandem( 'electron' ); // @private

    tandem.addInstance( this, TJohnTravoltageModel );
  }

  //Function to determine if electrons are exiting.
  var exiting = function( e ) {return e.exiting;};

  johnTravoltage.register( 'JohnTravoltageModel', JohnTravoltageModel );

  return inherit( Object, JohnTravoltageModel, {

    reset: function() {
      //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
      this.sparkProperty.reset();
      this.sparkVisibleProperty.reset();
      this.legAngularVelocityProperty.reset();
      this.shoeOnCarpetProperty.reset();
      this.soundProperty.reset();
      this.arm.reset();
      this.leg.reset();
      while ( this.electrons.length > 0 ) {
        this.removeElectron( this.electrons.get( 0 ) );
      }
      this.resetEmitter.emit();
    },
    getLineSegments: function() {
      return this.lineSegments;
    },
    // Called by the animation loop
    step: function( dt ) {

      //Clamp dt, since navigating to another tab and back gives the particles an apparent burst of energy, see #25
      if ( dt > 2 / 60 ) {
        dt = 2 / 60;
      }

      //Test for spark.  Check every step so that newly added electrons can be assigned to exit if the threshold is still exceeded, see #27
      //If the finger is touching the doorknob, discharge everything
      var distToKnob = this.arm.getFingerPosition().distance( this.doorknobPosition );

      //Minimum distance the finger can be to the knob, if pointed directly at it.  Sampled at runtime by printing angles.  Must be adjusted if the doorknob position is adjusted.
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

      //If we are under the threshold, consider stopping the spark, but only if no electrons are close to the finger
      else {

        //Stop the spark, but only if the finger has moved further enough from the doorknob
        //Use an increased threshold to model the more conductive path once the spark has started
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

      //Step the model
      var length = this.electrons.length;
      for ( var i = 0; i < length; i++ ) {
        this.electrons._array[ i ].step( dt );
      }
      var wasSpark = this.sparkVisibleProperty.get();
      if ( this.electronsToRemove.length ) {
        this.sparkVisibleProperty.set( true );
      }
      while ( this.electronsToRemove.length ) {
        this.removeElectron( this.electronsToRemove.pop() );
      }

      if ( this.electrons.length === 0 || _.filter( this.electrons._array, exiting ).length === 0 ) {

        //Make sure the spark shows at least one frame for a single electron exiting, see #55
        if ( wasSpark ) {
          this.sparkVisibleProperty.set( false );
          delete this.sparkCreationDistToKnob;

          this.dischargeEndedEmitter.emit();
        }
      }

      this.legAngularVelocityProperty.set( ( this.leg.angleProperty.get() - this.legAngleAtPreviousStep ) / dt );
      this.legAngleAtPreviousStep = this.leg.angleProperty.get();
      this.shoeOnCarpetProperty.set( ( this.leg.angleProperty.get() > FOOT_ON_CARPET_MIN_ANGLE && this.leg.angleProperty.get() < FOOT_ON_CARPET_MAX_ANGLE  ) );

      this.stepEmitter.emit();
    },
    removeElectron: function( electron ) {
      this.electrons.remove( electron );
      electron.dispose();
    },
    addElectron: function() {

      var segment = new LineSegment( 424.0642054574639, 452.28892455858755, 433.3097913322633, 445.5088282504014 );
      var v = segment.vector;
      var rand = phet.joist.random.nextDouble() * v.magnitude();

      var point = segment.p0.plus( v.normalized().times( rand ) );

      this.electrons.add( new Electron( point.x, point.y, this, this.electronGroupTandem.createNextTandem() ) );

      //For debugging: show randomly in the middle for debugging
      var debugging = false;
      if ( debugging ) {
        var random = phet.joist.random;
        this.electrons.add(
          new Electron(
            this.bodyVertices[ 0 ].x + 50 + 50 * random.nextDouble(),
            this.bodyVertices[ 0 ].y - 75 + 50 * random.nextDouble(),
            this,
            this.tandem.createTandem( 'electrons', this.electrons.length )
          ) );
      }
    },

    //Electrons can get outside of the body when moving to the spark, this code moves them back inside
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
    }
  }, {
    MAX_ELECTRONS: MAX_ELECTRONS
  } );
} );
