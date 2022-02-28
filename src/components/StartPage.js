import React, {useContext, useEffect} from 'react';
import {
  Alert,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import TitleText from './TitleText';
import BodyText from './BodyText';
import {useNavigate} from 'react-router-dom';
import {AuthContext, onGoogleButtonPress} from '../context/AuthContext';
import firestore from '@react-native-firebase/firestore';

const StartPage = () => {
  const navigate = useNavigate();
  const {user} = useContext(AuthContext);

  useEffect(() => {
    if (user && Object.keys(user).length > 0) {
      firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(res => {
          if (!res.data()) {
            navigate('/register');
          } else {
            navigate('/home');
          }
        })
        .catch(e => console.log(e));
    }

    BackHandler.addEventListener('hardwareBackPress', () => {
      alert('CLOSE THE APP?', 'EXIT');
      return true;
    });
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  });

  return (
    <>
      <View style={styles.center}>
        <TitleText>TYPE-HOON</TitleText>
      </View>

      <View style={styles.center}>
        <SignUp />
        <View style={{marginTop: 32}} />
      </View>
    </>
  );
};

const SignUp = () => {
  return (
    <TouchableOpacity onPress={() => onGoogleButtonPress()}>
      <BodyText customStyles={styles.signUpButton}>Sign In</BodyText>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpButton: {
    borderWidth: 3,
    height: 30,
    paddingVertical: 1,
    color: 'forestgreen',
    borderColor: 'forestgreen',
    paddingHorizontal: 75,
  },
  logInButton: {
    color: 'dodgerblue',
    borderColor: 'dodgerblue',
    paddingHorizontal: 50,
  },
});

const alert = (msg, title) => {
  Alert.alert(title, msg, [
    {text: 'Yes', onPress: () => BackHandler.exitApp()},
    {
      text: 'No',
      onPress: () => {
        true;
      },
    },
  ]);
};
export default StartPage;
