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

    // adds sonification, with diffferent degrees and styles depending on the value
    // of the query parameter.  The behavior of each value is described below:
    // 0 -
    //        No prototype sonification (default value).
    // 1 -    
    //        charge level - randomly selected piano pitches (more charges -> faster notes)
    //        charges entering body - mild 'pop' sound when electron is added or removed 
    //        leg range limit reached - nothing
    //        max electrons reached - longer pitch matching last 'electron added' sound
    // 2 -
    //        arm proximity to doorknob - tone with pitch and LFO changing
    //        charge level - randomly filtered tone (more charges -> faster changes)
    //        electron added/removed - mild 'pop' sound when electron is added or removed
    //        leg range limit reached - bonk
    //        max electrons reached - longer pitch matching last electron added sound
    // 3 -
    //        arm proximity to doorknob - constant picth tone with LFO changing
    //        charge level - looped 'jostling' sound (more charges -> louder sound)
    //        electron added/removed - mild 'pop' sound when electron is added or removed
    //        leg range limit reached - bonk
    //        max electrons reached - longer pitch matching last electron added sound
    // 4 -
    //        arm proximity to doorknob - tone with pitch changing, no LFO
    //        charge level - transformer-ish sound (more charge -> higher cutoff frequency and more volume)
    //        electron added/removed - mild 'pop' sound when electron is added or removed
    //        leg range limit reached - bonk
    //        max electrons reached - longer pitch matching last electron added sound 
    sonification: { type: 'number', defaultValue: 0 },

    // shows debug lines which represent the body, and force lines which restrict the charges
    // to stay inside of the body
    showDebugInfo: { type: 'flag' }

  } );

  johnTravoltage.register( 'JohnTravoltageQueryParameters', JohnTravoltageQueryParameters );

  return JohnTravoltageQueryParameters;
} );
