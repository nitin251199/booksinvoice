/**
 * @format
 */
 import 'react-native-gesture-handler';
import {AppRegistry, Platform} from 'react-native';
import TrackPlayer from 'react-native-track-player';

import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  onNotification: function(notification) {
    // console.log('NOTIFICATION:', notification);
  },
  requestPermissions: Platform.OS === 'ios'
});


// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => require('./service'));
