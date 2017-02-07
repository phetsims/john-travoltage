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
  var NumberProperty = require( 'AXON/NumberProperty' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function Leg( tandem ) {
    this.initialAngle = 1.3175443221852239;
    this.angleProperty = new NumberProperty( this.initialAngle, {
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioValueType: TNumber( 'radians' )
    } );

    this.angularVelocityProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'angularVelocityProperty' ),
      phetioValueType: TNumber( { units: 'radians/second' } )
    } );
    this.position = new Vector2( 398, 335 );

    //Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;
  }

  johnTravoltage.register( 'Leg', Leg );

  return inherit( Object, Leg, {
    reset: function() {
      this.angleProperty.reset();
      this.angularVelocityProperty.reset();
    },

    deltaAngle: function() { return this.angleProperty.get() - this.initialAngle; }
  } );
} );