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

  var LegModel = Fort.Model.extend(
    {
      defaults: {
        rotationAngle: 0
      },
      init: function( x, y ) {
        this.location = new Vector2( x, y );
        this.rotationCenter = new Vector2( x + 15, y + 10 );
        //last 3 angles of leg, need to addElectrons
        this.angleHistory = new Array(3);
      }
    } );

  return LegModel;
} );
