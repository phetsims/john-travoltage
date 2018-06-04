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
    sceneSummaryJohnPatternString: {
      value: 'John\'s hand is {{position}}, and he is ready to swing his leg to rub his foot on the rug.'
    },
    sceneSummaryWithChargePatternString: {
      value: '{{charge}} {{johnDescription}}'
    },
    electronsDescriptionSingleString: {
      value: 'John has 1 charge on his body.'
    },
    electronsDescriptionMultipleString: {
      value: 'John has {{value}} charges on his body.'
    },
    positionTemplateString: {
      value: 'Position {{value}}: {{description}}.'
    },
    electronsTotalString: {
      value: 'Electrons on body: {{value}}.'
    },
    electronsTotalAfterDischargeString: {
      value: 'Discharge occurred. Electrons on body decreased from {{oldValue}} to {{newValue}} with hand at position {{position}}, {{region}}.'
    },

    // keyboard help content strings
    orString: {
      value: orString
    },
    shiftKeyString: {
      value: shiftKeyString
    },
    escKeyString: {
      value: escKeyString
    },
    tabKeyString: {
      value: tabKeyString
    },
    hotKeysAndHelpString: {
      value: hotKeysAndHelpString
    },
    arrowKeysMoveFootString: {
      value: arrowKeysMoveFootString
    },
    tabKeyDescriptionString: {
      value: tabKeyDescriptionString
    },
    shiftTabKeyDescriptionString: {
      value: shiftTabKeyDescriptionString
    },
    escapeKeyDescriptionString: {
      value: escapeKeyDescriptionString
    },

    // appendage labels
    armSliderLabelString: {
      value: 'Hand position'
    },
    legSliderLabelString: {
      value: 'Leg swing'
    },

    // leg appendage position descriptions
    footOnCarpetString: {
      value: 'Foot rubbing on the rug'
    },
    footOffCarpetString: {
      value: 'Foot off the rug'
    },

    footOffRugPointingBackwardsString: {
      value: 'Foot off rug, pointing backward'
    },
    footOffRugString: {
      value: 'Foot off rug'
    },
    footRubbingOnRugString: {
      value: 'Foot rubbing on rug'
    },
    footOffRugPointingForwardString: {
      value: 'Foot off rug, pointing forward'
    },
    
    // arm appendage position descriptions
    farthestFromDoorknobString: {
      value: 'Farthest from doorknob'
    },
    veryFarFromDoorknobString: {
      value: 'Very far from doorknob'
    },
    farFromDoorknobString: {
      value: 'Far from doorknob'
    },
    notSoCloseToDoorknobString: {
      value: 'Not so close to doorknob'
    },
    closeToDoorknobString: {
      value: 'Close to doorknob'
    },
    veryCloseToDoorknobString: {
      value: 'Very close to doorknob'
    },
    justAboveDoorknobString: {
      value: 'Just above doorknob'
    },
    atDoorknobString: {
      value: 'At doorknob'
    },
    justBelowDoorknobString: {
      value: 'Just below doorknob'
    },

    // directional change indicators
    towardsDoorknobString: {
      value: 'Towards doorknob'
    },
    awayFromDoorknobString: {
      value: 'Away from doorknob'
    },
    towardsDoorknobPatternString: {
      value: 'Towards doorknob, {{description}}'
    },
    awayFromDoorknobPatternString: {
      value: 'Away from doorknob, {{description}}'
    },
    fartherAwayPatternString: {
      value: 'Farther away, {{description}}'
    },
	
    // progress indicators
    closerToDoorknobString: {
      value: 'Closer to doorknob'
    },
    fartherAwayFromDoorknobString: {
      value: 'Farther away from doorknob'
    },

    // landmark positions for the arm
    handPointingAwayString: {
      value: 'Hand pointing away from door, very far from doorknob'
    },
    handPointingStraightUpString: {
      value: 'Hand pointing straight up'
    },
    handPointingAtUpperDoorString: {
      value: 'Hand pointing at upper door, close to doorknob'
    },
    handPointingAtLowerDoorString: {
      value: 'Hand pointing at lower door, close to doorknob'
    },
    handPointingStraightDownString: {
      value: 'Hand pointing straight down'
    },
    farthestFromDoorknobLastString: {
      value: 'Farthest from doorknob.'
    },

    // section labels
    controlPanelString: {
      value: 'Control Panel'
    },
    playAreaString: {
      value: 'Play Area'
    },
    sceneSummaryString: {
      value: 'Scene Summary'
    },

    // what should be read for negative values - VoiceOver will frequently ignore the unicode minus signs and dashes
    // when reading the value, see https://github.com/phetsims/john-travoltage/issues/238
    negativePatternString: {
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