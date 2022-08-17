import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  KeyboardAvoidingView,
  TextInput,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import PhoneInput from 'react-native-phone-number-input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceCountry, {TYPE_TELEPHONY} from 'react-native-device-country';
import {Button, ButtonGroup} from 'react-native-elements';
import {postData} from './FetchApi';

const {width, height} = Dimensions.get('window');

export default function ForgotPass(props) {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';

  const [showForgot, setShowForgot] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [show, setShow] = useState('password');
  const phoneInput = useRef(null);
  const [mobileNo, setMobileNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [country, setCountry] = useState('');

  let resendOtpTimerInterval;
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(0);

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
    setShow('');
    setMobileNo('');
    return () => {
      setMobileNo('');
      setOtp('');
      setShow('');
    };
  }, []);

  const resetPassword = async () => {
    setLoading(true);
    let body = {
      user_type: selectedIndex === 0 ? 'individual' : 'organisation',
      usermobile: mobileNo,
      password: password,
    };
    let result = await postData('api/getForget', body);
    if (result.success) {
      setShowForgot(false);
      setShow('');
      setMobileNo('');
      setPassword('');
      setOtp('');
      alert('Password reset successfully');
    } else {
      ToastAndroid.show(result.msg, ToastAndroid.SHORT);
    }
    setLoading(false);
  };

  const generateOTP = async () => {
    const checkValid = phoneInput.current?.isValidNumber(mobileNo);
    if (checkValid) {
      setShow('otp');
      var body = {
        user_type: selectedIndex === 0 ? 'individual' : 'organisation',
        usermobile: mobileNo,
      };
      var result = await postData('api/getCheckgenerate', body);
      if (result.msg === 'Generate') {
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

  const validateOTP = async () => {
    setLoading(true);
    let body = {
      user_type: selectedIndex === 0 ? 'individual' : 'organisation',
      usermobile: mobileNo,
      otp: otp,
    };
    let result = await postData('api/getValidateforgetpwd', body);
    if (result?.success) {
      setShow('password');
    } else {
      alert('Invalid OTP !');
    }
    setLoading(false);
  };

  const renderView = () => {
    if (show == '') {
      return (
        <>
          <ButtonGroup
            buttons={['Individual', 'Organisation']}
            selectedIndex={selectedIndex}
            onPress={value => {
              setSelectedIndex(value);
            }}
            containerStyle={{
              marginBottom: 20,
              borderRadius: 10,
              borderColor: '#212121',
            }}
            selectedButtonStyle={{backgroundColor: '#ff9000'}}
            textStyle={{color: '#000'}}
            selectedTextStyle={{color: '#000'}}
          />
          <View style={{paddingVertical: 5}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: textColor,
                marginBottom: 15,
              }}>
              Please enter your registered mobile number.
            </Text>
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
                width: '100%',
              }}
              placeholder="Mobile Number"
              onChangeFormattedText={text => {
                setMobileNo(text);
              }}
              withDarkTheme={theme === 'dark' ? true : false}
              withShadow
              autoFocus
            />
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
          </View>
        </>
      );
    } else if (show == 'otp') {
      return (
        <>
          <ButtonGroup
            buttons={['Individual', 'Organisation']}
            selectedIndex={selectedIndex}
            onPress={value => {
              setSelectedIndex(value);
            }}
            containerStyle={{
              marginBottom: 20,
              borderRadius: 10,
              borderColor: '#212121',
            }}
            selectedButtonStyle={{backgroundColor: '#ff9000'}}
            textStyle={{color: '#000'}}
            selectedTextStyle={{color: '#000'}}
          />
          <View style={{paddingVertical: 5, alignItems: 'center'}}>
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: textColor,
                marginBottom: 15,
              }}>
              Please enter your registered mobile number.
            </Text>
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
              withDarkTheme={theme === 'dark' ? true : false}
              withShadow
              // autoFocus={true}
            />
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
                  style={{color: textColor}}
                  placeholder="OTP"
                  placeholderTextColor={textColor}
                  onChangeText={text => setOtp(text)}
                />
              </View>
              <View style={{paddingVertical: 10, width: width * 0.85}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
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
                  <TouchableOpacity onPress={() => setShow('')}>
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
          </View>
        </>
      );
    } else if (show == 'password') {
      return (
        <View style={{paddingHorizontal: 15, paddingVertical: 25}}>
          <Text
            style={{
              fontSize: 14,
              fontWeight: '600',
              color: textColor,
            }}>
            Please enter your new password here.
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                borderBottomColor: 'gray',
                color: textColor,
                marginBottom: 20,
              },
            ]}
            autoFocus
            onChangeText={text => setPassword(text)}
            placeholder="New password"
            placeholderTextColor="#999"
          />
          <Button
            onPress={() => resetPassword()}
            title="Reset Password"
            loading={loading}
            loadingProps={{
              color: '#000',
            }}
            titleStyle={styles.btnText}
            buttonStyle={styles.btn}
          />
        </View>
      );
    }
  };

  const changeModal = () => {
    return (
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={showForgot}
        onRequestClose={() => {
          setShowForgot(false);
          setShow('');
          setMobileNo('');
          setOtp('');
          setPassword('');
        }}>
        <View style={styles.centeredView}>
          <KeyboardAvoidingView behavior="padding">
            <View
              style={[styles.modalView, {backgroundColor: modelBackgroundColor}]}>
              <View style={{margin: 10}}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: '800',
                    color: textColor,
                    padding: 10,
                    textAlign: 'center',
                  }}>
                  Forgot Password ?
                </Text>
                {/* <Divider
                  style={{backgroundColor: textColor, width: width * 0.6}}
                /> */}
              </View>
              {renderView()}
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setShowForgot(true)}
        style={[
          styles.container,
          {
            width: (props.width && props.width) || width * 0.85,
          },
        ]}>
        <Text style={{...styles.title, color: textColor}}>
          Forgot Password ?
        </Text>
      </TouchableOpacity>
      {changeModal()}
    </>
  );
}

const styles = StyleSheet.create({
  container: {marginVertical: 10},
  title: {
    fontWeight: '700',
    textAlign: 'right',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -18,
  },
  textInput: {borderBottomWidth: 1, width: width * 0.9},
  modalView: {
    margin: 30,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    // borderWidth: 1,
    width: width * 0.8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
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
});
