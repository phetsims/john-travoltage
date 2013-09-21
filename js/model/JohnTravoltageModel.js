// Copyright 2002-2013, University of Colorado Boulder

/**
 * main Model container.
 * creates box2d model, checks condition for spark
 *
 * @author Vasily Shakhov (Mlearner.com)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Arm = require( 'JOHN_TRAVOLTAGE/model/Arm' );
  var Leg = require( 'JOHN_TRAVOLTAGE/model/Leg' );
  var Box2DModel = require( 'JOHN_TRAVOLTAGE/model/Box2DModel' );
  var SparkModel = require( 'JOHN_TRAVOLTAGE/model/SparkModel' );
  var Electron = require( 'JOHN_TRAVOLTAGE/model/Electron' );
  var LineSegment = require( 'JOHN_TRAVOLTAGE/model/LineSegment' );
  var Property = require( 'AXON/Property' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sound = require( 'VIBE/Sound' );
  var Vector2 = require( 'DOT/Vector2' );

  function JohnTravoltageModel() {
    var johnTravoltageModel = this;

    //vertices of path, border of body, sampled using a listener in JohnTravoltageView
    this.verts = [
      new Vector2( 272.2124616956078, 306.9090909090909 ),
      new Vector2( 274.5658835546476, 207.2808988764045 ),
      new Vector2( 346.73748723186924, 110.79060265577121 ),
      new Vector2( 378.1164453524004, 106.08375893769154 ),
      new Vector2( 411.0643513789581, 67.64453524004088 ),
      new Vector2( 451.8569969356486, 80.98059244126662 ),
      new Vector2( 431.46067415730334, 137.4627170582227 ),
      new Vector2( 402.43513789581203, 136.67824310520942 ),
      new Vector2( 429.1072522982635, 211.2032686414709 ),

      //Arm
      new Vector2( 431.46067415730334, 211.9877425944842 ),
      new Vector2( 497.3564862104188, 207.2808988764045 ),
      new Vector2( 491.0806945863125, 238.65985699693567 ),
      new Vector2( 423.6159346271706, 246.50459652706846 ),
      new Vector2( 400.8661899897855, 235.52196118488254 ),
      //End arm

      new Vector2( 400.0817160367722, 242.58222676200205 ),
      new Vector2( 418.1246169560776, 333.58120531154236 ),

      //Leg
      new Vector2( 436.95199182839633, 426.1491317671093 ),
      new Vector2( 460.48621041879466, 442.6230847803881 ),
      new Vector2( 422.046986721144, 470.0796731358529 ),
      new Vector2( 392.2369765066394, 420.6578140960163 ),
      new Vector2( 370.2717058222676, 339.8569969356486 ),
      //End leg

      new Vector2( 318.4964249233912, 444.97650663942795 ),
      new Vector2( 323.98774259448413, 482.63125638406535 ),
      new Vector2( 272.99693564862105, 469.2951991828396 ),
      new Vector2( 319.2808988764045, 348.48621041879466 ),
      new Vector2( 272.2124616956078, 297.49540347293157 )
    ];

    //lines, to which electrons moves, when spark happened
    this.forceLines = [
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
    ];

    //[num of electron, distance between door and knob, when spark started]
    this.fireSparkConditions = [
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
    ];

    //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    PropertySet.call( this, { sound: true } );

    this.electrons = new ObservableArray( [] );
    this.arm = new Arm();
    this.leg = new Leg();
    this.spark = new SparkModel();
//    this.box2dModel = new Box2DModel( this.verts, this.forceLines );
    this.sounds = [
      new Sound( 'audio/OuchSmallest.mp3' ),
      new Sound( 'audio/ShockSmallest.mp3' )
    ];

    //if last 3 position of leg is correct, add Electron to body
    this.leg.angleProperty.lazyLink( function( angle ) {
      if ( angle < 0.1 || angle > 0.8 ) {
        johnTravoltageModel.addElectron();
      }
    } );

    var array = [];
    for ( var i = 0; i < this.verts.length - 1; i++ ) {
      var current = this.verts[i];
      var next = this.verts[i + 1];
      array.push( new LineSegment( current.x, current.y, next.x, next.y ) );
    }
    //TODO: store, do not reallocate
    array.push( new LineSegment( this.verts[this.verts.length - 1].x, this.verts[this.verts.length - 1].y, this.verts[0].x, this.verts[0].y ) );
    this.lineSegments = array;
  }

  return inherit( PropertySet, JohnTravoltageModel, {

    getLineSegments: function() {
      return this.lineSegments;
    },
    // Called by the animation loop
    step: function( dt ) {
      var self = this;

      //if spark we must removed electrons from finger
//      if ( this.box2dModel.isSpark ) {
//        var newParticles = [];
//        this.electrons.forEach( function( entry ) {
//          if ( entry.removed ) {
//            entry.viewNode.detach();
//          }
//          else {
//            newParticles.push( entry );
//          }
//        } );
//        this.electrons = newParticles;
//        if ( newParticles.length === 0 ) {
//          this.box2dModel.isSpark = false;
//          this.electronsLength = 0;
//        }
//      }
//
//      //Test for spark
//      else {
////        var distToKnob = this.spark.sink.distance( this.arm.getFingerPosition() );
////        var n = this.electrons.length / 2;
////        for ( var i = 0; i < this.fireSparkConditions.length; i++ ) {
////          if ( n > this.fireSparkConditions[i][0] && distToKnob < this.fireSparkConditions[i][1] ) {
////            //if one of the conditions to fire spark correct - fire it
////            if ( this.soundProperty.get() ) {
////              this.sounds[Math.floor( Math.random() * 2 )].play();
////            }
////            this.box2dModel.isSpark = true;
////            break;
////          }
////        }
//      }
      // recalculate model, spark, then particles positions
//      this.box2dModel.step( this );
//      this.spark.step();
      this.electrons.forEach( function( entry ) {
        entry.step( dt, self );
      } );
    },
    addElectron: function() {

      var segment = new LineSegment( new Vector2( 423.6159346271706, 463.8038815117467 ), new Vector2( 450.2880490296221, 444.97650663942795 ) );
      var v = segment.toVector();
      var rand = Math.random() * v.magnitude();
      var point = segment.getP0().plus( v.normalized().times( rand ) );

      //TODO: use phet-core Poolable?
      this.electrons.add( new Electron( point.x, point.y, this, this.leg ) );

      //Show randomly in the middle for debugging
//      this.electrons.add( new Electron( this.verts[0].x + 50 + 50 * Math.random(), this.verts[0].y - 75 + 50 * Math.random(), this ) );
    }
  } );
} );