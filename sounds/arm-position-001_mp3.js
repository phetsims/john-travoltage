/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';
import base64SoundToByteArray from '../../tambo/js/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../tambo/js/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,//swxAAAByjJTfQRABkPpe8DALAAmQAJd1M8gCACFj/lIAOhNTvOfQn+hGX8lSE8hJCEZqvO//n/6nO6AY/n5gDIeH5vEZn///E6PgCJP0+fzfZ//68Nj4q+kEw+cwqReaqX79sLPdXF/HL70Dl1EDscrDW5daMNecrcaHJjhVJ6QY/8ubTqm33P/pFXFnv/eayqoAAtsv2AA3/6//syxASCR+i9b5wlgAEil2zABi0xZgJnb1nyUmKjmV8Mh9bO3w7ySTR0D8vP+gVFvNcufuv/v7++Iuv5aQIckkm1amtvLL1iwCbFsvS9Nn/62/ZaNx0LB+7HFGYENMSh5D0GozBMN47QekQVyaPTSOniaO8EgeS974+J/c35///vqVGy2qf9nb5/5S+GBQKiWu7r+/wB/7LG3I2AJf/7MsQEgAhM7Y+hGEuxFZqttHWJcpU/MFwUwka2HaRg41Q4l8crZhJvLff/NYze0rLMuvUtaGN1+pWBEBBWnaytzTr28BNPOnjwadCrg7Ldv9Uygm26JzmtbcIQGh5MntD8DqCcfNadtpsaPw691zFy36lL6OVAzlaUrJlqXVW/8xSplZLaKFKjRPQVcSJFXXXLOlkADDzs4CDn+Qf/+zLEBIAIkMlDgKDrgPmh5OgQjXC/68QQWkNeSrM2u0mkrSrHK5UHoOQGi3Q45x4HwuOObvXOOecazm/0UbKR9Bs1JUZln70AUOiXlVnQ6S+LmdIgACCIQp6hDqLD5Mxdhiewrh1WGpXZsKJL63VWZQtVLqq3/7Nxv/U+CgoCJWKX/VU4xkwo2El/DUBf0t7fzG1lKy+VIUShliRW//swxAcCyRUc/AAJC4j4I9vgAJlwL9f+dYb/5yrvyUYmmJFQah6OKYoFQNRUVr9mVA6FrFVVZDkVFRWli2YOg+FrYWPFrlask2Ra1gWcVEgN/8w5hXCvJ+1eZn//+vOV/3nvM4ai1VTz2q0WefRszLVJSRxJKYqZN0FCcn7JGmrexyXmLluxxIiRbZIo5QM//yL/+ahcX///iJ/4//syxAcDR/EiniAFC8DgFEfIAGUqttavk1pGjr9Ya5FTbrUGwhiUQCzGixgtUipsC1lEjTLNja2KdZQWwbDRBIO5NUkBEWFb/5lveF/mdiLMNVWW01t5JPe+tEYCgyXztrHWdLKo9N1Jt2G/Vyj0qi2OSO6wZWEt8ZBplyAjNUxBTUUzLjk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsQPA8AAAaQAAAAgAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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