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
import JohnTravoltageQueryParameters from '../JohnTravoltageQueryParameters.js';

// constants
const CHARGES_LEAVING_PATTERN = [ 200, 100 ];

class VibrationController {
  constructor() {}

  /**
   * @public
   * @param {JohnTravoltageModel} model
   * @param {JohnTravoltageView} view
   */
  initialize( model, view, vibrationManager ) {

    // vibration selection can either be one of the general ones in initialize-globals, or
    // a sim specific one for john-travoltage
    const paradigmChoice = phet.chipper.queryParameters.vibration || JohnTravoltageQueryParameters.simVibration;

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
        if ( !isRunningPattern && model.electronGroup.count > 0 ) {
          vibrationManager.vibrateAtFrequencyForever( 5 );
          isRunningPattern = true;
        }
        else if ( model.electronGroup.count === 0 ) {

          // stop vibration if we have no more charges without discharge (like on reset)
          vibrationManager.stop();
          isRunningPattern = false;
        }
      } );
    }

    // A sim specific design - different from the other classified paradigms.
    if ( paradigmChoice === 'prototypeDesign1' ) {

      // flag to indicate that we are currently vibrating with a pattern to indicate
      // that there are charges currently in the body - if this is true, do not
      // start with this vibration
      let runningChargeHoldPattern = false;

      // vibration pattern for when charges are held in the body, 100 ms on, 1000 ms off
      const chargesHeldPattern = [ 0.1, 1 ];

      // in ms, how long to wait to start the chargesHeldPattern after we have
      // picked up a new charge
      const delayAfterAddingCharge = 1; // in seconds
      let timeSpentWaitingAfterChargeAdded = 0;

      // counts of charges, to determine the correct vibration pattern
      let currentCharge = 0;
      let previousCharge = 0;

      let vibratingFromChargePickup = false;
      let timeSpentVibrating = 0;

      // amount of time to vibrate per electron charge pickup
      const vibrationTimePerCharge = 0.1;

      // for as long as there are charges in the body, vibrate forever - in step function because we want to
      // start vibration again after we may have stopped it from dischargeEndedEmitter
      model.stepEmitter.addListener( dt => {
        currentCharge = model.electronGroup.count;

        if ( vibratingFromChargePickup ) {
          timeSpentVibrating += dt;

          // we have vibrated for long eough for the charges that have been picked up
          if ( timeSpentVibrating > vibrationTimePerCharge ) {

            // this stop will put a hold on both
            vibrationManager.stop();
            vibratingFromChargePickup = false;
            runningChargeHoldPattern = false;
          }
        }
        else {
          timeSpentWaitingAfterChargeAdded += dt;
        }

        if ( currentCharge > previousCharge ) {

          // we have picked up a new charge, start vibrating right away or
          // continue to vibrate without resetting timer
          timeSpentVibrating = 0;

          // reset delay between charge pickup vibration and body charge vibration
          timeSpentWaitingAfterChargeAdded = 0;

          if ( !vibratingFromChargePickup ) {
            vibratingFromChargePickup = true;
            vibrationManager.vibrateForever();
          }
        }

        previousCharge = currentCharge;

        if ( !vibratingFromChargePickup && timeSpentWaitingAfterChargeAdded > delayAfterAddingCharge ) {
          if ( currentCharge > 0 ) {

            // there are some charges on the body, vibrate with a constant pattern
            // to represent this
            if ( !runningChargeHoldPattern ) {
              vibrationManager.vibrateWithCustomPatternForever( chargesHeldPattern );
              runningChargeHoldPattern = true;
            }
          }
          else {

            // stop vibration if we lost charges (such as from reset all, since
            // the dischargeEndedEmitter will have its own vibration)
            vibrationManager.stop();
            runningChargeHoldPattern = false;
          }
        }
      } );

      model.dischargeStartedEmitter.addListener( () => {
        vibrationManager.vibrateWithCustomPatternForever( CHARGES_LEAVING_PATTERN );

        // prevent us from starting the 'hold' pattern while we are doing discharge
        runningChargeHoldPattern = true;
      } );
      model.dischargeEndedEmitter.addListener( () => {
        vibrationManager.stop();
        runningChargeHoldPattern = true;
      } );
    }
  }
}

// create and register the singleton instance
const vibrationController = new VibrationController();
johnTravoltage.register( 'vibrationController', vibrationController );
export default vibrationController;