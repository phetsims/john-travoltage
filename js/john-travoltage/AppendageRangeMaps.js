// Copyright 2016-2022, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * RangeMaps used by the AppendageNodes to associate a position with a position description.
 *
 * @author Justin Obara
 */

import Range from '../../../dot/js/Range.js';
import johnTravoltage from '../johnTravoltage.js';
import JohnTravoltageStrings from '../JohnTravoltageStrings.js';

const farthestFromDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.farthestFromDoorknob;
const veryFarFromDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.veryFarFromDoorknob;
const farFromDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.farFromDoorknob;
const notSoCloseToDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.notSoCloseToDoorknob;
const closeToDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.closeToDoorknob;
const veryCloseToDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.veryCloseToDoorknob;
const justAboveDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.justAboveDoorknob;
const atDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.atDoorknob;
const justBelowDoorknobString = JohnTravoltageStrings.a11y.appendages.arm.positions.justBelowDoorknob;

const handPointingAwayString = JohnTravoltageStrings.a11y.appendages.arm.positions.handPointingAway;
const handPointingStraightUpString = JohnTravoltageStrings.a11y.appendages.arm.positions.handPointingStraightUp;
const handPointingAtUpperDoorString = JohnTravoltageStrings.a11y.appendages.arm.positions.handPointingAtUpperDoor;
const handPointingAtLowerDoorString = JohnTravoltageStrings.a11y.appendages.arm.positions.handPointingAtLowerDoor;
const handPointingStraightDownString = JohnTravoltageStrings.a11y.appendages.arm.positions.handPointingStraightDown;
const farthestFromDoorknobLastString = JohnTravoltageStrings.a11y.appendages.arm.positions.farthestFromDoorknobLast;

const footOffRugPointingBackwardsString = JohnTravoltageStrings.a11y.appendages.leg.positions.footOffRugPointingBackwards;
const footOffRugString = JohnTravoltageStrings.a11y.appendages.leg.positions.footOffRug;
const footRubbingOnRugString = JohnTravoltageStrings.a11y.appendages.leg.positions.footRubbingOnRug;
const footOffRugPointingForwardString = JohnTravoltageStrings.a11y.appendages.leg.positions.footOffRugPointingForward;


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
        range: new Range( 15, 15 ),
        text: farthestFromDoorknobString
      }, {
        range: new Range( 12, 14 ),
        text: veryFarFromDoorknobString
      }, {
        range: new Range( 9, 11 ),
        text: farFromDoorknobString
      }, {
        range: new Range( 6, 8 ),
        text: notSoCloseToDoorknobString
      }, {
        range: new Range( 3, 5 ),
        text: closeToDoorknobString
      }, {
        range: new Range( 2, 2 ),
        text: veryCloseToDoorknobString,
        addFartherAway: true
      }, {
        range: new Range( 1, 1 ),
        text: justAboveDoorknobString
      }, {
        range: new Range( 0, 0 ),
        text: atDoorknobString
      }, {
        range: new Range( -1, -1 ),
        text: justBelowDoorknobString
      }, {
        range: new Range( -2, -2 ),
        text: veryCloseToDoorknobString,
        addFartherAway: true
      }, {
        range: new Range( -5, -3 ),
        text: closeToDoorknobString
      }, {
        range: new Range( -8, -6 ),
        text: notSoCloseToDoorknobString
      }, {
        range: new Range( -11, -9 ),
        text: farFromDoorknobString
      }, {
        range: new Range( -14, -12 ),
        text: veryFarFromDoorknobString
      }, {
        range: new Range( -15, -15 ),
        text: farthestFromDoorknobString
      }
    ],

    landmarks: [
      {
        value: 15,
        text: farthestFromDoorknobLastString
      },
      {
        value: 13,
        text: handPointingAwayString
      },
      {
        value: 8,
        text: handPointingStraightUpString
      },
      {
        value: 4,
        text: handPointingAtUpperDoorString
      },
      {
        value: 2,
        text: veryCloseToDoorknobString
      },
      {
        value: 1,
        text: justAboveDoorknobString
      }, {
        value: 0,
        text: atDoorknobString
      }, {
        value: -1,
        text: justBelowDoorknobString
      }, {
        value: -2,
        text: veryCloseToDoorknobString
      }, {
        value: -4,
        text: handPointingAtLowerDoorString
      }, {
        value: -7,
        text: handPointingStraightDownString
      }, {
        value: -13,
        text: handPointingAwayString
      }, {
        value: -15,
        text: farthestFromDoorknobLastString
      }
    ]
  }
};

johnTravoltage.register( 'AppendageRangeMaps', AppendageRangeMaps );

export default AppendageRangeMaps;