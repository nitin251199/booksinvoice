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
  ActivityIndicator,
  Platform,
  NativeModules,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, ButtonGroup} from 'react-native-elements';
import {postData} from './FetchApi';
import {useDispatch} from 'react-redux';
import {storeDatasync} from './AsyncStorage';
import PhoneInput from 'react-native-phone-number-input';
import {useSelector} from 'react-redux';
import DeviceCountry, {TYPE_TELEPHONY} from 'react-native-device-country';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {LoginManager, Profile} from 'react-native-fbsdk-next';
import ForgotPass from './ForgotPass';
import {useSwipe} from './useSwipe';

const {width, height} = Dimensions.get('window');

export const Login = ({navigation}) => {
  const phoneInput = useRef(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [plainMobileNo, setPlainMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [country, setCountry] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [showLogo, setShowLogo] = useState(true);

  const DEVICE_ID =
    Platform.OS === 'android'
      ? NativeModules.PlatformConstants.getAndroidID()
      : NativeModules.SettingsManager.clientUniqueId;

  let resendOtpTimerInterval;
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(0);

  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#fff' : '#000';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  useFocusEffect(
    React.useCallback(() => {
      // alert('Screen was focused');
      // Do something when the screen is focused
      return () => {
        setShowSignup(false);
        setShow(false);
        setMobileNo('');
        setPlainMobileNo('');
        setOtp('');
        setEmail('');
        setPassword('');
        setSelectedIndex(0);
        setLoading1(false);
        setLoading2(false);
        // Do something when the screen is unfocused
        // Useful for cleanup functions
      };
    }, []),
  );

  useEffect(() => {
    GoogleSignin.configure();
    isSignedIn();
  }, []);

  const googleSignIn = async () => {
    setLoading1(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      saveGoogleInfo(userInfo);
      // console.log('User Info --> ', userInfo);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
        console.log('error', error);
      }
    }
  };

  const saveGoogleInfo = async user => {
    var body = {
      email: user.user.email,
      username: user.user.name,
      type: '1',
      user_type: selectedIndex === 0 ? 'individual' : 'organisation',
      device_id: DEVICE_ID,
    };
    var result = await postData('api/getAddgoogleuser', body);
    if (result !== null) {
      var sub = await checkSubscription(result.data);
      setLoading1(false);
      navigation.navigate('Homepage');
      storeDatasync(result.data.id, result.data);
      dispatch({
        type: 'SET_STATUS',
        payload: {isLogin: true, isSubscribed: sub},
      });
      // storeDatasync('isSubscribed', sub);
      dispatch({type: 'ADD_USER', payload: [result.data.id, result.data]});
      dispatch({type: 'SET_LOGIN', payload: true});
      // storeDatasync('isLogin', true);
      if (result?.success !== '') {
        Alert.alert(
          'Welcome to Booksinvoice',
          `Email: ${result.data.useremail}\nPassword: ${result?.success}`,
        );
      }
      ToastAndroid.show('Login Successfully !', ToastAndroid.LONG);
    } else {
      alert('Invalid Creditentials');
    }
  };

  const isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (!!isSignedIn) {
      getCurrentUserInfo();
    } else {
      // console.log('Please Login');
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      // console.log('edit_', userInfo);
    } catch (error) {
      if (error.code) {
        statusCodes.SIGN_IN_REQUIRED;
      } else {
        alert('Something went wrong.');
      }
    }
  };

  const fbLogin = () => {
    setLoading2(true);
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      function (result) {
        if (result.isCancelled) {
        } else {
          const currentProfile = Profile.getCurrentProfile().then(function (
            currentProfile,
          ) {
            if (currentProfile) {
              saveFbInfo(currentProfile);
            } else {
              LoginManager.logInWithPermissions([
                'public_profile',
                'email',
              ]).then(function (result) {
                if (result.isCancelled) {
                } else {
                  const currentProfile = Profile.getCurrentProfile().then(
                    function (currentProfile) {
                      if (currentProfile) {
                        saveFbInfo(currentProfile);
                        console.log(currentProfile);
                      }
                    },
                  );
                }
              });
            }
          });
        }
      },
      function (error) {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  const saveFbInfo = async user => {
    var body = {
      email:
        user.name.replace(/ /g, '').toLowerCase() +
        user.userID.substring(user.userID.length - 5) +
        '@biv.com',
      username: user.name,
      type: '1',
      user_type: selectedIndex === 0 ? 'individual' : 'organisation',
      device_id: DEVICE_ID,
    };
    var result = await postData('api/getAddfacebookuser', body);
    if (result !== null) {
      var sub = await checkSubscription(result.data);
      setLoading2(false);
      navigation.navigate('Homepage');
      storeDatasync(result.data.id, result.data);
      dispatch({
        type: 'SET_STATUS',
        payload: {isLogin: true, isSubscribed: sub},
      });
      // storeDatasync('isSubscribed', sub);
      dispatch({type: 'ADD_USER', payload: [result.data.id, result.data]});
      dispatch({type: 'SET_LOGIN', payload: true});
      // storeDatasync('isLogin', true);
      if (result?.success !== '') {
        Alert.alert(
          'Welcome to Booksinvoice',
          `Email: ${result.data.useremail}\nPassword: ${result?.success}`,
        );
      }
      ToastAndroid.show('Login Successfully !', ToastAndroid.LONG);
    } else {
      alert('Invalid Creditentials');
    }
  };

  const getLocation = () => {
    DeviceCountry.getCountryCode(TYPE_TELEPHONY)
      .then(result => {
        // console.log(result.code.toUpperCase());
        // {"code": "BY", "type": "telephony"}
        setCountry(result.code.toUpperCase());
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getLocation();
  }, []);

  const checkSubscription = async res => {
    var body = {type: 1, user_id: res.id, user_type: res.usertype};
    var result = await postData('api/getSubscription', body);

    var cart = await postData('api/getShowcart', body);
    if (cart && cart.msg === 'Success') {
      cart.data.map(item => {
        dispatch({type: 'ADD_CART', payload: [item.id, item]});
      });
    }
    if (result.msg === 'Subscribed') {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    startResendOtpTimer();

    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
    };
  }, [resendButtonDisabledTime]);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  };

  const otpLogin = () => {
    return (
      <View
        style={{
          // height: height * 0.5,
          // backgroundColor: '#FFD369',
          alignItems: 'center',
          paddingVertical: 15,
        }}>
        <View>
          <PhoneInput
            ref={phoneInput}
            defaultValue={mobileNo.slice(3, mobileNo.length)}
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
            onChangeText={text => {
              setPlainMobileNo(text);
            }}
            withDarkTheme={theme === 'dark' ? true : false}
            withShadow
            // autoFocus
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
                value={otp}
                keyboardType="numeric"
                style={{width: '90%', color: textColor}}
                placeholder="OTP"
                placeholderTextColor={textColor}
                onChangeText={text => setOtp(text)}
              />
            </View>
            <View style={{paddingVertical: 10, width: width * 0.85}}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                {resendButtonDisabledTime > 0 ? (
                  <Text style={{color: textColor}}>
                    Resend OTP in {resendButtonDisabledTime}s
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      generateOTP();
                    }}>
                    <Text style={{color: '#ff9000'}}>Resend OTP</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setShow(false)}>
                  <Text style={{color: '#ff9000'}}>Change Mobile Number</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Button
              onPress={() => validateOTP()}
              title="Validate OTP"
              loading={loading}
              loadingProps={{
                color: '#000',
              }}
              titleStyle={styles.btnText}
              buttonStyle={styles.btn}
            />
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
      device_id: DEVICE_ID,
    };
    var result = await postData('api/getLogin', body);
    if (result.msg === 'Login') {
      var sub = await checkSubscription(result.data);
      navigation.navigate('Homepage');
      storeDatasync(result.data.id, result.data);
      dispatch({
        type: 'SET_STATUS',
        payload: {isLogin: true, isSubscribed: sub},
      });
      // storeDatasync('isSubscribed', sub);
      dispatch({type: 'ADD_USER', payload: [result.data.id, result.data]});
      // storeDatasync('isLogin', true);
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
        setResendButtonDisabledTime(30);
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
    setLoading(true);
    var body = {
      type: '1',
      usermobile: mobileNo,
      user_type: selectedIndex === 0 ? 'individual' : 'organisation',
      otp: otp,
      mobile: plainMobileNo,
      device_id: DEVICE_ID,
    };
    var result = await postData('api/getValidateuserotp', body);

    if (result.msg === 'Login') {
      var sub = await checkSubscription(result.data);
      navigation.navigate('Homepage');
      storeDatasync(result.data.id, result.data);
      dispatch({
        type: 'SET_STATUS',
        payload: {isLogin: true, isSubscribed: sub},
      });
      // storeDatasync('isSubscribed', sub);
      dispatch({type: 'ADD_USER', payload: [result.data.id, result.data]});
      // storeDatasync('isLogin', true);
      if (result?.success !== '') {
        Alert.alert(
          'Welcome to Booksinvoice',
          `Email: ${result.data.useremail}\nPassword: ${result?.success}`,
        );
      }
      ToastAndroid.show('Login Successfully !', ToastAndroid.LONG);
    } else {
      // ToastAndroid.show('Invalid OTP !', ToastAndroid.LONG);
      alert('Invalid OTP');
    }
    setLoading(false);
  };

  const loginView = () => {
    if (showSignup) {
      return (
        <>
          {otpLogin()}
          {/* <ForgotPass /> */}
          <View
            style={{
              width: width * 0.9,
              marginBottom: 20,
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}>
            <Text style={{color: textColor, textAlign: 'left'}}>
              Continue, if you agree to the
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Legal', {page: 'TermAndConditions'})
              }>
              <Text style={{color: '#ff9000'}}> T & C </Text>
            </TouchableOpacity>
            <Text style={{color: textColor, textAlign: 'left'}}>and</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Legal', {page: 'PrivacyPolicy'})
              }>
              <Text style={{color: '#ff9000'}}> Privacy Policy </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: width * 0.3,
            }}>
            <TouchableOpacity onPress={() => fbLogin()}>
              <MaterialCommunityIcons
                name="facebook"
                size={50}
                color="#4267B2"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => googleSignIn()}
              style={{justifyContent: 'center'}}>
              <Image
                source={require('../../images/google.png')}
                style={{width: 40, height: 40, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>

          <View
            style={{
              width: width * 0.85,
              marginVertical: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => {
                setShowSignup(false);
                setShow(false);
                setMobileNo('');
                setPlainMobileNo('');
                setOtp('');
              }}>
              <Text
                style={{
                  color: textColor,
                  fontWeight: '700',
                  textAlign: 'left',
                }}>
                Sign In Instead ?
              </Text>
            </TouchableOpacity>
            <ForgotPass width={width * 0.35} />
          </View>
        </>
      );
    } else {
      return (
        <>
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
                value={email}
                placeholder="Login id ex:(xxxxxx1234@biv.com)"
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
                value={password}
                placeholder="Password"
                placeholderTextColor="#999"
                onChangeText={text => setPassword(text)}
              />
              <MaterialCommunityIcons
                onPress={() => setShowPass(!showPass)}
                style={{marginHorizontal: 10}}
                name={showPass ? 'eye' : 'eye-off'}
                size={25}
                color={textColor}
              />
            </View>
          </View>

          <View
            style={{
              width: width * 0.9,
              marginBottom: 0,
              alignItems: 'flex-end',
              flexDirection: 'row',
            }}>
            <Text style={{color: textColor, textAlign: 'left'}}>
              Continue, if you agree to the
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Legal', {page: 'TermAndConditions'})
              }>
              <Text style={{color: '#ff9000'}}> T & C </Text>
            </TouchableOpacity>
            <Text style={{color: textColor, textAlign: 'left'}}>and</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Legal', {page: 'PrivacyPolicy'})
              }>
              <Text style={{color: '#ff9000'}}> Privacy Policy </Text>
            </TouchableOpacity>
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
          <TouchableOpacity onPress={() => setShowSignup(true)}>
            <View
              style={{
                ...styles.btn,
                marginVertical: 0,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: textColor,
              }}>
              <Text style={{color: textColor}}>
                Don't have an account? Sign Up / Log In
              </Text>
            </View>
          </TouchableOpacity>
          <ForgotPass />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: width * 0.3,
            }}>
            <TouchableOpacity onPress={() => fbLogin()}>
              <MaterialCommunityIcons
                name="facebook"
                size={50}
                color="#4267B2"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => googleSignIn()}
              style={{justifyContent: 'center'}}>
              <Image
                source={require('../../images/google.png')}
                style={{width: 40, height: 40, resizeMode: 'contain'}}
              />
            </TouchableOpacity>
          </View>
        </>
      );
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        // or some other action
        setShowLogo(false);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setShowLogo(true);
        // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    navigation.popToTop();
  }

  function onSwipeRight() {
    navigation.popToTop();
  }

  return (
    <SafeAreaView
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <ActivityIndicator
        animating={loading1}
        size={'large'}
        style={{position: 'absolute', width: '100%', height: '100%'}}
      />
      <ActivityIndicator
        animating={loading2}
        size={'large'}
        style={{position: 'absolute', width: '100%', height: '100%'}}
      />
      <View
        style={{
          display: showLogo ? 'flex' : 'none',
        }}>
        <Image source={require('../../images/logo.jpg')} style={styles.logo} />
      </View>
      <View style={styles.textContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Homepage')}>
          <Text
            style={[
              styles.text,
              {
                color: '#ff9000',
              },
            ]}>
            BooksInVoice
          </Text>
        </TouchableOpacity>
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
      <Text style={{color: '#ff9000', fontSize: 13, margin: 5}}>
        Your Precious Information is Safe With Us
      </Text>
      {/* <KeyboardAvoidingView behavior='padding'> */}
      {loginView()}
      {/* </KeyboardAvoidingView> */}
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
    height: height * 0.12,
    width: width * 0.5,
    // borderRadius: 10,
    marginTop: 20,
  },
  textContainer: {
    width: width * 0.8,
    justifyContent: 'center',
  },
  text: {
    fontSize: 34,
    textAlign: 'center',
    fontWeight: '800',
    marginTop: 10,
  },
  inputContainer: {
    // marginVertical: 5,
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
    padding: 10,
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
