// Copyright 2018-2021, University of Colorado Boulder

/**
 * Sound generator used to produce a sound like that of a foot being dragged on a carpet.
 *
 * @author John Blanco
 */

import dotRandom from '../../../../dot/js/dotRandom.js';
import Utils from '../../../../dot/js/Utils.js';
import merge from '../../../../phet-core/js/merge.js';
import NoiseGenerator from '../../../../tambo/js/sound-generators/NoiseGenerator.js';
import johnTravoltage from '../../johnTravoltage.js';

// constants
const MAX_DRAG_SOUND_VOLUME = 2; // can be greater than 1 because filtering tends to reduce output a lot
const VELOCITY_REDUCTION_RATE = 50; // amount per second, empirically determined for best sound
const STILLNESS_TIME = 0.064; // in seconds, if there are no angle updates for this long, the leg is considered still
const NOISE_CENTER_FREQUENCY = 1300; // Hz
const DIRECTION_FREQUENCY_DELTA = NOISE_CENTER_FREQUENCY / 8; // max difference for forward vs backward motion of foot
const MAX_LEG_ANGULAR_VELOCITY = 3 * Math.PI; // in radians/sec, see explanatory note where this is used
const MIN_SOUND_GAP = 0.05; // in seconds
const NOISE_START_TIME_CONSTANT = 0.01;
const NOISE_STOP_TIME_CONSTANT = 0.02;
const NOISE_LEVEL_CHANGE_TIME_CONSTANT = 0.1;
const NOISE_OFF_TIME = 0.05; // in seconds

class FootDragSoundGenerator extends NoiseGenerator {

