// Copyright 2013-2017, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageScreen' );
  var Random = require( 'DOT/Random' );

  // strings
  require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  phet.joist = {
    random: new Random( { staticSeed: true } )
  };
} );