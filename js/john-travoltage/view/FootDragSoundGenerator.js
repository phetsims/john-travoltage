// Copyright 2018, University of Colorado Boulder

/**
 * Sound generator used to produce a sound like that of a foot being dragged on a carpet.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var NoiseGenerator = require( 'TAMBO/sound-generators/NoiseGenerator' );
  var SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );

  // constants
  var MIN_CONTACT_ANGLE = 1.15; // in radians, angle below which the foot is not in contact with the carpet
  var MAX_CONTACT_ANGLE = 2.25; // in radians, angle above which the foot is not in contact with the carpet
  var MAX_DRAG_SOUND_VOLUME = 4; // can be greater than 1 because filtering tends to reduce output a lot
  var VELOCITY_REDUCTION_RATE = 50; // amount per second, empirically determined for best sound
  var STILLNESS_TIME = 0.064; // in seconds, if there are no angle updates for this long, the leg is considered still
  var NOISE_CENTER_FREQUENCY = 1500; // Hz
  var DIRECTION_FREQ_DELTA = 75; // difference from center frequency for forward versus backward movement
  var MAX_LEG_ANGULAR_VELOCITY = 10; // in radians/sec, see explanatory note where this is used
  var MIN_SOUND_GAP = 0.05; // in seconds
  var NOISE_START_TIME_CONSTANT = 0.2;
  var NOISE_STOP_TIME_CONSTANT = 0.02;
  var NOISE_OFF_TIME = 0.5; // in seconds

  /**
   * @constructor
   * {Property.<number>} legAngleProperty - angle of leg in radians
   * {Object} [options]
   */
  function FootDragSoundGenerator( legAngleProperty, options ) {

    var self = this;
    SoundGenerator.call( this, options );

    // @private {NoiseGenerator} - the noise generator that will serve as the source of the basic dragging sound
    this.noiseGenerator = new NoiseGenerator( {
      noiseType: 'pink',
      centerFrequency: NOISE_CENTER_FREQUENCY,
      Q: 2,
      initialOutputLevel: 0
    } );

    // connect the noise generator to the output path
    this.noiseGenerator.connect( this.masterGainNode );

    // @private - state variables for keeping track of what the foot is doing
    this.legAngleUpdateTime = null;
    this.legAngularVelocity = 0;
    this.previousStepTime = 0;
    this.soundStartCountdown = 0;
    this.motionState = 'still'; // valid values are 'still', 'forward', and 'backward'
    var legAngle = null;

    // monitor the leg angle and adjust the noise output accordingly
    legAngleProperty.link( function( newLegAngle ) {
      var now = self.audioContext.currentTime;

      // determine whether the foot is on the carpet
      var footOnCarpet = newLegAngle > MIN_CONTACT_ANGLE && newLegAngle < MAX_CONTACT_ANGLE;

      // update the angular velocity of the leg and determine the motion state
      var newMotionState = 'still';
      if ( newLegAngle === legAngleProperty.initialValue && !self.fullyEnabledProperty.get() ) {

        // this case indicates that a reset caused the leg motion, so set the leg velocity to zero
        self.legAngularVelocity = 0;
      }
      else if ( self.legAngleUpdateTime !== null ) {
        self.legAngularVelocity = ( newLegAngle - legAngle ) / ( now - self.legAngleUpdateTime );

        // We can sometimes get updates very close together in time, leading to very high or even infinite angular
        // velocity values for the leg, so we limit it to an empirically determined max.
        if ( Math.abs( self.legAngularVelocity ) > MAX_LEG_ANGULAR_VELOCITY ) {
          self.legAngularVelocity = ( self.legAngularVelocity > 0 ? 1 : -1 ) * MAX_LEG_ANGULAR_VELOCITY;
        }
        newMotionState = self.legAngularVelocity > 0 ? 'backward' : 'forward';
      }

      // update the state of sound generation (on or off)
      if ( footOnCarpet && newMotionState !== 'still' ) {

        if ( newMotionState !== self.motionState && self.motionState !== 'still' ) {

          // the leg switched directions without stopping in between, so set a timer that will create a gap in the sound
          self.noiseGenerator.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
          self.soundStartCountdown = MIN_SOUND_GAP;
        }
        else {
          if ( !self.isPlaying ) {
            self.noiseGenerator.start();
          }
          self.noiseGenerator.setOutputLevel( mapVelocityToOutputLevel( self.legAngularVelocity ), NOISE_START_TIME_CONSTANT );
        }
      }
      else {
        if ( self.noiseGenerator.isPlaying ) {
          self.noiseGenerator.stop( now + NOISE_OFF_TIME );
          self.noiseGenerator.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
        }
      }

      // set the filter value that controls whether the forward or backward dragging sound is heard
      if ( self.motionState !== newMotionState ) {
        var frequencyDelta = newMotionState === 'forward' ? DIRECTION_FREQ_DELTA : -DIRECTION_FREQ_DELTA;

        // set the filter value that controls whether the forward or backward dragging sound is heard
        self.noiseGenerator.setBandpassFilterCenterFrequency( NOISE_CENTER_FREQUENCY + frequencyDelta, 1E-10 );
      }

      // update state variable for the timer to use and for next time through this method
      legAngle = newLegAngle;
      self.legAngleUpdateTime = now;
      self.motionState = newMotionState;
    } );
  }

  // helper function to convert the angular velocity of the leg to an output level for the noise generator
  function mapVelocityToOutputLevel( angularVelocityOfLeg ) {
    var multiplier = Math.min( Math.pow( Math.abs( angularVelocityOfLeg ) / MAX_LEG_ANGULAR_VELOCITY, 0.7 ), 1 );
    return MAX_DRAG_SOUND_VOLUME * multiplier;
  }

  johnTravoltage.register( 'FootDragSoundGenerator', FootDragSoundGenerator );

  return inherit( SoundGenerator, FootDragSoundGenerator, {

    /**
     * step function that mostly detects when the leg stops moving and helps create the silence intervals when the foot
     * drag changes direction
     * @param {number} dt - amount of time step, in seconds
     * @public
     */
    step: function( dt ) {

      if ( this.soundStartCountdown > 0 ) {
        this.soundStartCountdown = Math.max( this.soundStartCountdown - dt, 0 );
        if ( this.soundStartCountdown === 0 && this.motionState !== 'still' ) {
          this.noiseGenerator.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_START_TIME_CONSTANT );
        }
      }
      else if ( this.audioContext.currentTime - this.legAngleUpdateTime > STILLNESS_TIME &&
                Math.abs( this.legAngularVelocity ) > 0 ) {

        // The leg angle hasn't changed for a bit, so start to reduce the angular velocity, but don't do it all at once
        // since that isn't realistic and tends to cause gaps in the sound.
        var angularVelocityChange = ( this.legAngularVelocity > 0 ? -1 : 1 ) *
                                    Math.min( dt * VELOCITY_REDUCTION_RATE, Math.abs( this.legAngularVelocity ) );
        this.legAngularVelocity = this.legAngularVelocity + angularVelocityChange;
        if ( this.legAngularVelocity === 0 ) {
          this.motionState = 'still';
          this.noiseGenerator.stop( this.audioContext.currentTime + NOISE_OFF_TIME );
          this.noiseGenerator.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
        }
        else {
          this.noiseGenerator.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_START_TIME_CONSTANT );
        }
      }
    }

  } );
} );
