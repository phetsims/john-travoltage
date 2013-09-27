// Copyright 2002-2013, University of Colorado Boulder

/**
 * Model for John Travoltage.
 *
 * @author Vasily Shakhov (Mlearner.com)
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  var Arm = require( 'JOHN_TRAVOLTAGE/model/Arm' );
  var Leg = require( 'JOHN_TRAVOLTAGE/model/Leg' );
  var Electron = require( 'JOHN_TRAVOLTAGE/model/Electron' );
  var LineSegment = require( 'JOHN_TRAVOLTAGE/model/LineSegment' );
  var ObservableArray = require( 'AXON/ObservableArray' );
  var PropertySet = require( 'AXON/PropertySet' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Sound = require( 'VIBE/Sound' );
  var Vector2 = require( 'DOT/Vector2' );
  var ouchSmallestAudio = require( 'audio!JOHN_TRAVOLTAGE/../audio/OuchSmallest.mp3' );
  var shockSmallestAudio = require( 'audio!JOHN_TRAVOLTAGE/../audio/ShockSmallest.mp3' );

  function JohnTravoltageModel() {
    var johnTravoltageModel = this;

    this.electronsToRemove = [];

    //vertices of path, border of body, sampled using a listener in JohnTravoltageView
    this.bodyVertices = [new Vector2( 422.21508828250404, 455.370786516854 ),
      new Vector2( 403.10754414125205, 424.5521669341895 ),
      new Vector2( 379.68539325842704, 328.3980738362762 ),
      new Vector2( 357.4959871589086, 335.17817014446234 ),
      new Vector2( 309.4189406099519, 448.5906902086678 ),
      new Vector2( 322.362760834671, 473.86195826645275 ),
      new Vector2( 284.14767255216697, 461.5345104333869 ),
      new Vector2( 327.9101123595506, 341.95826645264856 ),
      new Vector2( 281.6821829855538, 296.34670947030503 ),
      new Vector2( 286.6131621187801, 202.65810593900486 ),
      new Vector2( 318.66452648475126, 147.800963081862 ),
      new Vector2( 349.48314606741576, 118.83146067415731 ),
      new Vector2( 387.08186195826653, 110.20224719101125 ),
      new Vector2( 407.42215088282506, 75.06902086677371 ),
      new Vector2( 425.9133226324238, 75.06902086677371 ),
      new Vector2( 439.4735152487962, 85.54735152487964 ),
      new Vector2( 433.9261637239166, 118.21508828250404 ),
      new Vector2( 420.9823434991975, 126.2279293739968 ),
      new Vector2( 403.7239165329053, 128.07704654895667 ),
      new Vector2( 393.2455858747994, 142.25361155698238 ),
      new Vector2( 408.0385232744784, 171.22311396468703 ),
      new Vector2( 423.44783306581064, 221.14927768860358 ),
      new Vector2( 487.5505617977529, 217.45104333868383 ),
      new Vector2( 485.701444622793, 228.54574638844306 ),
      new Vector2( 432.07704654895673, 240.25682182985557 ),
      new Vector2( 392.0128410914928, 224.23113964687002 ),
      new Vector2( 390.7800963081863, 280.9373996789728 ),
      new Vector2( 404.34028892455865, 319.1524879614768 ),
      new Vector2( 414.81861958266455, 404.2118780096309 ),
      new Vector2( 435.15890850722315, 433.18138041733556 ),
      new Vector2( 464.1284109149278, 433.79775280898883 )];

    //lines, to which electrons moves, when spark happened
    this.forceLines = [
      new LineSegment( 472.38690040454634, 428.7835099210171, 431.4047389712964, 450.8037757657484 ),
      new LineSegment( 424.06465035638604, 445.2987093045656, 392.2575996917742, 324.79892120978616 ),
      new LineSegment( 392.2575996917742, 321.12887690233094, 376.35407435946826, 225.70772490849546 ),
      new LineSegment( 376.96574841071083, 222.6493546522828, 406.3261028703525, 217.75596224234252 ),
      new LineSegment( 406.3261028703525, 217.75596224234252, 428.34636871508377, 232.43613947216335 ),
      new LineSegment( 395.56783691959237, 118.72253680634202, 405.3091732729332, 203.95922989807477 ),
      new LineSegment( 308.5046432616082, 435.92480181200455, 338.33748584371466, 278.84575311438283 ),
      new LineSegment( 421.74767836919597, 225.87723669309176, 527.0758776896943, 212.48289920724804 )
    ];

    this.doorknobPosition = new Vector2( 543.9318903113076, 257.5894162536105 );

    //Properties of the model.  All user settings belong in the model, whether or not they are part of the physical model
    PropertySet.call( this, { sound: true, spark: false, sparkVisible: false } );

    this.electrons = new ObservableArray( [] );
    this.arm = new Arm();
    this.leg = new Leg();
    this.sounds = [
      new Sound( ouchSmallestAudio ),
      new Sound( shockSmallestAudio )
    ];

    //If leg dragged across carpet, add electron
    this.leg.angleProperty.lazyLink( function( angle ) {
      if ( angle < 2.4 && angle > 1 && johnTravoltageModel.electrons.length < 100 ) {
        johnTravoltageModel.addElectron();
      }
    } );

    var array = [];
    for ( var i = 0; i < this.bodyVertices.length - 1; i++ ) {
      var current = this.bodyVertices[i];
      var next = this.bodyVertices[i + 1];
      array.push( new LineSegment( current.x, current.y, next.x, next.y ) );
    }
    //TODO: store, do not reallocate
    var lineSegment = new LineSegment( this.bodyVertices[this.bodyVertices.length - 1].x, this.bodyVertices[this.bodyVertices.length - 1].y, this.bodyVertices[0].x, this.bodyVertices[0].y );
    array.push( lineSegment );
    this.lineSegments = array;
  }

  return inherit( PropertySet, JohnTravoltageModel, {

    reset: function() {
      PropertySet.prototype.reset.call( this );
      this.arm.reset();
      this.leg.reset();
      while ( this.electrons.length > 0 ) {
        this.removeElectron( this.electrons.get( 0 ) );
      }
      this.trigger( 'reset' );
    },
    getLineSegments: function() {
      return this.lineSegments;
    },
    // Called by the animation loop
    step: function( dt ) {

      //Clamp dt, since navigating to another tab and back gives the particles an apparent burst of energy, see #25
      if ( dt > 2 / 60 ) {
        dt = 2 / 60;
      }
      //Test for spark
      if ( !this.electronsExiting ) {
        var distToKnob = this.arm.getFingerPosition().distance( this.doorknobPosition );
        if ( distToKnob < this.electrons.length ) {
          this.electronsExiting = true;
          if ( this.sound ) {
            this.sounds[Math.floor( Math.random() * 2 )].play();
          }
        }
      }

      //Step the model
      var i = 0;
      var length = this.electrons.length;
      if ( !this.electronsExiting ) {
        for ( i = 0; i < length; i++ ) {
          this.electrons._array[i].step( dt );
        }
      }
      else {
        for ( i = 0; i < length; i++ ) {
          this.electrons._array[i].stepInSpark( dt );
        }
        if ( this.electronsToRemove.length ) {
          this.sparkVisible = true;
        }
        while ( this.electronsToRemove.length ) {
          this.removeElectron( this.electronsToRemove.pop() );
        }
        if ( this.electrons.length === 0 ) {
          this.electronsExiting = false;
          this.sparkVisible = false;
        }
      }

      this.trigger( 'step' );
    },
    removeElectron: function( electron ) {
      this.electrons.remove( electron );
    },
    addElectron: function() {

      var segment = new LineSegment( 424.0642054574639, 452.28892455858755, 433.3097913322633, 445.5088282504014 );
      var v = segment.vector;
      var rand = Math.random() * v.magnitude();

      var point = segment.p0.plus( v.normalized().times( rand ) );

      //TODO: use phet-core Poolable?
      this.electrons.add( new Electron( point.x, point.y, this, this.leg ) );

      //For debugging: show randomly in the middle for debugging
//      this.electrons.add( new Electron( this.bodyVertices[0].x + 50 + 50 * Math.random(), this.bodyVertices[0].y - 75 + 50 * Math.random(), this ) );
    }
  } );
} );