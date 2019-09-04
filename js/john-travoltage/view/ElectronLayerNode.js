// Copyright 2016-2019, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the electron layer.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var ElectronNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Utterance = require( 'SCENERY_PHET/accessibility/Utterance' );
  var utteranceQueue = require( 'SCENERY_PHET/accessibility/utteranceQueue' );

  // a11y strings
  var electronsTotalString = JohnTravoltageA11yStrings.electronsTotal.value;
  var electronsTotalAfterDischargeString = JohnTravoltageA11yStrings.electronsTotalAfterDischarge.value;

  /**
   * @param {JohnTravoltageModel} model
   * @param {AppendageNode} armNode
   * @param {number} maxElectrons
   * @param {Tandem} tandem
   * @constructor
   */
  function ElectronLayerNode( model, armNode, maxElectrons, tandem ) {
    var self = this;

    Node.call( this );

    // Add larger delay time is used so that the assistive technology can finish speaking updates
    // from the aria-valuetext of the AppendageNode. Note that if the delay is too long, there is too much silence
    // between the change in charges and the alert.
    const electronUtterance = new Utterance( {
      alertStableDelay: 1000
    } );

    var priorCharge = 0;

    // a11y - when electrons enter or leave the body, announce this change with a status update to assistive technology
    var setElectronStatus = function() {
      var alertString;
      var currentCharge = model.electrons.length;

      if ( currentCharge >= priorCharge ) {
        alertString = StringUtils.fillIn( electronsTotalString, { value: currentCharge } );

      }
      else {
        var position = armNode.positionAtDischarge || '';

        var regionText = '';
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
    model.electrons.addItemAddedListener( electronAddedListener );
    model.electrons.forEach( electronAddedListener );

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