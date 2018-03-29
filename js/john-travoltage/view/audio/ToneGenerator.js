// Copyright 2016-2017, University of Colorado Boulder

/**
 * a 2 oscillator monophonic sound generator
 * TODO: This was created for sonification, and should be generalized and put in common code at some point when we know
 * TODO: more about what we need to do.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Sound = require( 'VIBE/Sound' );

  // audio
  var ir = require( 'audio!JOHN_TRAVOLTAGE/jb-living-room-impulse.mp3' );

  // constants
  var INITIAL_FREQUENCY = 261.626; // Hz
  var MAX_GAIN = 1;

  /**
   * @constructor
   * {Property.<boolean> soundEnabledProperty
   */
  function ToneGenerator( soundEnabledProperty ) {

    // TODO: If this lives for a while, go through this an make things that are public private where possible.
    this.soundEnabledProperty = soundEnabledProperty;

    // queue for storing pops to be played if they are coming too quickly
    this.pitchQueue = [];

    // create the audio context
    // TODO: Is this if clause still needed, or is window.AudioContext now widely supported?
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // create and set up oscillator 1
    this.oscillator1 = this.audioContext.createOscillator(); // Create sound source
    this.oscillator1.type = 'sine';
    this.oscillator1.frequency.value = INITIAL_FREQUENCY;
    this.oscillator1.detune.value = 7;
    this.oscillator1.start( 0 );

    // create a filter for oscillator 1
    this.biquadFilter1 = this.audioContext.createBiquadFilter();
    this.biquadFilter1.type = 'lowpass';
    this.biquadFilter1.frequency.value = 1500;

    // hook oscillator 1 to its filter
    this.oscillator1.connect( this.biquadFilter1 );

    // create and set up oscillator 2
    this.oscillator2 = this.audioContext.createOscillator(); // Create sound source
    this.oscillator2.type = 'triangle';
    this.oscillator2.frequency.value = INITIAL_FREQUENCY;
    this.oscillator2.detune.value = -7;
    this.oscillator2.start( 0 );

    // create a filter for oscillator 2
    this.biquadFilter2 = this.audioContext.createBiquadFilter();
    this.biquadFilter2.type = 'lowpass';
    this.biquadFilter2.frequency.value = 1500;

    // hook oscillator 2 to its filter
    this.oscillator2.connect( this.biquadFilter2 );

    // create a low frequency oscillator (LFO) that can be used to modulate the output volume
    this.lfo = this.audioContext.createOscillator();
    this.lfo.frequency.value = 0; // Hz
    this.lfo.start();

    // since oscillators go from -1 to +1 we need to put this value through a TODO finish comment
    this.lfoGain = this.audioContext.createGain();
    this.lfoGain.gain.value = 0.5;

    // Oscillators go from -1 to 1, so route the LFO through a gain stage set to 0.5 so that its output will range from
    // -0.5 to 0.5.
    this.lfo.connect( this.lfoGain );

    // create the gain stage that will be modulated by the LFO
    this.modulatedGainControl = this.audioContext.createGain();
    this.modulatedGainControl.gain.value = 0.5;

    // hook up the LFO to modulate the LFO gain stage
    this.lfoGain.connect( this.modulatedGainControl.gain );

    // connect the filters to the modulated gain control
    this.biquadFilter1.connect( this.modulatedGainControl );
    this.biquadFilter2.connect( this.modulatedGainControl );

    // create a convolver to add a bit of reverb for a fuller sound
    this.convolver = this.audioContext.createConvolver();
    this.impulseResponse = new Sound( ir );
    this.impulseLoaded = false;

    // connect the modulated gain control to the convolver
    this.modulatedGainControl.connect( this.convolver );

    // create the master gain control
    this.masterGainControl = this.audioContext.createGain();
    this.masterGainControl.gain.value = 0;

    // connect the convolver to the master gain control
    this.convolver.connect( this.masterGainControl );

    // connect the master gain control to the output
    this.masterGainControl.connect( this.audioContext.destination );
  }

  johnTravoltage.register( 'ToneGenerator', ToneGenerator );

  return inherit( Object, ToneGenerator, {

    /**
     * play a tone at the specified base frequency, moves to the specified pitch if a tone is already playing
     * @param {number} frequency - in Hz
     * @public
     */
    playTone: function( frequency ) {

      // This is necessary because of the async load of the impulse response buffer.
      if ( !this.impulseLoaded && typeof( this.impulseResponse.audioBuffer ) !== 'undefined' ) {
        this.convolver.buffer = this.impulseResponse.audioBuffer;
        this.impulseLoaded = true;
      }

      this.oscillator1.frequency.value = frequency;
      this.oscillator2.frequency.value = frequency;
      this.masterGainControl.gain.value = MAX_GAIN;
    },

    /**
     * stop the tone that is currently playing
     * @public
     */
    stopTone: function() {
      this.masterGainControl.gain.value = 0;
    },

    /**
     * set the frequency of the low frequency oscillator
     * @param {number} frequency - in Hz, should be a pretty low value (like under 10)
     * @public
     */
    setLfoFrequency: function( frequency ) {
      this.lfo.frequency.value = frequency;
    }

  } );
} );
