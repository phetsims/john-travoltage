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
   * @param instance
   * @param phetioID
   * @constructor
   */
  function ElectronIO( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.johnTravoltage.Electron );
    ObjectIO.call( this, instance, phetioID );
  }

  phetioInherit( ObjectIO, 'ElectronIO', ElectronIO, {}, {
    documentation: 'Electron in John\'s body',

    fromStateObject: function( stateObject ) {
      return stateObject;
    },

    toStateObject: function( value ) {
      return {
        history: value.history,
        velocityX: value.velocity.x,
        velocityY: value.velocity.y
      };
    },

    setValue: function( instance, value ) {
      assert && assert( value.history, 'value should have history' );
      instance.history = value.history;
      instance.velocity.x = value.velocityX;
      instance.velocity.y = value.velocityY;

      // Trigger a computation of screen position
      instance.historyChangedEmitter.emit();
    }
  } );

  johnTravoltage.register( 'ElectronIO', ElectronIO );

  return ElectronIO;
} );