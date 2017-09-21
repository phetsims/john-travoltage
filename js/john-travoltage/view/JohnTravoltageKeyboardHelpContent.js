// Copyright 2016-2017, University of Colorado Boulder

/**
 * Content for the "Hot Keys and Help" dialog that can be brought up from the sim navigation bar.
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var AlignGroup = require( 'SCENERY/nodes/AlignGroup' );
  var ArrowKeyNode = require( 'SCENERY_PHET/keyboard/ArrowKeyNode' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var EscapeKeyNode = require( 'SCENERY_PHET/keyboard/EscapeKeyNode' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var RichText = require( 'SCENERY/nodes/RichText' );
  var ShiftKeyNode = require( 'SCENERY_PHET/keyboard/ShiftKeyNode' );
  var Spacer = require( 'SCENERY/nodes/Spacer' );
  var TabKeyNode = require( 'SCENERY_PHET/keyboard/TabKeyNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var VBox = require( 'SCENERY/nodes/VBox' );

  // constants
  var LAYOUT_SPACING = 10;
  var DIALOG_MARGIN = 25;
  var ICON_VERTICAL_SPACING = 8;
  var TEXT_KEY_WIDTH = 42;
  var DESCRIPTION_FONT = new PhetFont( 14 );
  var TEXT_MAX_WIDTH = 300;

  /**
   * Constructor.
   * @param {Tandem} tandem
   * @constructor
   */
  function JohnTravoltageKeyboardHelpContent( tandem ) {

    // icons
    // arrow keys, separated by 'or' text
    var leftArrowKeyNode = new ArrowKeyNode( 'left', {
      tandem: tandem.createTandem( 'leftArrowKeyNode' )
    } );
    var rightArrowKeyNode = new ArrowKeyNode( 'right', {
      tandem: tandem.createTandem( 'rightArrowKeyNode' )
    } );
    var orText = new Text( JohnTravoltageA11yStrings.orString, {
      font: new PhetFont( 12 ),
      tandem: tandem.createTandem( 'orText' ),
      maxWidth: TEXT_MAX_WIDTH / 4
    } );
    var arrowKeysIconHBox = new HBox( {
      children: [ leftArrowKeyNode, orText, rightArrowKeyNode ],
      spacing: LAYOUT_SPACING,
      tandem: tandem.createTandem( 'arrowKeysIconHBox' )
    } );

    // single tab key
    var singleTabKeyIcon = new TabKeyNode( {
      minKeyWidth: TEXT_KEY_WIDTH, // in ScreenView coordinates
      maxKeyWidth: TEXT_KEY_WIDTH,
      tandem: tandem.createTandem( 'singleTabKeyIcon' )
    } );

    // shift and tab keys, separated by plus sign
    var shiftKeyIcon = new ShiftKeyNode( {
      minKeyWidth: TEXT_KEY_WIDTH, // in ScreenView coordinates
      maxKeyWidth: TEXT_KEY_WIDTH,
      tandem: tandem.createTandem( 'shiftKeyIcon' )
    } );
    var plusIconNode = new PlusNode( {
      size: new Dimension2( 10, 1.5 ),
      tandem: tandem.createTandem( 'plusIconNode' )
    } );
    var shiftPlusTabIconHBox = new HBox( {
      children: [ shiftKeyIcon, plusIconNode, new TabKeyNode( {
        minKeyWidth: TEXT_KEY_WIDTH,
        maxKeyWidth: TEXT_KEY_WIDTH
      } ) ],
      spacing: 10,
      tandem: tandem.createTandem( 'shiftPlusTabIconHBox' )
    } );

    // escape key
    var escapeKeyIconNode = new EscapeKeyNode( {
      tandem: tandem.createTandem( 'escapeKeyNode' )
    } );

    // descriptions
    var descriptionOptions = {
      font: DESCRIPTION_FONT,

      // a11y options
      tagName: 'p',
      parentContainerTagName: 'li'
    };
    var arrowKeyDescription = new RichText( JohnTravoltageA11yStrings.arrowKeysMoveFootString, _.extend( {
      tandem: tandem.createTandem( 'arrowKeyDescription' ),
      accessibleLabel: JohnTravoltageA11yStrings.arrowKeysMoveFootString,
      maxWidth: TEXT_MAX_WIDTH
    }, descriptionOptions ) );
    var tabKeyDescription = new RichText( JohnTravoltageA11yStrings.tabKeyDescriptionString, _.extend( {
      tandem: tandem.createTandem( 'tabKeyDescription' ),
      accessibleLabel: JohnTravoltageA11yStrings.tabKeyDescriptionString,
      maxWidth: TEXT_MAX_WIDTH
    }, descriptionOptions ) );
    var shiftPlusTabDescription = new RichText( JohnTravoltageA11yStrings.shiftTabKeyDescriptionString, _.extend( {
      tandem: tandem.createTandem( 'shiftPlusTabDescription' ),
      accessibleLabel: JohnTravoltageA11yStrings.shiftTabKeyDescriptionString,
      maxWidth: TEXT_MAX_WIDTH
    }, descriptionOptions ) );
    var escapeKeyDescription = new RichText( JohnTravoltageA11yStrings.escapeKeyDescriptionString, _.extend( {
      tandem: tandem.createTandem( 'escapeKeyDescription' ),
      accessibleLabel: JohnTravoltageA11yStrings.escapeKeyDescriptionString,
      maxWidth: TEXT_MAX_WIDTH
    }, descriptionOptions ) );

    /**
     * Align the icon and its description vertically by placing in a vertical align group
     * @param  {Node} icon
     * @param  {RichText} description
     * @returns {object} - keys icon {Node} and its description {RichText}
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
      spacing: ICON_VERTICAL_SPACING,
      tandem: tandem.createTandem( 'iconVBox' )
    } );

    // place descriptions in a left aligned box
    var descriptionVBox = new VBox( {
      children: [ arrowKeyContentRow.description, tabKeyContentRow.description, shiftPlusTabContentRow.description, escapeKeyContentRow.description ],
      align: 'left',
      spacing: ICON_VERTICAL_SPACING,
      tandem: tandem.createTandem( 'descriptionVBox' ),

      // a11y - wrap all descriptions in an unordered list
      tagName: 'ul'
    } );

    // the two boxes are aligned horizontally, vertical spacing is guaranteed
    // to be corrected by the AlignGroup
    var contentHBox = new HBox( {
      children: [ iconVBox, descriptionVBox ],
      spacing: 15,
      tandem: tandem.createTandem( 'contentHBox' ),
    } );

    Panel.call( this, contentHBox, {
      stroke: null,
      fill: 'rgb( 214, 237, 249 )',
      tandem: tandem,

      // a11y
      tagName: 'div'
    } );

    // the content should be centered in the dialog relative to the description text
    var oldCenter = contentHBox.centerX;
    var newCenter = descriptionVBox.centerX;
    var spacerWidth = newCenter - oldCenter + 2 * DIALOG_MARGIN;
    contentHBox.addChild( new Spacer( spacerWidth, 0, {
      tandem: tandem.createTandem( 'spacer' )
    } ) );
  }

  johnTravoltage.register( 'JohnTravoltageKeyboardHelpContent', JohnTravoltageKeyboardHelpContent );

  return inherit( Panel, JohnTravoltageKeyboardHelpContent );
} );