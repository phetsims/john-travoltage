// Copyright 2002-2013, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var inherit = require( 'PHET_CORE/inherit' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/model/JohnTravoltageModel' );
  var JohnTravoltageView = require( 'JOHN_TRAVOLTAGE/view/JohnTravoltageView' );
  var Screen = require( 'JOIST/Screen' );
  var title = require( 'string!JOHN_TRAVOLTAGE/travoltage.name' );

  function JohnTravoltageScreen() {
    Screen.call( this, title, null /* single-screen sim, no icon */,
      function() {return new JohnTravoltageModel();},
      function( model ) {return new JohnTravoltageView( model );},
      { backgroundColor: '#9ddcf8' }
    );
  }

  return inherit( Screen, JohnTravoltageScreen );
} );