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
    arrowKeysMoveFootString: '<strong>Left or right arrow keys</strong> move the hand or foot.',
    tabKeyDescriptionString: '<strong>Tab key</strong> moves to the next item.',
    shiftTabKeyDescriptionString: '<strong>Shift plus Tab</strong> moves to the previous item.',
    escapeKeyDescriptionString: '<strong>Escape key</strong> closes a dialog, like this one.',

    // appendage labels
    armSliderLabelString: 'Hand position',
    legSliderLabelString: 'Leg swing',

    // used in status updates
    electronsDischargedString: 'electrons discharged',

    // appendage position descriptions
    footOnCarpetString: 'foot rubbing on the rug',
    footOffCarpetString: 'foot off the rug',
    handClosestString: 'closest to the doorknob',
    handVeryCloseString: 'very close to the doorknob',
    handCloseString: 'close to the doorknob',
    handNeitherString: 'neither far nor close to the doorknob',
    handFarString: 'far from the doorknob',
    handVeryFarString: 'very far from the doorknob',
    handFarthestString: 'farthest from the doorknob',

    // section labels
    controlPanelString: 'Control Panel',
    playAreaString: 'Play Area'

  };

  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    for ( var key in JohnTravoltageA11yStrings ) {
      JohnTravoltageA11yStrings[ key ] += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( JohnTravoltageA11yStrings ); }

  johnTravoltage.register( 'JohnTravoltageA11yStrings', JohnTravoltageA11yStrings );

  return JohnTravoltageA11yStrings;
} );