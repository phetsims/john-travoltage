// Copyright 2016-2018, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var GeneralNavigationHelpContent = require( 'SCENERY_PHET/keyboard/help/GeneralNavigationHelpContent' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var HelpContent = require( 'SCENERY_PHET/keyboard/help/HelpContent' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  var handOrFootString = require( 'string!JOHN_TRAVOLTAGE/handOrFoot' );
  var moveHandOrFootString = require( 'string!JOHN_TRAVOLTAGE/moveHandOrFoot' );

  // a11y strings, not translatable
  var moveHandOrFootDescriptionString = JohnTravoltageA11yStrings.moveHandOrFootDescription.value;

  /**
   * Constructor.
   *
   * @constructor
   */
  function JohnTravoltageKeyboardHelpContent() {

    // help content specific to john-travoltage, moving the arm and leg
    var appendageHelpContent = new HelpContent( handOrFootString, [
      HelpContent.labelWithIcon( new Text( moveHandOrFootString, {
          font: HelpContent.DEFAULT_LABEL_FONT
        } ),
        HelpContent.leftRightArrowKeysRowIcon( {
          tagName: 'p',
          innerContent: moveHandOrFootDescriptionString
        } ) )
    ], { a11yContentTagName: null } ); // only one entry in this help content, don't wrap in the default ul
    var generalNavigationHelpContent = new GeneralNavigationHelpContent();

    HBox.call( this, {
      children: [ appendageHelpContent, generalNavigationHelpContent ],
      align: 'top',
      spacing: 35
    } );
  }

  johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );

  return inherit( HBox, JohnTravoltageKeyboardHelpContent );
} );