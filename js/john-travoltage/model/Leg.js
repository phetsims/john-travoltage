// Copyright 2013-2015, University of Colorado Boulder

/**
 * Leg model of John Travoltage. Can rotate.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Property = require( 'AXON/Property' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  function Leg() {
    this.initialAngle = 1.3175443221852239;
    this.angleProperty = new NumberProperty( this.initialAngle );
    Property.preventGetSet( this, 'angle' );
    this.position = new Vector2( 398, 335 );

    //Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;
  }

  johnTravoltage.register( 'Leg', Leg );

  return inherit( Object, Leg, {
    reset: function() {
      this.angleProperty.reset();
    },

    deltaAngle: function() { return this.angleProperty.get() - this.initialAngle; }
  } );
} );