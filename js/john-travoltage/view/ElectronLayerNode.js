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
  var AriaHerald = require( 'SCENERY_PHET/accessibility/AriaHerald' );

  /**
   * @param {JohnTravoltageModel} model
   * @param {number} maxElectrons
   * @param {Tandem} tandem
   * @param {Object} options
   * @constructor
   */
  function ElectronLayerNode( model, maxElectrons, tandem, options ) {
    var self = this;

    options = _.extend( {
      pitchedPopGenerator: null
    }, options );

    Node.call( this, options );

    var priorCharge = 0;
    var setElectronStatus = function() {
      var currentCharge = model.electrons.length;
      var chargeText = currentCharge >= priorCharge ? JohnTravoltageA11yStrings.electronsTotalString : JohnTravoltageA11yStrings.electronsTotalAfterDischargeString;

      AriaHerald.announcePoliteWithStatus( StringUtils.format( chargeText, currentCharge, priorCharge ), true );
      priorCharge = currentCharge;
    };

    //if new electron added to model - create and add new node to leg
    model.electrons.addItemAddedListener( function( added ) {

      // and the visual representation of the electron
      var newElectron = new ElectronNode( added, model.leg, model.arm, tandem.createTandem( added.electronTandem.tail ) );
      self.addChild( newElectron );

      // play the sound that indicates that an electron was added
      options.pitchedPopGenerator && options.pitchedPopGenerator.createPop(
        model.electrons.length / maxElectrons,
        model.electrons.length < maxElectrons ? 0.02 : 1.75 // longer pitch for last electron
      );

      // a11y - anounce the state of charges with a status update
      setElectronStatus();

      // If GC issues are noticeable from creating this IIFE, consider a map that maps model elements to 
      // corresponding view components, see https://github.com/phetsims/john-travoltage/issues/170
      var itemRemovedListener = function( removed ) {
        if ( removed === added ) {
          self.removeChild( newElectron );
          model.electrons.removeItemRemovedListener( itemRemovedListener );

          // play the sound that indicates that an electron was removed
          options.pitchedPopGenerator && options.pitchedPopGenerator.createPop( model.electrons.length / maxElectrons, 0.02 );
        }
      };
      model.electrons.addItemRemovedListener( itemRemovedListener );
    } );

    // update status whenever an electron discharge has ended - disposal is not necessary
    model.dischargeEndedEmitter.addListener( setElectronStatus );

    // when the model is reset, update prior charge - disposal not necessary
    // 
    model.resetEmitter.addListener( function() {
      priorCharge = 0;
    } );
  }

  johnTravoltage.register( 'ElectronLayerNode', ElectronLayerNode );

  return inherit( Node, ElectronLayerNode );
} );