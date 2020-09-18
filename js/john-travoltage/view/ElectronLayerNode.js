// Copyright 2016-2020, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the electron layer.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */

import inherit from '../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../phetcommon/js/util/StringUtils.js';
import levelSpeakerModel from '../../../../scenery-phet/js/accessibility/speaker/levelSpeakerModel.js';
import Node from '../../../../scenery/js/nodes/Node.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import johnTravoltage from '../../johnTravoltage.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';
import ElectronNode from './ElectronNode.js';
import Range from '../../../../dot/js/Range.js';

const electronsTotalDescriptionPatternString = johnTravoltageStrings.a11y.electrons.totalDescriptionPattern;
const electronsTotalAfterDischargePatternString = johnTravoltageStrings.a11y.electrons.totalAfterDischargePattern;

const QUALITATIVE_DESCRIPTION_MAP = new Map();
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 0, 0 ), 'No' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 1, 10 ), 'A few' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 11, 35 ), 'Some' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 36, 49 ), 'A bunch of' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 50, 75 ), 'A large amount of' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 76, 99 ), 'A huge amount of' );
QUALITATIVE_DESCRIPTION_MAP.set( new Range( 100, Number.POSITIVE_INFINITY ), 'Max amount of' );

/**
 * @param {JohnTravoltageModel} model
 * @param {AppendageNode} armNode
 * @param {number} maxElectrons
 * @param {Tandem} tandem
 * @constructor
 */
function ElectronLayerNode( model, armNode, maxElectrons, tandem ) {
  const self = this;

  Node.call( this );

  // Add larger delay time is used so that the assistive technology can finish speaking updates
  // from the aria-valuetext of the AppendageNode. Note that if the delay is too long, there is too much silence
  // between the change in charges and the alert.
  const electronUtterance = new Utterance( {
    alertStableDelay: 1000
  } );

  let priorCharge = 0;

  // pdom - when electrons enter or leave the body, announce this change with a status update to assistive technology
  const setElectronStatus = function() {
    let alertString;
    const currentCharge = model.electronGroup.count;

    if ( currentCharge >= priorCharge ) {
      alertString = StringUtils.fillIn( electronsTotalDescriptionPatternString, { value: currentCharge } );

    }
    else {
      const position = armNode.positionAtDischarge || '';

      let regionText = '';
      if ( armNode.regionAtDischarge && armNode.regionAtDischarge.text ) {
        regionText = armNode.regionAtDischarge.text.toLowerCase();
      }

      alertString = StringUtils.fillIn( electronsTotalAfterDischargePatternString, {
        oldValue: priorCharge,
        newValue: currentCharge,
        position: position,
        region: regionText
      } );

      const selfVoicingAlertString = StringUtils.fillIn( '{{qualitativeDescription}} electrons discharged.', {
        qualitativeDescription: self.getQualitativeChargeDescription( priorCharge - currentCharge )
      } );

      levelSpeakerModel.speakAllResponses( '', selfVoicingAlertString, '', {
        withCancel: false
      } );
    }

    electronUtterance.alert = alertString;
    phet.joist.sim.utteranceQueue.addToBack( electronUtterance );

    // for haptic feedback, experimental
    model.utteranceAddedEmitter.emit( alertString );

    priorCharge = currentCharge;
  };

  // if new electron added to model - create and add new node to leg
  function electronAddedListener( added ) {

    // and the visual representation of the electron
    self.addChild( new ElectronNode( added, model.leg, model.arm ) );

    // pdom - announce the state of charges with a status update
    setElectronStatus();
  }

  // The electron's view is removed when the electron is disposed, see ElectronNode.js
  model.electronGroup.elementCreatedEmitter.addListener( electronAddedListener );
  model.electronGroup.forEach( electronAddedListener );

  // update status whenever an electron discharge has ended - disposal is not necessary
  model.dischargeEndedEmitter.addListener( setElectronStatus );

  // when the model is reset, update prior charge - disposal not necessary
  model.resetEmitter.addListener( function() {
    priorCharge = 0;
  } );
}

johnTravoltage.register( 'ElectronLayerNode', ElectronLayerNode );

inherit( Node, ElectronLayerNode, {

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
} );
export default ElectronLayerNode;