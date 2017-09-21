// Copyright 2016-2017, University of Colorado Boulder

/**
 * sound effect generator that produces a popping sound with a certain pitch
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Timer = require( 'PHET_CORE/Timer' );

  // constants
  var MIN_FREQUENCY = 261.626; // Hz
  var MAX_FREQUENCY = 783.991; // Hz
  var MAX_GAIN = 1.0;
  var AUDIO_CHANGE_TIME_CONSTANT = 0.015; // this can be adjusted to make attack of the sound more or less gradual

  /**
   * @constructor
   * {Property.<boolean>} soundEnabledProperty
   */
  function PitchedPopGenerator( soundEnabledProperty ) {

    var self = this;

    // @private
    this.soundEnabledProperty = soundEnabledProperty;

    // queue for storing sounds to be played if they are coming too quickly
    this.pitchQueue = [];

    // create the audio context
    // TODO: Is this trickery still needed, or is window.AudioContext now widely supported?
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

    this.oscillator1 = audioContext.createOscillator(); // Create sound source
    this.oscillator1.type = 'sine';
    this.oscillator1.frequency.value = MIN_FREQUENCY;
    this.gainControl = audioContext.createGain();
    this.gainControl.gain.value = 0;
    this.oscillator1.connect( this.gainControl );
    this.oscillator1.start( 0 );
    this.gainControl.connect( audioContext.destination );

    // timer for controlling the length of the sounds
    this.noteTimer = null;

    // when sound enabled goes false, set the gain immediately to zero to stop any in-progress sound generation
    soundEnabledProperty.link( function( soundEnabled ) {
      if ( !soundEnabled ) {
        self.gainControl.gain.setTargetAtTime( 0, audioContext.currentTime, AUDIO_CHANGE_TIME_CONSTANT );
      }
    } );

    // make audio context available to methods
    this.audioContext = audioContext;
  }

  johnTravoltage.register( 'PitchedPopGenerator', PitchedPopGenerator );

  return inherit( Object, PitchedPopGenerator, {

    /**
     * create the pop sound
     * {number} relativePitch - a value from 0 to 1 indicating the frequency to play within the pitch range
     */
    createPop: function( relativePitch, duration ) {

      assert && assert( relativePitch >= 0 && relativePitch <= 1, 'relativePitch must be between 0 and 1' );

      // only queue sounds when enabled
      if ( this.soundEnabledProperty.get() ) {

        // queue the sound
        this.pitchQueue.push( {
          pitch: MIN_FREQUENCY + relativePitch * ( MAX_FREQUENCY - MIN_FREQUENCY ),
          duration: duration
        } );

        // if the timer isn't running, play the pitch immediately
        if ( !this.noteTimer ) {
          this.playNextPitchFromQueue();
        }
      }
    },

    // @private
    playNextPitchFromQueue: function() {

      var self = this;

      // error checking
      assert && assert( this.timer !== null, 'timer should not be running when starting to play queued sounds' );

      if ( this.pitchQueue.length > 0 ) {
        var duration = this.pitchQueue[ 0 ].duration;
        this.pitchOn( this.pitchQueue[ 0 ].pitch, duration );
        this.pitchQueue.splice( 0, 1 );
        this.noteTimer = Timer.setTimeout( function() {
          self.noteTimer = null;
          self.playNextPitchFromQueue();
          //}, ( duration + MIN_INTER_NOTE_TIME ) * 1000 );
        }, 10 ); // TODO: Temp workaround for an issue where this gets too far behind, look at callbacks from parameter changes (if there is such a thing)
      }
    },

    // @private
    pitchOn: function( pitch, duration ) {

      // set the frequency of the sound to be played
      this.oscillator1.frequency.value = pitch;

      // turn on the sound, but only if simulation sound is enabled
      if ( this.soundEnabledProperty.value ) {
        var now = this.audioContext.currentTime;
        this.gainControl.gain.setTargetAtTime( MAX_GAIN, now, AUDIO_CHANGE_TIME_CONSTANT );
        this.gainControl.gain.setTargetAtTime( 0, now + duration, AUDIO_CHANGE_TIME_CONSTANT );
      }
    }
  } );
} );