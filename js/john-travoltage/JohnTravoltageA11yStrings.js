// Copyright 2017-2018, University of Colorado Boulder

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

  // i18n strings
  var arrowKeysMoveFootString = require( 'string!JOHN_TRAVOLTAGE/arrowKeysMoveFoot' );
  var escapeKeyDescriptionString = require( 'string!JOHN_TRAVOLTAGE/escapeKeyDescription' );
  var escKeyString = require( 'string!JOHN_TRAVOLTAGE/escKey' );
  var hotKeysAndHelpString = require( 'string!JOHN_TRAVOLTAGE/hotKeysAndHelp' );
  var orString = require( 'string!JOHN_TRAVOLTAGE/or' );
  var shiftKeyString = require( 'string!JOHN_TRAVOLTAGE/shiftKey' );
  var shiftTabKeyDescriptionString = require( 'string!JOHN_TRAVOLTAGE/shiftTabKeyDescription' );
  var tabKeyDescriptionString = require( 'string!JOHN_TRAVOLTAGE/tabKeyDescription' );
  var tabKeyString = require( 'string!JOHN_TRAVOLTAGE/tabKey' );

  var JohnTravoltageA11yStrings = {

    // summary information
    screenSummaryJohnPattern: {
      value: 'John\'s hand is {{position}}, and he is ready to swing his leg to rub his foot on the rug.'
    },
    screenSummaryWithChargePattern: {
      value: '{{charge}} {{johnDescription}}'
    },
    electronsDescriptionSingle: {
      value: 'John has 1 charge on his body.'
    },
    electronsDescriptionMultiple: {
      value: 'John has {{value}} charges on his body.'
    },
    positionTemplate: {
      value: 'Position {{value}}: {{description}}.'
    },
    electronsTotal: {
      value: 'Electrons on body: {{value}}.'
    },
    electronsTotalAfterDischarge: {
      value: 'Discharge occurred. Electrons on body decreased from {{oldValue}} to {{newValue}} with hand at position {{position}}, {{region}}.'
    },

    // keyboard help content strings
    or: {
      value: orString
    },
    shiftKey: {
      value: shiftKeyString
    },
    escKey: {
      value: escKeyString
    },
    tabKey: {
      value: tabKeyString
    },
    hotKeysAndHelp: {
      value: hotKeysAndHelpString
    },
    arrowKeysMoveFoot: {
      value: arrowKeysMoveFootString
    },
    tabKeyDescription: {
      value: tabKeyDescriptionString
    },
    shiftTabKeyDescription: {
      value: shiftTabKeyDescriptionString
    },
    escapeKeyDescription: {
      value: escapeKeyDescriptionString
    },
    moveHandOrFootDescription: {
      value: 'Move hand or foot with left and right arrow keys.'
    },

    // appendage labels
    armSliderLabel: {
      value: 'Hand position'
    },
    legSliderLabel: {
      value: 'Leg swing'
    },

    // leg appendage position descriptions
    footOnCarpet: {
      value: 'Foot rubbing on the rug'
    },
    footOffCarpet: {
      value: 'Foot off the rug'
    },

    footOffRugPointingBackwards: {
      value: 'Foot off rug, pointing backward'
    },
    footOffRug: {
      value: 'Foot off rug'
    },
    footRubbingOnRug: {
      value: 'Foot rubbing on rug'
    },
    footOffRugPointingForward: {
      value: 'Foot off rug, pointing forward'
    },
    
    // arm appendage position descriptions
    farthestFromDoorknob: {
      value: 'Farthest from doorknob'
    },
    veryFarFromDoorknob: {
      value: 'Very far from doorknob'
    },
    farFromDoorknob: {
      value: 'Far from doorknob'
    },
    notSoCloseToDoorknob: {
      value: 'Not so close to doorknob'
    },
    closeToDoorknob: {
      value: 'Close to doorknob'
    },
    veryCloseToDoorknob: {
      value: 'Very close to doorknob'
    },
    justAboveDoorknob: {
      value: 'Just above doorknob'
    },
    atDoorknob: {
      value: 'At doorknob'
    },
    justBelowDoorknob: {
      value: 'Just below doorknob'
    },

    // directional change indicators
    towardsDoorknob: {
      value: 'Towards doorknob'
    },
    awayFromDoorknob: {
      value: 'Away from doorknob'
    },
    towardsDoorknobPattern: {
      value: 'Towards doorknob, {{description}}'
    },
    awayFromDoorknobPattern: {
      value: 'Away from doorknob, {{description}}'
    },
    fartherAwayPattern: {
      value: 'Farther away, {{description}}'
    },
	
    // progress indicators
    closerToDoorknob: {
      value: 'Closer to doorknob'
    },
    fartherAwayFromDoorknob: {
      value: 'Farther away from doorknob'
    },

    // landmark positions for the arm
    handPointingAway: {
      value: 'Hand pointing away from door, very far from doorknob'
    },
    handPointingStraightUp: {
      value: 'Hand pointing straight up'
    },
    handPointingAtUpperDoor: {
      value: 'Hand pointing at upper door, close to doorknob'
    },
    handPointingAtLowerDoor: {
      value: 'Hand pointing at lower door, close to doorknob'
    },
    handPointingStraightDown: {
      value: 'Hand pointing straight down'
    },
    farthestFromDoorknobLast: {
      value: 'Farthest from doorknob. Last Stop'
    },

    // what should be read for negative values - VoiceOver will frequently ignore the unicode minus signs and dashes
    // when reading the value, see https://github.com/phetsims/john-travoltage/issues/238
    negativePattern: {
      value: 'negative {{value}}'
    }

  };

  if ( phet.chipper.queryParameters.stringTest === 'xss' ) {
    for ( var key in JohnTravoltageA11yStrings ) {
      JohnTravoltageA11yStrings[ key ].value += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIW2NkYGD4DwABCQEBtxmN7wAAAABJRU5ErkJggg==" onload="window.location.href=atob(\'aHR0cHM6Ly93d3cueW91dHViZS5jb20vd2F0Y2g/dj1kUXc0dzlXZ1hjUQ==\')" />';
    }
  }

  // verify that object is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( JohnTravoltageA11yStrings ); }

  johnTravoltage.register( 'JohnTravoltageA11yStrings', JohnTravoltageA11yStrings );

  return JohnTravoltageA11yStrings;
} );