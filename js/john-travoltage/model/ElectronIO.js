// Copyright 2017, University of Colorado Boulder

/**
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
   *
   * @param electron
   * @param phetioID
   * @constructor
   */
  function ElectronIO( electron, phetioID ) {
    assert && assertInstanceOf( electron, phet.johnTravoltage.Electron );
    ObjectIO.call( this, electron, phetioID );
  }

  phetioInherit( ObjectIO, 'ElectronIO', ElectronIO, {}, {
    documentation: 'Electron in John\'s body',

    fromStateObject: function( stateObject ) {
      return stateObject;
    },

    toStateObject: function( electron ) {
      assert && assertInstanceOf( electron, phet.johnTravoltage.Electron );
      return {
        history: electron.history,
        velocityX: electron.velocity.x,
        velocityY: electron.velocity.y
      };
    },

    setValue: function( electron, value ) {
      assert && assertInstanceOf( electron, phet.johnTravoltage.Electron );
      assert && assert( value.history, 'value should have history' );
      electron.history = value.history;
      electron.velocity.x = value.velocityX;
      electron.velocity.y = value.velocityY;

      // Trigger a computation of screen position
      electron.historyChangedEmitter.emit();
    }
  } );

  johnTravoltage.register( 'ElectronIO', ElectronIO );

  return ElectronIO;
} );