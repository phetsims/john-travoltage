// Copyright 2017-2019, University of Colorado Boulder

/**
 * IO type for Electron
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var ObjectIO = require( 'TANDEM/types/ObjectIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );
  var validate = require( 'AXON/validate' );

  /**
   * @param {Electron} electron
   * @param {string} phetioID
   * @constructor
   */
  function ElectronIO( electron, phetioID ) {
    ObjectIO.call( this, electron, phetioID );
  }

  phetioInherit( ObjectIO, 'ElectronIO', ElectronIO, {}, {
    validator: { isValidValue: v => v instanceof phet.johnTravoltage.Electron },
    documentation: 'Electron in John\'s body',

    /**
     * @param {Electron} electron
     * @returns {Object}
     * @override
     */
    toStateObject: function( electron ) {
      validate( electron, this.validator );
      return {
        history: electron.history,
        velocityX: electron.velocity.x,
        velocityY: electron.velocity.y
      };
    },

    /**
     * @param {Object} stateObject
     * @returns {Object}
     * @override
     */
    fromStateObject: function( stateObject ) {
      return stateObject;
    },

    setValue: function( electron, fromStateObject ) {
      validate( electron, this.validator );
      assert && assert( fromStateObject.history, 'value should have history' );
      electron.history = fromStateObject.history;
      electron.velocity.x = fromStateObject.velocityX;
      electron.velocity.y = fromStateObject.velocityY;

      // Trigger a computation of screen position
      electron.historyChangedEmitter.emit();
    }
  } );

  johnTravoltage.register( 'ElectronIO', ElectronIO );

  return ElectronIO;
} );