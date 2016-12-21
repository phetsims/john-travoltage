// Copyright 2016, University of Colorado Boulder

/**
 * Key node with text, meant to look like a keyboard key.  By default, a
 * key node with text is more rectangular than a letter key, and the text
 * content is aligned in the left top corner.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var KeyNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/keys/KeyNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );

  /**
   * Constructor.
   * @param {string} string
   * @param {object} options
   */
  function TextKeyNode( string, options ) {

    options = _.extend( {

      // keynode options
      align: 'leftTop',
      xOffset: 5,
      yOffset: 5,

      minKeyWidth: 42,
      maxKeyWidth: 42,

      minKeyHeight: 32,
      maxKeyHeight: 32,

      // text options
      font: new PhetFont( 10 ),
      fill: 'black'

    }, options );

    var textNode = new Text( string, { font: options.font, fill: options.fill } );
    KeyNode.call( this, textNode, options );
  }

  johnTravoltage.register( 'TextKeyNode', TextKeyNode );

  return inherit( KeyNode, TextKeyNode );

} );
