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
const moveFootString = johnTravoltageStrings.moveFoot;
const moveHandString = johnTravoltageStrings.moveHand;

const moveFootDescriptionString = johnTravoltageStrings.a11y.keyboardHelpDialog.moveFootDescription;
const moveHandDescriptionString = johnTravoltageStrings.a11y.keyboardHelpDialog.moveHandDescription;

class JohnTravoltageKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // help sections specific to john-travoltage, moving the arm and leg
    const appendageHelpSection = new KeyboardHelpSection( handOrFootString, [
      KeyboardHelpSection.labelWithIcon(
        moveFootString,
        KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(),
        moveFootDescriptionString
      ),
      KeyboardHelpSection.labelWithIcon(
        moveHandString,
        KeyboardHelpIconFactory.upDownArrowKeysRowIcon(),
        moveHandDescriptionString
      )
    ] );

    // section for general content to interacti with common components
    const generalNavigationHelpSection = new GeneralKeyboardHelpSection();

    super( [ appendageHelpSection ], [ generalNavigationHelpSection ] );
  }
}

johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );
export default JohnTravoltageKeyboardHelpContent;