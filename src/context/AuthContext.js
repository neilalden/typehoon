import React, {useState, createContext, useEffect} from 'react';
import {Alert} from 'react-native';
import {useNavigate} from 'react-router-native';
import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '272703103850-sqqd39goa1q6fe8tcv19nqm4sap9t5qk.apps.googleusercontent.com',
});

export const AuthContext = createContext();

const AuthContextProvider = props => {
  const [user, setUser] = useState({});
  const [reload, setReload] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [reload]);

  const onAuthStateChanged = user => {
    setUser(user);
    history('/');
  };

  return (
    <AuthContext.Provider value={{user, setUser, setReload}}>
      {props.children}
    </AuthContext.Provider>
  );
};

export async function onGoogleButtonPress() {
  try {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return auth().signInWithCredential(googleCredential);
  } catch (e) {
    console.log(e.code);
    alert(`${e}`);
  }
}
export const signOut = () => {
  auth()
    .signOut()
    .then(async function () {
      await GoogleSignin.revokeAccess();
    })
    .catch(err => alert(`${err}`));
};

const alert = (msg, title = 'Alert') => {
  Alert.alert(`${title ? title : 'Alert'}`, `${msg ? msg : ''}`, [
    {text: 'OK', onPress: () => true},
  ]);
};
export default AuthContextProvider;
