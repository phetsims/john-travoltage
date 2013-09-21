// Copyright 2002-2013, University of Colorado Boulder

/**
 * Leg model of a John-Travoltage.
 * Can rotate around rotation center.
 * TODO: Unify Leg and Arm to Appendage
 *
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Leg() {
    var leg = this;
    this.initialAngle = 1.3175443221852239;
    PropertySet.call( this, { angle: this.initialAngle  } );
    this.position = new Vector2( 385 + 18 - 5, 312 + 28 - 5 );

    //last 3 angles of leg, need to addElectron function in JohnTravoltageModel
    //TODO: Delete me
    this.angleHistory = [this.angle, this.angle, this.angle];
    this.angleProperty.link( function( angle ) {
      leg.angleHistory.push( angle );
      leg.angleHistory.shift();
    } );
  }

  return inherit( PropertySet, Leg, {
    deltaAngle: function() { return this.angle - this.initialAngle; }
  } );
} );