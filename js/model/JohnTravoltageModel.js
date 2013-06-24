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
  var Box2DModel = require( 'model/Box2DModel' );
  var SparkModel = require( 'model/SparkModel' );
  var PointChargeModel = require('model/PointChargeModel');

  var JohnTravoltage = Fort.Model.extend(
    {
      //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
      defaults: {
        charge: 0,
        //verticles of path, border of body
        verts: [
          [172.857,203.791],
          [200.714,218.791],
          [190,235.219],
          [187.857,263.076],
          [172.857,278.791],
          [155,273.076],
          [147.143,278.791],
          [166.429,310.219],
          [166.429,328.076],
          [175,347.362],
          [208.571,345.934],
          [229.286,335.934],
          [247.857,328.076],
          [260.714,331.648],
          [257.857,348.791],
          [238.571,353.791],
          [233.571,373.076],
          [168.571,386.648],
          [148.571,373.791],
          [145,380.934],
          [146.429,425.219],
          [177.143,462.362],
          [172.143,466.648],
          [196.429,538.076],
          [210.714,555.219],
          [225,556.648],
          [243.571,544.505],
          [255,540.934],
          [257.857,551.648],
          [207.143,602.362],
          [188.571,590.219],
          [180,574.505],
          [172.143,573.076],
          [128.571,480.934],
          [108.571,475.934],
          [110,486.648],
          [69.2857,580.219],
          [64.2857,583.791],
          [67.8571,597.362],
          [92.1429,605.219],
          [95.7143,613.076],
          [79.2857,620.934],
          [59.2857,619.505],
          [30.7143,609.505],
          [17.1429,611.648],
          [18.5714,585.934],
          [38.5714,538.791],
          [57.8571,488.076],
          [15.7143,443.076],
          [15,351.648],
          [30.7143,310.934],
          [62.1429,268.076],
          [85.7143,248.076],
          [111.429,245.934],
          [112.143,238.791],
          [128.571,238.791],
          [139.286,213.791],
          [150.714,201.648],
          [172.857,203.791]
        ],
        particles: []
      },

      //Main constructor
      init: function() {
        this.arm = new ArmModel( 418, 186 );
        this.leg = new LegModel( 385, 312 );
        this.spark = new SparkModel();
        this.box2dModel = new Box2DModel(this.verts);


        //TODO remove this
        this.particles.push(new PointChargeModel(300,300,this.box2dModel.world));
        this.particles.push(new PointChargeModel(350,350,this.box2dModel.world));
        this.particles.push(new PointChargeModel(350,300,this.box2dModel.world));
        this.particles.push(new PointChargeModel(300,350,this.box2dModel.world));
      },

      // Called by the animation loop
      step: function() {
        this.box2dModel.step(this.particles);
        this.spark.step();
        this.particles.forEach(function(entry){
           entry.step();
        });
      }
    } );

  return JohnTravoltage;
} );
