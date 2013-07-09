// Copyright 2002-2013, University of Colorado Boulder

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
        [170, 207],
        [192, 220],
        [184, 229],
        [180, 259],
        [170, 271],
        [160, 267],
        [148, 270],
        [142, 278],
        [158, 312],
        [158, 326],
        [167, 345],
        [167, 355],
        [207, 353],
        [232, 343],
        [248, 336],
        [253, 335],
        [250, 344],
        [240, 350],
        [234, 359],
        [229, 366],
        [170, 378],
        [156, 372],
        [148, 364],
        [138, 375],
        [138, 422],
        [163, 461],
        [188, 539],
        [203, 557],
        [221, 563],
        [246, 551],
        [251, 547],
        [250, 549],
        [206, 594],
        [194, 584],
        [187, 574],
        [177, 566],
        [136, 480],
        [116, 473],
        [102, 485],
        [63, 575],
        [64, 575],
        [60, 595],
        [86, 611],
        [88, 610],
        [77, 613],
        [60, 611],
        [35, 602],
        [22, 605],
        [26, 587],
        [45, 542],
        [68, 485],
        [23, 440],
        [22, 353],
        [37, 314],
        [67, 273],
        [88, 255],
        [106, 252],
        [117, 244],
        [124, 245],
        [145, 218],
        [153, 209],
        [170, 207]
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
    this.soundProperty = new Property( true );
    this.sounds = [
      new Howl( {urls: ['audio/OuchSmallest.mp3', 'audio/OuchSmallest.ogg']} ),
      new Howl( {urls: ['audio/OuchSmallest.mp3', 'audio/OuchSmallest.ogg']} )
    ];
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

        for ( var i = 0; i < this.fireSparkConditions.length; i++ ) {
          if ( n > this.fireSparkConditions[i][0] && distToKnob < this.fireSparkConditions[i][1] ) {
            //fire spark
            if ( this.soundProperty.get() ) {
              this.sounds[Math.floor( Math.random() * 2 )].play();
            }
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
      this.particles.push( new PointChargeModel( 460, 450, this.box2dModel.world ) );
      this.particlesLength++;
      this.charge++;
    }
  } );
  return JohnTravoltage;
} );
