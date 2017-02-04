// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );

  // TODO: this file is likely where we will deal with serializing the particles

  var TJohnTravoltageModel = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.johnTravoltage.JohnTravoltageModel );
    TObject.call( this, instance, phetioID );
  };

  phetioInherit( TObject, 'TJohnTravoltageModel', TJohnTravoltageModel, {}, {} );

  phetioNamespace.register( 'TJohnTravoltageModel', TJohnTravoltageModel );

  return TJohnTravoltageModel;
} );

