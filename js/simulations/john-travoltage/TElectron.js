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
  var phetio = require( 'PHET_IO/phetio' );
  var TObject = require( 'PHET_IO/types/TObject' );

  var TElectron = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.johnTravoltage.Electron );
    TObject.call( this, instance, phetioID );
  };

  phetioInherit( TObject, 'TElectron', TElectron, {}, {

    fromStateObject: function( stateObject ) {
      return {};
    },

    toStateObject: function( value ) {
      return {};
    },

    setValue: function( instance, value ) {
      // done in constructor, nothing else to do here, could be omitted
    }
  } );

  phetioNamespace.register( 'TElectron', TElectron );

  return TElectron;
} );