// Copyright 2016, University of Colorado Boulder

/**
 * a sound generator intended for use in portraying the sound of a number of things jostling around, created for
 * sonification
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Sound = require( 'VIBE/Sound' );

  // audio
  var jostlingAudio = require( 'audio!JOHN_TRAVOLTAGE/jostling-03.mp3' );

  /**
   * @constructor
   * {Property.<boolean> soundEnabledProperty
   */
  function JostlingChargesSoundGenerator( soundEnabledProperty, numItemsProperty, minItems, maxItems ) {

    var jostlingSound = new Sound( jostlingAudio );
    var soundLoaded = false;
    var soundIsPlaying = false;
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();
    var jostlingSoundSource;

    // create a gain stage - gain is adjusted as the number of particles increases and decreases
    var masterGainControl = audioContext.createGain();
    masterGainControl.gain.value = 0;
    masterGainControl.connect( audioContext.destination );

    // create a function to map the number of particles to output gain
    var mapNumItemsToGain = LinearFunction( minItems, maxItems, 0.2, 1 );

    // start and stop the sounds and adjust it based on the number of items
    numItemsProperty.link( function( numItems ){

      if ( numItems > 0 ) {

        // This is necessary because of the async load of the audio buffer.
        if ( !soundLoaded && typeof( jostlingSound.audioBuffer ) !== 'undefined' ) {
          soundLoaded = true;
        }

        if ( soundLoaded && !soundIsPlaying ) {

          // create the sound source and start it up
          jostlingSoundSource = audioContext.createBufferSource();
          jostlingSoundSource.buffer = jostlingSound.audioBuffer;
          jostlingSoundSource.loop = true;
          jostlingSoundSource.connect( masterGainControl );
          jostlingSoundSource.start();
          soundIsPlaying = true;
        }

        // set the gain
        masterGainControl.gain.value = soundEnabledProperty.value ? mapNumItemsToGain( numItems ) : 0;
      }
      else{
        if ( soundIsPlaying ){
          jostlingSoundSource.stop();
          soundIsPlaying = false;
        }
      }
    } );

    soundEnabledProperty.link( function( soundEnabled ){
      if ( !soundEnabled ){
        masterGainControl.gain.value = 0;
      }
    } );
  }

  johnTravoltage.register( 'JostlingChargesSoundGenerator', JostlingChargesSoundGenerator );

  return inherit( Object, JostlingChargesSoundGenerator );
} );