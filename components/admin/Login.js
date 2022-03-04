import React, {useRef, useState} from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  View,
  Image,
  Dimensions,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  ToastAndroid,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RBSheet from 'react-native-raw-bottom-sheet';
import {Button, ButtonGroup} from 'react-native-elements';
import {postData} from '../FetchApi';
import {useDispatch} from 'react-redux';
import {storeDatasync} from '../AsyncStorage';

const {width, height} = Dimensions.get('window');

export const Login = ({navigation}) => {
  const refRBSheet = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [otp, setOtp] = useState('');
  const [show, setShow] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  const textColor = useColorScheme() === 'dark' ? '#fff' : '#000';
  const backgroundColor = useColorScheme() === 'dark' ? '#212121' : '#FFF';

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
            <View
              style={[
                styles.input,
                {
                  borderColor: textColor,
                },
              ]}>
              <AntDesign
                style={{marginHorizontal: 10}}
                name="user"
                size={30}
                color={textColor}
              />
              <TextInput
                value={mobileNo}
                style={{width: '90%'}}
                placeholder="Mobile Number"
                placeholderTextColor={textColor}
                onChangeText={text => setMobileNo(text)}
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
                  <AntDesign
                    style={{marginHorizontal: 10}}
                    name="key"
                    size={30}
                    color={textColor}
                  />
                  <TextInput
                    autoFocus
                    style={{width: '90%'}}
                    placeholder="OTP"
                    placeholderTextColor={textColor}
                    onChangeText={text => setOtp(text)}
                  />
                </View>
                <TouchableOpacity onPress={() => validateOTP()}>
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
                  setShow(true);
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
      dispatch({type: 'ADD_USER', payload: [result.data.id,result.data]});
      // alert("Login Successfully")
      ToastAndroid.show('Login Successfully !', ToastAndroid.LONG);
    } else {
      // ToastAndroid.show('Invalid OTP !', ToastAndroid.LONG);
      alert('Invalid Creditentials');
    }
    setLoading(false);
  };

  const generateOTP = async () => {
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
      dispatch({type: 'ADD_USER', payload: [result.data.id,result.data]});
      // alert("Login Successfully")
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
              color: textColor,
            },
          ]}>
          Login
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
          borderColor: backgroundColor,
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
          <AntDesign
            style={{marginHorizontal: 10}}
            name="user"
            size={30}
            color={textColor}
          />
          <TextInput
            style={{width: '80%'}}
            placeholder="E-mail"
            placeholderTextColor={textColor}
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
          <AntDesign
            style={{marginHorizontal: 10}}
            name="key"
            size={30}
            color={textColor}
          />
          <TextInput
            style={{width: '80%'}}
            secureTextEntry={true}
            placeholder="Password"
            placeholderTextColor={textColor}
            onChangeText={text => setPassword(text)}
          />
        </View>
      </View>
        <Button
          onPress={() => handleLogin()}
          title="Log In"
          loading={loading}
          loadingProps={{
            color: '#000'
          }}
          titleStyle={styles.btnText}
          buttonStyle={styles.btn}
        />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: width * 0.82,
          paddingBottom: 20,
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
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity>
          <Image
            style={{width: 50, height: 50, marginHorizontal: 15}}
            source={require('../../images/facebook.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={{width: 50, height: 50, marginHorizontal: 15}}
            source={require('../../images/google.png')}
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
    paddingTop: 80,
  },
  logo: {
    resizeMode: 'contain',
    height: height * 0.15,
    width: width * 0.5,
    borderRadius: 10,
    margin: 10,
  },
  textContainer: {
    width: width * 0.8,
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    textAlign: 'center',
    fontWeight: '800',
  },
  inputContainer: {
    marginVertical: 20,
  },
  input: {
    borderWidth: 1,
    width: width * 0.8,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    margin: 15,
  },
  btn: {
    backgroundColor: '#ff9000',
    width: width * 0.8,
    padding: 15,
    alignItems: 'center',
    borderRadius: 10,
  },
  btnText: {
    fontWeight: '700',
    fontSize: 20,
    color: '#000'
  },
});
