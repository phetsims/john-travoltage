// Copyright 2018, University of Colorado Boulder

/**
 * Controls vibration in john-travoltage through use of tappi's vibrationManager. There are three paradigms
 * for design that are being explored, all are implemented in this file.
 *
 * Singleton class as one instance controls all vibration in the simulation.
 *
 * 1) Objects - Haptic feedback is used to indicate to a user where objects are in the scene.
 * 2) Interaction - Haptic feedback is used to indicate successful user interaction.
 * 3) State - Haptic feedback is used to indicate current state of sim objects.
 *
 * Each implemented below, selected by query parameter.
 *
 * @author Jesse Greenberg
 */
define( require => {
  'use strict';

  // modules
  const johnTravoltage = require( 'JOHN_TRAVOLTAGE/johnTravoltage' );
  const vibrationManager = require( 'TAPPI/vibrationManager' );
  const VibrationPatterns = require( 'TAPPI/VibrationPatterns' );

  class VibrationController {
    constructor() {}

    /**
     * @param {JohnTravoltageModel} model
     */
    initialize( model ) {
      const paradigmChoice = phet.chipper.queryParameters.vibration;

      if ( paradigmChoice === 'objects' ) {

        // Important model objects give the user feedback while they are touching/interacting with them. This makes
        // objects seem distinct and "physical". Each object has a different pattern so it feels unique.
        model.leg.dragStartedEmitter.addListener( () => {
          vibrationManager.startTimedVibrate( 250, VibrationPatterns.HZ_10 );
        } );

        model.arm.dragStartedEmitter.addListener( () => {
          vibrationManager.startTimedVibrate( 250, VibrationPatterns.HZ_25 );
        } );

        model.touchingBodyProperty.link( ( touchingBody ) => {
          if ( touchingBody ) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_5 );
          }
          else {
            vibrationManager.stopVibrate();
          }
        } );
      }
    }
  }

  // create and register the singleton instance
  const vibrationController = new VibrationController();
  return johnTravoltage.register( 'vibrationController', vibrationController );
} );
