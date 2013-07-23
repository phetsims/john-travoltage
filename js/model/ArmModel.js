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
    PropertySet.call( this, {
      rotationAngle: 0,
      location: new Vector2( x, y )
    } );
    this.rotationCenter = new Vector2( x + 5, y + 40 );
  }

  return inherit( PropertySet, ArmModel, {
    //return Vector2, position of finger, where spark starts
    getFingerLocation: function() {
      return this.rotationCenter.plus( new Vector2( 107, 25 ).rotated( this.rotationAngle - 0.5 ) );
    }
  } );
} );