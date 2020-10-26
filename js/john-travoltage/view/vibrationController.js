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

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import LinearFunction from '../../../../dot/js/LinearFunction.js';
import johnTravoltage from '../../johnTravoltage.js';
import JohnTravoltageModel from '../model/JohnTravoltageModel.js';

// constants
// vibration pattern during electron discharge, on/off intervals in seconds
const CHARGES_LEAVING_PATTERN = [ .100, .070, 0.050, 0.050 ];

class VibrationController {
  constructor() {}

  /**
   * @public
   * @param {JohnTravoltageModel} model
   * @param {JohnTravoltageView} view
   * @param {VibrationManageriOS} vibrationManager
   */
  initialize( model, view, vibrationManager ) {

    // vibration selection can either be one of the general ones in initialize-globals, or
    // a sim specific one for john-travoltage
    const paradigmChoice = phet.chipper.queryParameters.vibrationParadigm;

    // A sim specific design - different from the other classified paradigms.
    if ( paradigmChoice === 1 ) {

      // flag to indicate that we are currently vibrating with a pattern to indicate
      // that there are charges currently in the body - if this is true, do not
      // start with this vibration
      let runningChargeHoldPattern = false;

      // linear function for the pattern that plays while charges are within the body - as the body
      // picks up charge, the on/off pattern will become faster
      const chargeHoldVibrationIntervalFunction = new LinearFunction( 0, JohnTravoltageModel.MAX_ELECTRONS, 0.2, 0.025, true );

      // if the inverval determined by the above function changes, we will request a new
      // vibration pattern, but variable required since this is driven with polling rather
      // than a Property
      let lastChargeHoldInterval = 0.2;

      const runningDischargePatternProperty = new BooleanProperty( false );

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
      const vibrationTimePerCharge = 0.25;

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
            vibrationManager.vibrateContinuous( {

              // lower intensity requested for charge pickup vibration
              intensity: 0.75
            } );
          }
        }

        previousCharge = currentCharge;

        if ( !vibratingFromChargePickup && timeSpentWaitingAfterChargeAdded > delayAfterAddingCharge ) {
          if ( currentCharge > 0 ) {

            // there are some charges on the body, vibrate with a constant pattern
            // to represent this - start this vibration when we are not vibrating due to
            // discharge, or whenever the number of charges on the body has changed
            const chargeInterval = chargeHoldVibrationIntervalFunction( currentCharge );
            if ( !runningDischargePatternProperty.get() && ( !runningChargeHoldPattern || lastChargeHoldInterval !== chargeInterval ) ) {
              const newPattern = [ chargeInterval, chargeInterval ];

              vibrationManager.vibrateWithCustomPatternForever( newPattern );
              runningChargeHoldPattern = true;

              lastChargeHoldInterval = chargeInterval;
            }
          }
        }
      } );

      model.dischargeStartedEmitter.addListener( () => {
        vibrationManager.vibrateContinuous( {
          pattern: CHARGES_LEAVING_PATTERN
        } );

        // prevent us from starting the 'hold' pattern while we are doing discharge
        runningChargeHoldPattern = true;

        runningDischargePatternProperty.set( true );
      } );
      model.dischargeEndedEmitter.addListener( () => {
        vibrationManager.stop();

        // we can start the 'hold' pattern again, if discharge didn't get rid of all electrons
        runningChargeHoldPattern = false;

        runningDischargePatternProperty.set( false );
      } );

      model.resetEmitter.addListener( () => {

        // stop vibration if we lost charges (such as from reset all, since
        // the dischargeEndedEmitter will have its own vibration)
        vibrationManager.stop();
        runningChargeHoldPattern = false;

        // request three quick transient vibrations upon reset - if we like this we should
        // consider a way to queue these requests with timing rather than using a timeout
        const resetVibrationInterval = 150; // ms
        vibrationManager.vibrateTransient();
        window.setTimeout( () => {
          vibrationManager.vibrateTransient();

          window.setTimeout( () => {
            vibrationManager.vibrateTransient();
          }, resetVibrationInterval );
        }, resetVibrationInterval );
      } );
    }
  }
}

// create and register the singleton instance
const vibrationController = new VibrationController();
johnTravoltage.register( 'vibrationController', vibrationController );
export default vibrationController;