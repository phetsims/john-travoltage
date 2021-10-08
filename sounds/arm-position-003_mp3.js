/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB2kFS7QCgAj+ou8DAtAAAAAAqTgAADGQmc7t6nf9CE/5yEb/0ISpCdCNIQjKc7kD4fPk/1OdDnf5yMp0EA4KCYAAQUUPPzeIzPn//5fR70XRR6CDU0l+m7OYLECHiVLWBSrUkaJpptzD5j7JqcwNNbopJ9iIq9SkU6y+6DKXrLlv1FhfdN0PmjtWqszNuYZqk20YEbZ1//syxAYACLy9l/z1ADD6jzG0EyUu/m/aiLUYBArUqZa7SsQcYfCqhdzSiq3aa39+wTBs7/t94tIdnOv/+exgqsDLhKFCCz2tZDkQaO/uKWi222WJJkkBX3kzPetlkAhE9NjIQpCCTlFFQuCDHT/xA7qSYHzKrO3OdU4MFBhUOi4juZ8RBUj3+p5ZBqUh2thttKSiC1LgCAn9wwkTtf/7MsQHgAlZBX2hJEuZER5r9BMVckQxoixERH03Rdkc9illz5SW24xj6/qpgyHEjI8xukpXM5mt0ft9DG/ZP9bymFCQESzOVygLDG/oRgoKNktw9ZRICIdF1RSDqOFkVA2PxMnJUlSWs8uRUbmy1ef/DoqowPHYzqU3oaylEWMYztEjaGfsJB4xv//+UClLLc3DQFdrtAArbaAARRf/+zLEBAJH+L81gIjJgRkiIMABIXH/TTVpnUKrG1KYCC/Zlktl8Z5mK/7HEt00Janyq3///95aZbZOJJG7ziThr/iJYaDQNVgqGuWHq+Zv+rfZStKUBAWVBYWvjZrKFrJVWKGmqjLDEipqm5NNtJqkiocgpBsPJNZmbaRU1hpsMtX6m5N00wLWSiAqAWD45hYeSw4AAVgA+EU+HO8K//swxAUDCE0g3QAEy4jYpFUMAJ14LkLhD/X/bZ/7Vv+Tlf/+fONVTJtUcS3vlNs/1T/1VV3NROJUDBVU8zM/tpGTkq31pGTrglVHEtigIhyAf////877CRL////VF/VHZ2ONKFD22OHShQ9M0bBCEQgEcaE2djjVRdFOHSpj2OGojCt6TEFNRTMuOTkuNaqqqqqqqqqqqqqqqqqq//syxAwDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
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