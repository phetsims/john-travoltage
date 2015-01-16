// Copyright 2002-2013, University of Colorado Boulder

/**
 * Leg model of John Travoltage. Can rotate.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Leg() {
    this.initialAngle = 1.3175443221852239;
    PropertySet.call( this, { angle: this.initialAngle } );
    this.position = new Vector2( 398, 335 );

    //Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;
  }

  return inherit( PropertySet, Leg, {
    deltaAngle: function() { return this.angle - this.initialAngle; }
  } );
} );