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
    sceneDescriptionString: '{1} John\'s hand is {0}, and he is ready to swing his leg to rub his foot on the rug.',
    electronsDescriptionSingleString: 'John has 1 charge on his body.',
    electronsDescriptionMultipleString: 'John has {0} charges on his body.',
    positionTemplateString: 'Position {0}: {1}',
    electronsTotalString: 'Electrons on body: {0}',
    electronsTotalAfterDischargeString: 'Discharge occurred. Electrons on body decreased from {1} to {0}.',

    // keyboard help content strings
    orString: 'or',
    shiftKeyString: 'Shift',
    escKeyString: 'Esc',
    tabKeyString: 'Tab',
    hotKeysAndHelpString: 'Keyboard Shortcuts',
    arrowKeysMoveFootString: '<strong>Left or right arrow keys</strong> move the hand or foot.',
    tabKeyDescriptionString: '<strong>Tab key</strong> moves to the next item.',
    shiftTabKeyDescriptionString: '<strong>Shift plus Tab</strong> moves to the previous item.',
    escapeKeyDescriptionString: '<strong>Escape key</strong> closes a dialog, like this one.',

    // appendage labels
    armSliderLabelString: 'Hand position',
    legSliderLabelString: 'Leg swing',

    // used in status updates
    electronsDischargedString: 'electrons discharged',

    // leg appendage position descriptions
    footOnCarpetString: 'foot rubbing on the rug',
    footOffCarpetString: 'foot off the rug',

    footOffRugStringPointingBackward: 'foot off rug, pointing backward',
    footOffRugString: 'foot off rug',
    footRubbingOnRugString: 'foot rubbing on rug',
    footOffRugStringPointingForward: 'foot off rug, pointing forward',
    
    // arm appendage position descriptions
    farthestFromDoorknobString: 'farthest from doorknob',
    veryFarFromDoorknobString: 'very far from doorknob',
    farFromDoorknobString: 'far from doorknob',
    notSoCloseToDoorknobString: 'not so close to doorknob',
    closeToDoorknobString: 'close to doorknob',
    veryClosetoDoorknobString: 'very close to doorknob',
    justAboveDoorknobString: 'just above doorknob',
    atDoorknobString: 'at doorknob',
    justBelowDoorknobString: 'just below doorknob',

    // directional change indicators
    towardsDoorknobString: 'towards doorknob',
    awayFromDoorknobString: 'away from doorknob',
	
    // directional indicator for emphasis when moving away above and below doorknob
    fartherAwayVeryCloseString: 'farther away, very close to doorknob',

    // progress indicators
    closerToDoorknobString: 'closer to doorknob',
    fartherAwayFromDoorknobString: 'farther away from doorknob',
    closerStillPatternString: 'closer, still {0}',
    fartherAwayStillPatternString: 'farther away, still {0}',

    // landmark positions for the arm
    handPointingAwayString: 'Hand pointing away from door, very far from doorknob.',
    handPointingStraightUpString: 'Hand pointing straight up.',
    handPointingAtUpperDoorframeString: 'Hand pointing at upper door frame, not so close to doorknob.',
    handPointingAtLowerDoorFrameString: 'Hand pointing at lower door frame, not close to doorknob.',
    handPointingStraightDownString: 'Hand pointing straight down.',

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