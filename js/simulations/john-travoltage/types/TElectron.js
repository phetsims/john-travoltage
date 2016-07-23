// Copyright 2016, University of Colorado Boulder

/**
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var TObject = require( 'PHET_IO/types/TObject' );
  var TVector2 = require( 'PHET_IO/types/dot/TVector2' );

  var TElectron = phetioInherit( TObject, 'TElectron', function( instance, phetioID ) {
    assertInstanceOf( instance, phet.johnTravoltage.Electron );
    TObject.call( this, instance, phetioID );
  }, {}, {
    create: function( tandemID ) {
      return new phet.johnTravoltage.Electron( 0, 0, phetio.getInstance( 'johnTravoltage.johnTravoltageScreen.model' ),
        new phet.tandem.Tandem( tandemID ) );
    },
    fromStateObject: function( stateObject ) {
      return phetio.getWrapper( stateObject ).instance;
    },
    toStateObject: function( instance ) {
      return instance.phetioID;
    }
  } );

  phetioNamespace.register( 'TElectron', TElectron );

  return TElectron;
} );

