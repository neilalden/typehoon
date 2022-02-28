import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import TitleText from './TitleText';
import BodyText from './BodyText';
import firestore from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';
import {AuthContext} from '../context/AuthContext';
const HomePage = () => {
  const {user} = useContext(AuthContext);
  const [typhoon, setTyphoon] = useState({});
  const [evac, setEvac] = useState(false);
  const [hasRequestedEvac, setHasRequestedEvac] = useState(false);
  const [hasRequestedImmediateEvac, setHasRequestedImmediateEvac] =
    useState(false);
  useEffect(() => {
    firestore()
      .collection('typhoons')
      .where('landfall', '>=', lastweek())
      .where('landfall', '<=', new Date())
      .orderBy('landfall', 'desc')
      .limit(1)
      .onSnapshot(querySnapshot => {
        querySnapshot.forEach(doc => {
          if (doc.data().name !== typhoon.name) {
            PushNotification.localNotification({
              channelId: 'channel-id',
              message: `Signal number ${doc.data().signal_number} typhoon ${
                doc.data().name
              } has made landfall`,
              title: `⚠️ TYPHOON WARNING ⚠️`,
              vibrate: true, // (optional) default: true
              vibration: 300,
            });
          }
          setTyphoon({
            id: doc.id,
            name: doc.data().name,
            immediate_evacuation: doc.data().immediate_evacuation,
            signal_number: doc.data().signal_number,
            evac_list: doc.data().to_evacuate,
            immediate_evac_list: doc.data().to_immediate_evacuate,
          });
          for (const i in doc.data().to_immediate_evacuate) {
            if (doc.data().to_immediate_evacuate[i] == user.uid) {
              setHasRequestedImmediateEvac(true);
              setEvac(true);
              return;
            }
          }
          for (const i in doc.data().to_evacuate) {
            if (doc.data().to_evacuate[i] == user.uid) {
              setHasRequestedEvac(true);
              setEvac(true);
              return;
            }
          }
          setHasRequestedImmediateEvac(false);
          setHasRequestedEvac(false);
          setEvac(false);
        });
      });

    BackHandler.addEventListener('hardwareBackPress', () => {
      alert('CLOSE THE APP?', 'EXIT');
      return true;
    });
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  }, []);

  return (
    <>
      <View style={styles.center}>
        <TitleText>TYPE-HOON</TitleText>

        {hasRequestedImmediateEvac ? (
          <View>
            <BodyText
              customStyles={{
                fontSize: 32,
                color: 'crimson',
                textAlign: 'center',
              }}>
              You will be evacuated immediately
            </BodyText>
          </View>
        ) : (
          hasRequestedEvac && (
            <View>
              <BodyText
                customStyles={{
                  fontSize: 32,
                  color: 'crimson',
                  textAlign: 'center',
                }}>
                You will be evacuated when necessary
              </BodyText>
            </View>
          )
        )}
      </View>
      {Object.keys(typhoon).length > 0 ? (
        <Typhoon
          typhoon={typhoon}
          user={user}
          evac={evac}
          setEvac={setEvac}
          hasRequestedEvac={hasRequestedEvac}
          hasRequestedImmediateEvac={hasRequestedImmediateEvac}
        />
      ) : (
        <NoTyphoon />
      )}
    </>
  );
};
const NoTyphoon = () => {
  return (
    <View style={styles.center}>
      <BodyText customStyles={styles.header1}>
        Currently no threats of typhoon
      </BodyText>
      <BodyText customStyles={styles.textCenter}>
        You will be notified when a typhoon is near
      </BodyText>
    </View>
  );
};
const Typhoon = ({
  typhoon,
  user,
  evac,
  setEvac,
  hasRequestedEvac,
  hasRequestedImmediateEvac,
}) => {
  let disabled = hasRequestedImmediateEvac;
  const handleRequestImmediateEvac = () => {
    Alert.alert('IS THIS AN EMERGENCY?', 'This cannot be cancelled', [
      {
        text: 'Yes',
        onPress: () => {
          firestore()
            .collection('typhoons')
            .doc(typhoon.id)
            .update({
              to_evacuate: firestore.FieldValue.arrayRemove(user.uid),
            })
            .then(() => {
              firestore()
                .collection('typhoons')
                .doc(typhoon.id)
                .update({
                  to_immediate_evacuate: firestore.FieldValue.arrayUnion(
                    user.uid,
                  ),
                });
            });
        },
      },
      {
        text: 'No',
        onPress: () => {
          true;
        },
      },
    ]);
  };
  return (
    <View style={[styles.center, {}]}>
      <BodyText customStyles={styles.header1}>
        Typhoon {typhoon.name} is near
      </BodyText>
      <BodyText customStyles={{marginTop: 20}}>
        Evacuate me when necessary
      </BodyText>
      <View
        style={{
          flex: 1,
          marginHorizontal: 20,
        }}>
        <ToggleComponent
          isTrue={evac}
          setIstrue={setEvac}
          typhoon={typhoon}
          user={user}
          disabled={disabled}
        />
      </View>
      {(evac || hasRequestedEvac || hasRequestedImmediateEvac) && (
        <TouchableOpacity
          onPress={handleRequestImmediateEvac}
          disabled={hasRequestedImmediateEvac}>
          <BodyText
            customStyles={[
              hasRequestedImmediateEvac && {color: '#ccc'},
              {
                textDecorationLine: 'underline',
                marginVertical: 20,
              },
            ]}>
            Request immediate evacuation?
          </BodyText>
        </TouchableOpacity>
      )}
    </View>
  );
};
const ToggleComponent = ({isTrue, setIstrue, typhoon, user, disabled}) => {
  const handleRequestEvac = () => {
    firestore()
      .collection('typhoons')
      .doc(typhoon.id)
      .update({
        to_evacuate: firestore.FieldValue.arrayUnion(user.uid),
      });
  };
  const handleCancelRequest = () => {
    firestore()
      .collection('typhoons')
      .doc(typhoon.id)
      .update({
        to_evacuate: firestore.FieldValue.arrayRemove(user.uid),
      });
  };
  return (
    <View style={[styles.toggleContainer, disabled && {borderColor: '#ccc'}]}>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.toggleItem,
          isTrue && styles.toggleItemIsActive,
          disabled && {backgroundColor: '#ccc'},
        ]}
        onPress={() => {
          setIstrue(true);
          handleRequestEvac();
        }}>
        <BodyText customStyles={isTrue && {color: '#ffffff'}}>YES</BodyText>
      </TouchableOpacity>
      <TouchableOpacity
        disabled={disabled}
        style={[
          styles.toggleItem,
          !isTrue && styles.toggleItemIsActive,
          disabled && {backgroundColor: '#ccc'},
        ]}
        onPress={() => {
          setIstrue(false);
          handleCancelRequest();
        }}>
        <BodyText customStyles={!isTrue && {color: '#ffffff'}}>NO</BodyText>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header1: {
    fontSize: 32,
    color: '#000000',

    textAlign: 'center',
  },
  textCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderWidth: 3,
    borderRadius: 5,
    borderColor: '#666666',
    marginBottom: 20,
  },
  toggleItem: {
    width: '50%',
    paddingHorizontal: '20%',
  },
  toggleItemIsActive: {
    backgroundColor: '#666666',
  },
});
function lastweek() {
  var today = new Date();
  var lastweek = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7,
  );
  return lastweek;
}

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
export default HomePage;