  /**
   * @constructor
   * {Property.<number>} legAngleProperty - angle of leg in radians
   * {Number} minContactAngle - min angle at which foot motion starts to make sound, in radians
   * {Number} maxContactAngle - max angle at which foot motion makes sound, in radians
   * {Object} [options]
   */
  constructor( legAngleProperty, minContactAngle, maxContactAngle, options ) {
    options = merge( {
        noiseType: 'brown',
        centerFrequency: NOISE_CENTER_FREQUENCY,
        qFactor: 2,
        initialOutputLevel: 0
      },
      options
    );

    super( options );

    // @private - state variables for keeping track of what the foot is doing
    this.legAngleUpdateTime = null;
    this.legAngularVelocity = 0;
    this.soundStartCountdown = 0;
    this.motionState = 'still'; // valid values are 'still', 'forward', and 'backward'
    let legAngle = null;

    // monitor the leg angle and adjust the noise output accordingly
    legAngleProperty.link( newLegAngle => {
      const now = this.audioContext.currentTime;

      // determine whether the foot is on the carpet
      const footOnCarpet = newLegAngle > minContactAngle && newLegAngle < maxContactAngle;

      // update the angular velocity of the leg and determine the motion state
      let newMotionState = 'still';
      if ( newLegAngle === legAngleProperty.initialValue && !this.fullyEnabledProperty.value ) {

        // this case indicates that a reset caused the leg motion, so set the leg velocity to zero
        this.legAngularVelocity = 0;
      }
      else if ( this.legAngleUpdateTime !== null ) {

        // set the angular velocity of the leg, but keep it limited to the max allowed value
        this.legAngularVelocity = Utils.clamp(
          ( newLegAngle - legAngle ) / ( now - this.legAngleUpdateTime ),
          -MAX_LEG_ANGULAR_VELOCITY,
          MAX_LEG_ANGULAR_VELOCITY
        );

        // update the motion state
        newMotionState = this.legAngularVelocity > 0 ? 'backward' : 'forward';
      }

      // update the state of sound generation (on or off)
      if ( footOnCarpet && newMotionState !== 'still' ) {

        if ( newMotionState !== this.motionState && this.motionState !== 'still' ) {

          // the leg switched directions without stopping in between, so set a countdown that will create a sound gap
          this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
          this.soundStartCountdown = MIN_SOUND_GAP;
        }
        else {

          // figure

          // the foot is dragging on the carpet, make sure sound is playing
          if ( !this.isPlaying ) {
            this.start();
            this.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_START_TIME_CONSTANT );
          }
          else {
            this.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_LEVEL_CHANGE_TIME_CONSTANT );
          }

          // set the frequency of the drag sound
          this.setBandpassFilterCenterFrequency( mapVelocityToFilterFrequency( this.legAngularVelocity, newMotionState ) );
        }
      }
      else {
        if ( this.isPlaying ) {
          this.stop( now + NOISE_OFF_TIME );
        }
      }

      // set the filter value that controls whether the forward or backward dragging sound is heard
      if ( this.motionState !== newMotionState ) {

        // set the frequency based on the direction
        let frequencyDelta = newMotionState === 'forward' ? DIRECTION_FREQUENCY_DELTA : -DIRECTION_FREQUENCY_DELTA;

        // add some randomization to the frequency delta so that back-and-forth motion sounds less repetitive
        frequencyDelta = frequencyDelta * ( 1 - dotRandom.nextDouble() / 2 );

        // set the filter value that controls whether the forward or backward dragging sound is heard
        this.setBandpassFilterCenterFrequency( NOISE_CENTER_FREQUENCY + frequencyDelta, 0.01 );
      }

      // update state variable for the timer to use and for next time through this method
      legAngle = newLegAngle;
      this.legAngleUpdateTime = now;
      this.motionState = newMotionState;
    } );
  }

  /**
   * step function that mostly detects when the leg stops moving and helps create the silence intervals when the foot
   * drag changes direction
   * @param {number} dt - amount of time step, in seconds
   * @public
   */
  step( dt ) {

    // check if the countdown used to keep sounds from running together is going
    if ( this.soundStartCountdown > 0 ) {
      this.soundStartCountdown = Math.max( this.soundStartCountdown - dt, 0 );
      if ( this.soundStartCountdown === 0 && this.motionState !== 'still' ) {
        this.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_START_TIME_CONSTANT );
      }
    }
    else if ( this.audioContext.currentTime - this.legAngleUpdateTime > STILLNESS_TIME &&
              Math.abs( this.legAngularVelocity ) > 0 ) {

      // The leg angle hasn't changed for a bit, so start to reduce the angular velocity, but don't do it all at once
      // since that isn't realistic and tends to cause gaps in the sound.
      const angularVelocityChange = ( this.legAngularVelocity > 0 ? -1 : 1 ) *
                                    Math.min( dt * VELOCITY_REDUCTION_RATE, Math.abs( this.legAngularVelocity ) );
      this.legAngularVelocity = this.legAngularVelocity + angularVelocityChange;
      if ( this.legAngularVelocity === 0 ) {
        this.motionState = 'still';
        this.stop( this.audioContext.currentTime + NOISE_OFF_TIME );
        this.setOutputLevel( 0, NOISE_STOP_TIME_CONSTANT );
      }
      else {
        this.setOutputLevel( mapVelocityToOutputLevel( this.legAngularVelocity ), NOISE_START_TIME_CONSTANT );
      }
    }
  }

}

// helper function to convert the angular velocity of the leg to an output level for the noise generator
function mapVelocityToOutputLevel( angularVelocityOfLeg ) {
  const multiplier = Math.min( Math.pow( Math.abs( angularVelocityOfLeg ) / MAX_LEG_ANGULAR_VELOCITY, 0.7 ), 1 );
  return MAX_DRAG_SOUND_VOLUME * multiplier;
}

// helper function to convert the angular velocity of the leg to a center frequency values for the noise filter
function mapVelocityToFilterFrequency( angularVelocityOfLeg, direction ) {
  let minFrequency;
  if ( direction === 'forward' ) {
    minFrequency = NOISE_CENTER_FREQUENCY - DIRECTION_FREQUENCY_DELTA;
  }
  else {
    minFrequency = NOISE_CENTER_FREQUENCY + DIRECTION_FREQUENCY_DELTA;
  }
  const multiplier = Math.abs( angularVelocityOfLeg ) / MAX_LEG_ANGULAR_VELOCITY;
  return minFrequency + 500 * multiplier;
}

johnTravoltage.register( 'FootDragSoundGenerator', FootDragSoundGenerator );

export default FootDragSoundGenerator;