// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import arm_png from '../../../images/arm_png.js';
import johnTravoltage from '../../johnTravoltage.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';
import AppendageRangeMaps from '../AppendageRangeMaps.js';
import AppendageNode from './AppendageNode.js';

// constants
const handInteractionHintString = johnTravoltageStrings.a11y.voicing.handInteractionHint;
const appendageArmLabelString = johnTravoltageStrings.a11y.appendages.arm.label;

class ArmNode extends AppendageNode {

  /**
   * @param {Arm} armModel
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( armModel, tandem, options ) {

    options = merge( {

      // pdom
      labelContent: appendageArmLabelString,

      // voicing
      voicingNameResponse: appendageArmLabelString,
      voicingHintResponse: handInteractionHintString
    }, options );

    const angleToPDOMValueFunction = new LinearFunction( armModel.angleProperty.range.max, armModel.angleProperty.range.min, -15, 15 );
    super( armModel, arm_png, 4, 45, -0.1, AppendageRangeMaps.armMap, angleToPDOMValueFunction, tandem, options );

    // @public (a11y) - {number} arm position value when discharge starts
    this.positionAtDischarge = null;

    // the hand position utterance is assertive so that the most recent hand position is always heard
    const handPositionChangeUtterance = new Utterance();
    this.sliderProperty.lazyLink( ( value, oldValue ) => {
      this.voicingSpeakObjectResponse( { utterance: handPositionChangeUtterance } );
    } );
  }
}

johnTravoltage.register( 'ArmNode', ArmNode );
export default ArmNode;
