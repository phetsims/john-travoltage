// Copyright 2019-2020, University of Colorado Boulder

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
import johnTravoltage from '../../johnTravoltage.js';
import VibrationManageriOS from '../../../../tappi/js/VibrationManageriOS.js';

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
    const vibrationManager = new VibrationManageriOS();

    if ( paradigmChoice === 'objects' ) {

      // Whenever a pointer moves over a new shape (even if it already is over an existing shape) this emitter
      // will emit an event. Get the right pattern and begin vibration for this case
      view.shapeHitDetector.hitShapeEmitter.addListener( hitShape => {
        if ( hitShape === model.touchableBodyShape ) {
          vibrationManager.vibrateAtFrequencyForever( 100 );
        }
        else if ( hitShape === model.carpetShape ) {
          vibrationManager.vibrateForever();
        }
        else if ( hitShape === view.arm.hitShape ) {
          vibrationManager.vibrateAtFrequencyForever( 25 );
        }
        else if ( hitShape === view.leg.hitShape ) {
          vibrationManager.vibrateAtFrequencyForever( 50 );
        }
        else {
          vibrationManager.stop();
        }
      } );

      Property.multilink( [ model.arm.isDraggingProperty, model.leg.isDraggingProperty ], ( armDragging, legDragging ) => {
        if ( armDragging ) {
          vibrationManager.vibrateAtFrequencyForever( 25 );
        }
        else if ( legDragging ) {
          vibrationManager.vibrateAtFrequencyForever( 10 );
        }
        else {
          vibrationManager.stop();
        }
      } );
    }

    // Vibration indicates successful interaction with different components.
    if ( paradigmChoice === 'manipulation' ) {
        // in response to a "change" event, begin a timed vibration (because TalkBack doesn't go through pointer
        // events, and the isDraggingProperties will fire one after another immediately)
        view.leg.addInputListener( {
          down: event => {
            vibrationManager.vibrateAtFrequencyForever( 25 );

            const pointerListener = {
              up: event => {
                vibrationManager.stop();
                event.pointer.removeInputListener( pointerListener );
              }
            };
            event.pointer.addInputListener( pointerListener );
          },
          change: event => {
            vibrationManager.vibrateAtFrequency( 1, 25 );
          }
        } );

        view.arm.addInputListener( {
          down: event => {
            vibrationManager.vibrateAtFrequencyForever( 50 );

            const pointerListener = {
              up: event => {
                vibrationManager.stop();
                event.pointer.removeInputListener( pointerListener );
              }
            };
            event.pointer.addInputListener( pointerListener );
          },
          change: event => {
            vibrationManager.vibrateAtFrequency( 1, 50 );
          }
        } );
    }

    // Vibration indicates charge entering the body while dragging the leg
    if ( paradigmChoice === 'interaction-changes' ) {
        Property.multilink( [ model.leg.isDraggingProperty, model.shoeOnCarpetProperty ], ( isDragging, shoeOnCarpet ) => {
          if ( isDragging && shoeOnCarpet ) {
            vibrationManager.vibrateForever();
          }
          else {
            vibrationManager.stop();
          }
        } );

        // in response to a "change" event, begin a timed vibration (because TalkBack doesn't go through pointer
        // events, and the isDraggingProperties will fire one after another immediately)
        view.leg.addInputListener( {
          change: event => {
            if ( model.shoeOnCarpetProperty.get() ) {
              vibrationManager.vibrate( 1 );
            }
          }
        } );
    }

    // Vibration feedback to indicate changes in charge
    if ( paradigmChoice === 'result' ) {
        let isRunningPattern = false;

        model.dischargeStartedEmitter.addListener( () => {
          vibrationManager.vibrateWithCustomPatternForever( CHARGES_LEAVING_PATTERN );
          isRunningPattern = true;
        } );
        model.dischargeEndedEmitter.addListener( () => {
          vibrationManager.stop();
          isRunningPattern = false;
        } );

        // for as long as there are charges in the body, vibrate forever - in step function because we want to
        // start vibration again after we may have stopped it from dischargeEndedEmitter
        model.stepEmitter.addListener( () => {

          // only initiate vibration if we haven't already initiated one
          if ( !isRunningPattern && model.electrons.length > 0 ) {
            vibrationManager.vibrateAtFrequencyForever( 5 );
            isRunningPattern = true;
          }
          else if ( model.electrons.length === 0 ) {

            // stop vibration if we have no more charges without discharge (like on reset)
            vibrationManager.stop();
            isRunningPattern = false;
          }
        } );
    }
  }
}

// create and register the singleton instance
const vibrationController = new VibrationController();
johnTravoltage.register( 'vibrationController', vibrationController );
export default vibrationController;