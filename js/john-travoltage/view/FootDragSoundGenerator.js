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

  // constants
  var MAX_DRAG_SOUND_VOLUME = 4; // can be greater than 1 because filtering tends to reduce output a lot
  var VELOCITY_REDUCTION_RATE = 50; // amount per second, empirically determined for best sound
  var STILLNESS_TIME = 0.064; // in seconds, if there are no angle updates for this long, the leg is considered still
  var NOISE_CENTER_FREQUENCY = 1300; // Hz
  var DIRECTION_FREQUENCY_DELTA = NOISE_CENTER_FREQUENCY / 12; // max difference for forward vs backward motion of foot
  var MAX_LEG_ANGULAR_VELOCITY = 10; // in radians/sec, see explanatory note where this is used
  var MIN_SOUND_GAP = 0.05; // in seconds
  var NOISE_START_RAMP_TIME = 0.05; // in seconds
  var NOISE_STOP_RAMP_TIME = 0.02;
  var NOISE_LEVEL_CHANGE_TIME_CONSTANT = 0.1;
  var NOISE_OFF_TIME = 0.05; // in seconds

  /**
   * @constructor
   * {Property.<number>} legAngleProperty - angle of leg in radians
   * {Number} minContactAngle - min angle at which foot motion starts to make sound, in radians
   * {Number} maxContactAngle - max angle at which foot motion makes sound, in radians
   * {Object} [options]
   */
  function FootDragSoundGenerator( legAngleProperty, minContactAngle, maxContactAngle, options ) {

    var self = this;

    options = _.extend( {
        noiseType: 'brown',
        centerFrequency: NOISE_CENTER_FREQUENCY,
        qFactor: 2,
        initialOutputLevel: 0
      },
      options
    );

    NoiseGenerator.call( this, options );

    // @private - state variables for keeping track of what the foot is doing
    this.legAngleUpdateTime = null;
    this.legAngularVelocity = 0;
    this.soundStartCountdown = 0;
    this.motionState = 'still'; // valid values are 'still', 'forward', and 'backward'
    var legAngle = null;

    // monitor the leg angle and adjust the noise output accordingly
    legAngleProperty.link( function( newLegAngle ) {
      var now = self.audioContext.currentTime;

      // determine whether the foot is on the carpet
      var footOnCarpet = newLegAngle > minContactAngle && newLegAngle < maxContactAngle;

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

          // the leg switched directions without stopping in between, so set a countdown that will create a sound gap
          self.setOutputLevel( 0, NOISE_STOP_RAMP_TIME );
          self.soundStartCountdown = MIN_SOUND_GAP;
        }
        else {

          // the foot is dragging on the carpet, make sure sound is playing
          if ( !self.isPlaying ) {
            self.start();
          }
          self.adjustOutputLevel( mapVelocityToOutputLevel( self.legAngularVelocity ), NOISE_LEVEL_CHANGE_TIME_CONSTANT );
        }
      }
      else {
        if ( self.isPlaying ) {
          self.stop( now + NOISE_OFF_TIME );
          self.setOutputLevel( 0, NOISE_STOP_RAMP_TIME );
        }
      }

      // set the filter value that controls whether the forward or backward dragging sound is heard
      if ( self.motionState !== newMotionState ) {

        // sat the frequency based on the direction
        var frequencyDelta = newMotionState === 'forward' ? DIRECTION_FREQUENCY_DELTA : -DIRECTION_FREQUENCY_DELTA;

        // add some randomization to the frequency delta so that back-and-forth motion sounds less repetitive
        frequencyDelta = frequencyDelta * ( 1 - phet.joist.random.nextDouble() / 2 );

        // set the filter value that controls whether the forward or backward dragging sound is heard
        self.setBandpassFilterCenterFrequency( NOISE_CENTER_FREQUENCY + frequencyDelta, 0.1 );
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

  return inherit( NoiseGenerator, FootDragSoundGenerator, {

    /**
     * step function that mostly detects when the leg stops moving and helps create the silence intervals when the foot
     * drag changes direction
     * @param {number} dt - amount of time step, in seconds
     * @public
     */
    step: function( dt ) {

      // check if the countdown used to keep sounds from running together is going
      if ( this.soundStartCountdown > 0 ) {
        this.soundStartCountdown = Math.max( this.soundStartCountdown - dt, 0 );
        if ( this.soundStartCountdown === 0 && this.motionState !== 'still' ) {
          this.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_START_RAMP_TIME );
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
          this.stop( this.audioContext.currentTime + NOISE_OFF_TIME );
          this.setOutputLevel( 0, NOISE_STOP_RAMP_TIME );
        }
        else {
          this.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_START_RAMP_TIME );
        }
      }
    }

  } );
} );
