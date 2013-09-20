// Copyright 2002-2013, University of Colorado Boulder

/**
 * Arm model of a John-Travoltage.
 * Can rotate around rotation center.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var Vector2 = require( 'DOT/Vector2' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  function ArmModel( x, y ) {
    PropertySet.call( this, { angle: 0 } );
    this.rotationCenter = new Vector2( x + 5, y + 40 );
    this.position = new Vector2( 423.6179673321235, 229.84969476984 );
  }

  return inherit( PropertySet, ArmModel, {
    //return Vector2, position of finger, where spark starts
    getFingerPosition: function() {
      return this.rotationCenter.plus( new Vector2( 107, 25 ).rotated( this.angle - 0.5 ) );
    }
  } );
} );