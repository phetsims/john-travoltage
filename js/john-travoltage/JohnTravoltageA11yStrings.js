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
    sceneSummaryJohnPatternString: 'John\'s hand is {{position}}, and he is ready to swing his leg to rub his foot on the rug.',
    sceneSummaryWithChargePatternString: '{{charge}} {{johnDescription}}',
    electronsDescriptionSingleString: 'John has 1 charge on his body.',
    electronsDescriptionMultipleString: 'John has {{value}} charges on his body.',
    positionTemplateString: 'Position {{value}}: {{description}}.',
    electronsTotalString: 'Electrons on body: {{value}}.',
    electronsTotalAfterDischargeString: 'Discharge occurred. Electrons on body decreased from {{oldValue}} to {{newValue}} with hand at position {{position}}, {{region}}.',

    // keyboard help content strings
    orString: orString,
    shiftKeyString: shiftKeyString,
    escKeyString: escKeyString,
    tabKeyString: tabKeyString,
    hotKeysAndHelpString: hotKeysAndHelpString,
    arrowKeysMoveFootString: arrowKeysMoveFootString,
    tabKeyDescriptionString: tabKeyDescriptionString,
    shiftTabKeyDescriptionString: shiftTabKeyDescriptionString,
    escapeKeyDescriptionString: escapeKeyDescriptionString,

    // appendage labels
    armSliderLabelString: 'Hand position',
    legSliderLabelString: 'Leg swing',

    // used in status updates
    electronsDischargedString: 'electrons discharged',

    // leg appendage position descriptions
    footOnCarpetString: 'Foot rubbing on the rug',
    footOffCarpetString: 'Foot off the rug',

    footOffRugStringPointingBackward: 'Foot off rug, pointing backward',
    footOffRugString: 'Foot off rug',
    footRubbingOnRugString: 'Foot rubbing on rug',
    footOffRugStringPointingForward: 'Foot off rug, pointing forward',
    
    // arm appendage position descriptions
    farthestFromDoorknobString: 'Farthest from doorknob',
    veryFarFromDoorknobString: 'Very far from doorknob',
    farFromDoorknobString: 'Far from doorknob',
    notSoCloseToDoorknobString: 'Not so close to doorknob',
    closeToDoorknobString: 'Close to doorknob',
    veryCloseToDoorknobString: 'Very close to doorknob',
    justAboveDoorknobString: 'Just above doorknob',
    atDoorknobString: 'At doorknob',
    justBelowDoorknobString: 'Just below doorknob',

    // directional change indicators
    towardsDoorknobString: 'Towards doorknob',
    awayFromDoorknobString: 'Away from doorknob',
    towardsDoorknobPatternString: 'Towards doorknob, {{description}}',
    awayFromDoorknobPatternString: 'Away from doorknob, {{description}}',
    fartherAwayPatternString: 'Farther away, {{description}}',
	
    // progress indicators
    closerToDoorknobString: 'Closer to doorknob',
    fartherAwayFromDoorknobString: 'Farther away from doorknob',

    // landmark positions for the arm
    handPointingAwayString: 'Hand pointing away from door, very far from doorknob',
    handPointingStraightUpString: 'Hand pointing straight up',
    handPointingAtUpperDoorString: 'Hand pointing at upper door, close to doorknob',
    handPointingAtLowerDoorString: 'Hand pointing at lower door, close to doorknob',
    handPointingStraightDownString: 'Hand pointing straight down',
    farthestFromDoorknobLastString: 'Farthest from doorknob. Last stop',

    // section labels
    controlPanelString: 'Control Panel',
    playAreaString: 'Play Area',
    sceneSummaryString: 'Scene Summary',

    // what should be read for negative values - VoiceOver will frequently ignore the unicode minus signs and dashes
    // when reading the value, see https://github.com/phetsims/john-travoltage/issues/238
    negativePatternString: 'negative {{value}}'

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