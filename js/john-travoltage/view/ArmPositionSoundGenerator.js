// Copyright 2018, University of Colorado Boulder

/**
 * sound generator used for indicating the position of the arm in the John Travoltage sim, may be generalized at some
 * future for other purposes
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var OneShotSoundClip = require( 'TAMBO/sound-generators/OneShotSoundClip' );
  var SoundGenerator = require( 'TAMBO/sound-generators/SoundGenerator' );

  // audio
  var armPosition01Audio = require( 'audio!JOHN_TRAVOLTAGE/arm-position-01.mp3' );
  var armPosition02Audio = require( 'audio!JOHN_TRAVOLTAGE/arm-position-01.mp3' );
  var armPosition03Audio = require( 'audio!JOHN_TRAVOLTAGE/arm-position-01.mp3' );
  var armPosition04Audio = require( 'audio!JOHN_TRAVOLTAGE/arm-position-01.mp3' );
  var armPosition05Audio = require( 'audio!JOHN_TRAVOLTAGE/arm-position-01.mp3' );
  var armPosition06Audio = require( 'audio!JOHN_TRAVOLTAGE/arm-position-01.mp3' );

  // constants
  var NUM_SOUND_POSITIONS = 32;
  var MAX_SOUNDS_PER_ITERATIONS = 3; // empirically determined
  var ANGLE_OF_HIGHEST_PITCH = 0.45; // this is when the finger is closest to the door knob

  /**
   * @constructor
   * {Property.<number>} armAngleProperty - angle, in radians, of the arm position
   * {Object} [options]
   */
  function ArmPositionSoundGenerator( armAngleProperty, options ) {

    var self = this;
    SoundGenerator.call( this, options );

    var ratchetSounds = [
      new OneShotSoundClip( armPosition01Audio ),
      new OneShotSoundClip( armPosition02Audio ),
      new OneShotSoundClip( armPosition03Audio ),
      new OneShotSoundClip( armPosition04Audio ),
      new OneShotSoundClip( armPosition05Audio ),
      new OneShotSoundClip( armPosition06Audio )
    ];

    // define a helper function to play a random ratchet sound
    var previousRatchetSoundIndex = -1;

    function playRandomRatchetSound( playbackRate ) {
      do {
        var ratchetSoundIndex = Math.floor( Math.random() * ratchetSounds.length );
      } while ( ratchetSoundIndex === previousRatchetSoundIndex );
      ratchetSounds[ ratchetSoundIndex ].setPlaybackRate( playbackRate, 1E-30 );
      ratchetSounds[ ratchetSoundIndex ].play();
      previousRatchetSoundIndex = ratchetSoundIndex;
    }

    // connect up the sound generators
    ratchetSounds.forEach( function( ratchetSound ) {
      ratchetSound.connect( self.masterGainNode );
    } );

    // create the array containing the 'sound points', which are the arm position where a sound sample is played
    var soundPositions = [];
    _.times( NUM_SOUND_POSITIONS, function( index ) {
      soundPositions.push( -Math.PI + index / NUM_SOUND_POSITIONS * Math.PI * 2 );
    } );

    // monitor the arm property, adjusting and playing sounds as appropriate
    var previousAngle = null;
    armAngleProperty.lazyLink( function( angle ) {

      var numClickSoundsToPlay = 0;

      // determine if the new angle crossed over one or more 'sound points' since the last angle
      console.log( 'angle = ' + angle );
      if ( previousAngle !== null ) {
        if ( ( ( previousAngle > 0 && angle < 0 ) || ( previousAngle < 0 && angle > 0 ) ) &&
             Math.abs( previousAngle - angle ) > Math.PI ) {

          // wraparound of the angle value has occurred - just play one click
          numClickSoundsToPlay = 1;
        }
        else {
          soundPositions.forEach( function( soundPosition ) {
              if ( ( previousAngle > soundPosition && angle < soundPosition ) ||
                   ( previousAngle < soundPosition && angle > soundPosition ) ) {
                numClickSoundsToPlay++;
              }
            }
          );
        }
      }

      // play the sounds that indicate the motion, but limit it in the case of really large changes
      var angularDistanceFromKnob = Math.abs( ANGLE_OF_HIGHEST_PITCH - angle );
      if ( angularDistanceFromKnob > Math.PI ) {
        angularDistanceFromKnob = Math.PI - angularDistanceFromKnob % Math.PI;
      }
      var playbackRate = 0.75 + 0.75 * ( 1 - angularDistanceFromKnob / Math.PI );
      _.times( Math.min( numClickSoundsToPlay, MAX_SOUNDS_PER_ITERATIONS ), function() {
        playRandomRatchetSound( playbackRate );
      } );

      // save the angle for the next time through
      previousAngle = angle;
    } );
  }

  johnTravoltage.register( 'ArmPositionSoundGenerator', ArmPositionSoundGenerator );

  inherit( SoundGenerator, ArmPositionSoundGenerator );

  return ArmPositionSoundGenerator;
} );
