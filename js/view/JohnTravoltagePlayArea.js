define( function( require ) {
  "use strict";
  var TabView = require( 'JOIST/TabView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require( "view/BackgroundElementsNode" );
  var ArmNode = require( 'view/ArmNode' );

  function JohnTravoltagePlayArea( model ) {
    TabView.call( this );

    this.addChild( new BackgroundElementsNode() );
    this.addChild( new ArmNode( model.arm ) );

  }

  inherit( TabView, JohnTravoltagePlayArea );
  return JohnTravoltagePlayArea;
} );
