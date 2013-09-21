// Copyright 2002-2013, University of Colorado Boulder

/**
 * Arm model of a John-Travoltage.
 * Can rotate around rotation center.
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Vector2 = require( 'DOT/Vector2' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  function Arm() {
    this.initialAngle = -0.5;
//    this.initialAngle = 0;
    PropertySet.call( this, { angle: this.initialAngle} );
    this.position = new Vector2( 423.6179673321235, 229.84969476984 );

    var finger = new Vector2( 534.3076703633706, 206.63766358806117 );
    this.fingerVector = finger.minus( this.position );
  }

  return inherit( PropertySet, Arm, {
    getFingerPosition: function() {

      //TODO: Reduce allocations
      return this.fingerVector.rotated( this.angle ).plus( this.position );
    }
  } );
} );