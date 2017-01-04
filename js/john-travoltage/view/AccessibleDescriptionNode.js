// Copyright 2016, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for the labels used to identify elements in the sim.
 *
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var AccessibleNode = require( 'SCENERY/accessibility/AccessibleNode' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // strings
  // a11y strings should be hard coded for now so that they are not
  // translatable, see https://github.com/phetsims/john-travoltage/issues/130
  var sceneDescriptionString =  '{1}John\'s hand is {0}, and he is ready to swing his leg to rub his foot on the rug.';
  var electronsDescriptionSingleString = 'John has 1 charge on his body.';
  var electronsDescriptionMultipleString = 'John has {0} charges on his body.';

  /**
   * @param {AppendageNode} arm -  the arm appendage
   * @param {AppendageNode} leg -  the leg appendage
   * @param {Electron} electron - the electron model
   * @param {Node} describedNode - the node for which the accessible description is instantiated for. This is used
   *                               to set the 'aria-describedby' relationship between the two PDOM elements.
   * @constructor
   */
  function AccessibleDescriptionNode( arm, leg, electrons, describedNode ) {
    AccessibleNode.call( this, {
      tagName: 'p'
    } );

    // after travolta picks up electrons the first time, this flag will modify descriptions slightly
    var hadElectrons = false;

    var self = this;
    var updateDescription = function() {
      var chargeDescriptor = electrons.length === 1 ? electronsDescriptionSingleString : electronsDescriptionMultipleString;
      var chargeMessage = hadElectrons ? StringUtils.format( chargeDescriptor, electrons.length ) : '';
      self.domElement.textContent = StringUtils.format( sceneDescriptionString, arm.positionDescription,  chargeMessage );
      hadElectrons = true;
    };

    // electrons observable array exists for the lifetime of the sim, so there is no need to remove these
    // listeners
    electrons.addItemAddedListener( updateDescription );

    //Events are fired for each electron removed. For example if there are 10 accrued charges, 10 events will be
    //fired when a complete discharge occurs. However, we do not want to update the description for each individual
    //electron being discharged, but rather for the operation of a single set of discharges. By using a debounce
    //method ( http://underscorejs.org/#debounce ) we are able to collect all of the events fired together and
    //operate on them as an individual event. In this case we are setting the time interval to 500ms. The time set
    //here needs to be long enough that a discharge is counted as a single occurrence but short enough that multiple
    //discharges, orchestrated by a user, do not appear to be a single one. 500ms likely won't be perfect in all
    //cases, but based on some manual tests seems to work in most.
    electrons.addItemRemovedListener( _.debounce( updateDescription, 500 ) );

    // properties exist for life of sim, no need to unlink
    arm.model.angleProperty.link( updateDescription );
    leg.model.angleProperty.link( updateDescription );
  }

  johnTravoltage.register( 'AccessibleDescriptionNode', AccessibleDescriptionNode );

  return inherit( AccessibleNode, AccessibleDescriptionNode );
} );
