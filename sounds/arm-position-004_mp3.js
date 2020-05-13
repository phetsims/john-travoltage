/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../chipper/js/grunt/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../chipper/js/grunt/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAB1UJS5QSgAkDoy7DANAAAAAGlKgAZ//8j8jUnfRv+d0O/Oc6HOc/+QhP3oRpCE1PnOf9P876EI3OdBAOCgmAAEFFExcfmP6Hnz9u8+r76VXWigggUzAqChN6lA9L0HWmyalnDajki+9TEupBHMBGDYx6y09drOggybV6a2H1HrrmxYndb/Kikx12hZu7u6p2bxSFzCK0//syxAWACPj7j/2FABD+HzJ0EZ12sdfjsYv/E7Nt3qapgssxJWMe7j0mNONIp6ns5Ynf1TTlAnjX//nFBaeY3//5pv///6qY+SoBSLUmeIiwa/AH/usbbSUAZf2BK9DPESgYIEAKAE7nEzT6CGIVn5wQFz20ap6GTG36N//85DDd2qt91b7c7qPOoJBR8eyhwxUAAD6ytJNFQDYIlP/7MsQFgAjtJYmgJEvxBySt8DQJfgKXIiyJcM4suWAUqGR2a08+K/yLTQ5LN+RzxhgYUFKhiqv8SVXv1/Ku4WYxjHSxSX/+nVpZSzJy19DKYTNtv7o1UQyGsNdVYwYekgpNFRUfJhysNNGDGt/XhZUV/7jqGv9SsY2ZX/VTPp9DPQ2rGeyOUzl6/+qP/tevM/2QYyoAACO0ftVb6qj/+zLEBIAIwQs8gBiriMcOJbwQiSrUedTbJGW3K/7kcpwUPB4PB4AhYsRNlQxSiJqPmMhSsYxvMZ/5jTGVlKhjG/+IuUqlFREOsVjUFoK9FF8JAAirREQkmkAMP4SIykwrEIQpz8v0epSlCisKAkcsNSGgaLCUNA0HYi2fy2twK//I/lr//5lL/ylhaqvMzM1TzPfP9NVW1X/anyqJ//swxAyCiEkc6gAIy4i6IJgkAJ11TXavJFWCgEtE7afWBgEFJeSOz+5pGQUklv5pEFCXw4BBVU4Kk8tRZECAKoP/8z//////////VEW7OaPCkTjhNnmjw6VMdrOaci7sNgegSEAjkC6qKu3+SkxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//syxBeDwAABpAAAACAAADSAAAAEqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==';
const soundByteArray = base64SoundToByteArray( phetAudioContext, soundURI );
const unlock = simLauncher.createLock( soundURI );
const wrappedAudioBuffer = new WrappedAudioBuffer();
const onDecodeSuccess = decodedAudio => {
  wrappedAudioBuffer.audioBuffer = decodedAudio;
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
const onDecodeError = decodeError => {
  console.warn( 'decode of audio data failed, using stubbed sound, error: ' + decodeError );
  wrappedAudioBuffer.audioBuffer = phetAudioContext.createBuffer( 1, 0, phetAudioContext.sampleRate );
  wrappedAudioBuffer.loadedProperty.set( true );
  unlock();
};
phetAudioContext.decodeAudioData( soundByteArray.buffer, onDecodeSuccess, onDecodeError );
export default wrappedAudioBuffer;