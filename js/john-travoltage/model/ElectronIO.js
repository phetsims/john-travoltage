// Copyright 2017-2018, University of Colorado Boulder

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
  
  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * @param {Electron} electron
   * @param {string} phetioID
   * @constructor
   */
  function ElectronIO( electron, phetioID ) {
    assert && assertInstanceOf( electron, phet.johnTravoltage.Electron );
    ObjectIO.call( this, electron, phetioID );
  }

  phetioInherit( ObjectIO, 'ElectronIO', ElectronIO, {}, {
    documentation: 'Electron in John\'s body',

    toStateObject: function( electron ) {
      assert && assertInstanceOf( electron, phet.johnTravoltage.Electron );
      return {
        history: electron.history,
        velocityX: electron.velocity.x,
        velocityY: electron.velocity.y
      };
    },

    fromStateObject: function( stateObject ) {
      return stateObject;
    },

    setValue: function( electron, fromStateObject ) {
      assert && assertInstanceOf( electron, phet.johnTravoltage.Electron );
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