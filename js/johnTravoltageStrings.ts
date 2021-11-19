// Copyright 2020-2021, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import johnTravoltage from './johnTravoltage.js';

type StringsType = {
  'john-travoltage': {
    'title': string
  },
  'or': string,
  'shiftKey': string,
  'escKey': string,
  'tabKey': string,
  'handOrFoot': string,
  'moveHandOrFoot': string,
  'moveFoot': string,
  'moveHand': string,
  'hotKeysAndHelp': string,
  'arrowKeysMoveFoot': string,
  'tabKeyDescription': string,
  'shiftTabKeyDescription': string,
  'escapeKeyDescription': string,
  'a11y': {
    'screenSummary': {
      'bodyDescriptionPattern': string,
      'descriptionWithChargePattern': string
    },
    'electrons': {
      'singleDescription': string,
      'multipleDescriptionPattern': string,
      'totalDescriptionPattern': string,
      'totalAfterDischargePattern': string
    },
    'appendages': {
      'arm': {
        'label': string,
        'positions': {
          'farthestFromDoorknob': string,
          'veryFarFromDoorknob': string,
          'farFromDoorknob': string,
          'notSoCloseToDoorknob': string,
          'closeToDoorknob': string,
          'veryCloseToDoorknob': string,
          'justAboveDoorknob': string,
          'atDoorknob': string,
          'justBelowDoorknob': string,
          'handPointingAway': string,
          'handPointingStraightUp': string,
          'handPointingAtUpperDoor': string,
          'handPointingAtLowerDoor': string,
          'handPointingStraightDown': string,
          'farthestFromDoorknobLast': string
        }
      },
      'leg': {
        'label': string,
        'positions': {
          'footOffRugPointingBackwards': string,
          'footOffRug': string,
          'footRubbingOnRug': string,
          'footOffRugPointingForward': string
        }
      }
    },
    'keyboardHelpDialog': {
      'moveFootDescription': string,
      'moveHandDescription': string
    },
    'voicing': {
      'contentHint': string,
      'detailedContentHint': string,
      'chargedContentHint': string,
      'overviewPattern': string,
      'previousDischargePattern': string,
      'johnFullyCharged': string,
      'multipleElectronsOnBodyPattern': string,
      'screenSummaryWithPreviousDischargePattern': string,
      'handInteractionHint': string,
      'footInteractionHint': string
    }
  }
};

const johnTravoltageStrings = getStringModule( 'JOHN_TRAVOLTAGE' ) as StringsType;

johnTravoltage.register( 'johnTravoltageStrings', johnTravoltageStrings );

export default johnTravoltageStrings;
