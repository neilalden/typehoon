import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  BackHandler,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {ProgressSteps, ProgressStep} from 'react-native-progress-steps';
import BodyText from './BodyText';
import {useNavigate} from 'react-router-dom';
import firestore from '@react-native-firebase/firestore';
import {Picker} from '@react-native-picker/picker';
import {AuthContext} from '../context/AuthContext';

const Register = () => {
  let navigate = useNavigate();
  const {user} = useContext(AuthContext);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [street, setStreet] = useState('');
  const [barangay, setBarangay] = useState('');

  const [isNotAlone, setIsNotAlone] = useState(false);
  const [livesWith, setLivesWith] = useState(1);
  const [isSenior, setIsSenior] = useState(false);
  const [seniors, setSeniors] = useState(1);
  const [isPWD, setIsPWD] = useState(false);
  const [PWDs, setPWDs] = useState(1);
  const [isAnInformalSettler, setIsAnInformalSettler] = useState(false);
  const [isInFloodingArea, setIsInFloodingArea] = useState(false);
  const [isInLandslideArea, setIsInLandslideArea] = useState(false);
  const handleSubmit = () => {
    const user_data = {
      name,
      phoneNumber,
      houseNumber,
      street,
      barangay,
      isNotAlone,
      livesWith,
      isSenior,
      seniors,
      isPWD,
      PWDs,
      isAnInformalSettler,
      isInFloodingArea,
      isInLandslideArea,
    };
    firestore()
      .collection('users')
      .doc(user.uid)
      .set(user_data)
      .then(() => navigate('/home'))
      .catch(e => alert(e.message, e.title));
  };

  useEffect(() => {
    if (!isNotAlone) {
      setLivesWith(0);
      setSeniors(0);
      setPWDs(0);
    }
    if (!isSenior) {
      setSeniors(0);
    }
    if (!isPWD) {
      setPWDs(0);
    }
  }, [isNotAlone, isSenior, isPWD]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => {
      alert(
        'THIS WILL REMOVE ALL OF YOUR INPUT',
        'CANCEL REGISTRATION?',
        navigate,
      );
      return true;
    });
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', () => true);
  });

  return (
    <View style={{flex: 1}}>
      <ProgressSteps labelFontFamily="BebasNeue-Regular">
        <ProgressStep
          label="BASIC INFORMATION"
          nextBtnStyle={styles.nextButtonBox}
          nextBtnTextStyle={styles.nextBtn}
          nextBtnDisabled={
            name == '' ||
            phoneNumber == '' ||
            houseNumber == '' ||
            street == '' ||
            barangay == ''
          }
          onNext={() => {
            setName(name.toUpperCase());
            setPhoneNumber(phoneNumber.toUpperCase());
            setHouseNumber(houseNumber.toUpperCase());
            setStreet(street.toUpperCase());
          }}>
          <BasicInfoForm
            name={name}
            setName={setName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            houseNumber={houseNumber}
            setHouseNumber={setHouseNumber}
            street={street}
            setStreet={setStreet}
            barangay={barangay}
            setBarangay={setBarangay}
          />
        </ProgressStep>

        <ProgressStep
          label="ADDITIONAL INFORMATION"
          nextBtnStyle={styles.nextButtonBox}
          nextBtnTextStyle={styles.nextBtn}
          previousBtnStyle={styles.prevButtonBox}
          previousBtnTextStyle={styles.prevBtn}
          nextBtnDisabled={
            isNaN(parseInt(livesWith)) ||
            isNaN(parseInt(seniors)) ||
            isNaN(parseInt(PWDs)) ||
            (isNotAlone && parseInt(livesWith) == 0) ||
            (isNotAlone && isSenior && parseInt(seniors) == 0) ||
            (isNotAlone && isPWD && parseInt(PWDs) == 0)
          }
          onNext={() => {
            if (isNotAlone) {
              setLivesWith(parseInt(livesWith));
              if (isSenior) {
                setSeniors(parseInt(seniors));
              }
              if (isPWD) {
                setPWDs(parseInt(PWDs));
              }
            }
          }}>
          <AdditionalInfoForm
            props={{
              isNotAlone,
              setIsNotAlone,
              isSenior,
              setIsSenior,
              isPWD,
              setIsPWD,
              livesWith,
              setLivesWith,
              seniors,
              setSeniors,
              PWDs,
              setPWDs,
              isInFloodingArea,
              setIsInFloodingArea,
              isInLandslideArea,
              setIsInLandslideArea,
              isAnInformalSettler,
              setIsAnInformalSettler,
            }}
          />
        </ProgressStep>

        <ProgressStep
          label="REVIEW"
          nextBtnStyle={styles.nextButtonBox}
          nextBtnTextStyle={styles.nextBtn}
          previousBtnStyle={styles.prevButtonBox}
          previousBtnTextStyle={styles.prevBtn}
          onSubmit={handleSubmit}>
          <ReviewForm
            props={{
              name,
              phoneNumber,
              houseNumber,
              street,
              barangay,
              isNotAlone,
              livesWith,
              isSenior,
              seniors,
              isPWD,
              PWDs,
              isInFloodingArea,
              isInLandslideArea,
              isAnInformalSettler,
            }}
          />
        </ProgressStep>
      </ProgressSteps>
    </View>
  );
};

