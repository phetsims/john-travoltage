// Copyright 2017, University of Colorado Boulder

/**
 * A base type for appedages in this sim. Extended by Arm.js and Leg.js.  Appendages have a pivot point, and an
 * observable angle which is used for dragging.
 * 
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Range = require( 'DOT/Range' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * @constructor
   * @param {Vector2} pivotPoint
   * @param {Tandem} tandem
   * @param {Object} options
   */
  function Appendage( pivotPoint, tandem, options ) {

    options = _.extend( {
      initialAngle: -0.5 // radians
    }, options );

    // @private
    this.initialAngle = options.initialAngle;

    // @public
    this.angleProperty = new NumberProperty( options.initialAngle, {
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioValueType: TNumber( { units: 'radians', range: new Range( -Math.PI, Math.PI ) } )
    } );

    // @public (read-only)
    this.position = pivotPoint;

    // @public - Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;

  }

  johnTravoltage.register( 'Appendage', Appendage );

  return inherit( Object, Appendage, {

    /**
     * Reset the appendage.
     * @public
     */
    reset: function() {
      this.angleProperty.reset();
    }
  } );

} );
