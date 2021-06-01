// Copyright 2021, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import legImage from '../../../images/leg_png.js';
import johnTravoltage from '../../johnTravoltage.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';
import AppendageRangeMaps from '../AppendageRangeMaps.js';
import AppendageNode from './AppendageNode.js';

const appendageLegLabelString = johnTravoltageStrings.a11y.appendages.leg.label;
const voicingContentHintString = johnTravoltageStrings.a11y.voicing.contentHint;
const footInteractionHintString = johnTravoltageStrings.a11y.voicing.footInteractionHint;

class LegNode extends AppendageNode {

  /**
   * @param {Leg} legModel
   * @param {Tandem} tandem
   * @param {Object } [options]
   */
  constructor( legModel, tandem, options ) {

    options = merge( {

      // the leg rotation is limited to the bottom semicircle relative to the rotation point, because it looks weird
      // if it can go around in a full circle
      limitRotation: angle => {
        if ( angle < -Math.PI / 2 ) {
          angle = Math.PI;
        }
        else if ( angle > -Math.PI / 2 && angle < 0 ) {
          angle = 0;
        }
        return angle;
      },

      // pdom
      labelContent: appendageLegLabelString,

      // voicing
      voicingHint: voicingContentHintString,
      manipulationHint: footInteractionHintString
    }, options );

    const angleToPDOMValueFunction = new LinearFunction( legModel.angleProperty.range.max, legModel.angleProperty.range.min, -7, 7 );
    super( legModel, legImage, 25, 28, Math.PI / 2 * 0.7, AppendageRangeMaps.legMap, angleToPDOMValueFunction, tandem, options );
  }

}

johnTravoltage.register( 'LegNode', LegNode );
export default LegNode;
