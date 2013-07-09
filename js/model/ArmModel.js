// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge have location and value.
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
      location: new Vector2()
    } );
    this.location = new Vector2( x, y );
    this.rotationCenter = new Vector2( x + 5, y + 40 );
  }

  return inherit( PropertySet, ArmModel, {
    getFingerLocation: function() {
      return this.rotationCenter.plus( new Vector2( 107, 25 ).rotated( this.rotationAngle - 0.5 ) );
    }
  } );
} );
