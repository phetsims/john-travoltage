// Copyright 2002-2013, University of Colorado Boulder

/**
 * Box2D physical model. Calculates position of electrons within physical body.
 * Calculates electical force and then motion along forcelines, when discharge happens
 * @author Vasily Shakhov (Mlearner)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );

  function Box2DModel( verts, forceLines ) {
    PropertySet.call( this, {
      isSpark: false
    } );

    this.forceLines = forceLines;
  }

  return inherit( PropertySet, Box2DModel, {
    //when we got spark, electrons moved to finger
    //calculate force along forceline
    getDischargeForce: function( body ) {
      var bodyPosition = new Vector2( body.m_xf.position.x, body.m_xf.position.y );
      //get closest forceline nad apply force to particle
      var closest = this.getClosestForceLine( bodyPosition );
      var vec = new Vector2( closest[2], closest[3] ).minus( bodyPosition );
      var k = 30;
      var v = vec.times( (k / Math.pow( vec.magnitude(), 1 )) / vec.magnitude() );
      var max = 10;
      if ( v.magnitude() > max ) {
        v = vec.times( (max) / vec.magnitude() );
      }

      return v.times( 1000 );
    },
    //find closest forceline
    getClosestForceLine: function( position ) {
      var closest = null;
      var closestDist = Number.POSITIVE_INFINITY;
      for ( var i = 0; i < this.forceLines.length; i++ ) {
        var dist = new Vector2( this.forceLines[i][0], this.forceLines[i][1] ).distance( position );
        if ( dist < closestDist ) {
          closest = this.forceLines[i];
          closestDist = dist;
        }
      }
      return closest;
    }
  } );
} );