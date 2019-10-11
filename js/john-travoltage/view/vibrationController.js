// Copyright 2019, University of Colorado Boulder

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
  const speechController = require( 'JOHN_TRAVOLTAGE/john-travoltage/view/speechController' );
  const vibrationManager = require( 'TAPPI/vibrationManager' );
  const VibrationPatterns = require( 'TAPPI/VibrationPatterns' );
  const Property = require( 'AXON/Property' );

  // constants
  const CHARGES_LEAVING_PATTERN = [ 200, 100 ];

  class VibrationController {
    constructor() {}

    /**
     * @param {JohnTravoltageModel} model
     */
    initialize( model ) {
      const paradigmChoice = phet.chipper.queryParameters.vibration;


      // Important model objects give the user feedback while they are touching/interacting with them. This makes
      // objects seem distinct and "physical". Each object has a different pattern so it feels unique.
      if ( paradigmChoice === 'objects' ) {
        model.leg.isDraggingProperty.link( isDragging => {
          if ( isDragging ) {
            vibrationManager.startTimedVibrate( 250, VibrationPatterns.HZ_10 );
          }
        } );
        model.arm.isDraggingProperty.link( isDragging => {
          if ( isDragging ) {
            vibrationManager.startTimedVibrate( 250, VibrationPatterns.HZ_25 );
          }
        } );

        // in a multilink because vibration shouldn't stop if both change simultaneously
        Property.multilink( [ model.touchingBodyProperty, model.touchingCarpetProperty ], ( touchingBody, touchingCarpet ) => {
          if ( touchingBody ) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_5 );
          }
          else if ( touchingCarpet ) {
            vibrationManager.startVibrate();
          }
          else {
            vibrationManager.stopVibrate();
          }
        } );

        // this paradigm will not work while a screen reader is in use because the device intercepts
        // pointer down gestures - instead we will use web speech to let the user know basic information about the sim
        speechController.initialize( model );
      }

      // Haptic feedback is used to convey movement of the arm and leg. Each component has a different pattern to
      // indicate difference.
      if ( paradigmChoice === 'interaction' ) {
        model.leg.isDraggingProperty.link( isDragging => {
          if ( isDragging ) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_10 );
          }
          else {
            vibrationManager.stopVibrate();
          }
        } );

        model.arm.isDraggingProperty.link( isDragging => {
          if ( isDragging ) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_25 );
          }
          else {
            vibrationManager.stopVibrate();
          }
        } );
      }

      // Vibration feedback used to convey state of charges in this sim. Vibration feedback indicates when the body
      // has charge and when charges enter/leave the body.
      if ( paradigmChoice === 'state' ) {

        // whenever charges leave the body
        model.dischargeStartedEmitter.addListener( () => vibrationManager.startVibrate( CHARGES_LEAVING_PATTERN ) );
        model.dischargeEndedEmitter.addListener( () => vibrationManager.stopVibrate() );

        // whenever the leg is dragged over the carpet and ready to pick up charge
        Property.multilink( [ model.leg.isDraggingProperty, model.shoeOnCarpetProperty ], ( isDragging, shoeOnCarpet ) => {
          if ( isDragging && shoeOnCarpet ) {
            vibrationManager.startVibrate();
          }
          else {
            vibrationManager.stopVibrate();
          }
        } );

        // if charges are removed without discharge, stop vibration
        model.electrons.addMemberCreatedListener( () => {
          if ( model.electrons.length === 0 ) {
            vibrationManager.stopVibrate();
          }
        } );

        // for as long as there are charges in the body and a vibration is currently running, initiate vibration
        model.stepEmitter.addListener( () => {
          if ( !vibrationManager.isRunningPattern() && model.electrons.length > 0 ) {
            vibrationManager.startVibrate( VibrationPatterns.HZ_5 );
          }
        } );
      }
    }
  }

  // create and register the singleton instance
  const vibrationController = new VibrationController();
  return johnTravoltage.register( 'vibrationController', vibrationController );
} );
