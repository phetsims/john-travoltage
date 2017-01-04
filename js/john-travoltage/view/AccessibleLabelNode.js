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
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  /**
   * @param {string} labelText - The text to output in the label
   *
   * @constructor
   */
  function AccessibleLabelNode( labelText ) {
    AccessibleNode.call( this, {
      tagName: 'label'
    } );

    // set the label content
    this.domElement.textContent = labelText;
  }

  johnTravoltage.register( 'AccessibleLabelNode', AccessibleLabelNode );

  return inherit( AccessibleNode, AccessibleLabelNode );
} );
