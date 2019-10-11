// Copyright 2016-2019, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the electron layer.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */
define( require => {
  'use strict';

  // modules
  const ElectronNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  const Node = require( 'SCENERY/nodes/Node' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  const utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  const electronsTotalString = JohnTravoltageA11yStrings.electronsTotal.value;
  const electronsTotalAfterDischargeString = JohnTravoltageA11yStrings.electronsTotalAfterDischarge.value;

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
        alertString = StringUtils.fillIn( electronsTotalString, { value: currentCharge } );

      }
      else {
        const position = armNode.positionAtDischarge || '';

        let regionText = '';
        if ( armNode.regionAtDischarge && armNode.regionAtDischarge.text ) {
          regionText = armNode.regionAtDischarge.text.toLowerCase();
        }

        alertString = StringUtils.fillIn( electronsTotalAfterDischargeString, {
          oldValue: priorCharge,
          newValue: currentCharge,
          position: position,
          region: regionText
        } );
      }

      electronUtterance.alert = alertString;
      utteranceQueue.addToBack( electronUtterance );

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
    model.electrons.memberCreatedEmitter.addListener( electronAddedListener );
    model.electrons.array.forEach( electronAddedListener );

    // update status whenever an electron discharge has ended - disposal is not necessary
    model.dischargeEndedEmitter.addListener( setElectronStatus );

    // when the model is reset, update prior charge - disposal not necessary
    model.resetEmitter.addListener( function() {
      priorCharge = 0;
    } );
  }

  johnTravoltage.register( 'ElectronLayerNode', ElectronLayerNode );

  return inherit( Node, ElectronLayerNode );
} );