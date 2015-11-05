// Copyright 2002-2013, University of Colorado Boulder

/**
 * Screen for John Travoltage
 *
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var JohnTravoltageView = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JohnTravoltageView' );
  var Screen = require( 'JOIST/Screen' );

  // strings
  var johnTravoltageTitleString = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.title' );

  function JohnTravoltageScreen() {
    Screen.call( this, johnTravoltageTitleString, null /* single-screen sim, no icon */,
      function() {return new JohnTravoltageModel();},
      function( model ) {return new JohnTravoltageView( model );},
      { backgroundColor: '#9ddcf8' }
    );
  }

  return inherit( Screen, JohnTravoltageScreen );
} );