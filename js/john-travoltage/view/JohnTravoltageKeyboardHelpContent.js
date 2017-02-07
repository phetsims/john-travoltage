// Copyright 2016, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Text = require( 'SCENERY/nodes/Text' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Panel = require( 'SUN/Panel' );
  var ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );
  var ShiftKeyNode = require( 'SCENERY_PHET/keyboard/ShiftKeyNode' );
  var EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var Spacer = require( 'SCENERY/nodes/Spacer' );
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );

  // constants
  var LAYOUT_SPACING = 10;
  var DIALOG_MARGIN = 25;
  var ICON_VERTICAL_SPACING = 8;
  var TEXT_KEY_WIDTH = 42;
  var DESCRIPTION_FONT = new PhetFont( 14 );

  /**
   * Constructor.
   * @param {Tandem} tandem
   * @constructor
   */
  function JohnTravoltageKeyboardHelpContent( tandem ) {

    // title
    var titleText = new Text( JohnTravoltageA11yStrings.hotKeysAndHelpString, {
      font: new PhetFont( {
        weight: 'bold',
        size: 20
      } )
    } );

    // icons
    // arrow keys, separated by 'or' text
    var leftArrowKeyNode = new ArrowKeyNode( 'left' );
    var rightArrowKeyNode = new ArrowKeyNode( 'right' );
    var orText = new Text( JohnTravoltageA11yStrings.orString, { font: new PhetFont( 12 ) } );
    var arrowKeysIconHBox = new HBox( {
      children: [ leftArrowKeyNode, orText, rightArrowKeyNode ],
      spacing: LAYOUT_SPACING
    } );

    // single tab key
    var singleTabKeyIcon = new TabKeyNode( {
      minKeyWidth: TEXT_KEY_WIDTH, // in ScreenView coordinates
      maxKeyWidth: TEXT_KEY_WIDTH
    } );

    // shift and tab keys, separated by plus sign
    var shiftKeyIconNode = new ShiftKeyNode( {
      minKeyWidth: TEXT_KEY_WIDTH, // in ScreenView coordinates
      maxKeyWidth: TEXT_KEY_WIDTH
    } );
    var plusIconNode = new PlusNode( {
      size: new Dimension2( 10, 1.5 )
    } );
    var shiftPlusTabIconHBox = new HBox( {
      children: [ shiftKeyIconNode, plusIconNode, new TabKeyNode( {
        minKeyWidth: TEXT_KEY_WIDTH,
        maxKeyWidth: TEXT_KEY_WIDTH
      } ) ],
      spacing: 10
    } );

    // escape key
    var escapeKeyIconNode = new EscapeKeyNode();

    // descriptions
    var descriptionOptions = { font: DESCRIPTION_FONT };
    var arrowKeyDescription = new HTMLText( JohnTravoltageA11yStrings.arrowKeysMoveFootString, descriptionOptions );
    var tabKeyDescription = new HTMLText( JohnTravoltageA11yStrings.tabKeyDescriptionString, descriptionOptions );
    var shiftPlusTabDescription = new HTMLText( JohnTravoltageA11yStrings.shiftTabKeyDescriptionString, descriptionOptions );
    var escapeKeyDescription = new HTMLText( JohnTravoltageA11yStrings.escapeKeyDescriptionString, descriptionOptions );

    /**
     * Align the icon and its description vertically by placing in a vertical align group
     * @param  {Node} icon
     * @param  {HTMLText} description
     * @return {object} - keys icon {Node} and its description {HTMLText}
     */
    var createContentRow = function( icon, description ) {
      var alignGroup = new AlignGroup( { matchHorizontal: false } );
      var iconBox = alignGroup.createBox( icon );
      var descriptionBox = alignGroup.createBox( description );

      return {
        icon: iconBox,
        description: descriptionBox
      };
    };

    // align the icons with their content
    var arrowKeyContentRow = createContentRow( arrowKeysIconHBox, arrowKeyDescription );
    var tabKeyContentRow = createContentRow( singleTabKeyIcon, tabKeyDescription );
    var shiftPlusTabContentRow = createContentRow( shiftPlusTabIconHBox, shiftPlusTabDescription );
    var escapeKeyContentRow = createContentRow( escapeKeyIconNode, escapeKeyDescription );

    // place icons in a right aligned vbox
    var iconVBox = new VBox( {
      children: [ arrowKeyContentRow.icon, tabKeyContentRow.icon, shiftPlusTabContentRow.icon, escapeKeyContentRow.icon ],
      align: 'right',
      spacing: ICON_VERTICAL_SPACING
    } );

    // place descriptions in a left aligned hbox
    var descriptionVBox = new VBox( {
      children: [ arrowKeyContentRow.description, tabKeyContentRow.description, shiftPlusTabContentRow.description, escapeKeyContentRow.description ],
      align: 'left',
      spacing: ICON_VERTICAL_SPACING
    } );

    // the two boxes are aligedn horizontally, vertical spacing is guaranteed 
    // to be corrected by the AlignGroup
    var contentHBox = new HBox( {
      children: [ iconVBox, descriptionVBox ],
      spacing: 15
    } );

    // title and content aligned in a VBox
    var content = new VBox( {
      children: [ titleText, contentHBox ],
      spacing: LAYOUT_SPACING
    } );

    Panel.call( this, content, {
      stroke: null,
      xMargin: DIALOG_MARGIN,
      yMargin: DIALOG_MARGIN,
      fill: 'rgb( 214, 237, 249 )',
      tandem: tandem
    } );

    // the content should be centered in the dialog relative to the description text
    var oldCenter = contentHBox.centerX;
    var newCenter = descriptionVBox.centerX;
    var spacerWidth = newCenter - oldCenter + 2 * DIALOG_MARGIN;
    var spacer = new Spacer( spacerWidth, 0 );
    contentHBox.addChild( spacer );
  }

  johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );

  return inherit( Panel, JohnTravoltageKeyboardHelpContent );
} );