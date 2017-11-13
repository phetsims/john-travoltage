// Copyright 2013-2017, University of Colorado Boulder

/**
 * Leg model of John Travoltage. Can rotate.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Appendage = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Appendage' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Range = require( 'DOT/Range' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function Leg( tandem ) {

    // empirically determined by inspecting the view
    var pivotPoint = new Vector2( 398, 335 );

    Appendage.call( this, pivotPoint, tandem.createSupertypeTandem(), {
      initialAngle: 1.3175443221852239, // determined empirically with DebutUtils
      range: new Range( 0, Math.PI )
    } );

    // @public (sonification) - speed of leg determines volume of some audio
    this.angularVelocityProperty = new NumberProperty( 0, {
      phetioReadOnly: true,
      tandem: tandem.createTandem( 'angularVelocityProperty' ),
      units: 'radians/second'
    } );
  }

  johnTravoltage.register( 'Leg', Leg );

  return inherit( Appendage, Leg, {

    /**
     * Reset the leg.
     * @public
     */
    reset: function() {
      this.angularVelocityProperty.reset();
      Appendage.prototype.reset.call( this );
    },

    /**
     * Calculate the change in angle from the initial value at construction.
     * @returns {number}
     * @public
     */
    deltaAngle: function() { return this.angleProperty.get() - this.initialAngle; }
  } );
} );