// Copyright 2002-2013, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Strings = require( 'JOHN_TRAVOLTAGE/Strings' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/model/JohnTravoltageModel' );
  var JohnTravoltageView = require( 'JOHN_TRAVOLTAGE/view/JohnTravoltageView' );

  function JohnTravoltageScreen() {
    return {
      name: Strings['johnTravoltage.name'],
      createModel: function() {return new JohnTravoltageModel();},
      createView: function( model ) {return new JohnTravoltageView( model );},
      backgroundColor: '#9ddcf8'
    };
  }

  return JohnTravoltageScreen;
} );