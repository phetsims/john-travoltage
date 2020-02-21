// Copyright 2019, University of Colorado Boulder

/**
 * Controls vibration in john-travoltage through use of tappi's vibrationManager. There are three paradigms
 * for design that are being explored, all are implemented in this file.
 *
 * Singleton class as one instance controls all vibration in the simulation.
 *
 * 1) Objects - Haptic feedback is used to indicate to a user where objects are in the scene.
 * 2) Manipulation - Haptic feedback is used to indicate successful interaction, while also indicating differences in
*                    the objects.
 * 3) Interaction Changes - Vibration conveys state changes in the sim while the user is interacting with it.
 * 4) Result - Vibration conveys state of the simulation after interaction.
 *
 * Each implemented below, selected by query parameter.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const speechController = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/speechController' );
  const VibrationManageriOS = require( 'TAPPI/VibrationManageriOS' );
  const Property = require( 'AXON/Property' );

  // constants
  const CHARGES_LEAVING_PATTERN = [ 200, 100 ];

  class VibrationControlleriOS {
    constructor() {}

    /**
     * @param {JohnTravoltageModel} model
     * @param {JohnTravoltageView} view
     */
    initialize( model, view ) {
      const paradigmChoice = phet.chipper.queryParameters.vibration;
      const vibrationManageriOS = new VibrationManageriOS();

      if ( paradigmChoice === 'objects' ) {

        // Whenever a pointer moves over a new shape (even if it already is over an existing shape) this emitter
        // will emit an event. Get the right pattern and begin vibration for this case
        view.shapeHitDetector.hitShapeEmitter.addListener( hitShape => {
          if ( hitShape === model.touchableBodyShape ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 100 );
            console.log('Touching body');
          }
          else if ( hitShape === model.carpetShape ) {
            vibrationManageriOS.vibrateForever();
            console.log('Touching carpet');
          }
          else if ( hitShape === view.arm.hitShape ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 25 );
            console.log('Touching arm');
          }
          else if ( hitShape === view.leg.hitShape ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 50 );
            console.log('Touching leg');
          }
          else {
            vibrationManageriOS.stop();
            console.log('vibration stop');
          }
        } );

        Property.multilink( [ model.arm.isDraggingProperty, model.leg.isDraggingProperty ], ( armDragging, legDragging ) => {
          if ( armDragging ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 25 );
          }
          else if ( legDragging ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 10 );
          }
          else {
            vibrationManageriOS.stop();
          }
        } );

        // this paradigm will not work while a screen reader is in use because the device intercepts
        // pointer down gestures - instead we will use web speech to let the user know basic information about the sim
        // NOTE: I notice that this adds quite a performance penalty in Chrome
        speechController.initialize( model );
      }

      // Vibration indicates successful interaction with different components.
      if ( paradigmChoice === 'manipulation' ) {
        Property.multilink( [ model.arm.isDraggingProperty, model.leg.isDraggingProperty ], ( armDragging, legDragging ) => {
          if ( armDragging ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 25 );
          }
          else if ( legDragging ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 50 );
          }
          else {
            vibrationManageriOS.stop();
          }
        } );

        // in response to a "change" event, begin a timed vibration (because TalkBack doesn't go through pointer
        // events, and the isDraggingProperties will fire one after another immediately)
        view.leg.addInputListener( {
          input: event => {
            vibrationManageriOS.vibrateAtFrequency( 1000, 25 );
          }
        } );

        view.arm.addInputListener( {
          input: event => {
            vibrationManageriOS.vibrateAtFrequency( 1, 10 );
          }
        } );
      }

      // Vibration indicates charge entering the body while dragging the leg
      if ( paradigmChoice === 'interaction-changes' ) {
        Property.multilink( [ model.leg.isDraggingProperty, model.shoeOnCarpetProperty ], ( isDragging, shoeOnCarpet ) => {
          if ( isDragging && shoeOnCarpet ) {
            vibrationManageriOS.vibrateForever();
          }
          else {
            vibrationManageriOS.stop();
          }
        } );

        // in response to a "change" event, begin a timed vibration (because TalkBack doesn't go through pointer
        // events, and the isDraggingProperties will fire one after another immediately)
        view.leg.addInputListener( {
          input: event => {
            if ( model.shoeOnCarpetProperty.get() ) {
              vibrationManageriOS.vibrate( 1 );
            }
          }
        } );
      }

      // Vibration feedback to indicate changes in charge
      // Need a way to tell if a vibration is running from iOS before this works
      if ( paradigmChoice === 'result' ) {
        let isRunningPattern = false;


        model.dischargeStartedEmitter.addListener( () => {
          vibrationManageriOS.vibrateWithCustomPatternForever( CHARGES_LEAVING_PATTERN );
          isRunningPattern = true;
        } );
        model.dischargeEndedEmitter.addListener( () => {
          vibrationManageriOS.stop();
          isRunningPattern = false;
        } );

        // for as long as there are charges in the body, vibrate forever - in step function because we want to
        // start vibration again after we may have stopped it from dischargeEndedEmitter
        model.stepEmitter.addListener( () => {

          // only initiate vibration if we haven't already initiated one
          if ( !isRunningPattern && model.electrons.length > 0 ) {
            vibrationManageriOS.vibrateAtFrequencyForever( 5 );
            isRunningPattern = true;
          }
          else if ( model.electrons.length === 0 ) {

            // stop vibration if we have no more charges without discharge (like on reset)
            vibrationManageriOS.stop();
            isRunningPattern = false;
          }
        } );
      }
    }
  }

  // create and register the singleton instance
  const vibrationControlleriOS = new VibrationControlleriOS();
  return johnTravoltage.register( 'vibrationControlleriOS', vibrationControlleriOS );
} );
