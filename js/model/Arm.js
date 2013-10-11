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
    PropertySet.call( this, { angle: -0.5} );

    //Arm pivot (elbow point) sampled using DebugPositions.js
    this.position = new Vector2( 423.6179673321235, 229.84969476984 );

    //Exact finger location sampled using DebugPositions.js
    var finger = new Vector2( 534.3076703633706, 206.63766358806117 );
    this.fingerVector = finger.minus( this.position );

    //Keep track of dragging flag (non-observable) so that when the sim is reset, a border outline is not added if the leg is dragging
    this.dragging = false;
  }

  return inherit( PropertySet, Arm, {
    getFingerPosition: function() {

      //TODO: Reduce allocations, possibly move this to a field that mutates
      return this.fingerVector.rotated( this.angle ).plus( this.position );
    },
    deltaAngle: function() { return this.angle; }
  } );
} );