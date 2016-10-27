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
  var Node = require( 'SCENERY/nodes/Node' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  // strings
  var sceneDescriptionString = require( 'string!JOHN_TRAVOLTAGE/scene.description' );
  var electronsDescriptionSingleString = require( 'string!JOHN_TRAVOLTAGE/electrons.description.single' );
  var electronsDescriptionMultipleString = require( 'string!JOHN_TRAVOLTAGE/electrons.description.multiple' );

  /**
   * @param {AppendageNode} arm -  the arm appendage
   * @param {AppendageNode} leg -  the leg appendage
   * @param {Electron} electron - the electron model
   * @param {Node} describedNode - the node for which the accessible description is instantiated for. This is used
   *                               to set the 'aria-describedby' relationship between the two PDOM elements.
   * @constructor
   */
  function AccessibleDescriptionNode( arm, leg, electrons, describedNode ) {
    Node.call( this );

    // Add accessible content for the label
    this.setAccessibleContent( {
      createPeer: function ( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();
        var hadElectrons = false;
        var domElement = document.createElement( 'p' );

        domElement.id = 'scene-description-' + uniqueId;
        describedNode.domElement.setAttribute( 'aria-describedby', domElement.id );

        var updateDescription = function () {
          var chargeDescriptor = electrons.length === 1 ? electronsDescriptionSingleString : electronsDescriptionMultipleString;
          var chargeMessage = hadElectrons ? StringUtils.format( chargeDescriptor, electrons.length ) : '';
          domElement.textContent = StringUtils.format( sceneDescriptionString, arm.positionDescription,  chargeMessage );
        };

        arm.model.angleProperty.link( updateDescription );
        leg.model.angleProperty.link( updateDescription );

        electrons.addItemAddedListener( function () {
          updateDescription();
          hadElectrons = true;
        } );

        //Events are fired for each electron removed. For example if there are 10 accrued charges, 10 events will be
        //fired when a complete discharge occurs. However, we do not want to update the description for each individual
        //electron being discharged, but rather for the operation of a single set of discharges. By using a debounce
        //method ( http://underscorejs.org/#debounce ) we are able to collect all of the events fired together and
        //operate on them as an individual event. In this case we are setting the time interval to 500ms. The time set
        //here needs to be long enough that a discharge is counted as a single occurrence but short enough that multiple
        //discharges, orchestrated by a user, do not appear to be a single one. 500ms likely won't be perfect in all
        //cases, but based on some manual tests seems to work in most.
        electrons.addItemRemovedListener( _.debounce( updateDescription, 500 ) );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );
  }

  johnTravoltage.register( 'AccessibleDescriptionNode', AccessibleDescriptionNode );

  return inherit( Node, AccessibleDescriptionNode );
} );
