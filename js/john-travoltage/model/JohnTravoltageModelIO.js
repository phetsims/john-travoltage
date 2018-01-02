// Copyright 2017, University of Colorado Boulder

/**
 * IO type for JohnTravoltageModel
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {JohnTravoltageModel} johnTravoltageModel
   * @param {string} phetioID
   * @constructor
   */
  function JohnTravoltageModelIO( johnTravoltageModel, phetioID ) {
    assert && assertInstanceOf( johnTravoltageModel, phet.johnTravoltage.JohnTravoltageModel );
    ObjectIO.call( this, johnTravoltageModel, phetioID );
  }

  phetioInherit( ObjectIO, 'JohnTravoltageModelIO', JohnTravoltageModelIO, {}, {
    documentation: 'The model for John Travoltage',
    clearChildInstances: function( johnTravoltageModel ) {
      assert && assertInstanceOf( johnTravoltageModel, phet.johnTravoltage.JohnTravoltageModel );
      johnTravoltageModel.clearElectrons();
    },

    /**
     * Adds an Electron as specified by the phetioID and state.
     * @param {Object} johnTravoltageModel
     * @param {Tandem} tandem
     * @param {Object} electronStateObject
     */
    addChildInstance: function( johnTravoltageModel, tandem, electronStateObject ) {
      assert && assertInstanceOf( johnTravoltageModel, phet.johnTravoltage.JohnTravoltageModel );
      johnTravoltageModel.addElectron( tandem );
    }
  } );

  johnTravoltage.register( 'JohnTravoltageModelIO', JohnTravoltageModelIO );

  return JohnTravoltageModelIO;
} );

