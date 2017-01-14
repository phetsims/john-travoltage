// Copyright 2016, University of Colorado Boulder

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
  //var MIN_INTER_NOTE_TIME = 0.01; // seconds
  var MAX_GAIN = 1.0;

  /**
   * @constructor
   * {Property.<boolean>} soundEnabledProperty
   */
  function PitchedPopGenerator( soundEnabledProperty ) {

    this.soundEnabledProperty = soundEnabledProperty;

    // queue for storing sounds to be played if they are coming too quickly
    this.pitchQueue = [];

    // create the audio context
    // TODO: Is this if clause still needed, or is window.AudioContext now widely supported?
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    this.oscillator1 = this.audioContext.createOscillator(); // Create sound source
    this.oscillator1.type = 'sine';
    this.oscillator1.frequency.value = MIN_FREQUENCY;
    this.gainControl = this.audioContext.createGain();
    this.gainControl.gain.value = 0;
    this.oscillator1.connect( this.gainControl );
    this.oscillator1.start( 0 );
    this.gainControl.connect( this.audioContext.destination );

    // timer for controlling the length of the sounds
    this.noteTimer = null;
  }

  johnTravoltage.register( 'PitchedPopGenerator', PitchedPopGenerator );

  return inherit( Object, PitchedPopGenerator, {

    /**
     * create the pop sound
     * {number} relativePitch - a value from 0 to 1 indicating the frequency to play within the pitch range
     */
    createPop: function( relativePitch, duration ) {

      assert && assert( relativePitch >= 0 && relativePitch <= 1, 'relativePitch must be between 0 and 1' );

      this.pitchQueue.push( {
        pitch: MIN_FREQUENCY + relativePitch * ( MAX_FREQUENCY - MIN_FREQUENCY ),
        duration: duration
      } );

      if ( !this.noteTimer ) {
        // the timer isn't running, so play the pitch immediately
        this.playNextPitchFromQueue();
      }
    },

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

    pitchOn: function( pitch, duration ) {

      // set the frequency of the sound to be played
      this.oscillator1.frequency.value = pitch;

      // turn on the sound, but only if simulation sound is enabled
      if ( this.soundEnabledProperty.value ) {
        var now = this.audioContext.currentTime;
        this.gainControl.gain.setTargetAtTime( MAX_GAIN, now, 0.015 );
        this.gainControl.gain.setTargetAtTime( 0, now + duration, 0.015 );
      }
    }
  } );
} );