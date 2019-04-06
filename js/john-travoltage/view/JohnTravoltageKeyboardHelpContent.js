// Copyright 2016-2019, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const GeneralKeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/GeneralKeyboardHelpSection' );
  const HBox = require( 'SCENERY/nodes/HBox' );
  const KeyboardHelpSection = require( 'SCENERY_PHET/keyboard/help/KeyboardHelpSection' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );

  // strings
  const handOrFootString = require( 'string!JOHN_TRAVOLTAGE/handOrFoot' );
  const moveHandOrFootString = require( 'string!JOHN_TRAVOLTAGE/moveHandOrFoot' );

  // a11y strings, not translatable
  const moveHandOrFootDescriptionString = JohnTravoltageA11yStrings.moveHandOrFootDescription.value;

  class JohnTravoltageKeyboardHelpContent extends HBox {
    constructor() {

      // help sections specific to john-travoltage, moving the arm and leg
      const appendageHelpSection = new KeyboardHelpSection( handOrFootString, [
        KeyboardHelpSection.labelWithIcon( moveHandOrFootString,
          KeyboardHelpSection.leftRightArrowKeysRowIcon( {
            tagName: 'p',
            innerContent: moveHandOrFootDescriptionString
          } ) )
      ], { a11yContentTagName: null } ); // only one entry in this help content, don't wrap in the default ul
      const generalNavigationHelpSection = new GeneralKeyboardHelpSection();

      super(  {
        children: [ appendageHelpSection, generalNavigationHelpSection ],
        align: 'top',
        spacing: 35
      } );
    }
  }

  return johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );
} );