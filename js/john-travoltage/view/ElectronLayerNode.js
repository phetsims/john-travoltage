// Copyright 2016-2022, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the electron layer.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */

import Range from '../../../../dot/js/Range.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import { Node, Voicing } from '../../../../scenery/js/imports.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import johnTravoltage from '../../johnTravoltage.js';
import JohnTravoltageStrings from '../../JohnTravoltageStrings.js';
import ElectronNode from './ElectronNode.js';

const electronsTotalDescriptionPatternString = JohnTravoltageStrings.a11y.electrons.totalDescriptionPattern;
const electronsTotalAfterDischargePatternString = JohnTravoltageStrings.a11y.electrons.totalAfterDischargePattern;

const QUALITATIVE_DESCRIPTION_MAP = new Map();
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 0, 0 ), 'No' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 1, 4 ), 'A couple' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 5, 9 ), 'A few' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 10, 30 ), 'Several' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 31, 53 ), 'A bunch of' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 54, 76 ), 'A large amount of' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 77, 99 ), 'A huge amount of' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 100, Number.POSITIVE_INFINITY ), 'Max amount of' );

class ElectronLayerNode extends Voicing( Node ) {

  /**
   * @param {JohnTravoltageModel} model
   * @param {AppendageNode} armNode
   * @param {number} maxElectrons
   * @param {Tandem} tandem
   */
  constructor( model, armNode, maxElectrons, tandem ) {

    super( {

      // many charges are usually added at once, wait until alerts stabilize before
      // announcing the change in charge - this critical information is intended to be
      // assertive
      voicingUtterance: new Utterance( {
        alertStableDelay: 500,
        alertMaximumDelay: 800
      } )
    } );

    // Add larger delay time is used so that the assistive technology can finish speaking updates
    // from the aria-valuetext of the AppendageNode. Note that if the delay is too long, there is too much silence
    // between the change in charges and the alert.
    const electronUtterance = new Utterance( {
      alertStableDelay: 1000
    } );

    let priorCharge = 0;

    // pdom - when electrons enter or leave the body, announce this change with a status update to assistive technology
    const setElectronStatus = () => {
      let alertString;
      const currentCharge = model.electronGroup.count;

      if ( currentCharge >= priorCharge ) {
        alertString = StringUtils.fillIn( electronsTotalDescriptionPatternString, { value: currentCharge } );

        this.voicingContextResponse = StringUtils.fillIn( '{{qualitativeDescription}} electrons on body', {
          qualitativeDescription: this.getQualitativeChargeDescription( currentCharge )
        } );
        this.voicingSpeakContextResponse();
      }
      else {

        let regionText = '';
        if ( armNode.regionAtDischarge && armNode.regionAtDischarge.text ) {
          regionText = armNode.regionAtDischarge.text.toLowerCase();
        }

        alertString = StringUtils.fillIn( electronsTotalAfterDischargePatternString, {
          oldValue: priorCharge,
          newValue: currentCharge,
          region: regionText
        } );

        this.voicingContextResponse = StringUtils.fillIn( '{{qualitativeDescription}} electrons discharged with {{region}}.', {
          qualitativeDescription: this.getQualitativeChargeDescription( priorCharge - currentCharge ),
          region: regionText
        } );
        this.voicingSpeakContextResponse();
      }

      electronUtterance.alert = alertString;
      this.alertDescriptionUtterance( electronUtterance );

      // for haptic feedback, experimental
      model.utteranceAddedEmitter.emit( alertString );

      priorCharge = currentCharge;
    };

    // if new electron added to model - create and add new node to leg
    const electronAddedListener = added => {

      // and the visual representation of the electron
      this.addChild( new ElectronNode( added, model.leg, model.arm ) );

      // pdom - announce the state of charges with a status update
      setElectronStatus();
    };

    // The electron's view is removed when the electron is disposed, see ElectronNode.js
    model.electronGroup.elementCreatedEmitter.addListener( electronAddedListener );
    model.electronGroup.forEach( electronAddedListener );

    // update status whenever an electron discharge has ended - disposal is not necessary
    model.dischargeEndedEmitter.addListener( setElectronStatus );

    // when the model is reset, update prior charge - disposal not necessary
    model.resetEmitter.addListener( () => {
      priorCharge = 0;
    } );
  }

  /**
   * Get a qualitative description of the charge value. Will return something like
   * "A few" or "A large amount of", see QUALITATIVE_DESCRIPTION_MAP above.
   * @public
   *
   * @param {number} charge
   * @returns {string}
   */
  getQualitativeChargeDescription( charge ) {
    let qualitativeDescription;
    QUALITATIVE_DESCRIPTION_MAP.forEach( ( value, key ) => {
      if ( key.contains( charge ) ) {
        qualitativeDescription = value;
      }
    } );

    assert && assert( qualitativeDescription, 'no description found for charge' );
    return qualitativeDescription;
  }
}

johnTravoltage.register( 'ElectronLayerNode', ElectronLayerNode );

export default ElectronLayerNode;