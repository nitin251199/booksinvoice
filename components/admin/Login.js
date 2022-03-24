import React, {useEffect, useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button, ButtonGroup} from 'react-native-elements';
import {postData} from '../FetchApi';
import {useDispatch} from 'react-redux';
import {storeDatasync} from '../AsyncStorage';
import PhoneInput from 'react-native-phone-number-input';
import {ThemeContext} from '../ThemeContext';
import DeviceCountry, {
  TYPE_ANY,
  TYPE_TELEPHONY,
  TYPE_CONFIGURATION,
} from 'react-native-device-country';

const {width, height} = Dimensions.get('window');

export const Login = ({navigation}) => {
  const refRBSheet = useRef();
  const phoneInput = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [country, setCountry] = useState('');

  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  

  const getLocation = () => {
    DeviceCountry.getCountryCode(TYPE_TELEPHONY)
  .then((result) => {
    // console.log(result.code.toUpperCase());
    // {"code": "BY", "type": "telephony"}
    setCountry(result.code.toUpperCase());
  })
  .catch((e) => {
    console.log(e);
  });
  }

  useEffect(() => {
    getLocation()
  }, [])

  const createAlert = () =>
    Alert.alert(
      "Your Precious Information is Safe With Us",
      "Continue, if you agree to the T&C and Privacy Policy.",
      [
        {
          text: "Cancel",
          // onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: "Proceed", onPress: () =>validateOTP() }
      ]
    );
  

  const otpLogin = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'transparent',
        }}>
        <RBSheet
          ref={refRBSheet}
          closeOnDragDown={true}
          closeOnPressMask={true}
          customStyles={{
            wrapper: {
              backgroundColor: 'transparent',
            },
            draggableIcon: {
              backgroundColor: textColor,
            },
            container: {
              backgroundColor: backgroundColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            },
          }}
          height={height * 0.6}>
          <View
            style={{
              height: height * 0.5,
              // backgroundColor: '#FFD369',
              alignItems: 'center',
              paddingVertical: 15,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}>
            <View>
              <PhoneInput
                ref={phoneInput}
                defaultValue={mobileNo}
                defaultCode={country}
                layout="first"
                textContainerStyle={{
                  borderRadius: 10,
                  alignItems: 'center',
                  paddingVertical: 0,
                }}
                containerStyle={{
                  borderWidth: 1,
                  borderColor: textColor,
                  borderRadius: 10,
                  alignItems: 'center',
                  width: '90%',
                }}
                placeholder="Mobile Number"
                onChangeFormattedText={text => {
                  setMobileNo(text);
                }}
                withDarkTheme={theme === 'dark' ? true : false}
                withShadow
                autoFocus
              />
            </View>
            {show ? (
              <View style={{alignItems: 'center'}}>
                <View
                  style={[
                    styles.input,
                    {
                      borderColor: textColor,
                    },
                  ]}>
                  <MaterialCommunityIcons
                    style={{marginHorizontal: 10}}
                    name="key"
                    size={25}
                    color="#ff9000"
                  />
                  <TextInput
                    autoFocus
                    style={{width: '90%'}}
                    placeholder="OTP"
                    placeholderTextColor={textColor}
                    onChangeText={text => setOtp(text)}
                  />
                </View>
                <TouchableOpacity onPress={() => createAlert()}>
                  <View
                    style={[
                      styles.btn,
                      {backgroundColor: '#ff9000', marginVertical: 20},
                    ]}>
                    <Text
                      style={[
                        styles.btnText,
                        {
                          color: '#000',
                        },
                      ]}>
                      Validate OTP
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  generateOTP();
                }}>
                <View
                  style={[
                    styles.btn,
                    {backgroundColor: '#ff9000', marginVertical: 20},
                  ]}>
                  <Text
                    style={[
                      styles.btnText,
                      {
                        color: '#000',
                      },
                    ]}>
                    Generate OTP
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </RBSheet>
      </View>
    );
  };

  var dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    let body = {
      user_type: selectedIndex === 0 ? 'individual' : 'organisation',
      email: email,
      password: password,
      type: 1,
    };
    var result = await postData('api/getLogin', body);
    if (result.msg === 'Login') {
      navigation.navigate('Homepage');
      storeDatasync(result.data.id, result.data);
      dispatch({type: 'ADD_USER', payload: [result.data.id, result.data]});
      dispatch({type: 'SET_LOGIN', payload: true});
      storeDatasync('isLogin', true);
      ToastAndroid.show('Login Successfully !', ToastAndroid.LONG);
    } else {
      alert('Invalid Creditentials');
    }
    setLoading(false);
  };

  const generateOTP = async () => {
    const checkValid = phoneInput.current?.isValidNumber(mobileNo);
    if (checkValid) {
      setShow(true);
      var body = {
        type: '1',
        user_type: selectedIndex === 0 ? 'individual' : 'organisation',
        usermobile: mobileNo,
      };
      var result = await postData('api/getGenerate', body);
      if (result.reaction === 'success') {
        ToastAndroid.show(
          'OTP has been sent to your mobile no. successfully!',
          ToastAndroid.LONG,
        );
      } else {
        ToastAndroid.show('Something Went Wrong!', ToastAndroid.LONG);
      }
    } else {
      ToastAndroid.show('Please enter a valid number!', ToastAndroid.LONG);
    }
  };

  // var dispatch = useDispatch()

  const validateOTP = async () => {
    var body = {
      type: '1',
      usermobile: mobileNo,
      user_type: selectedIndex === 0 ? 'individual' : 'organisation',
      otp: otp,
    };
    var result = await postData('api/getValidateuserotp', body);
    if (result.msg === 'Login') {
      navigation.navigate('Homepage');
      storeDatasync(result.data.id, result.data);
      dispatch({type: 'ADD_USER', payload: [result.data.id, result.data]});
      dispatch({type: 'SET_LOGIN', payload: true});
      storeDatasync('isLogin', true);
      ToastAndroid.show('Login Successfully !', ToastAndroid.LONG);
    } else {
      // ToastAndroid.show('Invalid OTP !', ToastAndroid.LONG);
      alert('Invalid OTP');
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View>
        <Image source={require('../../images/logo.jpg')} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.text,
            {
              color: '#ff9000',
            },
          ]}>
          BooksInVoice
        </Text>
        <Text style={[styles.subText, {color: '#ff9000'}]}>
          World's first online audio library
        </Text>
      </View>
      <ButtonGroup
        buttons={['Individual', 'Organisation']}
        selectedIndex={selectedIndex}
        onPress={value => {
          setSelectedIndex(value);
        }}
        containerStyle={{
          marginTop: 20,
          borderRadius: 10,
          borderColor: '#212121',
        }}
        selectedButtonStyle={{backgroundColor: '#ff9000'}}
        textStyle={{color: '#000'}}
        selectedTextStyle={{color: '#000'}}
      />
      <View style={styles.inputContainer}>
        <View
          style={[
            styles.input,
            {
              borderColor: textColor,
            },
          ]}>
          <MaterialCommunityIcons
            style={{marginHorizontal: 10}}
            name="email"
            size={25}
            color="#ff9000"
          />
          <TextInput
            style={{width: '80%', color: textColor}}
            placeholder="E-mail"
            placeholderTextColor="#999"
            onChangeText={text => setEmail(text)}
          />
        </View>
        <View
          style={[
            styles.input,
            {
              borderColor: textColor,
            },
          ]}>
          <MaterialCommunityIcons
            style={{marginHorizontal: 10}}
            name="key"
            size={25}
            color="#ff9000"
          />
          <TextInput
            style={{width: '70%', color: textColor}}
            secureTextEntry={!showPass}
            placeholder="Password"
            placeholderTextColor="#999"
            onChangeText={text => setPassword(text)}
          />
          <MaterialCommunityIcons
            onPress={() => setShowPass(!showPass)}
            style={{marginHorizontal: 10}}
            name={showPass ? 'eye-off' : 'eye'}
            size={25}
            color={textColor}
          />
        </View>
      </View>
      <Button
        onPress={() => handleLogin()}
        title="Log In"
        loading={loading}
        loadingProps={{
          color: '#000',
        }}
        titleStyle={styles.btnText}
        buttonStyle={styles.btn}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width * 0.85,
          paddingBottom: 0,
        }}>
        <Text
          onPress={() => refRBSheet.current.open()}
          style={{
            marginVertical: 20,
            fontWeight: '500',
            color: textColor,
          }}>
          Login with OTP
        </Text>
        <Text
          style={{
            marginVertical: 20,
            fontWeight: '500',
            color: textColor,
          }}>
          Forgot Password ?
        </Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width * 0.3,
        }}>
        <TouchableOpacity>
          <MaterialCommunityIcons name="facebook" size={50} color="#4267B2" />
        </TouchableOpacity>
        <TouchableOpacity style={{justifyContent: 'center'}}>
          <Image
            source={require('../../images/google.png')}
            style={{width: 40, height: 40, resizeMode: 'contain'}}
          />
        </TouchableOpacity>
      </View>
      {otpLogin()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
    height: height * 0.15,
    width: width * 0.5,
    // borderRadius: 10,
    margin: 20,
  },
  textContainer: {
    width: width * 0.8,
    justifyContent: 'center',
  },
  text: {
    fontSize: 34,
    textAlign: 'center',
    fontWeight: '800',
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    // borderWidth: 1,
    width: width * 0.9,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#99999930',
  },
  btn: {
    backgroundColor: '#ff9000',
    width: width * 0.9,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 20,
    color: '#000',
  },
  subText: {
    textAlign: 'center',
    fontSize: 14,
    textTransform: 'uppercase',
    marginTop: 5,
  },
});
