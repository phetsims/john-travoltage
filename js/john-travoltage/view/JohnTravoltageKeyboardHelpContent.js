// Copyright 2018, University of Colorado Boulder

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
  var Text = require( 'SCENERY/nodes/Text' );

  // strings
  // This content is being updated, once we like the look the visible strings should be moved to john-travoltage-a11y
  // strings, but keeping them here for now to avoid confusion with changes to the strings.json file
  var armAndLegString = 'Arm and Leg';
  var moveArmAndLegString = 'Move Arm or Leg';
  var moveArmAndLegHelpString = 'Move Arm or Leg with arrow keys.';

  /**
   * Constructor.
   *
   * @constructor
   */
  function JohnTravoltageKeyboardHelpContent() {

    // help content specific to john-travoltage, moving the arm and leg
    var appendageHelpContent = new HelpContent( armAndLegString, [
      {
        label: new Text( moveArmAndLegString, {
          font: HelpContent.DEFAULT_LABEL_FONT,
          maxWidth: HelpContent.DEFAULT_TEXT_MAX_WIDTH
        } ),
        icon: HelpContent.arrowKeysRowIcon( {
          tagName: 'p',
          innerContent: moveArmAndLegHelpString
        } )
      }
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