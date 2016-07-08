// Copyright 2016, University of Colorado Boulder

/**
 * This file contains the sonic equivalent of the view, meaning that attempts to represent the things that occur in the
 * model using sounds.  It was created as part of an exploratory effort in sonfication, see
 * https://github.com/phetsims/john-travoltage/issues/92
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var ChargeAmountSoundGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ChargeAmountSoundGenerator' );
  var ChargeAmountToneGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ChargeAmountToneGenerator' );
  var inherit = require( 'PHET_CORE/inherit' );
  var johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  var JohnTravoltageModel = require( 'JOHN_TRAVOLTAGE/john-travoltage/model/JohnTravoltageModel' );
  var LinearFunction = require( 'DOT/LinearFunction' );
  var PitchedPopGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/PitchedPopGenerator' );
  var RandomNotePlayer = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/RandomNotePlayer' );
  var Sound = require( 'VIBE/Sound' );
  var ToneGenerator = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/ToneGenerator' );

  // audio
  var shoeDraggingForwardOnCarpetAudio = require( 'audio!JOHN_TRAVOLTAGE/shoe-dragging-forward-on-carpet' );
  var shoeDraggingBackwardOnCarpetAudio = require( 'audio!JOHN_TRAVOLTAGE/shoe-dragging-backward-on-carpet' );

  // constants
  var MAX_ELECTRONS = JohnTravoltageModel.MAX_ELECTRONS;
  var MAP_ARM_DISTANCE_TO_OSCILLATOR_FREQUENCY = new LinearFunction( 14, 240, 440, 110 ); // values empirically determined
  var MAP_ARM_DISTANCE_TO_LFO_FREQUENCY = new LinearFunction( 14, 240, 10, 1 ); // values empirically determined

  /**
   * @param {JohnTravoltageModel} model
   * TODO: The arm view is needed because the model doesn't track if user is dragging it, consider changing this and using model instead
   * @param {AppendageNode} armView - view of arm, needed to determine whether arm is in motion
   * @param {boolean | number} sonificationControl - controls which sounds to play, see code below for details
   * @constructor
   */
  function JohnTravoltageAudio( model, armView, sonificationControl ) {
    this.model = model;
    this.armView = armView;
    this.sonificationControl = sonificationControl;

    // track previous arm position and time, used to decide if arm is currently moving
    this.previousFingerPosition = this.model.arm.getFingerPosition();
    this.timeAtCurrentFingerPosition = Number.POSITIVE_INFINITY;

    // add the object that will be used to create 'pitched pop' sounds when an electron is added or removed
    var pitchedPopGenerator = new PitchedPopGenerator( model.soundProperty );

    // hook up sound generator for charge level, different types depending on control setting
    if ( sonificationControl === true || sonificationControl === 1 ) {

      // create a random note player that will play notes more frequently as the number of charges increases
      this.randomNotePlayer = new RandomNotePlayer(
        model.soundProperty,
        model.electrons.lengthProperty,
        0,
        JohnTravoltageModel.MAX_ELECTRONS
      );
    }
    else if ( sonificationControl === 2 ) {

      // create a sound generator that will be used to create a jostling sound that represent the presence of charge
      this.jostlingChargesSoundGenerator = new ChargeAmountSoundGenerator(
        model.soundProperty,
        model.electrons.lengthProperty,
        0,
        JohnTravoltageModel.MAX_ELECTRONS
      );
    }
    else if ( sonificationControl === 3 ) {

      // create a tone generator that will indicate the presence of charge with a tone with a changing output filter
      this.chargeToneGenerator = new ChargeAmountToneGenerator(
        model.soundProperty,
        model.electrons.lengthProperty,
        0,
        JohnTravoltageModel.MAX_ELECTRONS,
        { randomlyUpdateFilterCutoff: true, toneFrequency: 120 }
      );
    }
    else {

      // create a tone generator that will indicate the present of charge with a filtered buzzing sound
      this.chargeToneGenerator = new ChargeAmountToneGenerator(
        model.soundProperty,
        model.electrons.lengthProperty,
        0,
        JohnTravoltageModel.MAX_ELECTRONS,
        { mapQuantityToFilterCutoff: true, toneFrequency: 90 }
      );
    }
    this.armPositionToneGenerator = new ToneGenerator();
    this.shoeDraggingForwardOnCarpetSound = new Sound( shoeDraggingForwardOnCarpetAudio );
    this.shoeDraggingBackwardOnCarpetSound = new Sound( shoeDraggingBackwardOnCarpetAudio );
    this.shoeDragSoundBeingPlayed = null;
    this.legStillTime = 0;

    // define a function that will play a sound when the count of electrons changing
    function playElectronAddedOrRemovedSound() {
      pitchedPopGenerator.createPop(
        model.electrons.length / MAX_ELECTRONS,
        model.electrons.length < JohnTravoltageModel.MAX_ELECTRONS ? 0.02 : 1.75 // longer pitch for last electron
      );
    }

    // monitor incoming and outgoing electrons
    model.electrons.addItemAddedListener( playElectronAddedOrRemovedSound );
    model.electrons.addItemRemovedListener( playElectronAddedOrRemovedSound );
  }

  johnTravoltage.register( 'JohnTravoltageAudio', JohnTravoltageAudio );

  return inherit( Object, JohnTravoltageAudio, {

    // @public, step the audio view
    step: function( dt ) {

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
      if ( this.armView.dragging && this.timeAtCurrentFingerPosition < 1.0 ) { // time threshold empirically determined
        var distanceToKnob = this.model.arm.getFingerPosition().distance( this.model.doorknobPosition );
        if ( this.sonificationControl === 2 ) {

          // pitch and LFO change
          this.armPositionToneGenerator.playTone( MAP_ARM_DISTANCE_TO_OSCILLATOR_FREQUENCY( distanceToKnob ) );
          this.armPositionToneGenerator.setLfoFrequency( MAP_ARM_DISTANCE_TO_LFO_FREQUENCY( distanceToKnob ) );
        }
        else if ( this.sonificationControl === 3 ) {

          // pitch constant, LFO changes
          this.armPositionToneGenerator.playTone( 220 );
          this.armPositionToneGenerator.setLfoFrequency( MAP_ARM_DISTANCE_TO_LFO_FREQUENCY( distanceToKnob ) );
        }
        else if ( this.sonificationControl === 4 ) {

          // LFO not used, pitch changes
          this.armPositionToneGenerator.playTone( MAP_ARM_DISTANCE_TO_OSCILLATOR_FREQUENCY( distanceToKnob ) );
        }
      }
      else {
        this.armPositionToneGenerator.stopTone();
      }

      // update arm position information for next step
      if ( this.model.arm.getFingerPosition().equals( this.previousFingerPosition ) ) {
        this.timeAtCurrentFingerPosition += dt;
      }
      else {
        this.previousFingerPosition = this.model.arm.getFingerPosition();
        this.timeAtCurrentFingerPosition = 0;
      }
    }
  } );
} );