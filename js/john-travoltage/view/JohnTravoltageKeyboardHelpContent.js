// Copyright 2016-2020, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import GeneralKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/GeneralKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import johnTravoltage from '../../johnTravoltage.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';

const handOrFootString = johnTravoltageStrings.handOrFoot;
const moveHandOrFootString = johnTravoltageStrings.moveHandOrFoot;

const moveHandOrFootDescriptionString = johnTravoltageStrings.a11y.keyboardHelpDialog.moveHandOrFootDescription;

class JohnTravoltageKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // help sections specific to john-travoltage, moving the arm and leg
    const appendageHelpSection = new KeyboardHelpSection( handOrFootString, [
      KeyboardHelpSection.labelWithIcon( moveHandOrFootString,
        KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
        moveHandOrFootDescriptionString,
        { iconOptions: { tagName: 'p' } } )
    ], { a11yContentTagName: null } ); // only one entry in this help content, don't wrap in the default ul
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection();

    super( [ appendageHelpSection ], [ generalNavigationHelpSection ] );
  }
}

johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );
export default JohnTravoltageKeyboardHelpContent;