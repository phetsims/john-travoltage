// Copyright 2017, University of Colorado Boulder

/**
 * Single location of all accessibility strings.  These strings are not meant to be translatable yet.  Rosetta needs
 * some work to provide translators with context for these strings, and we want to receive some community feedback
 * before these strings are submitted for translation.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  var JohnTravoltageA11yStrings = {

    // summary information
    sceneDescriptionString: '{1}John\'s hand is {0}, and he is ready to swing his leg to rub his foot on the rug.',
    electronsDescriptionSingleString: 'John has 1 charge on his body.',
    electronsDescriptionMultipleString: 'John has {0} charges on his body.',
    positionTemplateString: 'Position {0}: {1}',
    electronsTotalString: 'Electrons on body: {0}',
    electronsTotalAfterDischargeString: 'Electrons on body: Discharge occurred. Electrons decreased from {1} to {0}',

    // keyboard help content strings
    orString: 'or',
    shiftKeyString: 'Shift',
    escKeyString: 'Esc',
    tabKeyString: 'Tab',
    hotKeysAndHelpString: 'Hot Keys and Help',
    arrowKeysMoveFootString: '<b>Left or right arrow keys</b> move the hand or foot.',
    tabKeyDescriptionString: '<b>Tab key</b> moves to the next item.',
    shiftTabKeyDescriptionString: '<b>Shift plus Tab</b> moves to the previous item.',
    escapeKeyDescriptionString: '<b>Escape key</b> closes a dialog, like this one.',

    // appendage positions
    armSliderLabelString: 'Hand position',
    legSliderLabelString: 'Leg swing',
    electronsDischargedString: 'electrons discharged',
  };

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( JohnTravoltageA11yStrings ); }

  johnTravoltage.register( 'JohnTravoltageA11yStrings', JohnTravoltageA11yStrings );

  return JohnTravoltageA11yStrings;
} );