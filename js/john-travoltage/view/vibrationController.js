// Copyright 2019-2021, University of Colorado Boulder

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
import stepTimer from '../../../../axon/js/Timer.js'; // eslint-disable-line default-import-match-filename
import johnTravoltage from '../../johnTravoltage.js';

// constants
// vibration pattern during electron discharge, on/off intervals in seconds
const CHARGES_LEAVING_PATTERN = [ 0.100, 0.070, 0.050, 0.050 ];

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
    if ( paradigmChoice === '1' ) {
      const runningDischargePatternProperty = new BooleanProperty( false );

      // counts of charges, to determine the correct vibration pattern
      let currentCharge = 0;
      let previousCharge = 0;

      let vibratingFromChargePickup = false;
      let timeSpentVibrationFromChargePickup = 0;

      // amount of time to vibrate per electron charge pickup
      const vibrationTimePerCharge = 0.075;

      // vibrate every time we pickup a charge from the body - but if we pick up lots of charges
      // rapidly, we restart the timer and vibrate for at least as long as vibrationTimePerCharge,
      // the result is continuous vibration for as long as charges are entering the body
      model.stepEmitter.addListener( dt => {
        currentCharge = model.electronGroup.count;

        if ( vibratingFromChargePickup ) {
          timeSpentVibrationFromChargePickup += dt;

          // we have vibrated for long eough for the charges that have been picked up
          if ( timeSpentVibrationFromChargePickup > vibrationTimePerCharge ) {

            // this stop will put a hold on both
            vibrationManager.stop();
            vibratingFromChargePickup = false;
          }
        }

        if ( currentCharge > previousCharge ) {

          // we have picked up a new charge, start vibrating right away or
          // continue to vibrate without resetting timer
          timeSpentVibrationFromChargePickup = 0;

          if ( !vibratingFromChargePickup ) {
            vibratingFromChargePickup = true;
            vibrationManager.vibrateContinuous();
          }
        }

        previousCharge = currentCharge;
      } );

      model.dischargeStartedEmitter.addListener( () => {
        vibrationManager.vibrateContinuous( {
          pattern: CHARGES_LEAVING_PATTERN
        } );

        runningDischargePatternProperty.set( true );
      } );
      model.dischargeEndedEmitter.addListener( () => {
        vibrationManager.stop();
        runningDischargePatternProperty.set( false );
      } );

      model.resetEmitter.addListener( () => {

        // stop vibration if we lost charges (such as from reset all, since
        // the dischargeEndedEmitter will have its own vibration)
        vibrationManager.stop();

        // request three quick transient vibrations upon reset - if we like this we should
        // consider a way to queue these requests with timing rather than using a timeout
        const resetVibrationInterval = 150; // ms
        vibrationManager.vibrateTransient();
        stepTimer.setTimeout( () => {
          vibrationManager.vibrateTransient();

          stepTimer.setTimeout( () => {
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