// Copyright 2016, University of Colorado Boulder

/**
 * a 2 oscillator monophonic sound generator for indicating the charge level
 * TODO: This was created for sonification, and should be generalized and put in common code at some point when we know
 * TODO: more about what we need to do.
 *
 * TODO: This got hacked up a lot in the process of getting the 6/21 demo out, needs to be overhauled once we decide
 * TODO: which direction in which the take this.
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
  var ir = require( 'audio!JOHN_TRAVOLTAGE/jb-living-room-impulse.ogg' );

  // constants
  var DEFAULT_FREQUENCY = 60; // Hz
  var MAX_GAIN = 1;
  var MIN_FILTER_UPDATES_PER_SECOND = 2;
  var MAX_FILTER_UPDATES_PER_SECOND = 6;
  var MAX_FILTER_CUTOFF = 6000;  // chosen empirically after experimenting with a number of headphones and computer speakers
  var MAX_FILTER_CUTOFF_LOG = Math.log( MAX_FILTER_CUTOFF );

  /**
   * @param {Property.<boolean>} soundEnabledProperty
   * @param {Property.<number>} numChargesProperty
   * @param {number} minCharges
   * @param {number} maxCharges
   * @param {Object} options
   * @constructor
   */
  function ChargeAmountToneGenerator( soundEnabledProperty, numChargesProperty, minCharges, maxCharges, options ) {

    options = _.extend( {
      mapQuantityToGain: true,
      mapQuantityToFilterCutoff: false,
      randomlyUpdateFilterCutoff: false,
      toneFrequency: DEFAULT_FREQUENCY
    }, options );

    // create the audio context
    // TODO: Is this if clause still needed, or is window.AudioContext now widely supported?
    var audioContext = new ( window.AudioContext || window.webkitAudioContext )();

    // create and set up oscillator 1
    var oscillator1 = audioContext.createOscillator(); // Create sound source
    oscillator1.type = 'square';
    oscillator1.frequency.value = options.toneFrequency;
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
    oscillator2.frequency.value = options.toneFrequency;
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

    // only start the LFO is not doing the filter changes, since otherwise it's a bit too much activity
    if ( !options.mapQuantityToFilterCutoff && !options.randomlyUpdateFilterCutoff ) {
      lfo.start();
    }

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

    // function to map number of items to filter update rate
    var mapNumItemsToFilterUpdateRate = new LinearFunction(
      minCharges,
      maxCharges,
      MIN_FILTER_UPDATES_PER_SECOND,
      MAX_FILTER_UPDATES_PER_SECOND
    );

    // variables used to update the filter cutoff frequency, only used if that behavior is enabled
    var filterUpdateTimer = null;
    var minFilterCutoffLog = Math.log( options.toneFrequency * 1.5 );

    // function to update the filter range with a new randomly chosen cutoff value and set the time for the next change
    function doRandomUpdateOfFilterCutoff() {

      var random = phet.joist.random;
      var changeProportion = random.nextDouble() * 0.8 + 0.1; // 10% to 90%
      var changeAmountLog = changeProportion * ( MAX_FILTER_CUTOFF_LOG - minFilterCutoffLog );
      if ( random.nextDouble() > 0.5 ) {
        // make the change negative half the time
        changeAmountLog *= -1;
      }
      var newCutoffLog = Math.log( biquadFilter1.frequency.value ) + changeAmountLog;
      if ( newCutoffLog > MAX_FILTER_CUTOFF_LOG ) {
        newCutoffLog = minFilterCutoffLog + ( newCutoffLog - MAX_FILTER_CUTOFF_LOG );
      }
      else if ( newCutoffLog < minFilterCutoffLog ) {
        newCutoffLog = MAX_FILTER_CUTOFF_LOG - ( minFilterCutoffLog - newCutoffLog );
      }
      var newCutoff = Math.exp( newCutoffLog );
      biquadFilter1.frequency.setValueAtTime( newCutoff, audioContext.currentTime );
      biquadFilter2.frequency.setValueAtTime( newCutoff, audioContext.currentTime );
      filterUpdateTimer = Timer.setTimeout(
        doRandomUpdateOfFilterCutoff,
        1 / mapNumItemsToFilterUpdateRate( numChargesProperty.value ) * 1000
      );
    }

    // function to stop filter cutoff updates
    function stopFilterCutoffUpdates() {
      if ( filterUpdateTimer ) {
        Timer.clearInterval( filterUpdateTimer );
        filterUpdateTimer = null;
      }
    }

    // create a function to map the number of particles to output gain
    var mapNumItemsToGain = LinearFunction( minCharges, maxCharges, 0, MAX_GAIN );

    // create a function to map number of particles to filter cutoff frequency
    var mapNumItemsToFilterCutoff = LinearFunction( minCharges, maxCharges, options.toneFrequency, MAX_FILTER_CUTOFF );

    // monitor the number of charges and adjust the tone in response
    numChargesProperty.link( function( numCharges ) {

      if ( numCharges > 0 && soundEnabledProperty.value ) {

        // This is necessary because of the async load of the audio buffer.
        if ( !impulseLoaded && typeof( impulseResponse.audioBuffer ) !== 'undefined' ) {
          convolver.buffer = impulseResponse.audioBuffer;
          impulseLoaded = true;
        }

        // update the output gain
        if ( options.mapQuantityToGain ) {
          masterGainControl.gain.value = mapNumItemsToGain( numCharges );
        }


        // update the cutoff frequencies
        if ( options.mapQuantityToFilterCutoff ) {
          var newCutoff = mapNumItemsToFilterCutoff( numCharges );
          biquadFilter1.frequency.setValueAtTime( newCutoff, audioContext.currentTime );
          biquadFilter2.frequency.setValueAtTime( newCutoff, audioContext.currentTime );
        }

        // if the timer isn't running but random filter updates are enabled, kick it off
        if ( options.randomlyUpdateFilterCutoff && filterUpdateTimer === null ) {
          doRandomUpdateOfFilterCutoff();
        }
      }
      else {
        masterGainControl.gain.value = 0;
        stopFilterCutoffUpdates();
      }
    } );

    // if the sound enabled setting becomes false, turn off the sound right away
    soundEnabledProperty.link( function( soundEnabled ) {
      if ( !soundEnabled ) {
        masterGainControl.gain.value = 0;
      }
      else {
        masterGainControl.gain.value = mapNumItemsToGain( numChargesProperty.value );
      }
    } );
  }

  johnTravoltage.register( 'ChargeAmountToneGenerator', ChargeAmountToneGenerator );

  return inherit( Object, ChargeAmountToneGenerator );
} );