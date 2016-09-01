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

  // sonification can either be simply set on or can be assigned a numerical value, so handle that here
  var sonificationQueryParamValue = getQueryParameter( 'sonification' );
  if ( sonificationQueryParamValue ) {
    if ( sonificationQueryParamValue === 'undefined' ) {

      // This is kind of a quick of PhET's query parameter system that a string of 'undefined' is the default value if
      // the parameter is present.
      sonificationQueryParamValue = true;
    }
    else {
      sonificationQueryParamValue = parseInt( sonificationQueryParamValue, 10 );
    }
  }

  var JohnTravoltageQueryParameters = {

    // populates the output carousel with 1 card of each type
    SONIFICATION: sonificationQueryParamValue,

    SHOW_DEBUG_INFO: !!getQueryParameter( 'showDebugInfo' )

  };

  johnTravoltage.register( 'JohnTravoltageQueryParameters', JohnTravoltageQueryParameters );

  return JohnTravoltageQueryParameters;
} );
