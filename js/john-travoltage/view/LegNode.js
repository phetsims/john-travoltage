// Copyright 2021-2022, University of Colorado Boulder

/**
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import LinearFunction from '../../../../dot/js/LinearFunction.js';
import merge from '../../../../phet-core/js/merge.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import leg_png from '../../../images/leg_png.js';
import johnTravoltage from '../../johnTravoltage.js';
import JohnTravoltageStrings from '../../JohnTravoltageStrings.js';
import AppendageRangeMaps from '../AppendageRangeMaps.js';
import JohnTravoltageModel from '../model/JohnTravoltageModel.js';
import AppendageNode from './AppendageNode.js';

// constants
const appendageLegLabelString = JohnTravoltageStrings.a11y.appendages.leg.label;
const footInteractionHintString = JohnTravoltageStrings.a11y.voicing.footInteractionHint;
const johnFullyChargedString = JohnTravoltageStrings.a11y.voicing.johnFullyCharged;

const ALERTS_FOR_MAX_CHARGE = 2;

class LegNode extends AppendageNode {

  /**
   * @param {Leg} legModel
   * @param {PhetioGroup} electronGroup
   * @param {Tandem} tandem
   * @param {Object } [options]
   */
  constructor( legModel, electronGroup, tandem, options ) {
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

      // voicing - when a drag finishes while the body has max number of charges on the body, alert a few times
      // that the body is fully charged to encourage user to discharge electrons
      onDragEnd: () => {
        if ( electronGroup.count === JohnTravoltageModel.MAX_ELECTRONS ) {
          if ( this.numberOfDragsAtMaxCharge < ALERTS_FOR_MAX_CHARGE ) {
            this.voicingSpeakContextResponse( {
              contextResponse: johnFullyChargedString
            } );
          }
          this.numberOfDragsAtMaxCharge++;
        }
      },

      // pdom
      labelContent: appendageLegLabelString,

      // voicing
      voicingNameResponse: appendageLegLabelString,
      voicingHintResponse: footInteractionHintString,

      // the foot position Utterance is polite so that we only hear foot position after charge pickup alerts
      // are spoken, charge information is more important.
      voicingUtterance: new Utterance( {
        announcerOptions: {
          cancelOther: false
        }
      } )
    }, options );

    const angleToPDOMValueFunction = new LinearFunction( legModel.angleProperty.range.max, legModel.angleProperty.range.min, -7, 7 );
    super( legModel, leg_png, 25, 28, Math.PI / 2 * 0.7, AppendageRangeMaps.legMap, angleToPDOMValueFunction, tandem, options );

    // @private {number} - counts the number of times a drag occurs while there are max charges on the body
    this.numberOfDragsAtMaxCharge = 0;

    this.sliderProperty.lazyLink( () => {

      // leg alerts are only made when the foot is off the rug - otherwise we should hear charge information and the
      // rubbing sound only
      if ( !legModel.shoeOnCarpetProperty.value ) {
        this.voicingSpeakObjectResponse();
      }
    } );
  }

  /**
   * @public
   */
  resetDescriptionCounters() {
    this.numberOfDragsAtMaxCharge = 0;
  }
}

johnTravoltage.register( 'LegNode', LegNode );
export default LegNode;
