/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABw0BR5QRAAkPI+7DAIAAAAA1QLAAB//mY+jZ3fq//68+RpG6EJITyMpCNO///0JoQlQ4GLQDFujTnQ7kIxwMWgGBn/8M8AEc1XF6fN//8j0+fpx0YCb2VISVjK5eXFauJW//v+Xu4IGg3FBe/UOIzJs97FBtnI00MFRoe/E/e4pXu//g1D3aDssUDap4iIiIZVzksiAQ//syxAUACFTDifxlABEeF3I0J5U2rO7Xn2zs7RY5EcuQKcWKrqVmmHtp76OA2BVGvP3tMNoa03VSmdOO/o7hOF49YtUDJEu4P8v1PJCvAH///0UrSAG/wXkXakh9+uGaHFVziN8FASE/DQjsRul2Rqyn1c3CIwjK7fEVJyoVRpGF37IlBlCu79UXThQ81/6FNzBFwaXVt4FgfdZP1P/7MsQDgAgVB16gpUuY/pFr/BMVKLCjXq8sPsImsSenbCSL/0hr4Z6srgOC2ei6Ozmoqtrahuc753qbOaRHOqz2XRub/61aaRHnTS3J9tq8hM27sUImjoBOQhYirXNNgGARFVVVwl//IqgsYyatmfUOkFnR95noZ7IDPIXHXWSp0GgaFl+e+1w8QgqGglrV2yTAKRABAGE4mVLX++n/+zLEBwBIXLk5oIhpmRWjYuAQmXCrGAjGNVjN8bVV+gKUKX9CgICqkpMKNfZeMzM14GFexqBMN6wcd/210VN+JsJLM+KwdCx/90CKICT+L6Lnxf/6hDMNc2cNIo5TyyW4xKWSqqeZ3Gr1+52vOeZnsSJJTJpF5//7U2sS3zAMAQkiixxKu1VRqPeTUa05KlX/w+LhDFEIQthC4b5K//swxAaDCEUi7gAEy8CxpBgIAB10teZ/ojm/tU4bhxLf5miWzOMWReZ+Uk80SJVW4cDESJEjLm4cRIkUc9USIoxVWChOTP9VVG6BG4f/+qIv//2dnY4dFRQfMdnY5V/NRD2/92ONHih7Oxcag+CEQiITLOhpQfVMQU1FMy45OS41VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxBKDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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