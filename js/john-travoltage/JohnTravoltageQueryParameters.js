// Copyright 2016-2019, University of Colorado Boulder

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

    // shows debug lines which represent the body, and force lines which restrict the charges to stay inside of the body
    showDebugInfo: { type: 'flag' },

    // shows the accessible value text associated with the appendages on the screen view for easy reading and debugging
    valueText: { type: 'flag' },

    vibrationIndicator: { type: 'flag' },

    vibrationChart: { type: 'flag' }
  } );

  johnTravoltage.register( 'JohnTravoltageQueryParameters', JohnTravoltageQueryParameters );

  return JohnTravoltageQueryParameters;
} );
