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
  var AccessibleNode = require( 'SCENERY/accessibility/AccessibleNode' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  /**
   * @constructor
   */
  function AccessibleFormNode( options ) {

    options = _.extend( {
      tagName: 'form'
    }, options );
    
    AccessibleNode.call( this, options );
  }

  johnTravoltage.register( 'AccessibleFormNode', AccessibleFormNode );

  return inherit( AccessibleNode, AccessibleFormNode );
} );