const BasicInfoForm = ({
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  houseNumber,
  setHouseNumber,
  street,
  setStreet,
  barangay,
  setBarangay,
}) => {
  return (
    <View style={styles.contentContainer}>
      <BodyText>FULL NAME</BodyText>
      <TextInput
        style={styles.textIpt}
        value={name}
        onChangeText={e => {
          setName(e);
        }}
        placeholder="JUAN DELACRUZ"
      />

      <BodyText>PHONE NUMBER</BodyText>
      <TextInput
        style={styles.textIpt}
        value={phoneNumber}
        onChangeText={e => {
          setPhoneNumber(e);
        }}
        keyboardType="number-pad"
        placeholder="09123456789"
      />

      <View style={{marginTop: 32}} />

      <BodyText>HOUSE NO./ROOM NO./UNIT</BodyText>
      <TextInput
        style={styles.textIpt}
        value={houseNumber}
        onChangeText={e => {
          setHouseNumber(e);
        }}
        placeholder="12345"
      />

      <BodyText>STREET/VILLAGE/SUBDIVISION</BodyText>
      <TextInput
        style={styles.textIpt}
        value={street}
        onChangeText={e => {
          setStreet(e);
        }}
        placeholder="ANGELES B."
      />

      <BodyText>BARANGAY</BodyText>
      <Picker
        selectedValue={barangay}
        onValueChange={(itemValue, itemIndex) => setBarangay(itemValue)}>
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Select barangay"
          value="Select barangay"
          enabled={false}
        />
        <Picker.Item itemStyle={styles.pickerItem} label="Anos" value="Anos" />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Bagong Silang"
          value="Bagong Silang"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Bambang"
          value="Bambang"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Batong Malake"
          value="Batong Malake"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Baybayin"
          value="Baybayin"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Bayog"
          value="Bayog"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Lalakay"
          value="Lalakay"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Maahas"
          value="Maahas"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Malinta"
          value="Malinta"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Mayondon"
          value="Mayondon"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Putho-Tuntungin"
          value="Putho-Tuntungin"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="San Antonio"
          value="San Antonio"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Tadlac"
          value="Tadlac"
        />
        <Picker.Item
          itemStyle={styles.pickerItem}
          label="Timugan"
          value="Timugan"
        />
      </Picker>
    </View>
  );
};

const AdditionalInfoForm = props => {
  return (
    <View style={styles.contentContainer}>
      <BodyText>Do you live with anyone ?</BodyText>
      <ToggleComponent
        isTrue={props.props.isNotAlone}
        setIstrue={props.props.setIsNotAlone}
      />
      {props.props.isNotAlone && (
        <View>
          <BodyText>How many people do you live with?</BodyText>
          <TextInput
            style={styles.textIpt}
            value={props.props.livesWith.toString()}
            onChangeText={e => {
              props.props.setLivesWith(e);
            }}
            placeholder="1"
            keyboardType="number-pad"
          />
        </View>
      )}

      <BodyText>
        {props.props.isNotAlone ? 'Are you or Are you with' : 'Are you'} a
        senior citizen ?
      </BodyText>
      <ToggleComponent
        isTrue={props.props.isSenior}
        setIstrue={props.props.setIsSenior}
      />
      {props.props.isNotAlone && props.props.isSenior && (
        <View>
          <BodyText>How many senior citizens do you live with?</BodyText>
          <TextInput
            style={styles.textIpt}
            value={props.props.seniors.toString()}
            onChangeText={e => {
              props.props.setSeniors(e);
            }}
            placeholder="1"
            keyboardType="number-pad"
          />
        </View>
      )}
      <BodyText>
        {props.props.isNotAlone ? 'Are you or Are you with' : 'Are you'} a PWD ?
      </BodyText>
      <ToggleComponent
        isTrue={props.props.isPWD}
        setIstrue={props.props.setIsPWD}
      />
      {props.props.isNotAlone && props.props.isPWD && (
        <View>
          <BodyText>How many PWDs do you live with?</BodyText>
          <TextInput
            style={styles.textIpt}
            value={props.props.PWDs.toString()}
            onChangeText={e => {
              props.props.setPWDs(e);
            }}
            placeholder="1"
            keyboardType="number-pad"
          />
        </View>
      )}

      <BodyText>Are you an informal settler ?</BodyText>
      <ToggleComponent
        isTrue={props.props.isAnInformalSettler}
        setIstrue={props.props.setIsAnInformalSettler}
      />

      <BodyText>Does your area have a history of flooding ?</BodyText>
      <ToggleComponent
        isTrue={props.props.isInFloodingArea}
        setIstrue={props.props.setIsInFloodingArea}
      />

      <BodyText>Does your area have a history of landslide ?</BodyText>
      <ToggleComponent
        isTrue={props.props.isInLandslideArea}
        setIstrue={props.props.setIsInLandslideArea}
      />
    </View>
  );
};

