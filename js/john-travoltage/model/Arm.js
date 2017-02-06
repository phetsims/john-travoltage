// Copyright 2013-2015, University of Colorado Boulder

/**
 * Model for John Travoltage's arm, which can rotate about the shoulder.
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  function Arm( tandem ) {

    // @public (read-only) the angle of the arm.
    this.angleProperty = new NumberProperty( -0.5, {
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioValueType: TNumber( { units: 'radians' } )
    } );

    // Arm pivot (elbow point) sampled using DebugPositions.js
    this.position = new Vector2( 423.6179673321235, 229.84969476984 );

    // Exact finger location sampled using DebugPositions.js
    var finger = new Vector2( 534.3076703633706, 206.63766358806117 );
    this.fingerVector = finger.minus( this.position );

    //Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;
  }

  johnTravoltage.register( 'Arm', Arm );

  return inherit( Object, Arm, {

    /**
     * Reset the arm.
     */
    reset: function() {
      this.angleProperty.reset();
    },

    /**
     * Gets the location of the finger
     * @returns {Vector2}
     */
    getFingerPosition: function() {
      return this.fingerVector.rotated( this.angleProperty.get() ).plus( this.position );
    }
  } );
} );