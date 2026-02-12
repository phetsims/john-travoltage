// Copyright 2016-2026, University of Colorado Boulder

/**
 * Content for the "Keyboard Shortcuts" dialog that can be brought up from the sim navigation bar.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import BasicActionsKeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/BasicActionsKeyboardHelpSection.js';
import KeyboardHelpSection from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSection.js';
import KeyboardHelpSectionRow from '../../../../scenery-phet/js/keyboard/help/KeyboardHelpSectionRow.js';
import TwoColumnKeyboardHelpContent from '../../../../scenery-phet/js/keyboard/help/TwoColumnKeyboardHelpContent.js';
import HotkeyData from '../../../../scenery/js/input/HotkeyData.js';
import johnTravoltage from '../../johnTravoltage.js';
import JohnTravoltageStrings from '../../JohnTravoltageStrings.js';

const handOrFootString = JohnTravoltageStrings.handOrFoot;

class JohnTravoltageKeyboardHelpContent extends TwoColumnKeyboardHelpContent {
  constructor() {

    // help sections specific to john-travoltage, moving the arm and leg
    const appendageHelpSection = new KeyboardHelpSection( handOrFootString, [
      KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
        keys: [ 'arrowLeft', 'arrowRight' ],
        repoName: johnTravoltage.name,
        keyboardHelpDialogLabelStringProperty: JohnTravoltageStrings.moveFootStringProperty
      } ) ),
      KeyboardHelpSectionRow.fromHotkeyData( new HotkeyData( {
        keys: [ 'arrowUp', 'arrowDown' ],
        repoName: johnTravoltage.name,
        keyboardHelpDialogLabelStringProperty: JohnTravoltageStrings.moveHandStringProperty
      } ) )
    ] );

    // section for general content to interacti with common components
    const basicActionsHelpSection = new BasicActionsKeyboardHelpSection();

    super( [ appendageHelpSection ], [ basicActionsHelpSection ] );
  }
}

johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );
export default JohnTravoltageKeyboardHelpContent;