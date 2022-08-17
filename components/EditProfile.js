import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';
import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  ToastAndroid,
  TextInput,
  Modal,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import {Avatar, Button, Card, Divider, ListItem} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
import {
  checkSyncData,
  getSyncData,
  removeDatasync,
  storeDatasync,
} from './AsyncStorage';
import {postData, ServerURL} from './FetchApi';
import {useSelector} from 'react-redux';
import AnimatedLottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import TrackPlayer from 'react-native-track-player';

const {width, height} = Dimensions.get('window');

export const EditProfile = ({navigation}) => {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [city, setCity] = useState('');
  const [cityName, setCityName] = useState('');
  const [cityList, setCityList] = useState([]);
  const [state, setState] = useState('');
  const [stateName, setStateName] = useState('');
  const [stateList, setStateList] = useState([]);
  const [country, setCountry] = useState('');
  const [countryName, setCountryName] = useState('');
  const [countryList, setCountryList] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showPass, setShowPass] = useState(true);
  const [showPassNew, setShowPassNew] = useState(true);
  const [showPassConfirm, setShowPassConfirm] = useState(true);
  const [image, setImage] = useState('');
  const [oldData, setOldData] = useState([]);
  const refProfilepic = useRef(null);
  const [tempCountryList, setTempCountryList] = useState([]);

  const [userData, setUserData] = useState([]);
  var dispatch = useDispatch();

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const signOutFb = () => {
    try {
      LoginManager.logOut();
      // this.setState({ user: null }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  const takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      cropping: true,
      compressImageQuality: 0.7,
      includeBase64: true,
    }).then(image => {
      setImage(image.path);
      uploadImage(image);
      refProfilepic.current.close();
    });
  };

  const choosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      cropping: true,
      compressImageQuality: 0.7,
      includeBase64: true,
    }).then(image => {
      setImage(image.path);
      uploadImage(image);
      refProfilepic.current.close();
    });
  };

  const removeImage = async () => {
    setImage('https://booksinvoice.com/upload/userprofile_ind/null');
    let body = {
      user_id: userData.id,
      user_type: userData.usertype,
    };
    let result = await postData('api/getRemoveProimg', body);
    if (result.msg == 'Success') {
      ToastAndroid.show(
        'Profile Picture Removed Successfully',
        ToastAndroid.SHORT,
      );
      refProfilepic.current.close();
    } else {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
    }
  };

  const uploadImage = async image => {
    var body = {
      image:
        Platform.OS === 'ios' ? image.path.replace('file://', '') : image.path,
      user_id: userData.id,
      user_type: userData.usertype,
      img_string2: image.data,
    };
    await postData('api/getProfileimg', body).then(res => {
      if (res.msg == 'Success') {
        ToastAndroid.show(
          'Profile Picture uploaded Successfully',
          ToastAndroid.SHORT,
        );
      } else {
        ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      }
    });
  };

  const bottomSheet = () => {
    return (
      <RBSheet
        ref={refProfilepic}
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
        height={height * 0.55}>
        <View style={{...styles.panel, backgroundColor: backgroundColor}}>
          <View style={{alignItems: 'center'}}>
            <Text style={{...styles.panelTitle, color: textColor}}>
              Upload Photo
            </Text>
            <Text style={styles.panelSubtitle}>
              Choose Your Profile Picture
            </Text>
          </View>
          <TouchableOpacity
            style={{...styles.panelButton, backgroundColor: '#ff9000'}}
            onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.panelButton, backgroundColor: '#ff9000'}}
            onPress={choosePhotoFromLibrary}>
            <Text style={styles.panelButtonTitle}>Choose From Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.panelButton, backgroundColor: '#ff9000'}}
            onPress={() => removeImage()}>
            <Text style={styles.panelButtonTitle}>Remove Profile Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{...styles.panelButton, backgroundColor: '#ff9000'}}
            onPress={() => refProfilepic.current.close()}>
            <Text style={styles.panelButtonTitle}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </RBSheet>
    );
  };

  var isLogin = useSelector(state => state.isLogin);

  const fetchProfile = async () => {
    var key = await checkSyncData();

    if (isLogin) {
      var userData = await getSyncData(key[0]);
      setUserData(userData);
    }
  };

  const fetchUserData = async () => {
    if (userData.usertype === 'individual') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'individual',
      };
      var result = await postData('api/getProfile', body);
      setOldData(result.data[0]);
      setName(result.data[0].username);
      setAddress(result.data[0].address);
      setPinCode(result.data[0].zip_pin);
      setCountry(result.data[0].country_id);
      setCountryName(result.country[0].name);
      setState(result.data[0].state_id);
      setStateName(result.state[0].name);
      setCity(result.data[0].district_id);
      setCityName(result.city[0].name);
      setPhone(result.data[0].telephone);
      setEmail(result.data[0].email);
      setCurrentPassword(result.data[0].password);
      setImage(
        `${ServerURL}/upload/userprofile_ind/${result.data[0].profile_img}`,
      );
      blinkingText(result);
      await fetchAllCountry();
      await fetchAllStates(result.data[0].state_id);
      await fetchAllCity(result.data[0].district_id);
    } else if (userData.usertype === 'organisation') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'organisation',
      };
      var result = await postData('api/getProfile', body);
      setOldData(result.data[0]);
      setName(result.data[0].orgnisationname);
      setAddress(result.data[0].address);
      setPinCode(result.data[0].postalcode);
      setCity(result.data[0].district);
      setCityName(result.city[0].name);
      setState(result.data[0].state);
      setStateName(result.state[0].name);
      setCountry(result.data[0].country_id);
      setCountryName(result.country[0].name);
      setPhone(result.data[0].orgnisationcontact);
      setEmail(result.data[0].orgnisationemail);
      setCurrentPassword(result.data[0].password);
      setImage(
        `${ServerURL}/upload/userprofile_org/${result.data[0].profile_img}`,
      );
      blinkingText(result);
      await fetchAllCountry();
      await fetchAllStates(result.data[0].state);
      await fetchAllCity(result.data[0].district);
    }
  };

  const blinkingText = result => {
    if (userData.usertype === 'individual') {
      if (
        result.data[0].username === '' ||
        result.data[0].address === '' ||
        result.data[0].zip_pin === '' ||
        result.state[0].name === '' ||
        result.city[0].name === '' ||
        result.data[0].telephone === '' ||
        result.data[0].email === ''
      ) {
        return setShowText(true);
      } else {
        return setShowText(false);
      }
    } else if (userData.usertype === 'organisation') {
      if (
        result.data[0].orgnisationname === '' ||
        result.data[0].address === '' ||
        result.data[0].postalcode === '' ||
        result.city[0].name === '' ||
        result.state[0].name === '' ||
        result.data[0].orgnisationcontact === '' ||
        result.data[0].orgnisationemail === ''
      ) {
        return setShowText(true);
      } else {
        return setShowText(false);
      }
    }
  };

  const fetchAllCountry = async () => {
    var body = {type: 1};
    var result = await postData('api/getCountry', body);
    setCountryList(result.data);
    let tempArr = [];
    result.data.map(item => {
      tempArr.push({
        id: item.id,
        title: item.name,
      });
    });
    setTempCountryList(tempArr);
  };

  const fetchAllStates = async id => {
    var body = {type: 1, country_id: id};
    var result = await postData('api/getState', body);
    if (result.msg !== 'Profile Not Available') {
      let tempArr = [];
      result.data.map(item => {
        tempArr.push({
          id: item.id,
          title: item.name,
        });
      });
      setStateList(tempArr);
    }
  };

  const fetchAllCity = async id => {
    var body = {type: 1, state_id: id};
    var result = await postData('api/getCity', body);
    if (result.msg !== 'Profile Not Available') {
      let tempArr = [];
      result.data.map(item => {
        tempArr.push({
          id: item.id,
          title: item.name,
        });
      });
      setCityList(tempArr);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchAllCountry();
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [userData]);

  const [visible, setVisible] = useState(false);
  const toggleOverlay = () => {
    setVisible(!visible);
  };

  function capitalizeFirstLetter(string) {
    if (string === null || string === undefined || string === '') {
      return '';
    }
    return string[0].toUpperCase() + string.slice(1);
  }

  const editUser = async () => {
    if (newPassword !== confirmPassword) {
      alert('Password not match with confirm password');
    } else {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: capitalizeFirstLetter(userData.usertype),
        name: name,
        address: address,
        email: email,
        country_id: country,
        state_id: state,
        city_id: city,
        contact: phone,
        pincode: pinCode,
        old_password: currentPassword,
        new_password: newPassword,
      };
      var result = await postData('api/getProfileedit', body);
      // console.log(result);
      if (result.data == 1) {
        if (
          name === '' ||
          address === '' ||
          email === '' ||
          phone === '' ||
          pinCode === '' ||
          country === '' ||
          state === '' ||
          city === ''
        ) {
          Alert.alert(
            'Profile Updated Successfully',
            result.free_id !== null &&
              'Please update all details to activate trial pack!',
          );
        } else {
          Alert.alert(
            'Profile Updated Successfully',
            result.free_id !== null &&
              result.status == 'newuser' &&
              'Your trial pack is active now!',
          );
          dispatch({
            type: 'SET_STATUS',
            payload: {isLogin: true, isSubscribed: true},
          });
        }
        fetchProfile();
        fetchUserData();
        toggleOverlay();
        storeDatasync(userData.id, {
          id: userData.id,
          user_name: name,
          useremail: email,
          usertype: userData.usertype,
        });
        dispatch({
          type: 'ADD_USER',
          payload: [
            userData.id,
            {
              id: userData.id,
              user_name: name,
              useremail: email,
              usertype: userData.usertype,
            },
          ],
        });
      } else {
        alert('Something went wrong');
      }
    }
  };

  const getLocation = async text => {
    setPinCode(text);
    // if (text.length == 6) {
    //   const response = await fetch(
    //     `https://api.postalpincode.in/pincode/${text}`,
    //   );
    //   const data = await response.json();
    //   if (data[0].Status == 'Success') {
    //     console.log(data[0].PostOffice[0].Name);
    //     console.log(data[0].PostOffice[0].District);
    //     console.log(data[0].PostOffice[0].State);
    //     console.log(data[0].PostOffice[0].Pincode);
    //   }
    // }
  };

  const closeModal = () => {
    setVisible(false);
    if (userData.usertype === 'individual') {
      setName(oldData.username);
      setAddress(oldData.address);
      setPinCode(oldData.zip_pin);
      setCountry(oldData.country_id);
      setCountryName(oldData.name);
      setState(oldData.state_id);
      setStateName(oldData.name);
      setCity(oldData.district_id);
      setCityName(oldData.name);
      setPhone(oldData.telephone);
      setEmail(oldData.email);
      setCurrentPassword(oldData.password);
    } else {
      setName(oldData.orgnisationname);
      setAddress(oldData.address);
      setPinCode(oldData.postalcode);
      setCity(oldData.district);
      setCityName(oldData.name);
      setState(oldData.state);
      setStateName(oldData.name);
      setCountry(oldData.country_id);
      setCountryName(oldData.name);
      setPhone(oldData.orgnisationcontact);
      setEmail(oldData.orgnisationemail);
      setCurrentPassword(oldData.password);
    }
  };

  const editProfile = () => {
    return (
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => closeModal()}>
        <View style={styles.centeredView}>
          <KeyboardAvoidingView behavior="padding">
            <View
              style={[styles.modalView, {backgroundColor: backgroundColor}]}>
              <View style={{margin: 10}}>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '800',
                    color: textColor,
                    padding: 10,
                    textAlign: 'center',
                  }}>
                  Edit Profile
                </Text>
                <Divider
                  style={{backgroundColor: textColor, width: width * 0.4}}
                />
              </View>
              <View style={{padding: 5}}>
                <TextInput
                  value={name}
                  onChangeText={text => setName(text)}
                  style={[
                    styles.textInput,
                    {borderBottomColor: 'gray', color: textColor},
                  ]}
                  placeholder="Name"
                  placeholderTextColor="#999"
                />
                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    value={address}
                    onChangeText={text => setAddress(text)}
                    style={[
                      styles.textInput,
                      {
                        borderBottomColor: 'gray',
                        width: width * 0.4,
                        marginRight: 10,
                        color: textColor,
                      },
                    ]}
                    placeholder="Address"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    value={pinCode}
                    onChangeText={text => getLocation(text)}
                    style={[
                      styles.textInput,
                      {
                        borderBottomColor: 'gray',
                        width: width * 0.4,
                        color: textColor,
                      },
                    ]}
                    placeholder="Pin Code"
                    placeholderTextColor="#999"
                  />
                </View>
                <AutocompleteDropdown
                  clearOnFocus={false}
                  // closeOnBlur={true}
                  closeOnSubmit={false}
                  initialValue={{id: country, title: countryName}} // or just '2'
                  dataSet={tempCountryList}
                  textInputProps={{
                    placeholder: '-Select Country-',
                    placeholderTextColor: '#999',
                    fontSize: 14,
                    color: textColor,
                    // value: countryName,
                  }}
                  suggestionsListContainerStyle={{
                    backgroundColor: backgroundColor,
                  }}
                  suggestionsListTextStyle={{
                    color: textColor,
                  }}
                  inputContainerStyle={[
                    styles.textInput,
                    {
                      backgroundColor: backgroundColor,
                      color: textColor,
                      borderBottomColor: '#999',
                      borderRadius: 0,
                      justifyContent: 'flex-end',
                    },
                  ]}
                  onFocus={() => {
                    setStateName('');
                  }}
                  onChangeText={item => {
                    setCountryName(item);
                  }}
                  onSelectItem={itemValue => {
                    if (itemValue !== null) {
                      setCountry(itemValue.id);
                      fetchAllStates(itemValue.id);
                    }
                  }}
                />
                <AutocompleteDropdown
                  clearOnFocus={true}
                  showClear={false}
                  closeOnSubmit={false}
                  initialValue={{id: state, title: stateName}} // or just '2'
                  dataSet={stateList}
                  textInputProps={{
                    placeholder: '-Select State-',
                    placeholderTextColor: '#999',
                    fontSize: 14,
                    color: textColor,
                    value: stateName,
                  }}
                  suggestionsListContainerStyle={{
                    backgroundColor: backgroundColor,
                  }}
                  suggestionsListTextStyle={{
                    color: textColor,
                  }}
                  inputContainerStyle={[
                    styles.textInput,
                    {
                      backgroundColor: backgroundColor,
                      color: textColor,
                      borderBottomColor: '#999',
                      borderRadius: 0,
                      justifyContent: 'flex-end',
                    },
                  ]}
                  onFocus={() => {
                    setCityName('');
                  }}
                  onChangeText={item => {
                    setStateName(item);
                  }}
                  onSelectItem={itemValue => {
                    if (itemValue !== null) {
                      setState(itemValue.id);
                      setStateName(itemValue.title);
                      fetchAllCity(itemValue.id);
                    }
                  }}
                />
                <AutocompleteDropdown
                  clearOnFocus={true}
                  showClear={false}
                  closeOnSubmit={false}
                  initialValue={{id: city, title: cityName}} // or just '2'
                  dataSet={cityList}
                  textInputProps={{
                    placeholder: '-Select City-',
                    placeholderTextColor: '#999',
                    fontSize: 14,
                    color: textColor,
                    value: cityName,
                  }}
                  suggestionsListContainerStyle={{
                    backgroundColor: backgroundColor,
                  }}
                  suggestionsListTextStyle={{
                    color: textColor,
                  }}
                  inputContainerStyle={[
                    styles.textInput,
                    {
                      backgroundColor: backgroundColor,
                      color: textColor,
                      borderBottomColor: '#999',
                      borderRadius: 0,
                      justifyContent: 'flex-end',
                    },
                  ]}
                  onChangeText={item => {
                    setCityName(item);
                  }}
                  onSelectItem={itemValue => {
                    if (itemValue !== null) {
                      setCity(itemValue.id);
                      setCityName(itemValue.title);
                    }
                  }}
                />

                <View style={{flexDirection: 'row'}}>
                  <TextInput
                    value={phone}
                    editable={phone.length < 10}
                    onChangeText={text => setPhone(text)}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: backgroundColor,
                        width: width * 0.3,
                        color: textColor,
                        borderBottomColor: '#999',
                        borderRadius: 0,
                        justifyContent: 'flex-end',
                        marginRight: 10,
                      },
                    ]}
                    placeholder="Contact Number"
                    placeholderTextColor="#999"
                  />
                  <TextInput
                    value={email}
                    editable={false}
                    onChangeText={text => setEmail(text)}
                    style={[
                      styles.textInput,
                      {
                        backgroundColor: backgroundColor,
                        width: width * 0.5,
                        color: textColor,
                        borderBottomColor: '#999',
                        borderRadius: 0,
                        justifyContent: 'flex-end',
                        // padding: 5,
                      },
                    ]}
                    placeholder="Email"
                    placeholderTextColor="#999"
                  />
                </View>
                <View
                  style={[
                    styles.textInput,
                    {
                      borderBottomColor: 'gray',
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <TextInput
                    value={currentPassword}
                    secureTextEntry={showPass}
                    onChangeText={text => setCurrentPassword(text)}
                    style={{color: textColor, width: width * 0.72}}
                    placeholder="Current Password"
                    placeholderTextColor="#999"
                  />
                  <MaterialCommunityIcons
                    onPress={() => setShowPass(!showPass)}
                    style={{marginHorizontal: 10}}
                    name={showPass ? 'eye-off' : 'eye'}
                    size={25}
                    color={textColor}
                  />
                </View>
                <View
                  style={[
                    styles.textInput,
                    {
                      borderBottomColor: 'gray',
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <TextInput
                    // value={newPassword}
                    secureTextEntry={showPassNew}
                    onChangeText={text => setNewPassword(text)}
                    style={{color: textColor, width: width * 0.72}}
                    placeholder="New Password"
                    placeholderTextColor="#999"
                  />
                  <MaterialCommunityIcons
                    onPress={() => setShowPassNew(!showPassNew)}
                    style={{marginHorizontal: 10}}
                    name={showPassNew ? 'eye-off' : 'eye'}
                    size={25}
                    color={textColor}
                  />
                </View>
                <View
                  style={[
                    styles.textInput,
                    {
                      borderBottomColor: 'gray',
                      flexDirection: 'row',
                      alignItems: 'center',
                    },
                  ]}>
                  <TextInput
                    secureTextEntry={showPassConfirm}
                    // value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                    style={{color: textColor, width: width * 0.72}}
                    placeholder="Confirm Password"
                    placeholderTextColor="#999"
                  />
                  <MaterialCommunityIcons
                    onPress={() => setShowPassConfirm(!showPassConfirm)}
                    style={{marginHorizontal: 10}}
                    name={showPassConfirm ? 'eye-off' : 'eye'}
                    size={25}
                    color={textColor}
                  />
                </View>
              </View>
              <View style={{padding: 20, flexDirection: 'row'}}>
                <Button
                  onPress={() => editUser()}
                  title="Save Changes"
                  buttonStyle={{
                    backgroundColor: '#ff9000',
                    borderRadius: 30,
                    padding: 10,
                  }}
                  containerStyle={{
                    width: 150,
                    marginVertical: 10,
                  }}
                  titleStyle={{fontWeight: 'bold', color: 'black'}}
                />
                <Button
                  onPress={() => closeModal()}
                  containerStyle={{
                    width: 100,
                    marginVertical: 10,
                  }}
                  title="Cancel"
                  type="clear"
                  titleStyle={{color: textColor}}
                />
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    );
  };

  const handleLogout = async () => {
    setShow(true);
    await TrackPlayer.destroy();
    signOut();
    signOutFb();
    await removeDatasync(userData.id);
    // storeDatasync('isLogin', false);
    dispatch({
      type: 'SET_STATUS',
      payload: {isLogin: false, isSubscribed: false},
    });
    dispatch({type: 'REMOVE_ALL_CART'});
    // storeDatasync('isSubscribed', false);
    navigation.navigate('Homepage');
    // dispatch({type: 'REMOVE_USER', payload: userData.id});
    setShow(false);
    ToastAndroid.show('Logout Successfully', ToastAndroid.SHORT);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <Card
        containerStyle={{
          elevation: 5,
          backgroundColor: backgroundColor,
          borderRadius: 10,
          width: '90%',
          alignItems: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <View style={{marginBottom: 20}}>
            <Avatar
              size={120}
              rounded
              source={
                image.substring(image.length - 4) !== `null`
                  ? {uri: image || '../images/tempProfile.jpg'}
                  : require('../images/tempProfile.jpg')
              }
              containerStyle={{borderColor: '#ff9000', borderWidth: 1}}>
              <Avatar.Accessory
                size={44}
                color="black"
                onPress={() => refProfilepic.current.open()}
              />
            </Avatar>
          </View>
          {bottomSheet()}
          <View>
            <Text style={[styles.username, {color: textColor}]}>
              {userData.user_name}
            </Text>
            <Text style={[styles.useremail, {color: textColor}]}>
              {userData.useremail}
            </Text>
            <Text style={[styles.usertype, {color: textColor}]}>
              {capitalizeFirstLetter(userData.usertype)}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                display: showText ? 'flex' : 'none',
              }}>
              <Text
                style={{color: textColor, fontSize: 11, textAlign: 'center'}}>
                Update your profile & Activate Free Trial Without Adding Any
                Debit or Credit Card
              </Text>
              <AnimatedLottieView
                source={require('../images/blink.json')}
                style={{width: 8, height: 8}}
                autoPlay
                loop
              />
            </View>
          </View>
        </View>
      </Card>
      <Divider />
      <ScrollView
        persistentScrollbar
        style={styles.listWrapper}
        contentContainerStyle={{alignItems: 'flex-start'}}>
        <TouchableOpacity onPress={() => toggleOverlay()}>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              Update Profile
            </ListItem.Title>
            <ListItem.Subtitle
              style={{fontSize: 12, fontWeight: '300', color: textColor}}>
              Update your profile
            </ListItem.Subtitle>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('MyBooks')}>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              My Premium Books
            </ListItem.Title>
            <ListItem.Subtitle
              style={{fontSize: 12, fontWeight: '300', color: textColor}}>
              View all your premium books
            </ListItem.Subtitle>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('FavouriteBooks')}>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              My Playlist
            </ListItem.Title>
            <ListItem.Subtitle
              style={{fontSize: 12, fontWeight: '300', color: textColor}}>
              View all your favourite books
            </ListItem.Subtitle>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserSubscriptions')}>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              My Subscriptions
            </ListItem.Title>
            <ListItem.Subtitle
              style={{fontSize: 12, fontWeight: '300', color: textColor}}>
              View your subscriptions
            </ListItem.Subtitle>
          </ListItem>
        </TouchableOpacity>
        {userData.usertype === 'individual' ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('ActivationLink', {userData})}>
            <ListItem
              containerStyle={[
                styles.listContainer,
                {backgroundColor: backgroundColor},
              ]}>
              <ListItem.Title
                style={{fontSize: 18, fontWeight: '800', color: textColor}}>
                Received Activation Link
              </ListItem.Title>
              <ListItem.Subtitle
                style={{fontSize: 12, fontWeight: '300', color: textColor}}>
                View Activation Link From Your Organization
              </ListItem.Subtitle>
            </ListItem>
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity onPress={() => navigation.navigate('Download')}>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              My Downloads
            </ListItem.Title>
            <ListItem.Subtitle
              style={{fontSize: 12, fontWeight: '300', color: textColor}}>
              View all your downloads
            </ListItem.Subtitle>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLogout()}>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              Log Out
            </ListItem.Title>
            {show ? <ActivityIndicator /> : null}
          </ListItem>
        </TouchableOpacity>
      </ScrollView>
      {editProfile()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  },
  username: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '800',
    padding: 3,
  },
  useremail: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    padding: 3,
  },
  usertype: {fontSize: 14, fontWeight: '300', textAlign: 'center', padding: 3},
  listWrapper: {
    display: 'flex',
    width: width * 0.95,
    padding: 0,
    marginHorizontal: 20,
    // height: height * 0.1,
  },
  listitem: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  listContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
    height: height * 0.09,
  },
  textInput: {borderBottomWidth: 1, width: width * 0.83},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 15,
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
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
    // shadowColor: '#000000',
    // shadowOffset: {width: 0, height: 0},
    // shadowRadius: 5,
    // shadowOpacity: 0.4,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    // elevation: 5,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 20,
  },
  panelSubtitle: {
    fontSize: 14,
    color: 'gray',
    height: 30,
    marginBottom: 10,
  },
  panelButton: {
    padding: 13,
    borderRadius: 10,
    backgroundColor: '#FF6347',
    alignItems: 'center',
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
  },
});
