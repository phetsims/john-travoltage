// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import armImage from '../../../images/arm_png.js';
import johnTravoltage from '../../johnTravoltage.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';
import AppendageRangeMaps from '../AppendageRangeMaps.js';
import AppendageNode from './AppendageNode.js';

// constants
const voicingDetailedContentHintString = johnTravoltageStrings.a11y.voicing.detailedContentHint;
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
      voicingHint: voicingDetailedContentHintString,
      manipulationHint: handInteractionHintString
    }, options );

    const angleToPDOMValueFunction = new LinearFunction( armModel.angleProperty.range.min, armModel.angleProperty.range.max, -15, 15 );
    super( armModel, armImage, 4, 45, -0.1, AppendageRangeMaps.armMap, angleToPDOMValueFunction, tandem, options );
  }
}

johnTravoltage.register( 'ArmNode', ArmNode );
export default ArmNode;
