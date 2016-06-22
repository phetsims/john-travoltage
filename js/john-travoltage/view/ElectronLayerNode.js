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
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );

  // strings
  var electronsTotalString = require( 'string!JOHN_TRAVOLTAGE/electrons.total' );
  var electronsTotalAfterDischargeString = require( 'string!JOHN_TRAVOLTAGE/electrons.totalAfterDischarge' );

  /**
   * @param {Electrons} electrons - the model for the number of electrons
   * @param {Leg} leg - the model for the leg appendage
   * @param {Arm} arm - the model for the arm appendage
   * @constructor
   */
  function ElectronLayerNode( electrons, maxElectrons, leg, arm, options ) {
    var electronLayerView = this;
    var statusNode = document.getElementById( options.peerID );

    Node.call( this, options );

    //if new electron added to model - create and add new node to leg
    //TODO: Pooling for creation and use visible instead of addChild for performance
    electrons.addItemAddedListener( function( added ) {

      // and the visual representation of the electron
      var newElectron = new ElectronNode( added, leg, arm );
      added.viewNode = newElectron;
      electronLayerView.addChild( newElectron );

      // play the sound that indicates that an electron was added
      options.pitchedPopGenerator && options.pitchedPopGenerator.createPop(
        electrons.length / maxElectrons,
        electrons.length < maxElectrons ? 0.02 : 1.75 // longer pitch for last electron
      );

      var itemRemovedListener = function( removed ) {
        if ( removed === added ) {
          electronLayerView.removeChild( newElectron );
          electrons.removeItemRemovedListener( itemRemovedListener );

          // play the sound that indicates that an electron was removed
          options.pitchedPopGenerator && options.pitchedPopGenerator.createPop( electrons.length / maxElectrons, 0.02 );
        }
      };
      electrons.addItemRemovedListener( itemRemovedListener );
    } );

    if (statusNode) {
      var priorCharge = 0;

      var setElectronStatus = function () {
        var currentCharge = electrons.length;
        var chargeText = currentCharge >= priorCharge ? electronsTotalString : electronsTotalAfterDischargeString;

        statusNode.textContent = '';
        statusNode.textContent = StringUtils.format( chargeText, currentCharge, priorCharge );
        priorCharge = currentCharge;
      };

      electrons.addItemAddedListener( setElectronStatus );

      //Events are fired for each electron removed. For example if there are 10 accrued charges, 10 events will be
      //fired when a complete discharge occurs. However, we do not want to update the status for each individual
      //electron being discharged, but rather for the operation of a single set of discharges. By using a debounce
      //method ( http://underscorejs.org/#debounce ) we are able to collect all of the events fired together and
      //operate on them as an individual event. In this case we are setting the time interval to 500ms. The time set
      //here needs to be long enough that a discharge is counted as a single occurrence but short enough that multiple
      //discharges, orchestrated by the user, do not appear to be a single one. 500ms likely won't be perfect in all
      //cases, but based on some manual tests seems to work in most.
      electrons.addItemRemovedListener( _.debounce( setElectronStatus, 500 ) );
    }
  }

  johnTravoltage.register( 'ElectronLayerNode', ElectronLayerNode );

  return inherit( Node, ElectronLayerNode );
} );
