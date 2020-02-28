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

  // Add a visualization of vibration that looks like a phone. For exploration into haptic feedback,
  // see https://github.com/phetsims/john-travoltage/issues/337
  vibrationChart: { type: 'flag' }
} );

johnTravoltage.register( 'JohnTravoltageQueryParameters', JohnTravoltageQueryParameters );

export default JohnTravoltageQueryParameters;