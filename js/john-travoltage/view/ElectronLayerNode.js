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
import Node from '../../../../scenery/js/nodes/Node.js';
import Utterance from '../../../../utterance-queue/js/Utterance.js';
import johnTravoltageStrings from '../../johnTravoltageStrings.js';
import johnTravoltage from '../../johnTravoltage.js';
import ElectronNode from './ElectronNode.js';

const electronsTotalDescriptionPatternString = johnTravoltageStrings.a11y.electrons.totalDescriptionPattern;
const electronsTotalAfterDischargePatternString = johnTravoltageStrings.a11y.electrons.totalAfterDischargePattern;

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

  // a11y - when electrons enter or leave the body, announce this change with a status update to assistive technology
  const setElectronStatus = function() {
    let alertString;
    const currentCharge = model.electrons.length;

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

    // a11y - announce the state of charges with a status update
    setElectronStatus();
  }

  // The electron's view is removed when the electron is disposed, see ElectronNode.js
  model.electrons.addMemberCreatedListener( electronAddedListener );
  model.electrons.array.forEach( electronAddedListener );

  // update status whenever an electron discharge has ended - disposal is not necessary
  model.dischargeEndedEmitter.addListener( setElectronStatus );

  // when the model is reset, update prior charge - disposal not necessary
  model.resetEmitter.addListener( function() {
    priorCharge = 0;
  } );
}

johnTravoltage.register( 'ElectronLayerNode', ElectronLayerNode );

inherit( Node, ElectronLayerNode );
export default ElectronLayerNode;