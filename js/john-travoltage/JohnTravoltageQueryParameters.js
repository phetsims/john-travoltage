// Copyright 2016-2020, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */

import johnTravoltage from '../johnTravoltage.js';

const JohnTravoltageQueryParameters = QueryStringMachine.getAll( {

  // shows debug lines which represent the body, and force lines which restrict the charges to stay inside of the body
  showDebugInfo: { type: 'flag' },

  // shows the accessible value text associated with the appendages on the screen view for easy reading and debugging
  valueText: { type: 'flag' },

  // a vibration design that is custom to the john-travoltage simulation - initialize-globals
  // aready has a x'vibration' query parameter, so this is named to avoid a conflict
  simVibration: {
    type: 'string',
    defaultValue: null,
    validValues: [ null, 'prototypeDesign1' ]
  }
} );

johnTravoltage.register( 'JohnTravoltageQueryParameters', JohnTravoltageQueryParameters );

export default JohnTravoltageQueryParameters;