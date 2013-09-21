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

    this.electronsToRemove = [];

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
      new LineSegment( 472.38690040454634, 428.7835099210171, 431.4047389712964, 450.8037757657484 ),
      new LineSegment( 424.06465035638604, 445.2987093045656, 392.2575996917742, 324.79892120978616 ),
      new LineSegment( 392.2575996917742, 321.12887690233094, 376.35407435946826, 225.70772490849546 ),
      new LineSegment( 376.96574841071083, 222.6493546522828, 406.3261028703525, 217.75596224234252 ),
      new LineSegment( 406.3261028703525, 217.75596224234252, 428.34636871508377, 232.43613947216335 ),
//      new LineSegment(428.34636871508377,231.82446542092083,492.57214409554996,169.43371219418225)
      new LineSegment( 421.5406360424028, 230.84098939929325, 507.4770318021201, 219.98586572438163 )
//      new LineSegment( 495, 428, 460, 447 ),
//      new LineSegment( 460, 447, 381, 324 ),
//      new LineSegment( 381, 324, 348, 222 ),
//      new LineSegment( 348, 222, 437, 231 ),
//      new LineSegment( 431, 230, 516, 198 ),
//      new LineSegment( 430, 104, 340, 168 ),
//      new LineSegment( 420, 136, 394, 125 ),
//      new LineSegment( 390, 126, 370, 205 ),
//      new LineSegment( 312, 147, 362, 211 ),
//      new LineSegment( 270, 215, 360, 218 ),
//      new LineSegment( 275, 260, 364, 230 ),
//      new LineSegment( 296, 316, 361, 233 ),
//      new LineSegment( 346, 476, 288, 466 ),
//      new LineSegment( 287, 467, 333, 361 ),
//      new LineSegment( 333, 361, 345, 231 ),
//      new LineSegment( 410, 189, 383, 231 ),
//      new LineSegment( 412, 210, 404, 236 ),
//      new LineSegment( 390, 225, 461, 235 ),
//      new LineSegment( 451, 220, 515, 198 )
    ];

    this.doorknobPosition = new Vector2( 543.9318903113076, 257.5894162536105 );

    //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    PropertySet.call( this, { sound: true, spark: false } );

    this.electrons = new ObservableArray( [] );
    this.arm = new Arm();
    this.leg = new Leg();
//    this.spark = new SparkModel();
//    this.box2dModel = new Box2DModel( this.verts, this.forceLines );
    this.sounds = [
      new Sound( 'audio/OuchSmallest.mp3' ),
      new Sound( 'audio/ShockSmallest.mp3' )
    ];

    //If leg dragged across carpet, add electron
    this.leg.angleProperty.lazyLink( function( angle ) {
      if ( angle < 0.1 || angle > 0.8 && johnTravoltageModel.electrons.length < 100 ) {
        johnTravoltageModel.addElectron();
      }
    } );

    var array = [];
    for ( var i = 0; i < this.verts.length - 1; i++ ) {
      var current = this.verts[i];
      var next = this.verts[i + 1];
      var segment = new LineSegment( current.x, current.y, next.x, next.y );

      //Precompute normal vectors for performance in Electron's inner loop
      segment.normalVector = segment.getNormalVector();
      array.push( segment );
    }
    //TODO: store, do not reallocate
    var lineSegment = new LineSegment( this.verts[this.verts.length - 1].x, this.verts[this.verts.length - 1].y, this.verts[0].x, this.verts[0].y );

    //Precompute normal vectors for performance in Electron's inner loop
    lineSegment.normalVector = lineSegment.getNormalVector();
    array.push( lineSegment );
    this.lineSegments = array;
  }

  return inherit( PropertySet, JohnTravoltageModel, {

    getLineSegments: function() {
      return this.lineSegments;
    },
    // Called by the animation loop
    step: function( dt ) {
      var self = this;

      //Test for spark
      if ( !this.spark ) {
        var distToKnob = this.arm.getFingerPosition().distance( this.doorknobPosition );
//      console.log( distToKnob, this.electrons.length );
        if ( distToKnob < this.electrons.length ) {
          if ( this.sound ) {
            this.sounds[Math.floor( Math.random() * 2 )].play();
            this.spark = true;
          }
        }
      }

      //Step the model
      var i = 0;
      var length = this.electrons.length;
      if ( !this.spark ) {
        for ( i = 0; i < length; i++ ) {
          this.electrons._array[i].step( dt );
        }
      }
      else {
        for ( i = 0; i < length; i++ ) {
          this.electrons._array[i].stepInSpark( dt );
        }
        while ( this.electronsToRemove.length ) {
          this.removeElectron( this.electronsToRemove.pop() );
        }
        if ( this.electrons.length === 0 ) {
          this.spark = false;
        }
      }
    },
    removeElectron: function( electron ) {
      this.electrons.remove( electron );
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