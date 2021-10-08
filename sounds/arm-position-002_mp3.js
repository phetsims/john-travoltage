/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAABt0BTfQRABkTJa7DAKAAqZAJhwVYAAAAByAAHrkS/oRjnOfnp6nPP6ndAM7oQhMjf/9SEbOfn//5DneQn+c7oBgY+AIwEfzDCU2Xuz8od84eEj3ATJLqBCvbMlzUWaTR6/PzCAkShpclLmoUYYvJ3mLPOFgVEMeVHRkE1nN2NRx+erH/iSStR/jIungAiIdTTm1QG0tX//syxAWACFj/fdy1ABEXnzK8JJ13//fcl9jpJxEAiOVxZIJKWGKazVpXcxLc4JSHJpnP+UJig+fsdo/ppsg+fZ3b9q9un3ViAsZij6oAAiomFeyQNsAb/BIr0kwuGiBsmovOssnEcG0pQvUnwfOWXdF2qBMYtY002h5jP///W+7ojKiobOLO23fXVXvctpDRRWXd2l5r0Z0dfYqnBP/7MsQFAAiEgWQAMYlBA4/s8GYNKuHsYCUQE8FuKrDSMGyGCooGR6oXLmnjlg9R3aQ47qSoglmISjHwWHH3ayKQ2CbCrAVYFXAH8nNxqhC7dtoymVaBq2XkVaLsASL4ERQfIZwTXZzs11rF16tlNUDiDoQCb+ATL+qATaqGcHVhJ+SK4ldeSKqCQd/hQ84Ok+MON4Rez5/7+aRNp+L/+zLEBoAIaK9CgJhpiROg5CwQmXCJEiSXanmZ7VNUqJDARszBRIYUxszBRKAQEGIMBMaqV6ArlG/zomUGi/KShFXf//FyigqooqKojlWRUBT5rOzXD11zTrxCMKEI1Hsds53yrmcOJTP3+ZejUa3///vJyUtlSRyjQkjVPOf///85I1RGAZOeaRI6bMkXesYqAGjYJP5Zwsn8z/to//swxAYCiGki9oCIa8EFpBZIAS1xaXM6tqY34V4zMKNf9VjNdjYUf9AQFfZqGZjUmAjDATNVZyJjXuwEsAjoCVWgKNQEBKsx6oBGGUkP/9P6KvsYoaH1f//////TmqKPq/2uh//bUofV+1yKqB9Y8TR3AkikLhvHwvMly0dw8mJovX3Tomr/mI/tqRSgrUxBTUUzLjk5LjVVVVVV//syxAcDwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==';
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