const ReviewForm = props => {
  return (
    <View style={styles.contentContainer}>
      <BodyText
        customStyles={{fontSize: 28, color: '#000', marginVertical: 10}}>
        BASIC INFORMATION
      </BodyText>
      <BodyText>{props.props.name}</BodyText>
      <BodyText>{props.props.phoneNumber}</BodyText>
      <BodyText>{props.props.houseNumber}</BodyText>
      <BodyText>{props.props.street}</BodyText>
      <BodyText>{props.props.barangay}</BodyText>
      <BodyText
        customStyles={{fontSize: 28, color: '#000', marginVertical: 10}}>
        ADDITIONAL INFORMATION
      </BodyText>
      <BodyText>
        {props.props.isNotAlone &&
          `Lives with ${parseInt(props.props.livesWith)} people`}
      </BodyText>
      {props.props.isSenior && (
        <BodyText>
          {props.props.isNotAlone
            ? `${props.props.seniors} senior(s)`
            : 'Senior citizen'}
        </BodyText>
      )}
      {props.props.isPWD && (
        <BodyText>
          {props.props.isNotAlone ? `${props.props.PWDs} PWD(s)` : 'PWD'}
        </BodyText>
      )}
      {props.props.isAnInformalSettler && <BodyText>Informal settler</BodyText>}
      {props.props.isInFloodingArea && (
        <BodyText>Lives in flooding area</BodyText>
      )}
      {props.props.isInLandslideArea && (
        <BodyText>Lives in landslide area</BodyText>
      )}
    </View>
  );
};

const ToggleComponent = ({isTrue, setIstrue}) => {
  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[styles.toggleItem, isTrue && styles.toggleItemIsActive]}
        onPress={() => {
          setIstrue(true);
        }}>
        <BodyText customStyles={isTrue && {color: '#ffffff'}}>YES</BodyText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.toggleItem, !isTrue && styles.toggleItemIsActive]}
        onPress={() => {
          setIstrue(false);
        }}>
        <BodyText customStyles={!isTrue && {color: '#ffffff'}}>NO</BodyText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    marginHorizontal: 32,
  },
  prevBtn: {
    color: 'orange',
  },
  nextBtn: {
    color: 'forestgreen',
  },
  textIpt: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 18,
    color: '#666666',
    borderBottomWidth: 3,
    borderBottomColor: '#666666',
    padding: 0,
    marginBottom: 20,
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
  picker: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 18,
    color: '#666666',
    borderBottomWidth: 3,
    borderBottomColor: '#666666',
    padding: 0,
    marginBottom: 20,
  },
  pickerItem: {
    fontFamily: 'BebasNeue-Regular',
    fontSize: 18,
    color: '#666666',
  },
  prevButtonBox: {
    borderWidth: 3,
    paddingVertical: 1,
    borderColor: 'orange',
  },
  nextButtonBox: {
    borderWidth: 3,
    paddingVertical: 1,
    borderColor: 'forestgreen',
  },
});

const alert = (msg, title, navigate) => {
  if (title === 'CANCEL REGISTRATION?') {
    Alert.alert(title, msg, [
      {
        text: 'Yes',
        onPress: () => {
          navigate('/');
        },
      },
      {
        text: 'No',
        onPress: () => {
          true;
        },
      },
    ]);
  } else {
    Alert.alert(title, msg, [
      {
        text: 'Ok',
        onPress: () => {},
      },
    ]);
  }
};

export default Register;
