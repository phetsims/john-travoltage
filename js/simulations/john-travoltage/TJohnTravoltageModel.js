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

  var TJohnTravoltageModel = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.johnTravoltage.JohnTravoltageModel );
    TObject.call( this, instance, phetioID );
  };

  phetioInherit( TObject, 'TJohnTravoltageModel', TJohnTravoltageModel, {}, {
    clearChildInstances: function( model ) {
      model.clearElectrons();
    },

    /**
     * Adds an Electron as specified by the phetioID and state.
     * @param {Object} model
     * @param {Tandem} tandem
     * @param {Object} electronStateObject
     */
    addChildInstance: function( model, tandem, electronStateObject ) {
      model.addElectron( tandem );
    }
  } );

  phetioNamespace.register( 'TJohnTravoltageModel', TJohnTravoltageModel );

  return TJohnTravoltageModel;
} );

