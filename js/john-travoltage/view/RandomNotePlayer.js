// Copyright 2016, University of Colorado Boulder

/**
 * plays notes randomly where the frequency of note generation increases as a property increases
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Sound = require( 'VIBE/Sound' );
  var Timer = require( 'PHET_CORE/Timer' );

  // audio
  var ir = require( 'audio!JOHN_TRAVOLTAGE/koli_summer_site1_1way_mono.ogg' );
  var piano_c3 = require( 'audio!JOHN_TRAVOLTAGE/piano-c3' );
  var piano_c4 = require( 'audio!JOHN_TRAVOLTAGE/piano-c4' );
  var piano_c5 = require( 'audio!JOHN_TRAVOLTAGE/piano-c5' );
  var piano_f4 = require( 'audio!JOHN_TRAVOLTAGE/piano-f4' );
  var piano_g4 = require( 'audio!JOHN_TRAVOLTAGE/piano-g4' );

  // constants
  var MIN_INTER_NOTE_TIME = 0.1;
  var MAX_INTER_NOTE_TIME = 1.0;

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {Property.<number> } numItemsProperty
   * @param {Property.<boolean> } reduceVolumeProperty
   * @param {number} minItems
   * @param {number} maxItems
   * @constructor
   *
   */
  function RandomNotePlayer( soundEnabledProperty, numItemsProperty, reduceVolumeProperty, minItems, maxItems ) {

    var notes = [
      new Sound( piano_c3 ),
      new Sound( piano_c4 ),
      new Sound( piano_c5 ),
      new Sound( piano_f4 ),
      new Sound( piano_g4 )
    ];
    var soundsLoaded = false;
    var mostRecentlyPlayedNote = null;
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

    // create a gain stage
    var masterGainControl = audioContext.createGain();
    masterGainControl.connect( audioContext.destination );

    // create a convolver to add a bit of reverb for a fuller sound
    var convolver = audioContext.createConvolver();
    convolver.connect( masterGainControl );
    var impulseResponse = new Sound( ir );

    // TODO doc
    var interNoteTime = Number.POSITIVE_INFINITY;
    var noteTimer = null;

    // create a function to map the amount of charge to the inter-note time
    var mapNumItemsToInterNoteTime = LinearFunction( minItems, maxItems, MAX_INTER_NOTE_TIME * 1000, MIN_INTER_NOTE_TIME * 1000 );

    function playRandomNoteAndSetTimer() {

      // select a note to play that is not the most recently played note
      var note;
      do {
        note = _.sample( notes );
      } while( note === mostRecentlyPlayedNote );
      mostRecentlyPlayedNote = note;

      // play the note
      var soundSource = audioContext.createBufferSource();
      soundSource.buffer = note.audioBuffer;
      soundSource.connect( convolver );
      soundSource.start();

      // set the timer to play the next note
      if ( interNoteTime !== Number.POSITIVE_INFINITY ) {
        // set a timeout to play the next note
        noteTimer = Timer.setTimeout( playRandomNoteAndSetTimer, interNoteTime );
      }
      else {
        noteTimer = null;
      }
    }

    // start and stop the sounds and adjust it based on the number of items
    numItemsProperty.link( function( numItems ) {

      if ( numItems > 0 ) {

        // Make sure sounds are loaded, necessary because of the async load of the audio buffers.
        if ( !soundsLoaded ) {
          var allSoundsLoaded = true;
          notes.forEach( function( sound ) {
            if ( !sound.audioBuffer ) {
              allSoundsLoaded = false;
            }
          } );
          if ( impulseResponse.audioBuffer ){
            convolver.buffer = impulseResponse.audioBuffer;
          }
          else{
            allSoundsLoaded = false;
          }
          soundsLoaded = allSoundsLoaded;
        }

        if ( soundsLoaded ) {

          if ( soundEnabledProperty.value ) {
            interNoteTime = mapNumItemsToInterNoteTime( numItems );
            masterGainControl.gain.value = 1;
            if ( noteTimer === null ) {
              playRandomNoteAndSetTimer();
            }
          }
        }
      }
      else {
        interNoteTime = Number.POSITIVE_INFINITY;
        if ( noteTimer ){
          Timer.clearTimeout( noteTimer );
          noteTimer = null;
        }
      }
    } );

    // handle changes to whether sound is enabled at all
    soundEnabledProperty.link( function( soundEnabled ) {
      if ( soundEnabled ) {
        masterGainControl.gain.value = 1;
        if ( numItemsProperty.value > 0 ){
          interNoteTime = mapNumItemsToInterNoteTime( numItemsProperty.value );
          playRandomNoteAndSetTimer();
        }
      }
      else{
        masterGainControl.gain.value = 0;
        interNoteTime = Number.POSITIVE_INFINITY;
      }
    } );

    // reduce the volume in some cases to avoid overpowering other sounds TODO:
    reduceVolumeProperty.link( function( reduceVolume ){
      if ( reduceVolume && soundEnabledProperty.value ){
        masterGainControl = 0.5;
      }

    } );
  }

  johnTravoltage.register( 'RandomNotePlayer', RandomNotePlayer );

  return inherit( Object, RandomNotePlayer );
} );