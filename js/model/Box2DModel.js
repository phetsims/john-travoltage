/**
 * Copyright 2002-2013, University of Colorado
 * Author: Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  //var box2D =   require('../../lib/Box2dWeb-2.1.a.3.min');

  var Box2DModel = Fort.Model.extend(
    {
      defaults: {},
      init: function( verts ) {

      },
      step: function() {

      }
    } );

  return Box2DModel;
} );
