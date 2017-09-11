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
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );
  var ElectronNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageA11yStrings = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageA11yStrings' );
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var electronsTotalString = JohnTravoltageA11yStrings.electronsTotalString;
  var electronsTotalAfterDischargeString = JohnTravoltageA11yStrings.electronsTotalAfterDischargeString;

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
        if( armNode.regionAtDischarge && armNode.regionAtDischarge.text){
          regionText = armNode.regionAtDischarge.text.toLowerCase();
        }

        alertString = StringUtils.fillIn( electronsTotalAfterDischargeString, {
          oldValue: priorCharge,
          newValue: currentCharge,
          position: position,
          region: regionText
        } );
      }

      AriaHerald.announcePolite( alertString );
      priorCharge = currentCharge;
    };

    // if new electron added to model - create and add new node to leg
    function electronAddedListener( added ) {

      // and the visual representation of the electron
      var newElectron = new ElectronNode( added, model.leg, model.arm, tandem.createTandem( added.electronTandem.tail ) );
      self.addChild( newElectron );

      // a11y - anounce the state of charges with a status update
      setElectronStatus();

      // If GC issues are noticeable from creating this IIFE, consider a map that maps model elements to 
      // corresponding view components, see https://github.com/phetsims/john-travoltage/issues/170
      var itemRemovedListener = function( removed ) {
        if ( removed === added ) {
          self.removeChild( newElectron );
          model.electrons.removeItemRemovedListener( itemRemovedListener );
        }
      };
      model.electrons.addItemRemovedListener( itemRemovedListener );
    }
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