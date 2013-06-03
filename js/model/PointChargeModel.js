// Copyright 2002-2013, University of Colorado

/**
 * Model of a John-Travoltage.
 * Point charge model. Each charge have location and value.
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var Vector2 = require( 'DOT/Vector2' );

  var PointChargeModel = Fort.Model.extend(
      {
        defaults: {},
        init: function( x, y ) {
          this.location = new Vector2( x, y );
        },
        getCenter: function() {
          return new Vector2( this.location.x + this.radius, this.location.y + this.radius );
        }

      }, {
        radius: 9,
        charge: -1
      } );

  return PointChargeModel;
} );
