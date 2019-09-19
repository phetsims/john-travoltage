// Copyright 2016-2018, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * RangeMaps used by the AppendageNodes to associate a position with a position description.
 *
 * @author Justin Obara
 */
define( require => {
  'use strict';

  // modules
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  const Range = require( 'DOT/Range' );

  // a11y strings
  const farthestFromDoorknobString = JohnTravoltageA11yStrings.farthestFromDoorknob.value;
  const veryFarFromDoorknobString = JohnTravoltageA11yStrings.veryFarFromDoorknob.value;
  const farFromDoorknobString = JohnTravoltageA11yStrings.farFromDoorknob.value;
  const notSoCloseToDoorknobString = JohnTravoltageA11yStrings.notSoCloseToDoorknob.value;
  const closeToDoorknobString = JohnTravoltageA11yStrings.closeToDoorknob.value;
  const veryCloseToDoorknobString = JohnTravoltageA11yStrings.veryCloseToDoorknob.value;
  const justAboveDoorknobString = JohnTravoltageA11yStrings.justAboveDoorknob.value;
  const atDoorknobString = JohnTravoltageA11yStrings.atDoorknob.value;
  const justBelowDoorknobString = JohnTravoltageA11yStrings.justBelowDoorknob.value;

  const handPointingAwayString = JohnTravoltageA11yStrings.handPointingAway.value;
  const handPointingStraightUpString = JohnTravoltageA11yStrings.handPointingStraightUp.value;
  const handPointingAtUpperDoorString = JohnTravoltageA11yStrings.handPointingAtUpperDoor.value;
  const handPointingAtLowerDoorString = JohnTravoltageA11yStrings.handPointingAtLowerDoor.value;
  const handPointingStraightDownString = JohnTravoltageA11yStrings.handPointingStraightDown.value;
  const farthestFromDoorknobLastString = JohnTravoltageA11yStrings.farthestFromDoorknobLast.value;

  const footOffRugPointingBackwardsString = JohnTravoltageA11yStrings.footOffRugPointingBackwards.value;
  const footOffRugString = JohnTravoltageA11yStrings.footOffRug.value;
  const footRubbingOnRugString = JohnTravoltageA11yStrings.footRubbingOnRug.value;
  const footOffRugPointingForwardString = JohnTravoltageA11yStrings.footOffRugPointingForward.value;


  const AppendageRangeMaps = {

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
          text: footOffRugString
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
          text: footOffRugString
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
          value: -13,
          text: handPointingAwayString
        },
        {
          value: -8,
          text: handPointingStraightUpString,
          includeDirection: true
        },
        {
          value: -4,
          text: handPointingAtUpperDoorString
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
          text: handPointingAtLowerDoorString
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
