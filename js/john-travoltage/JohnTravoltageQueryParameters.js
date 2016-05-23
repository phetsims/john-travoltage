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

  var getQueryParameter = phet.chipper.getQueryParameter;

  var JohnTravoltageQueryParameters = {

    // populates the output carousel with 1 card of each type
    SONIFICATION: !!getQueryParameter( 'sonification' ),

    SHOW_DEBUG_INFO: !!getQueryParameter( 'showDebugInfo' )

  };

  johnTravoltage.register( 'JohnTravoltageQueryParameters', JohnTravoltageQueryParameters );

  return JohnTravoltageQueryParameters;
} );
