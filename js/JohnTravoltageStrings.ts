// Copyright 2021-2022, University of Colorado Boulder

/**
 * Auto-generated from modulify, DO NOT manually modify.
 */
/* eslint-disable */
import getStringModule from '../../chipper/js/getStringModule.js';
import TReadOnlyProperty from '../../axon/js/TReadOnlyProperty.js';
import johnTravoltage from './johnTravoltage.js';

type StringsType = {
  'john-travoltage': {
    'title': string;
    'titleStringProperty': TReadOnlyProperty<string>;
  };
  'or': string;
  'orStringProperty': TReadOnlyProperty<string>;
  'shiftKey': string;
  'shiftKeyStringProperty': TReadOnlyProperty<string>;
  'escKey': string;
  'escKeyStringProperty': TReadOnlyProperty<string>;
  'tabKey': string;
  'tabKeyStringProperty': TReadOnlyProperty<string>;
  'handOrFoot': string;
  'handOrFootStringProperty': TReadOnlyProperty<string>;
  'moveHandOrFoot': string;
  'moveHandOrFootStringProperty': TReadOnlyProperty<string>;
  'moveFoot': string;
  'moveFootStringProperty': TReadOnlyProperty<string>;
  'moveHand': string;
  'moveHandStringProperty': TReadOnlyProperty<string>;
  'hotKeysAndHelp': string;
  'hotKeysAndHelpStringProperty': TReadOnlyProperty<string>;
  'arrowKeysMoveFoot': string;
  'arrowKeysMoveFootStringProperty': TReadOnlyProperty<string>;
  'tabKeyDescription': string;
  'tabKeyDescriptionStringProperty': TReadOnlyProperty<string>;
  'shiftTabKeyDescription': string;
  'shiftTabKeyDescriptionStringProperty': TReadOnlyProperty<string>;
  'escapeKeyDescription': string;
  'escapeKeyDescriptionStringProperty': TReadOnlyProperty<string>;
  'a11y': {
    'screenSummary': {
      'bodyDescriptionPattern': string;
      'bodyDescriptionPatternStringProperty': TReadOnlyProperty<string>;
      'descriptionWithChargePattern': string;
      'descriptionWithChargePatternStringProperty': TReadOnlyProperty<string>;
    };
    'electrons': {
      'singleDescription': string;
      'singleDescriptionStringProperty': TReadOnlyProperty<string>;
      'multipleDescriptionPattern': string;
      'multipleDescriptionPatternStringProperty': TReadOnlyProperty<string>;
      'totalDescriptionPattern': string;
      'totalDescriptionPatternStringProperty': TReadOnlyProperty<string>;
      'totalAfterDischargePattern': string;
      'totalAfterDischargePatternStringProperty': TReadOnlyProperty<string>;
    };
    'appendages': {
      'arm': {
        'label': string;
        'labelStringProperty': TReadOnlyProperty<string>;
        'positions': {
          'farthestFromDoorknob': string;
          'farthestFromDoorknobStringProperty': TReadOnlyProperty<string>;
          'veryFarFromDoorknob': string;
          'veryFarFromDoorknobStringProperty': TReadOnlyProperty<string>;
          'farFromDoorknob': string;
          'farFromDoorknobStringProperty': TReadOnlyProperty<string>;
          'notSoCloseToDoorknob': string;
          'notSoCloseToDoorknobStringProperty': TReadOnlyProperty<string>;
          'closeToDoorknob': string;
          'closeToDoorknobStringProperty': TReadOnlyProperty<string>;
          'veryCloseToDoorknob': string;
          'veryCloseToDoorknobStringProperty': TReadOnlyProperty<string>;
          'justAboveDoorknob': string;
          'justAboveDoorknobStringProperty': TReadOnlyProperty<string>;
          'atDoorknob': string;
          'atDoorknobStringProperty': TReadOnlyProperty<string>;
          'justBelowDoorknob': string;
          'justBelowDoorknobStringProperty': TReadOnlyProperty<string>;
          'handPointingAway': string;
          'handPointingAwayStringProperty': TReadOnlyProperty<string>;
          'handPointingStraightUp': string;
          'handPointingStraightUpStringProperty': TReadOnlyProperty<string>;
          'handPointingAtUpperDoor': string;
          'handPointingAtUpperDoorStringProperty': TReadOnlyProperty<string>;
          'handPointingAtLowerDoor': string;
          'handPointingAtLowerDoorStringProperty': TReadOnlyProperty<string>;
          'handPointingStraightDown': string;
          'handPointingStraightDownStringProperty': TReadOnlyProperty<string>;
          'farthestFromDoorknobLast': string;
          'farthestFromDoorknobLastStringProperty': TReadOnlyProperty<string>;
        }
      };
      'leg': {
        'label': string;
        'labelStringProperty': TReadOnlyProperty<string>;
        'positions': {
          'footOffRugPointingBackwards': string;
          'footOffRugPointingBackwardsStringProperty': TReadOnlyProperty<string>;
          'footOffRug': string;
          'footOffRugStringProperty': TReadOnlyProperty<string>;
          'footRubbingOnRug': string;
          'footRubbingOnRugStringProperty': TReadOnlyProperty<string>;
          'footOffRugPointingForward': string;
          'footOffRugPointingForwardStringProperty': TReadOnlyProperty<string>;
        }
      }
    };
    'keyboardHelpDialog': {
      'moveFootDescription': string;
      'moveFootDescriptionStringProperty': TReadOnlyProperty<string>;
      'moveHandDescription': string;
      'moveHandDescriptionStringProperty': TReadOnlyProperty<string>;
    };
    'voicing': {
      'contentHint': string;
      'contentHintStringProperty': TReadOnlyProperty<string>;
      'detailedContentHint': string;
      'detailedContentHintStringProperty': TReadOnlyProperty<string>;
      'chargedContentHint': string;
      'chargedContentHintStringProperty': TReadOnlyProperty<string>;
      'overviewPattern': string;
      'overviewPatternStringProperty': TReadOnlyProperty<string>;
      'previousDischargePattern': string;
      'previousDischargePatternStringProperty': TReadOnlyProperty<string>;
      'johnFullyCharged': string;
      'johnFullyChargedStringProperty': TReadOnlyProperty<string>;
      'multipleElectronsOnBodyPattern': string;
      'multipleElectronsOnBodyPatternStringProperty': TReadOnlyProperty<string>;
      'screenSummaryWithPreviousDischargePattern': string;
      'screenSummaryWithPreviousDischargePatternStringProperty': TReadOnlyProperty<string>;
      'handInteractionHint': string;
      'handInteractionHintStringProperty': TReadOnlyProperty<string>;
      'footInteractionHint': string;
      'footInteractionHintStringProperty': TReadOnlyProperty<string>;
    }
  }
};

const johnTravoltageStrings = getStringModule( 'JOHN_TRAVOLTAGE' ) as StringsType;

johnTravoltage.register( 'johnTravoltageStrings', johnTravoltageStrings );

export default johnTravoltageStrings;
