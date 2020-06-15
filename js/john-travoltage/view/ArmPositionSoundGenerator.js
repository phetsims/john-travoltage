// Copyright 2018-2020, University of Colorado Boulder

/**
 * sound generator used for indicating the position of the arm in the John Travoltage sim, may be generalized at some
 * future for other purposes
 *
 * @author John Blanco
 */

import SoundClip from '../../../../tambo/js/sound-generators/SoundClip.js';
import SoundGenerator from '../../../../tambo/js/sound-generators/SoundGenerator.js';
import armPosition01Audio from '../../../sounds/arm-position-001_mp3.js';
import armPosition02Audio from '../../../sounds/arm-position-002_mp3.js';
import armPosition03Audio from '../../../sounds/arm-position-003_mp3.js';
import armPosition04Audio from '../../../sounds/arm-position-004_mp3.js';
import armPosition05Audio from '../../../sounds/arm-position-005_mp3.js';
import armPosition06Audio from '../../../sounds/arm-position-006_mp3.js';
import johnTravoltage from '../../johnTravoltage.js';

// constants
const NUM_SOUND_POSITIONS = 32;
const MAX_SOUNDS_PER_ITERATION = 3; // empirically determined
const ANGLE_OF_HIGHEST_PITCH = 0.45; // this is when the finger is closest to the door knob

class ArmPositionSoundGenerator extends SoundGenerator {

  /**
   * @constructor
   * {Property.<number>} armAngleProperty - angle, in radians, of the arm position
   * {Object} [options]
   */
  constructor( armAngleProperty, options ) {

    super( options );

    const ratchetSounds = [
      new SoundClip( armPosition01Audio ),
      new SoundClip( armPosition02Audio ),
      new SoundClip( armPosition03Audio ),
      new SoundClip( armPosition04Audio ),
      new SoundClip( armPosition05Audio ),
      new SoundClip( armPosition06Audio )
    ];

    // define a helper function to play a random ratchet sound
    let previousRatchetSoundIndex = -1;

    const playRandomRatchetSound = playbackRate => {
      let ratchetSoundIndex;
      do {
        ratchetSoundIndex = Math.floor( phet.joist.random.nextDouble() * ratchetSounds.length );
      } while ( ratchetSoundIndex === previousRatchetSoundIndex );
      ratchetSounds[ ratchetSoundIndex ].setPlaybackRate( playbackRate, 1E-30 );
      ratchetSounds[ ratchetSoundIndex ].play();
      previousRatchetSoundIndex = ratchetSoundIndex;
    };

    // connect up the sound generators
    ratchetSounds.forEach( ratchetSound => { ratchetSound.connect( this.soundSourceDestination ); } );

    // create the array containing the 'sound points', which are the arm position where a sound sample is played
    const soundPositions = [];
    _.times( NUM_SOUND_POSITIONS, index => {
      soundPositions.push( -Math.PI + index / NUM_SOUND_POSITIONS * Math.PI * 2 );
    } );
    const binSize = 2 * Math.PI / NUM_SOUND_POSITIONS;

    // monitor the arm property, adjusting and playing sounds as appropriate
    let previousAngle = null;
    armAngleProperty.lazyLink( angle => {

      let numClickSoundsToPlay = 0;

      // determine if the new angle crossed over one or more 'sound points' since the last angle
      if ( this.fullyEnabledProperty.value && previousAngle !== null ) {
        numClickSoundsToPlay = Math.abs( Math.floor( previousAngle / binSize ) -
                                         Math.floor( angle / binSize ) );
        // TODO: This is a temporary workaround for an issue where the angle seems to switch from + to - at an odd place
        if ( numClickSoundsToPlay > NUM_SOUND_POSITIONS / 2 ) {
          numClickSoundsToPlay = 0;
        }
      }

      // play the sounds that indicate the motion, but limit it in the case of really large changes
      let angularDistanceFromKnob = Math.abs( ANGLE_OF_HIGHEST_PITCH - angle );
      if ( angularDistanceFromKnob > Math.PI ) {
        angularDistanceFromKnob = Math.PI - angularDistanceFromKnob % Math.PI;
      }
      const playbackRate = 0.75 + 0.75 * ( 1 - angularDistanceFromKnob / Math.PI );
      _.times( Math.min( numClickSoundsToPlay, MAX_SOUNDS_PER_ITERATION ), () => {
        playRandomRatchetSound( playbackRate );
      } );

      // save the angle for the next time through
      previousAngle = angle;
    } );
  }

}

johnTravoltage.register( 'ArmPositionSoundGenerator', ArmPositionSoundGenerator );

export default ArmPositionSoundGenerator;