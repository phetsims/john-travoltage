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
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  // strings
  var totalElectronsText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.electrons.total' );
  var totalElectronsAfterDischargeText = require( 'string!JOHN_TRAVOLTAGE/john-travoltage.electrons.totalAfterDischarge' );

  /**
   * @param {Electrons} electrons - the model for the number of electrons
   * @param {Leg} leg - the model for the leg appendage
   * @param {Arm} arm - the model for the arm appendage
   * @constructor
   */
  function ElectronLayerNode( electrons, leg, arm, options ) {
    var electronLayerView = this;
    Node.call( this, options );

    //if new electron added to model - create and add new node to leg
    //TODO: Pooling for creation and use visible instead of addChild for performance
    electrons.addItemAddedListener( function( added ) {
      var newElectron = new ElectronNode( added, leg, arm );
      added.viewNode = newElectron;
      electronLayerView.addChild( newElectron );

      var itemRemovedListener = function( removed ) {
        if ( removed === added ) {
          electronLayerView.removeChild( newElectron );
          electrons.removeItemRemovedListener( itemRemovedListener );
        }
      };
      electrons.addItemRemovedListener( itemRemovedListener );
    } );

    // Add accessible content for the electron layer
    this.setAccessibleContent( {
      createPeer: function ( accessibleInstance ) {
        var priorCharge = 0;
        var domElement = document.createElement( 'p' );
        domElement.setAttribute( 'role', 'status' );

        if (options.peerID) {
          domElement.id = options.peerID;
        }

        var setElectronStatus = function () {
          var currentCharge = electrons.length;
          var chargeText = currentCharge >= priorCharge ? totalElectronsText : totalElectronsAfterDischargeText;

          domElement.textContent = StringUtils.format( chargeText, currentCharge, priorCharge );
          priorCharge = currentCharge;
        };

        setElectronStatus();

        electrons.addItemAddedListener( setElectronStatus );
        electrons.addItemRemovedListener( _.debounce( setElectronStatus, 500 ) );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );
  }

  return inherit( Node, ElectronLayerNode );
} );
