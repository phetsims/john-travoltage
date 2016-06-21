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
  var sceneDescriptionString = require( 'string!JOHN_TRAVOLTAGE/scene.descripton' );
  var electronsDescriptionString = require( 'string!JOHN_TRAVOLTAGE/electrons.discription' );

  /**
   * @param {String} labelText - The text to output in the label
   *
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
        //TODO: Is there a better way to set the 'aria-describedby' relationship? This doesn't seem very robust.
        describedNode.getAccessibleInstances()[0].peer.domElement.setAttribute( 'aria-describedby', domElement.id );

        var updateDescription = function () {
          var chargeMessage = hadElectrons ? StringUtils.format( electronsDescriptionString, electrons.length ) : '';
          domElement.textContent = StringUtils.format( sceneDescriptionString, arm.positionDescription, leg.positionDescription,  chargeMessage );
        };

        arm.model.angleProperty.link( updateDescription );
        leg.model.angleProperty.link( updateDescription );

        electrons.addItemAddedListener( function () {
          updateDescription();
          hadElectrons = true;
        } );
        electrons.addItemRemovedListener( _.debounce( updateDescription, 500 ) );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );
  }

  johnTravoltage.register( 'AccessibleDescriptionNode', AccessibleDescriptionNode );

  return inherit( Node, AccessibleDescriptionNode );
} );
