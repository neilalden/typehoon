/**
 * @format
 */

import {AppRegistry} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

import App from './App';
import {name as appName} from './app.json';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  PushNotification.localNotification({
    channelId: 'channel-id',
    message: remoteMessage.notification.body,
    title: remoteMessage.notification.title,
    bigPictureUrl: remoteMessage.notification.android.imageUrl,
    smallIcon: remoteMessage.notification.android.imageUrl,
    vibrate: true, // (optional) default: true
    vibration: 300,
  });
});

AppRegistry.registerComponent(appName, () => App);
