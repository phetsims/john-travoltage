/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBufferProperty.set( decodedAudio );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBufferProperty.set( phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate ) );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;