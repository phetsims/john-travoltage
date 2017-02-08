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

  var TElectron = function( instance, phetioID ) {
    assertInstanceOf( instance, phet.johnTravoltage.Electron );
    TObject.call( this, instance, phetioID );
  };

  phetioInherit( TObject, 'TElectron', TElectron, {}, {

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

  phetioNamespace.register( 'TElectron', TElectron );

  return TElectron;
} );