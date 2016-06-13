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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  /**
   * @constructor
   */
  function AccessibleFormNode( options ) {
    Node.call( this, options );

    // Add accessible form content
    this.setAccessibleContent( {
      createPeer: function ( accessibleInstance ) {
        var domElement = document.createElement( 'form' );

        return new AccessiblePeer( accessibleInstance, domElement );
      }
    } );
  }

  return inherit( Node, AccessibleFormNode );
} );
