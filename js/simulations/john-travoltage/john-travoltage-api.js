// Copyright 2015-2016, University of Colorado Boulder

/**
 * This is the public API for the Faraday's Law sim.  It can be used in concert with phetio.js and phetioEvents.js for API
 * simulation features.
 *
 * Conventions:
 * 1. Property names should start with the screen name. This will enable usage in sims where screens are mixed and matced
 * 2. Most components will be top level within the screen.  Sometime nested structure is valuable for composite items
 * 3. UI components have the component type as the suffix, such as showTimerButton.  Model components do not have a suffix
 *      such as concentrationScreen.solute
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */
// Permit uppercase function names, such as TProperty(string)
define(function(require) {
  'use strict';

  // modules
  var assertInstanceOf = require( 'PHET_IO/assertions/assertInstanceOf' );
  var phetio = require( 'PHET_IO/phetio' );
  var PhETIOCommon = require( 'PHET_IO/api/PhETIOCommon' );
  var phetioInherit = require( 'PHET_IO/phetioInherit' );
  var phetioNamespace = require( 'PHET_IO/phetioNamespace' );
  var Tandem = require( 'TANDEM/Tandem' );
  var TGroup = require( 'PHET_IO/api/TGroup' );
  var TObject = require( 'PHET_IO/api/TObject' );
  var TObservableArray = require( 'PHET_IO/api/axon/TObservableArray' );
  var TVector2 = require( 'PHET_IO/api/dot/TVector2' );

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
    },
    api: {
      velocity: TVector2
    }
  } );

  var TJohnTravoltageModel = phetioInherit( TObject, 'TJohnTravoltageModel', function( instance, phetioID ) {
    assertInstanceOf( instance, phet.johnTravoltage.JohnTravoltageModel );
    TObject.call( this, instance, phetioID );
  }, {}, {} );

  // Use explicit names for id keys so they will match what researchers see in data files
  // Use id and type instead of phetioID and typeID to simplify things for researchers
  // Use a map so that JS will help us check that there are no duplicate names.
  var johnTravoltageAPI = PhETIOCommon.createAPI( {
    johnTravoltage: PhETIOCommon.createSim( {
      johnTravoltageScreen: {
        model: TJohnTravoltageModel.extend( {
          electrons: TObservableArray( TElectron ),
          electron: TGroup( TElectron )
        } )
      }
      }
    )
  } );

    phetioNamespace.register( 'john-travoltage-api', johnTravoltageAPI );

  // Set the phetio.api after it was declared
  phetio.api = johnTravoltageAPI;

  // Register phetio as a tandem instance after API assigned
  new Tandem( 'phetio' ).addInstance( phetio );

  return johnTravoltageAPI;
});