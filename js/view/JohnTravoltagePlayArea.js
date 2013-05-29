define( function( require ) {
  "use strict";
  var ControlPanel = require( 'view/ControlPanel' );
  var Strings = require( 'Strings' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Vector2 = require( 'DOT/Vector2' );
  var TabView = require( 'JOIST/TabView' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var PlusChargeNode = require( 'view/MinusChargeNode' );

  function JohnTravoltagePlayArea( model ) {
    TabView.call( this );
  }

  inherit( JohnTravoltagePlayArea, TabView );
  return JohnTravoltagePlayArea;
} );
