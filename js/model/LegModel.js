// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge have location and value.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function LegModel( x, y ) {
    PropertySet.call( this, {
      rotationAngle: 0
    } );
    this.location = new Vector2( x, y );
    this.rotationCenter = new Vector2( x + 10, y + 15 );
    //last 3 angles of leg, need to addElectrons
    this.angleHistory = new Array( 3 );
  }

  return inherit( PropertySet, LegModel );
} );