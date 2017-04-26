// Copyright 2016, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * RangeMaps used by the AppendageNodes to associate a position with a position description.
 *
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Range = require( 'DOT/Range' );

  // strings - a11y strings should NOT be translatable yet
  // see https://github.com/phetsims/john-travoltage/issues/130
  // var footRubbingOnRugString = JohnTravoltageA11yStrings.footRubbingOnRugString;

  var farthestFromDoorknobString = JohnTravoltageA11yStrings.farthestFromDoorknobString;
  var veryFarFromDoorknobString = JohnTravoltageA11yStrings.veryFarFromDoorknobString;
  var farFromDoorknobString = JohnTravoltageA11yStrings.farFromDoorknobString;
  var notSoCloseToDoorknobString = JohnTravoltageA11yStrings.notSoCloseToDoorknobString;
  var closeToDoorknobString = JohnTravoltageA11yStrings.closeToDoorknobString;
  var veryCloseToDoorknobString = JohnTravoltageA11yStrings.veryCloseToDoorknobString;
  var justAboveDoorknobString = JohnTravoltageA11yStrings.justAboveDoorknobString;
  var atDoorknobString = JohnTravoltageA11yStrings.atDoorknobString;
  var justBelowDoorknobString = JohnTravoltageA11yStrings.justBelowDoorknobString;

  var handPointingAwayString = JohnTravoltageA11yStrings.handPointingAwayString;
  var handPointingStraightUpString = JohnTravoltageA11yStrings.handPointingStraightUpString;
  var handPointingAtUpperDoorframeString = JohnTravoltageA11yStrings.handPointingAtUpperDoorframeString;
  var handPointingAtLowerDoorFrameString = JohnTravoltageA11yStrings.handPointingAtLowerDoorFrameString;
  var handPointingStraightDownString = JohnTravoltageA11yStrings.handPointingStraightDownString;
  var farthestFromDoorknobLastString = JohnTravoltageA11yStrings.farthestFromDoorknobLastString;

  var footOffRugPointingBackwardsString = JohnTravoltageA11yStrings.footOffRugPointingBackwardsString;
  var footOffRugString = JohnTravoltageA11yStrings.footOffRugString;
  var footRubbingOnRugString = JohnTravoltageA11yStrings.footRubbingOnRugString;
  var footOffRugPointingForwardString = JohnTravoltageA11yStrings.footOffRugPointingForwardString;


  var AppendageRangeMaps = {

    legMap: {
      regions: [
        {
          range: new Range( -7, -5 ),
          text: footOffRugString
        }, {
          range: new Range( -4, 3 ),
          text: footRubbingOnRugString
        }, {
          range: new Range( 4, 7 ),
          text: footOffRugString
        }
      ],
      landmarks: [
        {
          value: -7,
          text: footOffRugPointingBackwardsString
        },
        {
          value: -6,
          text: footOffRugString
        },
        {
          value: -5,
          text: footOffRugString
        },
        {
          value: -4,
          text: footRubbingOnRugString
        },
        {
          value: -3,
          text: footRubbingOnRugString
        },
        {
          value: -2,
          text: footRubbingOnRugString
        },
        {
          value: -1,
          text: footRubbingOnRugString
        }, {
          value: 0,
          text: footRubbingOnRugString
        }, {
          value: 1,
          text: footRubbingOnRugString
        }, {
          value: 2,
          text: footRubbingOnRugString
        }, {
          value: 3,
          text: footRubbingOnRugString
        }, {
          value: 4,
          text: footOffRugString
        }, {
          value: 5,
          text: footOffRugString
        }, {
          value: 6,
          text: footOffRugString
        }, {
          value: 7,
          text: footOffRugPointingForwardString
        }
      ]
    },

    armMap: {
      regions: [
        {
          range: new Range( -15, -15 ),
          text: farthestFromDoorknobString
        }, {
          range: new Range( -14, -12 ),
          text: veryFarFromDoorknobString
        }, {
          range: new Range( -11, -9 ),
          text: farFromDoorknobString
        }, {
          range: new Range( -8, -6 ),
          text: notSoCloseToDoorknobString
        }, {
          range: new Range( -5, -3 ),
          text: closeToDoorknobString
        }, {
          range: new Range( -2, -2 ),
          text: veryCloseToDoorknobString,
          addFartherAway: true
        }, {
          range: new Range( -1, -1 ),
          text: justAboveDoorknobString
        }, {
          range: new Range( 0, 0 ),
          text: atDoorknobString
        }, {
          range: new Range( 1, 1 ),
          text: justBelowDoorknobString
        }, {
          range: new Range( 2, 2 ),
          text: veryCloseToDoorknobString,
          addFartherAway: true
        }, {
          range: new Range( 3, 5 ),
          text: closeToDoorknobString
        }, {
          range: new Range( 6, 8 ),
          text: notSoCloseToDoorknobString
        }, {
          range: new Range( 9, 11 ),
          text: farFromDoorknobString
        }, {
          range: new Range( 12, 14 ),
          text: veryFarFromDoorknobString
        }, {
          range: new Range( 15, 15 ),
          text: farthestFromDoorknobString
        }
      ],

      landmarks: [
        {
          value: -15,
          text: farthestFromDoorknobLastString
        },
        {
          value: -8,
          text: handPointingStraightUpString,
          includeDirection: true
        },
        {
          value: -4,
          text: handPointingAtUpperDoorframeString
        },
        {
          value: -2,
          text: veryCloseToDoorknobString
        },
        {
          value: -1,
          text: justAboveDoorknobString
        }, {
          value: 0,
          text: atDoorknobString
        }, {
          value: 1,
          text: justBelowDoorknobString
        }, {
          value: 2,
          text: veryCloseToDoorknobString
        }, {
          value: 4,
          text: handPointingAtLowerDoorFrameString
        }, {
          value: 7,
          text: handPointingStraightDownString,
          includeDirection: true
        }, {
          value: 13,
          text: handPointingAwayString
        }, {
          value: 15,
          text: farthestFromDoorknobLastString
        }
      ]
    }
  };

  johnTravoltage.register( 'AppendageRangeMaps', AppendageRangeMaps );

  return AppendageRangeMaps;
} );
