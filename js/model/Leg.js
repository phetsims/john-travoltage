// Copyright 2002-2013, University of Colorado Boulder

/**
 * Leg model of a John-Travoltage.
 * Can rotate around rotation center.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Leg() {
    PropertySet.call( this, { angle: 1.3175443221852239  } );
    this.position = new Vector2( 385 + 18 - 5, 312 + 28 - 5 );

    //last 3 angles of leg, need to addElectron function in JohnTravoltageModel
    this.angleHistory = new Array( 3 );
  }

  return inherit( PropertySet, Leg );
} );