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
  var MIN_FREQUENCY = 440; // Hz
  var MAX_FREQUENCY = 880; // Hz
  var NOTE_DURATION = 0.05; // seconds

  /**
   * @constructor
   * {Property.<boolean> soundEnabledProperty
   */
  function PitchedPopGenerator( soundEnabledProperty ) {

    this.soundEnabledProperty = soundEnabledProperty;

    // create the audio context
    // TODO: Is this if clause still needed, or is window.AudioContext now widely supported?
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
  }

  johnTravoltage.register( 'PitchedPopGenerator', PitchedPopGenerator );

  return inherit( Object, PitchedPopGenerator, {

    /**
     * create the pop sound
     * {number} relativePitch - a value from 0 to 1 indicating the frequency to play within the pitch range
     */
    createPop: function( relativePitch ){

      var self = this;

      assert && assert( relativePitch >= 0 && relativePitch <= 1, 'relativePitch must be between 0 and 1' );

      // clear any previously running timer
      if ( this.noteTimer ){
        Timer.clearTimeout( this.noteTimer );
      }

      // set up a new timer to turn the note off
      this.noteTimer = Timer.setTimeout( function(){
        self.gainControl.gain.value = 0;
        self.noteTimer = null;
      }, NOTE_DURATION * 1000 );

      // set the frequency of the sound to be played
      this.oscillator1.frequency.value = MIN_FREQUENCY + relativePitch * ( MAX_FREQUENCY - MIN_FREQUENCY );

      // turn on the sound, but only if simulation sound is enabled
      this.gainControl.gain.value = this.soundEnabledProperty.value ? 1 : 0;
    }
  } );
} );