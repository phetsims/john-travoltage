// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import arm_png from '../../../images/arm_png.js';
import johnTravoltage from '../../johnTravoltage.js';
import JohnTravoltageStrings from '../../JohnTravoltageStrings.js';
import AppendageRangeMaps from '../AppendageRangeMaps.js';
import AppendageNode from './AppendageNode.js';

// constants
const handInteractionHintString = JohnTravoltageStrings.a11y.voicing.handInteractionHint;
const appendageArmLabelString = JohnTravoltageStrings.a11y.appendages.arm.label;

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

    this.sliderProperty.lazyLink( () => this.voicingSpeakObjectResponse() );
  }
}

johnTravoltage.register( 'ArmNode', ArmNode );
export default ArmNode;
