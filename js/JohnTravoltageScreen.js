// Copyright 2002-2013, University of Colorado Boulder
define( function( require ) {
  var Strings = require( 'Strings' );
  var JohnTravoltageModel = require( 'model/JohnTravoltageModel' );
  var JohnTravoltageView = require( 'view/JohnTravoltageView' );

  function JohnTravoltageScreen() {
    return {
      name: Strings['johnTravoltage.name'],
      createModel: function() {return new JohnTravoltageModel( 834, 504 );},
      createView: function( model ) {return new JohnTravoltageView( model );},
      backgroundColor: '#9ddcf8'
    };
  }

  return JohnTravoltageScreen;
} );