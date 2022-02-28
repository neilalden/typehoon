import React, {useEffect} from 'react';
import {NativeRouter, Route, Routes, Link} from 'react-router-native';
import StartPage from './src/components/StartPage';
import Register from './src/components/Register';
import Home from './src/components/HomePage';
import AuthContextProvider from './src/context/AuthContext';
import PushNotification from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';

const App = () => {
  useEffect(() => {
    PushNotification.createChannel({
      channelId: 'channel-id', // (required)
      channelName: 'My channel', // (required)
      channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
      playSound: true, // (optional) default: true
      soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
    });
    // const unsubscribe = messaging().onMessage(async remoteMessage => {
    //   PushNotification.localNotification({
    //     channelId: 'channel-id',
    //     message: remoteMessage.notification.body,
    //     title: remoteMessage.notification.title,
    //     bigPictureUrl: remoteMessage.notification.android.imageUrl,
    //     smallIcon: remoteMessage.notification.android.imageUrl,
    //     vibrate: true, // (optional) default: true
    //     vibration: 300,
    //   });
    // });
    // return unsubscribe;
  }, []);
  return (
    <NativeRouter>
      <AuthContextProvider>
        <Routes>
          <Route exact path="/" element={<StartPage />} />
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/home" element={<Home />} />
        </Routes>
      </AuthContextProvider>
    </NativeRouter>
  );
};

export default App;
