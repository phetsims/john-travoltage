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
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var TObject = require( 'ifphetio!PHET_IO/types/TObject' );

  /**
   *
   * @param instance
   * @param phetioID
   * @constructor
   */
  function TElectron( instance, phetioID ) {
    assert && assertInstanceOf( instance, phet.johnTravoltage.Electron );
    TObject.call( this, instance, phetioID );
  }

  phetioInherit( TObject, 'TElectron', TElectron, {}, {
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

  johnTravoltage.register( 'TElectron', TElectron );

  return TElectron;
} );