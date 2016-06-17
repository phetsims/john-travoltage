// Copyright 2016, University of Colorado Boulder

/**
 * a sound generator intended for use in portraying the sounds of a number of things jostling around, created for
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
  var jostlingAudio = require( 'audio!JOHN_TRAVOLTAGE/jostling-01.mp3' );

  /**
   * @constructor
   * {Property.<boolean> soundEnabledProperty
   */
  function JostlingChargesSoundGenerator( soundEnabledProperty, numItemsProperty, minItems, maxItems ) {

    var jostlingSound = new Sound( jostlingAudio );
    var soundLoaded = false;
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

    // create the sound source
    var jostlingSoundSource = audioContext.createBufferSource();
    jostlingSoundSource.loop = true;

    // add in a gain stage - gain is adjusted as the number of particles increases and decreases
    var masterGainControl = audioContext.createGain();
    masterGainControl.gain.value = 0;

    // connect things together
    jostlingSoundSource.connect( masterGainControl );
    masterGainControl.connect( audioContext.destination );

    // create a function to map number of particles to output gain
    var mapNumItemsToGain = LinearFunction( 0, 100, 0.2, 1 );


    var soundIsPlaying = false;

    // adjust the sound based on the number of items that are jostling
    numItemsProperty.link( function( numItems ){

      if ( numItems > 0 ) {

        jostlingSoundSource

        // This is necessary because of the async load of the impulse response buffer.
        if ( !soundLoaded && typeof( jostlingSound.audioBuffer ) !== 'undefined' ) {
          jostlingSoundSource.buffer = jostlingSound.audioBuffer;
          soundLoaded = true;
        }

        // start the sound if it isn't already playing
        if ( soundLoaded && !soundIsPlaying ) {
          jostlingSoundSource.start();
          soundIsPlaying = true;
        }

        // set the gain
        masterGainControl.gain.value = mapNumItemsToGain( numItems );
      }
      else{
        if ( soundIsPlaying ){
          jostlingSoundSource.stop();
          soundIsPlaying = false;
        }
      }
    } );

  }

  johnTravoltage.register( 'JostlingChargesSoundGenerator', JostlingChargesSoundGenerator );

  return inherit( Object, JostlingChargesSoundGenerator );
} );