// Copyright 2016, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  var JohnTravoltageQueryParameters = QueryStringMachine.getAll( {

    // adds sonification, with different degrees and styles depending on the value
    // of the query parameter.  The behavior of each value is described below:
    // none -
    //        No prototype sonification (default value).
    // piano -    
    //        charge level - randomly selected piano pitches (more charges -> faster notes)
    //        charges entering body - mild 'pop' sound when electron is added or removed 
    //        leg range limit reached - nothing
    //        max electrons reached - longer pitch matching last 'electron added' sound
    // pitch -
    //        arm proximity to doorknob - tone with pitch and LFO changing
    //        charge level - randomly filtered tone (more charges -> faster changes)
    //        electron added/removed - mild 'pop' sound when electron is added or removed
    //        leg range limit reached - bonk
    //        max electrons reached - longer pitch matching last electron added sound
    // jostle -
    //        arm proximity to doorknob - constant pitch tone with LFO changing
    //        charge level - looped 'jostling' sound (more charges -> louder sound)
    //        electron added/removed - mild 'pop' sound when electron is added or removed
    //        leg range limit reached - bonk
    //        max electrons reached - longer pitch matching last electron added sound
    // transformer -
    //        arm proximity to doorknob - tone with pitch changing, no LFO
    //        charge level - transformer-ish sound (more charge -> higher cutoff frequency and more volume)
    //        electron added/removed - mild 'pop' sound when electron is added or removed
    //        leg range limit reached - bonk
    //        max electrons reached - longer pitch matching last electron added sound 
    sonification: {
      type: 'string',
      defaultValue: 'none',
      validValues: [ 'none', 'piano', 'pitch', 'jostle', 'transformer' ]
    },

    // shows debug lines which represent the body, and force lines which restrict the charges
    // to stay inside of the body
    showDebugInfo: { type: 'flag' },

    // shows the accessible value text associated with the appendages on the screen view for easy reading
    // and debugging
    valueText: { type: 'flag' }
  } );

  johnTravoltage.register( 'JohnTravoltageQueryParameters', JohnTravoltageQueryParameters );

  return JohnTravoltageQueryParameters;
} );
