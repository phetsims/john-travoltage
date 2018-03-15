// Copyright 2016-2017, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * RangeMaps used by the AppendageNodes to associate a position with a position description.
 *
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Range = require( 'DOT/Range' );

  // a11y strings
  var farthestFromDoorknobString = JohnTravoltageA11yStrings.farthestFromDoorknobString.value;
  var veryFarFromDoorknobString = JohnTravoltageA11yStrings.veryFarFromDoorknobString.value;
  var farFromDoorknobString = JohnTravoltageA11yStrings.farFromDoorknobString.value;
  var notSoCloseToDoorknobString = JohnTravoltageA11yStrings.notSoCloseToDoorknobString.value;
  var closeToDoorknobString = JohnTravoltageA11yStrings.closeToDoorknobString.value;
  var veryCloseToDoorknobString = JohnTravoltageA11yStrings.veryCloseToDoorknobString.value;
  var justAboveDoorknobString = JohnTravoltageA11yStrings.justAboveDoorknobString.value;
  var atDoorknobString = JohnTravoltageA11yStrings.atDoorknobString.value;
  var justBelowDoorknobString = JohnTravoltageA11yStrings.justBelowDoorknobString.value;

  var handPointingAwayString = JohnTravoltageA11yStrings.handPointingAwayString.value;
  var handPointingStraightUpString = JohnTravoltageA11yStrings.handPointingStraightUpString.value;
  var handPointingAtUpperDoorString = JohnTravoltageA11yStrings.handPointingAtUpperDoorString.value;
  var handPointingAtLowerDoorString = JohnTravoltageA11yStrings.handPointingAtLowerDoorString.value;
  var handPointingStraightDownString = JohnTravoltageA11yStrings.handPointingStraightDownString.value;
  var farthestFromDoorknobLastString = JohnTravoltageA11yStrings.farthestFromDoorknobLastString.value;

  var footOffRugPointingBackwardsString = JohnTravoltageA11yStrings.footOffRugPointingBackwardsString.value;
  var footOffRugString = JohnTravoltageA11yStrings.footOffRugString.value;
  var footRubbingOnRugString = JohnTravoltageA11yStrings.footRubbingOnRugString.value;
  var footOffRugPointingForwardString = JohnTravoltageA11yStrings.footOffRugPointingForwardString.value;


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
