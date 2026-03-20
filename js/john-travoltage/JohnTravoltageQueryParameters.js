// Copyright 2016-2026, University of Colorado Boulder

/**
 * Query parameters supported by this simulation.
 *
 * @author John Blanco
 */

import { QueryStringMachine } from '../../../query-string-machine/js/QueryStringMachineModule.js';

const JohnTravoltageQueryParameters = QueryStringMachine.getAll( {

  // shows debug lines which represent the body, and force lines which restrict the charges to stay inside of the body
  showDebugInfo: { type: 'flag' },

  // shows the accessible value text associated with the appendages on the screen view for easy reading and debugging
  valueText: { type: 'flag' }
} );

export default JohnTravoltageQueryParameters;
