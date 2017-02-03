// Copyright 2013-2015, University of Colorado Boulder
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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ElectronNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronNode' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  /**
   * @param {Electrons} electrons - the model for the number of electrons
   * @param {Leg} leg - the model for the leg appendage
   * @param {Arm} arm - the model for the arm appendage
   * @param {Emitter} dischargeEndedEmitter
   * @param {object} options
   * @constructor
   */
  function ElectronLayerNode( electrons, maxElectrons, leg, arm, dischargeEndedEmitter, options ) {
    var self = this;
    var statusNode = document.getElementById( options.peerID );

    Node.call( this, options );

    //if new electron added to model - create and add new node to leg
    //TODO: Pooling for creation and use visible instead of addChild for performance
    electrons.addItemAddedListener( function( added ) {

      // and the visual representation of the electron
      var newElectron = new ElectronNode( added, leg, arm );
      added.viewNode = newElectron;
      self.addChild( newElectron );

      // play the sound that indicates that an electron was added
      options.pitchedPopGenerator && options.pitchedPopGenerator.createPop(
        electrons.length / maxElectrons,
        electrons.length < maxElectrons ? 0.02 : 1.75 // longer pitch for last electron
      );

      var itemRemovedListener = function( removed ) {
        if ( removed === added ) {
          self.removeChild( newElectron );
          electrons.removeItemRemovedListener( itemRemovedListener );

          // play the sound that indicates that an electron was removed
          options.pitchedPopGenerator && options.pitchedPopGenerator.createPop( electrons.length / maxElectrons, 0.02 );
        }
      };
      electrons.addItemRemovedListener( itemRemovedListener );
    } );

    if ( statusNode ) {
      var priorCharge = 0;

      var setElectronStatus = function() {
        var currentCharge = electrons.length;
        var chargeText = currentCharge >= priorCharge ? JohnTravoltageA11yStrings.electronsTotalString : JohnTravoltageA11yStrings.electronsTotalAfterDischargeString;

        statusNode.textContent = '';
        statusNode.textContent = StringUtils.format( chargeText, currentCharge, priorCharge );
        priorCharge = currentCharge;
      };

      // update status whenever an electron is added, and whenever an electron discharge has ended
      // this node will exist for life of sim so disposal is not necessary
      electrons.addItemAddedListener( setElectronStatus );
      dischargeEndedEmitter.addListener( setElectronStatus );
    }
  }

  johnTravoltage.register( 'ElectronLayerNode', ElectronLayerNode );

  return inherit( Node, ElectronLayerNode );
} );
