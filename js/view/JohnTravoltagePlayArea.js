define( function( require ) {
  "use strict";
  var TabView = require( 'JOIST/TabView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require("view/BackgroundElementsNode");

  function JohnTravoltagePlayArea( model ) {
    TabView.call( this );

    this.addChild(new BackgroundElementsNode());



  }

  inherit( JohnTravoltagePlayArea, TabView );
  return JohnTravoltagePlayArea;
} );
