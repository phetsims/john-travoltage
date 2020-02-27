// Copyright 2019, University of Colorado Boulder

/**
 * Uses the Web Speech API to speak an utterance in response to various feedback in john-travotlage.
 * This file has limited functionality and is only intended to be used in support of experimental haptic
 * feedback. Some haptic feedback will not work while a screen reader is in use. This generally just
 * announces what is under the finger.
 *
 * @author Jesse Greenberg
 */

import johnTravoltage from '../../johnTravoltage.js';

class SpeechController {
  constructor() {

    // @private {JohnTravoltageModel|null} - null until initialized
    this.model = null;

    // @private {null|SpeechSynthesis} - null until initialized and
    this.synth = null;
  }

  /**
   * Initialize the singleton instance.
   *
   * @param {JohnTravoltageModel} model
   */
  initialize( model ) {
    this.model = model;
    this.synth = window.speechSynthesis;

    if ( !this.synth ) {
      console.warn( 'Sorry, speech synthesis is not supported on your platform.' );
      return;
    }

    this.addSpeechListener( this.model.touchingBodyProperty, 'John\'s Body' );
    this.addSpeechListener( this.model.touchingCarpetProperty, 'Rug' );
    this.addSpeechListener( this.model.touchingArmProperty, 'John\'s Arm' );
    this.addSpeechListener( this.model.touchingLegProperty, 'John\'s Leg' );

    model.utteranceAddedEmitter.addListener( content => {
      this.speak( content );
    } );
  }

  /**
   * Attach a listener so that whenever the Property value is true, we speak the provided string.
   *
   * @param {BooleanProperty} property
   * @param {String} string
   */
  addSpeechListener( property, string ) {
    property.link( value => {
      if ( value ) {
        this.speak( string );
      }
    } );
  }

  /**
   * Use speech synthesis to say a string.
   *
   * @private
   * @param   {String} string
   */
  speak( string ) {
    // don't queue any utterances for now
    this.synth.cancel();

    const utterThis = new SpeechSynthesisUtterance( string );
    this.synth.speak( utterThis );
  }
}

const speechController = new SpeechController();
johnTravoltage.register( 'speechController', speechController );
export default speechController;