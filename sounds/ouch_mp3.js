/* eslint-disable */
import simLauncher from '../../joist/js/simLauncher.js';
import base64SoundToByteArray from '../../chipper/js/grunt/base64SoundToByteArray.js';
import WrappedAudioBuffer from '../../chipper/js/grunt/WrappedAudioBuffer.js';
import phetAudioContext from '../../tambo/js/phetAudioContext.js';

const soundURI = 'data:audio/mpeg;base64,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RJ9waIT/+zDEcYDGoKlqgwTO2NqOrZDBpdvaaB8lDKIkrlq8+hCO45tBFjuQAwoBAtz0eJiyCpGcSWjqNm3RWdV5xp9W9/vo12t0RDj+NIBoNEY+ckacWURk0svUGKT31dBIeVq1Yo0FJkMlzUUWS39d6aE5IX/KQUCEntaLTdN62y1kgROAQHs2WQkpWc1UcXIz63hxDLGzLlGTU/6iawn/+zLEfwBHCHFvYDzA2NoT7VCQmgt5TKSJJfJ6LFlHIKBklTZY82t10etqxgiDcskZBIkWIZJApAgTYfK3d3Wyaj+uiDxMLjpqJKKYFYjkdmoqJs5MgY3C7wsFAEa2LTvWfVRUGsssaIECgXcLhSzQFiAMI0mno1RsRCTpHkxmHUQp5+FDUd24e40D4mSdFaXTH17OSnAkl2yTVojB//syxIuABrSLaoAko1jhFK4sko5SJMPKobH56VSyKGA4WJOGmOZh9Ds17jZjCKWz/s0g/3SwVSK2HxpX55NN1b99JX/tSqoZVpxAAImAWSDowxUT0RBHckIb+/aMcAkziw9TUcQwqSIyUtCy50k9uKmHFjIKmxrMN0Uyts7Y5PtWJI02SABbAprUgrJRYKqCwwtLhRN4oGj+hsh9WP/7MsSYgIcoeWlmBM6Q2o7skAMgMoqAUEIh61hNoakWSRhAc1oxE9i0jkXyyb9Yib6KDbSiAAAtAVRjckhTUamqxwYO4lHuagOf//9oBjiyIdgYMlQmSStblhonWMLS4TUVO9s28HUGEkWU2ZYWrlXApP0iXFJNKMBNaElCtZQNbU87+84l5bX8sdQMNg5NFclt+PwuZfxNFm+7T/f/+zDEpICGcG9nYCRhkNsMLHAWGBre3lKttP/cXKoQYAABVHAwq+upRv9lhr2Gp1QuStILOJb/hxIBKJVVPJpHZlknyJLPRKsFVHvK+zv5YGg6Jv9QEBppppqqHLBQMSqDBKoNVXTSBqvpp//Slaaqqqq7b+qmm3//8qpp///+0//Kq6bf/P/9VUxBTUUzLjk5LjNVVVVVVVVVVVX/+zLEsoAHPH1VYBkAgOKLavAGCBpVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//syxL0Ah2BJS4AwwJDhC+gkBJgzVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7MsTHAIbUdyThpNQQzgBUCBCMA1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
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