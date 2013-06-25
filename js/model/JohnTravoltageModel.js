// Copyright 2002-2013, University of Colorado

/**
 * main Model container.
 * @author Vasily Shakhov (Mlearner.com)
 */
define( function( require ) {
  'use strict';
  var ArmModel = require( 'model/ArmModel' );
  var LegModel = require( 'model/LegModel' );
  var Box2DModel = require( 'model/Box2DModel' );
  var SparkModel = require( 'model/SparkModel' );
  var PointChargeModel = require( 'model/PointChargeModel' );
  var Property = require( 'AXON/Property' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );

  function JohnTravoltage() {

    //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    PropertySet.call( this, {
      charge: 0,
      //verticles of path, border of body
      verts: [
        [172.857, 203.791],
        [200.714, 218.791],
        [190, 235.219],
        [187.857, 263.076],
        [172.857, 278.791],
        [155, 273.076],
        [147.143, 278.791],
        [166.429, 310.219],
        [166.429, 328.076],
        [175, 347.362],
        [208.571, 345.934],
        [229.286, 335.934],
        [247.857, 328.076],
        [260.714, 331.648],
        [257.857, 348.791],
        [238.571, 365.791],
        [233.571, 373.076],
        [168.571, 386.648],
        [148.571, 373.791],
        [145, 380.934],
        [146.429, 425.219],
        [177.143, 462.362],
        [172.143, 466.648],
        [196.429, 538.076],
        [210.714, 555.219],
        [225, 556.648],
        [243.571, 544.505],
        [255, 540.934],
        [257.857, 551.648],
        [207.143, 602.362],
        [188.571, 590.219],
        [180, 574.505],
        [172.143, 573.076],
        [128.571, 480.934],
        [108.571, 475.934],
        [110, 486.648],
        [69.2857, 580.219],
        [64.2857, 583.791],
        [67.8571, 597.362],
        [92.1429, 605.219],
        [95.7143, 613.076],
        [79.2857, 620.934],
        [59.2857, 619.505],
        [30.7143, 609.505],
        [17.1429, 611.648],
        [18.5714, 585.934],
        [38.5714, 538.791],
        [57.8571, 488.076],
        [15.7143, 443.076],
        [15, 351.648],
        [30.7143, 310.934],
        [62.1429, 268.076],
        [85.7143, 248.076],
        [111.429, 245.934],
        [112.143, 238.791],
        [128.571, 238.791],
        [139.286, 213.791],
        [150.714, 201.648],
        [172.857, 203.791]
      ],
      //lines, to which electrons moves, when spark happened
      forceLines: [
        [495, 428, 460, 447],
        [460, 447, 381, 324],
        [381, 324, 348, 222],
        [348, 222, 437, 231],
        [431, 230, 516, 198],
        [430, 104, 340, 168],
        [420, 136, 394, 125],
        [390, 126, 370, 205],
        [312, 147, 362, 211],
        [270, 215, 360, 218],
        [275, 260, 364, 230],
        [296, 316, 361, 233],
        [346, 476, 288, 466],
        [287, 467, 333, 361],
        [333, 361, 345, 231],
        [410, 189, 383, 231],
        [412, 210, 404, 236],
        [390, 225, 461, 235],
        [451, 220, 515, 198]
      ],
      particles: [],
      //length of particles array, need to link view
      particlesLength: 0,
      //[num of electron, distance between door and knob, when spark started]
      fireSparkConditions: [
        [10, 20],
        [15, 30],
        [20, 40],
        [25, 50],
        [30, 60],
        [35, 70],
        [40, 80],
        [50, 100],
        [60, 120],
        [70, 140]
      ]
    } );
    this.arm = new ArmModel( 418, 186 );
    this.leg = new LegModel( 385, 312 );
    this.spark = new SparkModel();
    this.box2dModel = new Box2DModel( this.verts, this.forceLines );
    this.soundProperty = new Property( false );
  }

  inherit( PropertySet, JohnTravoltage, {
    // Called by the animation loop
    step: function() {
      var self = this;

      //if spark we must removed electrons from finger
      if ( this.box2dModel.isSpark ) {
        var newParticles = [];
        this.particles.forEach( function( entry ) {
          if ( entry.removed ) {
            entry.viewNode.detach();
          }
          else {
            newParticles.push( entry );
          }
        } );
        this.particles = newParticles;
        if ( newParticles.length === 0 ) {
          this.box2dModel.isSpark = false;
          this.particlesLength = 0;
        }
      }
      else {
        //check if we must firespark
        var distToKnob = this.spark.sink.distance( this.arm.getFingerLocation() );
        var n = this.particles.length / 2;

        //edu.colorado.phet.common.util.Debug.traceln("Distance to knob="+distToKnob+", edu.colorado.phet.common count="+n);
        for ( var i = 0; i < this.fireSparkConditions.length; i++ ) {
          if ( n > this.fireSparkConditions[i][0] && distToKnob < this.fireSparkConditions[i][1] ) {
            this.box2dModel.isSpark = true;
            break;
          }
        }
      }

      this.box2dModel.step( this );
      this.spark.step();
      this.particles.forEach( function( entry ) {
        entry.step( self );
      } );
    },
    addElectron: function() {
      this.particles.push( new PointChargeModel( 455, 455, this.box2dModel.world ) );
      this.particlesLength++;
      this.charge++;
    },
    removeElectron: function( electron ) {

    }
  } );
  return JohnTravoltage;
} );
