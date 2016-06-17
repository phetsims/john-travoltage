// Copyright 2016, University of Colorado Boulder

/**
 * a 2 oscillator monophonic sound generator for indicating the charge level
 * TODO: This was created for sonification, and should be generalized and put in common code at some point when we know
 * TODO: more about what we need to do.
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var Sound = require( 'VIBE/Sound' );

  // audio
  var ir = require( 'audio!JOHN_TRAVOLTAGE/koli_summer_site1_1way_mono.ogg' );

  // constants
  var INITIAL_FREQUENCY = 60; // Hz
  var MAX_GAIN = 1;

  /**
   * @constructor
   * {Property.<boolean> soundEnabledProperty
   */
  function ChargeAmountToneGenerator( soundEnabledProperty, numChargesProperty, minCharges, maxCharges ) {

    // create the audio context
    // TODO: Is this if clause still needed, or is window.AudioContext now widely supported?
    var audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // create and set up oscillator 1
    var oscillator1 = audioContext.createOscillator(); // Create sound source
    oscillator1.type = 'square';
    oscillator1.frequency.value = INITIAL_FREQUENCY;
    oscillator1.detune.value = 7;
    oscillator1.start( 0 );

    // create a filter for oscillator 1
    var biquadFilter1 = audioContext.createBiquadFilter();
    biquadFilter1.type = 'lowpass';
    biquadFilter1.frequency.value = 500;

    // hook oscillator 1 to its filter
    oscillator1.connect( biquadFilter1 );

    // create and set up oscillator 2
    var oscillator2 = audioContext.createOscillator(); // Create sound source
    oscillator2.type = 'triangle';
    oscillator2.frequency.value = INITIAL_FREQUENCY;
    oscillator1.detune.value = -7;
    oscillator2.start( 0 );

    // create a filter for oscillator 2
    var biquadFilter2 = audioContext.createBiquadFilter();
    biquadFilter2.type = 'lowpass';
    biquadFilter2.frequency.value = 1500;

    // hook oscillator 2 to its filter
    oscillator2.connect( biquadFilter2 );

    // create a low frequency oscillator (LFO) that can be used to modulate the output volume
    var lfo = audioContext.createOscillator();
    lfo.frequency.value = 2; // Hz
    lfo.start();

    // since oscillators go from -1 to +1 we need to put this value through a TODO finish comment
    var lfoGain = audioContext.createGain();
    lfoGain.gain.value = 0.25;

    // Oscillators go from -1 to 1, so route the LFO through a gain stage set to 0.5 so that its output will range from
    // -0.5 to 0.5.
    lfo.connect( lfoGain );

    // create the gain stage that will be modulated by the LFO
    var modulatedGainControl = audioContext.createGain();
    modulatedGainControl.gain.value = 0.75;

    // hook up the LFO to modulate the LFO gain stage
    lfoGain.connect( modulatedGainControl.gain );

    // connect the filters to the modulated gain control
    biquadFilter1.connect( modulatedGainControl );
    biquadFilter2.connect( modulatedGainControl );

    // create a convolver to add a bit of reverb for a fuller sound
    var convolver = audioContext.createConvolver();
    var impulseResponse = new Sound( ir );
    var impulseLoaded = false;

    // connect the modulated gain control to the convolver
    modulatedGainControl.connect( convolver );

    // create the master gain control
    var masterGainControl = audioContext.createGain();
    masterGainControl.gain.value = 0;

    // connect the convolver to the master gain control
    convolver.connect( masterGainControl );

    // connect the master gain control to the output
    masterGainControl.connect( audioContext.destination );

    // create a function to map the number of particles to output gain
    var mapNumItemsToGain = LinearFunction( minCharges, maxCharges, 0, MAX_GAIN );

    // monitor the number of charges and adjust the tone in response
    numChargesProperty.link( function( numCharges ){
      if ( numCharges > 0 ){

        // This is necessary because of the async load of the audio buffer.
        if ( !impulseLoaded && typeof( impulseResponse.audioBuffer ) !== 'undefined' ) {
          convolver.buffer = impulseResponse.audioBuffer;
          impulseLoaded = true;
        }

        masterGainControl.gain.value = mapNumItemsToGain( numCharges );
      }
      else{
        masterGainControl.gain.value = 0;
      }
    } );
  }

  johnTravoltage.register( 'ChargeAmountToneGenerator', ChargeAmountToneGenerator );

  return inherit( Object, ChargeAmountToneGenerator );
} );