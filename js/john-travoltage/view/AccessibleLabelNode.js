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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  /**
   * @param {String} labelText - The text to output in the label
   *
   * @constructor
   */
  function AccessibleLabelNode( labelText ) {
    Node.call( this );

    // Add accessible content for the label
    this.setAccessibleContent( {
      createPeer: function ( accessibleInstance ) {
        var domElement = document.createElement( 'label' );
        domElement.textContent = labelText;

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );
  }

  return inherit( Node, AccessibleLabelNode );
} );
