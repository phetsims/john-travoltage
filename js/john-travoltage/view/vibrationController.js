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

import Property from '../../../../axon/js/Property.js';
import vibrationManager from '../../../../tappi/js/vibrationManager.js';
import VibrationPatterns from '../../../../tappi/js/VibrationPatterns.js';
import johnTravoltage from '../../johnTravoltage.js';
import speechController from './speechController.js';

// constants
const CHARGES_LEAVING_PATTERN = [ 200, 100 ];

class VibrationController {
  constructor() {}

  /**
   * @param {JohnTravoltageModel} model
   * @param {JohnTravoltageView} view
   */
  initialize( model, view ) {
    const paradigmChoice = phet.chipper.queryParameters.vibration;

    if ( paradigmChoice === 'objects' ) {

      // Whenever a pointer moves over a new shape (even if it already is over an existing shape) this emitter
      // will emit an event. Get the right pattern and begin vibration for this case
      view.shapeHitDetector.hitShapeEmitter.addListener( hitShape => {
        if ( hitShape === model.touchableBodyShape ) {
          vibrationManager.startVibrate( VibrationPatterns.HZ_5 );
        }
        else if ( hitShape === model.carpetShape ) {
          vibrationManager.startVibrate( VibrationPatterns.MOTOR_CALL );
        }
        else if ( hitShape === view.arm.hitShape ) {
          vibrationManager.startVibrate( VibrationPatterns.HZ_25 );
        }
        else if ( hitShape === view.leg.hitShape ) {
          vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
        }
        else {
          vibrationManager.stopVibrate();
        }
      } );

      Property.multilink( [ model.arm.isDraggingProperty, model.leg.isDraggingProperty ], ( armDragging, legDragging ) => {
        if ( armDragging ) {
          vibrationManager.startVibrate( VibrationPatterns.HZ_25 );
        }
        else if ( legDragging ) {
          vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
        }
        else {
          vibrationManager.stopVibrate();
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
          vibrationManager.startVibrate( VibrationPatterns.HZ_25 );
        }
        else if ( legDragging ) {
          vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
        }
        else {
          vibrationManager.stopVibrate();
        }
      } );

      // in response to a "change" event, begin a timed vibration (because TalkBack doesn't go through pointer
      // events, and the isDraggingProperties will fire one after another immediately)
      view.leg.addInputListener( {
        input: event => {
          vibrationManager.startTimedVibrate( 1000, VibrationPatterns.HZ_25 );
        }
      } );

      view.arm.addInputListener( {
        input: event => {
          vibrationManager.startTimedVibrate( 1000, VibrationPatterns.HZ_10 );
        }
      } );
    }

    // Vibration indicates charge entering the body while dragging the leg
    if ( paradigmChoice === 'interaction-changes' ) {
      Property.multilink( [ model.leg.isDraggingProperty, model.shoeOnCarpetProperty ], ( isDragging, shoeOnCarpet ) => {
        if ( isDragging && shoeOnCarpet ) {
          vibrationManager.startVibrate();
        }
        else {
          vibrationManager.stopVibrate();
        }
      } );

      // in response to a "change" event, begin a timed vibration (because TalkBack doesn't go through pointer
      // events, and the isDraggingProperties will fire one after another immediately)
      view.leg.addInputListener( {
        input: event => {
          if ( model.shoeOnCarpetProperty.get() ) {
            vibrationManager.startTimedVibrate( 1000, [ 1000 ] );
          }
        }
      } );
    }

    // Vibration feedback to indicate changes in charge
    if ( paradigmChoice === 'result' ) {
      model.dischargeStartedEmitter.addListener( () => {
        vibrationManager.startVibrate( CHARGES_LEAVING_PATTERN );
      } );
      model.dischargeEndedEmitter.addListener( () => {
        vibrationManager.stopVibrate();
      } );

      // for as long as there are charges in the body, vibrate forever
      model.stepEmitter.addListener( () => {

        // only initiate vibration if we haven't already initiated one
        if ( !vibrationManager.isRunningPattern() && model.electrons.length > 0 ) {
          vibrationManager.startVibrate( VibrationPatterns.HZ_5 );
        }
      } );
    }
  }
}

// create and register the singleton instance
const vibrationController = new VibrationController();
johnTravoltage.register( 'vibrationController', vibrationController );
export default vibrationController;