// Copyright 2013-2015, University of Colorado Boulder

/**
 * Main ScreenView of simulation. Drawing starts here
 *
 * @author Sam Reid
 * @author Vasily Shakhov (Mlearner)
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var Line = require( 'SCENERY/nodes/Line' );
  var inherit = require( 'PHET_CORE/inherit' );
  var BackgroundElementsNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/BackgroundElementsNode' );
  var AppendageNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/AppendageNode' );
  var SparkNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/SparkNode' );
  var ElectronNode = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ElectronNode' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SoundToggleButton = require( 'SCENERY_PHET/buttons/SoundToggleButton' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var DebugPositions = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/DebugPositions' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var platform = require( 'PHET_CORE/platform' );
  var HBox = require( 'SCENERY/nodes/HBox' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var JohnTravoltageQueryParameters = require( 'JOHN_TRAVOLTAGE/john-travoltage/JohnTravoltageQueryParameters' );
  var PitchedPopGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/PitchedPopGenerator' );
  var ToneGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ToneGenerator' );
  var JostlingChargesSoundGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/JostlingChargesSoundGenerator' );
  var ChargeAmountToneGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ChargeAmountToneGenerator' );
  var Sound = require( 'VIBE/Sound' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );

  // audio
  var shoeDraggingForwardOnCarpetAudio = require( 'audio!JOHN_TRAVOLTAGE/shoe-dragging-forward-on-carpet' );
  var shoeDraggingBackwardOnCarpetAudio = require( 'audio!JOHN_TRAVOLTAGE/shoe-dragging-backward-on-carpet' );

  // images
  var arm = require( 'image!JOHN_TRAVOLTAGE/arm.png' );
  var leg = require( 'image!JOHN_TRAVOLTAGE/leg.png' );

  // constants
  var SONIFICATION_CONTROL = JohnTravoltageQueryParameters.SONIFICATION;
  var SHOW_DEBUG_INFO = JohnTravoltageQueryParameters.SHOW_DEBUG_INFO;
  var MAX_ELECTRONS = JohnTravoltageModel.MAX_ELECTRONS;
  var MAP_ARM_DISTANCE_TO_OSCILLATOR_FREQUENCY = new LinearFunction( 14, 240, 440, 110 ); // values empirically determined
  var MAP_ARM_DISTANCE_TO_LFO_FREQUENCY = new LinearFunction( 14, 240, 10, 1 ); // values empirically determined

  /**
   * @param {JohnTravoltageModel} model
   * @constructor
   */
  function JohnTravoltageView( model ) {
    var johnTravoltageView = this;
    this.model = model;

    //The sim works best in most browsers using svg. But in firefox on Win8 it is very slow and buggy, so use canvas on firefox.
    ScreenView.call( this, {
      renderer: platform.firefox ? 'canvas' : null,
      layoutBounds: new Bounds2( 0, 0, 768, 504 )
    } );

    //track previous arm position and time, used to decide if arm is currently moving
    this.previousFingerPosition = this.model.arm.getFingerPosition();
    this.timeAtCurrentFingerPosition = Number.POSITIVE_INFINITY;

    //add background elements
    this.addChild( new BackgroundElementsNode() );

    //Split layers after background for performance
    this.addChild( new Node( { layerSplit: true, pickable: false } ) );

    //arm and leg - only interactive elements
    this.leg = new AppendageNode( model.leg, leg, 25, 28, Math.PI / 2 * 0.7, model.soundProperty );
    this.addChild( this.leg );

    this.arm = new AppendageNode( model.arm, arm, 4, 45, -0.1, model.soundProperty );
    this.addChild( this.arm );

    //Show the dotted lines again when the sim is reset
    model.on( 'reset', function() {
      if ( !johnTravoltageView.leg.dragging ) {
        johnTravoltageView.leg.border.visible = true;
      }
      if ( !johnTravoltageView.arm.dragging ) {
        johnTravoltageView.arm.border.visible = true;
      }
    } );

    //spark
    this.addChild( new SparkNode( model.sparkVisibleProperty, model.arm, model.doorknobPosition, function( listener ) {
      model.on( 'step', listener );
    } ) );

    //Sound button and reset all button
    var soundButton = new SoundToggleButton( model.soundProperty );
    var resetAllButton = new ResetAllButton( {
      listener: model.reset.bind( model ),
      scale: 1.32
    } );
    resetAllButton.scale( soundButton.height / resetAllButton.height );
    this.addChild( new HBox( {
      spacing: 10,
      children: [ soundButton, resetAllButton ],
      right: this.layoutBounds.maxX - 7,
      bottom: this.layoutBounds.maxY - 7
    } ) );

    //sonification
    if ( SONIFICATION_CONTROL ) {
      var pitchedPopGenerator = new PitchedPopGenerator( model.soundProperty );
      if ( SONIFICATION_CONTROL === true || SONIFICATION_CONTROL === 1 ) {

        this.jostlingChargesSoundGenerator = new JostlingChargesSoundGenerator(
          model.soundProperty,
          model.electrons.lengthProperty,
          0,
          JohnTravoltageModel.MAX_ELECTRONS
        );
      }
      else if ( SONIFICATION_CONTROL === 2 ) {
        this.chargeToneGenerator = new ChargeAmountToneGenerator(
          model.soundProperty,
          model.electrons.lengthProperty,
          0,
          JohnTravoltageModel.MAX_ELECTRONS
        );
      }
      else {

        this.chargeToneGenerator = new ChargeAmountToneGenerator(
          model.soundProperty,
          model.electrons.lengthProperty,
          0,
          JohnTravoltageModel.MAX_ELECTRONS,
          { mapQuantityToFilterChangeRate: true, toneFrequency: 120 }
        );


      }
      this.armPositionToneGenerator = new ToneGenerator();
      this.shoeDraggingForwardOnCarpetSound = new Sound( shoeDraggingForwardOnCarpetAudio );
      this.shoeDraggingBackwardOnCarpetSound = new Sound( shoeDraggingBackwardOnCarpetAudio );
      this.shoeDragSoundBeingPlayed = null;
      this.legStillTime = 0;
    }

    //Split layers before particle layer for performance
    //Use a layer for electrons so it has only one pickable flag, perhaps may improve performance compared to iterating over all electrons to see if they are pickable?
    var electronLayer = new Node( { layerSplit: true, pickable: false } );
    this.addChild( electronLayer );

    //if new electron added to model - create and add new node to leg
    //TODO: Pooling for creation and use visible instead of addChild for performance
    model.electrons.addItemAddedListener( function( added ) {

      // and the visual representation of the electron
      var newElectron = new ElectronNode( added, model.leg, model.arm );
      added.viewNode = newElectron;
      electronLayer.addChild( newElectron );

      // play the sound that indicates that an electron was added
      pitchedPopGenerator && pitchedPopGenerator.createPop(
        model.electrons.length / MAX_ELECTRONS,
        model.electrons.length < JohnTravoltageModel.MAX_ELECTRONS ? 0.02 : 1.75 // longer pitch for last electron
      );

      var itemRemovedListener = function( removed ) {
        if ( removed === added ) {
          electronLayer.removeChild( newElectron );
          model.electrons.removeItemRemovedListener( itemRemovedListener );
          pitchedPopGenerator && pitchedPopGenerator.createPop( model.electrons.length / MAX_ELECTRONS, 0.02 );
        }
      };
      model.electrons.addItemRemovedListener( itemRemovedListener );
    } );

    // debug lines, body and force line, enabled through query parameter
    // borders are approximately 8px = radius of particle from physical body, because physical radius of electron = 1 in box2D
    if ( SHOW_DEBUG_INFO ) {
      this.showBody();

      this.addChild( new Circle( 10, { x: model.bodyVertices[ 0 ].x, y: model.bodyVertices[ 0 ].y, fill: 'blue' } ) );
      this.addChild( new Circle( 10, { x: 0, y: 0, fill: 'blue' } ) );

      //Debugging for finger location
      var fingerCircle = new Circle( 10, { fill: 'red' } );
      model.arm.angleProperty.link( function() {
        fingerCircle.x = model.arm.getFingerPosition().x;
        fingerCircle.y = model.arm.getFingerPosition().y;
      } );
      this.addChild( fingerCircle );

      new DebugPositions().debugLineSegments( this );
    }
  }

  johnTravoltage.register( 'JohnTravoltageView', JohnTravoltageView );

  return inherit( ScreenView, JohnTravoltageView, {

    // @public, step the view
    step: function( dt ) {

      if ( SONIFICATION_CONTROL ) {

        //-------------------------------------------------------------------------------------------------------------
        // update the sound for shoe dragging
        //-------------------------------------------------------------------------------------------------------------

        var shoeDragSoundToPlay;
        if ( !this.model.shoeOnCarpet ) {

          // the shoe is above the carpet, so no sound should be playing
          shoeDragSoundToPlay = null;
        }
        else {
          if ( this.model.legAngularVelocity === 0 ) {

            // implement a bit of hysteresis for turning the sound on and off, otherwise it can start and stop too often
            this.legStillTime += dt;
            if ( this.legStillTime > 0.1 ) {
              shoeDragSoundToPlay = null;
            }
          }
          else {
            this.legStillTime = 0;
            shoeDragSoundToPlay = this.model.legAngularVelocity > 0 ?
                                  this.shoeDraggingBackwardOnCarpetSound :
                                  this.shoeDraggingForwardOnCarpetSound;
          }
        }

        // if the correct sound isn't currently being played, update it
        if ( this.shoeDragSoundBeingPlayed !== shoeDragSoundToPlay ) {

          if ( this.shoeDragSoundBeingPlayed ) {
            this.shoeDragSoundBeingPlayed.stop();
          }

          this.shoeDragSoundBeingPlayed = shoeDragSoundToPlay;

          if ( this.shoeDragSoundBeingPlayed ) {
            this.shoeDragSoundBeingPlayed.play();
          }
        }

        //-------------------------------------------------------------------------------------------------------------
        // update the sound for the arm distance from the knob
        //-------------------------------------------------------------------------------------------------------------

        //if the arm is moving, play the proximity sound
        if ( this.arm.dragging && this.timeAtCurrentFingerPosition < 1.0 ) { // time threshold empirically determined
          var distanceToKnob = this.model.arm.getFingerPosition().distance( this.model.doorknobPosition );
          if ( SONIFICATION_CONTROL === true || SONIFICATION_CONTROL === 1 ) {

            // pitch and LFO change
            this.armPositionToneGenerator.playTone( MAP_ARM_DISTANCE_TO_OSCILLATOR_FREQUENCY( distanceToKnob ) );
            this.armPositionToneGenerator.setLfoFrequency( MAP_ARM_DISTANCE_TO_LFO_FREQUENCY( distanceToKnob ) );

          }
          else if ( SONIFICATION_CONTROL === 2 ) {

            // pitch constant, LFO changes
            this.armPositionToneGenerator.playTone( 220 );
            this.armPositionToneGenerator.setLfoFrequency( MAP_ARM_DISTANCE_TO_LFO_FREQUENCY( distanceToKnob ) );
          }
          else {

            // LFO not used, pitch changes
            this.armPositionToneGenerator.playTone( MAP_ARM_DISTANCE_TO_OSCILLATOR_FREQUENCY( distanceToKnob ) );
          }
        }
        else {
          this.armPositionToneGenerator.stopTone();
        }
      }

      if ( this.model.arm.getFingerPosition().equals( this.previousFingerPosition ) ) {
        this.timeAtCurrentFingerPosition += dt;
      }
      else {
        this.previousFingerPosition = this.model.arm.getFingerPosition();
        this.timeAtCurrentFingerPosition = 0;
      }
    },

    showBody: function() {
      //vertices and body path
      var customShape = new Shape();
      var lineSegment = null;
      for ( var i = 0; i < this.model.lineSegments.length; i++ ) {
        lineSegment = this.model.lineSegments[ i ];
        customShape.moveTo( lineSegment.x1, lineSegment.y1 );
        customShape.lineTo( lineSegment.x2, lineSegment.y2 );
      }

      //Show normals
      for ( i = 0; i < this.model.lineSegments.length; i++ ) {
        lineSegment = this.model.lineSegments[ i ];
        var center = lineSegment.center;
        var normal = lineSegment.normal.times( 50 );
        this.addChild( new Line( center.x, center.y, center.x + normal.x, center.y + normal.y, {
          lineWidth: 2,
          stroke: 'blue'
        } ) );
      }

      var path = new Path( customShape, {
        stroke: 'green',
        lineWidth: 1,
        pickable: false
      } );
      this.addChild( path );

      //forcelines, which attract particles
      var lines = this.model.forceLines;
      for ( i = 0; i < lines.length; i++ ) {
        customShape = new Shape();
        customShape.moveTo( lines[ i ].x1, lines[ i ].y1 );
        customShape.lineTo( lines[ i ].x2, lines[ i ].y2 );
        path = new Path( customShape, {
          stroke: 'red',
          lineWidth: 1,
          pickable: false,
          x: 0,
          y: 0
        } );
        this.addChild( path );
      }
    }
  } );
} );