/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABtkVT/QRAAEmJW8DAtABAAAAlDNYQAAMP/xywP6E0b+nqfOc/I0md6E//5+p3+pCNnO/I05zoBiz0/5znQ50IynOgcWfo//5yQ/zBv9ll5HrTeZm8aS+pFQqKrTZOtNA4aoruspd60zy6NZmPpgR9RwoJO7KVlw9SRZS1mRSQ+upRLl9y+n+PZJM2Y98+dEVcAAAhWZp//syxAMACD0djfwlADENl280Mx0yCkiYBv/6QMTQmPJT7smndzUnGmvPzzgzJf3ROcdRTaLNd7azfY50BuRlY43p+qM/vOZc0sdVDWajfJslLbbZG0imkoBDiEmtO3cPfCEYxAvUC4j7D//J726dkAhXYrnGT+eWQ45efMOedr0MMNjVQRBiKLf8oGTQJBoEAi5/ehUH//9zJqntSf/7MsQEAAfYwWwArWmBGhit8ISJMuSQThgOC6Tj2Jwiqcs673NausvC1jYKY7SQfpdkpJqmxZz3///D7q+P6lnKSKXXmfyJlpcCkabdttIFQ9QCwNgiFmZmv2uWNJAGAE5ZMl/tCokLoZUs1te+Zyl6lKUx0MY3qoVnKUv5RLG+Z+FYxyAQ7HoK+Jd4ihUKPh2IlXUAAFiTCwiglL//+zLEBQAI5MNHwJipiP2gZAgQjXD/+iSRI4BJctErcNIzhyRqJ0yyiqGGvlZQ6wRAysY3iIFI6OX6lqX+1TGOIkUOiQoaNv/TXwv3+LMv9BTuoABg0gtHIjMJmcwo5h2TUcKE64vYUfS8KJVS6Uwz7LV/P+fV2NYYMCFHyqlAhR1SCiSZmaq2yghSxl26GPO+pQCAAFARKrGZoBMK//swxAWASFzrDKGEa4kGJB8kEI1xYVXliMIfzDEIUIWb1VdTh8ZvzYlWhRJ59VY55RgwE2vt3/VVIMKYVdmAmYCM4GfdMlOlyBRQ3xgMAAwBDFU1WKFO84mfnzcwqQt+MbMyl7MbZUKR6rFVf1VaX+s6qqWpVmPY1WyXgYCOKCAjWNV2MKArGZVjMzAQoUr/whmH/hhiiEIIYoVl//syxAaDB7kk2gAEy8DLJFPIAJV4WzleXo1H9ktac/NI41Z/3ntU52qq02vVkUa2aJJVUxX/mf3nO5oBCSM81KZbf2BkcAUYP///CRGv/8iOzsYphEaQ7OxlT9jFX+q//2MVEUnMUSGHI7Oxiq2xiiQRGiByZRITekxBTUUzLjk5LjWqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7MsQSA8AAAaQAAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo=';
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