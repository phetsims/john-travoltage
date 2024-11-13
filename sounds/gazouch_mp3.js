/* eslint-disable */
/* @formatter:off */

import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = asyncLoader.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();

// safe way to unlock
let unlocked = false;
const safeUnlock = () => {
  if ( !unlocked ) {
    unlock();
    unlocked = true;
  }
};

const onDecodeSuccess = decodedAudio => {
  if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
    wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
    safeUnlock();
  }
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 1, phetAudioContext.sampleRate ) );
  safeUnlock();
};
const decodePromise = phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
if ( decodePromise ) {
  decodePromise
    .then( decodedAudio => {
      if ( wrappedAudioBuffer.audioBufferProperty.value === null ) {
        wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
        safeUnlock();
      }
    } )
    .catch( e => {
      console.warn( 'promise rejection caught for audio decode, error = ' + e );
      safeUnlock();
    } );
}
export default wrappedAudioBuffer;