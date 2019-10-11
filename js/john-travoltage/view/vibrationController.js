// Copyright 2019, University of Colorado Boulder

/**
 * Controls vibration in john-travoltage through use of tappi's vibrationManager. There are three paradigms
 * for design that are being explored, all are implemented in this file.
 *
 * Singleton class as one instance controls all vibration in the simulation.
 *
 * 'objects', 'manipulation', 'interaction-changes', 'result'
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
  const vibrationManager = require( 'TAPPI/vibrationManager' );
  const VibrationPatterns = require( 'TAPPI/VibrationPatterns' );
  const Property = require( 'AXON/Property' );

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

        const patternMap = new Map();
        patternMap.set( model.touchableBodyShape, VibrationPatterns.HZ_5 );
        patternMap.set( model.carpetShape, VibrationPatterns.MOTOR_CALL );
        patternMap.set( view.arm.hitShape, VibrationPatterns.HZ_25 );
        patternMap.set( view.leg.hitShape, VibrationPatterns.HZ_10 );

        // Whenever a pointer moves over a new shape (even if it already is over an existing shape) this emitter
        // will emit an event. Get the right pattern and begin vibration for this case
        view.shapeHitDetector.hitShapeEmitter.addListener( hitShape => {
          console.log( hitShape );
          if ( patternMap.has( hitShape ) ) {
            vibrationManager.startVibrate( patternMap.get( hitShape ) );
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
