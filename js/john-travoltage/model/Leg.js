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
  var Range = require( 'DOT/Range' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var Appendage = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/Appendage' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @param {Tandem} tandem
   * @constructor
   */
  function Leg( tandem ) {

    // empirically determined by inspecting the view
    var pivotPoint = new Vector2( 398, 335 );

    Appendage.call( this, pivotPoint, tandem, {
      initialAngle: 1.3175443221852239, // determined empirically with DebutUtils
      range: new Range( 0, Math.PI )
    } );

    // @public (sonification) - speed of leg determines volume of some audio
    this.angularVelocityProperty = new NumberProperty( 0, {
      phetioInstanceDocumentation: 'Values are set internally by simulation and cannot be controlled by the PhET-IO interface.',
      tandem: tandem.createTandem( 'angularVelocityProperty' ),
      phetioValueType: TNumber( { units: 'radians/second' } )
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
     * @return {number}
     * @public
     */
    deltaAngle: function() { return this.angleProperty.get() - this.initialAngle; }
  } );
} );