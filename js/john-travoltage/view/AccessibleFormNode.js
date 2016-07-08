// Copyright 2016, University of Colorado Boulder
// Copyright 2016, OCAD University

/**
 * Scenery display object (scene graph node) for a form element to contain all controls in sim.
 *
 * @author Justin Obara
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  /**
   * @constructor
   */
  function AccessibleFormNode( options ) {
    var accessibleFormNode = this;

    Node.call( this, options );

    // Add accessible form content
    this.setAccessibleContent( {
      createPeer: function ( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();
        var domElement = document.createElement( 'form' );

        domElement.id = 'form-' + uniqueId;
        accessibleFormNode.domElement = domElement;

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );
  }

  johnTravoltage.register( 'AccessibleFormNode', AccessibleFormNode );

  return inherit( Node, AccessibleFormNode );
} );
