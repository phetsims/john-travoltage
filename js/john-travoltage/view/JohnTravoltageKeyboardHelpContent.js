// Copyright 2016-2022, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpIconFactory from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpIconFactory.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import johnTravoltage from '../../johnTravoltage.js';
import JohnTravoltageStrings from '../../JohnTravoltageStrings.js';

const handOrFootString = JohnTravoltageStrings.handOrFoot;
const moveFootString = JohnTravoltageStrings.moveFoot;
const moveHandString = JohnTravoltageStrings.moveHand;

const moveFootDescriptionString = JohnTravoltageStrings.a11y.keyboardHelpDialog.moveFootDescription;
const moveHandDescriptionString = JohnTravoltageStrings.a11y.keyboardHelpDialog.moveHandDescription;

class JohnTravoltageKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // help sections specific to john-travoltage, moving the arm and leg
    const appendageHelpSection = new KeyboardHelpSection( handOrFootString, [
      KeyboardHelpSectionRow.labelWithIcon(
        moveFootString,
        KeyboardHelpIconFactory.leftRightArrowKeysRowIcon(), {
          labelInnerContent: moveFootDescriptionString
        }
      ),
      KeyboardHelpSectionRow.labelWithIcon(
        moveHandString,
        KeyboardHelpIconFactory.upDownArrowKeysRowIcon(), {
          labelInnerContent: moveHandDescriptionString
        }
      )
    ] );

    // section for general content to interacti with common components
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection();

    super( [ appendageHelpSection ], [ basicActionsHelpSection ] );
  }
}

johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );
export default JohnTravoltageKeyboardHelpContent;