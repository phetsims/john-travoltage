// Copyright 2002-2013, University of Colorado

/**
 * main Model container.
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function( require ) {
  'use strict';
  var Fort = require( 'FORT/Fort' );
  var ArmModel = require( 'model/ArmModel' );
  var LegModel = require( 'model/LegModel' );
  var Box2DModel = require('model/Box2DModel');

  var JohnTravoltage = Fort.Model.extend(
    {
      //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
      defaults: {
        charge: 0,
        //verticles of path, border of body
        verts: [ [
          [163, 200],
          [165, 224],
          [186, 252],
          [187, 269],
          [208, 335],
          [223, 351],
          [242, 350],
          [262, 338],
          [276, 345],
          [218, 402],
          [192, 377],
          [181, 371],
          [147, 293],
          [130, 270],
          [85, 376],
          [95, 391],
          [113, 390],
          [118, 401],
          [91, 410],
          [40, 402],
          [49, 360],
          [83, 280],
          [46, 234],
          [40, 218],
          [40, 198],
          [40, 140],
          [77, 65],
          [111, 48],
          [133, 48],
          [137, 40],
          [145, 40],
          [164, 10],
          [186, 7],
          [212, 19],
          [211, 28],
          [206, 32],
          [200, 50],
          [202, 61],
          [191, 77],
          [173, 74],
          [167, 79],
          [174, 94],
          [181, 107],
          [183, 123],
          [190, 136],
          [207, 145],
          [286, 120],
          [298, 135],
          [296, 144],
          [275, 150],
          [270, 169],
          [200, 183],
          [172, 172],
          [162, 200]
        ]]
      },

      //Main constructor
      init: function() {
        this.arm = new ArmModel( 418, 186 );
        this.leg = new LegModel( 385, 312 );
        //this.box2dModel = new Box2DModel(this.verts);
      },

      // Called by the animation loop
      step: function() {
      }

      // Reset the entire model

    } );

  return JohnTravoltage;
} );
