import { GoogleSignin } from '@react-native-google-signin/google-signin';
import {Picker} from '@react-native-picker/picker';
import React, {useEffect, useState} from 'react';
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
} from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Divider,
  ListItem,
} from 'react-native-elements';
import {useDispatch} from 'react-redux';
import {checkSyncData, getSyncData, removeDatasync, storeDatasync} from './AsyncStorage';
import {postData} from './FetchApi';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const EditProfile = ({navigation}) => {

  const { theme } = React.useContext(ThemeContext);

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
  const [countryList, setCountryList] = useState([]);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [show, setShow] = useState(false);
  const [showText, setShowText] = useState(false);

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

  const fetchProfile = async () => {
    var key = await checkSyncData();

    if (key) {
      var userData = await getSyncData(key[0]);
      setUserData(userData);
    }
  };

  const fetchUserData = async () => {
    if (userData.usertype === 'Individual') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'individual',
      };
      var result = await postData('api/getProfile', body);
      setName(result.data[0].username);
      setAddress(result.data[0].address);
      setPinCode(result.data[0].zip_pin);
      setCountry(result.data[0].country_id);
      setState(result.data[0].state_id);
      setStateName(result.state[0].name);
      setCity(result.data[0].district_id);
      setCityName(result.city[0].name);
      setPhone(result.data[0].telephone);
      setEmail(result.data[0].email);
      blinkingText(result.data[0])
    } else if (userData.usertype === 'Organisation') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'organisation',
      };
      var result = await postData('api/getProfile', body);
      setName(result.data[0].orgnisationname);
      setAddress(result.data[0].address);
      setPinCode(result.data[0].postalcode);
      setCity(result.data[0].district);
      setCityName(result.city[0].name);
      setState(result.data[0].state);
      setStateName(result.state[0].name);
      setCountry(result.data[0].country_id);
      setPhone(result.data[0].orgnisationcontact);
      setEmail(result.data[0].orgnisationemail);
      // setCurrentPassword(result.data[0].password);
    }
  };

  const blinkingText = (result) => {
    setShowText(true);
    setTimeout(() => {
      setShowText(false);
    }, 1000);
  }

  const fetchAllCountry = async () => {
    var body = {type: 1};
    var result = await postData('api/getCountry', body);
    setCountryList(result.data);
  };

  const fillCountry = () => {
    return countryList.map((item, index) => {
      return <Picker.Item label={item.name} value={item.id} />;
    });
  };

  const fetchAllStates = async id => {
    var body = {type: 1, country_id: id};
    var result = await postData('api/getState', body);
    if (result.msg !== 'Profile Not Available') {
      setStateList(result.data);
    }
  };

  const fillState = () => {
    if (stateList.length) {
      return stateList.map((item, index) => {
        return <Picker.Item label={item.name} value={item.id} />;
      });
    } else {
      return <Picker.Item label={stateName} value={state} />;
    }
  };

  const fetchAllCity = async id => {
    var body = {type: 1, state_id: id};
    var result = await postData('api/getCity', body);
    if (result.msg !== 'Profile Not Available') {
      setCityList(result.data);
    }
  };

  const fillCity = () => {
    if (cityList.length) {
      return cityList.map((item, index) => {
        return <Picker.Item label={item.name} value={item.id} />;
      });
    } else {
      return <Picker.Item label={cityName} value={city} />;
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

  const editUser = async () => {
    if (currentPassword === '' && newPassword === '') {
      if (newPassword !== confirmPassword) {
        alert('Password not match with confirm password');
      } else {
        var body = {
          type: 1,
          user_id: userData.id,
          user_type: userData.usertype,
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
        // alert(userData.id)
        if (result.data == 1) {
          alert('Profile Updated Successfully');
          fetchProfile();
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
    } else if (currentPassword !== '' && newPassword !== '') {
      if (newPassword !== confirmPassword) {
        alert('Password not match with confirm password');
      } else {
        var body = {
          type: 1,
          user_id: userData.id,
          user_type: userData.usertype,
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
        // alert(userData.id)
        if (result.data == 1) {
          alert('Profile Updated Successfully');
          fetchProfile();
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
    } else {
      alert('Please enter new password');
    }
  };

  const editProfile = () => {
    return (
      <Modal
        statusBarTranslucent
        animationType="slide"
        transparent={true}
        visible={visible}>
        <View style={styles.centeredView}>
          <View style={[styles.modalView, {backgroundColor: backgroundColor}]}>
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
                style={[styles.textInput, {borderBottomColor: 'gray',color:textColor}]}
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
                      color:textColor
                    },
                  ]}
                  placeholder="Address"
                  placeholderTextColor="#999"
                />
                <TextInput
                  value={pinCode}
                  onChangeText={text => setPinCode(text)}
                  style={[
                    styles.textInput,
                    {borderBottomColor: 'gray', width: width * 0.4,color:textColor},
                  ]}
                  placeholder="Pin Code"
                  placeholderTextColor="#999"
                />
              </View>
              <Picker
                selectedValue={country}
                style={[styles.textInput, {borderWidth: 1, marginVertical: 10,color:textColor}]}
                mode="dropdown"
                onValueChange={(itemValue, itemIndex) => {
                  setCountry(itemValue);
                  fetchAllStates(itemValue);
                }}>
                <Picker.Item
                  label="-Select Country-"
                  value="0"
                  enabled={false}
                />
                {fillCountry()}
              </Picker>
              <View style={{flexDirection: 'row'}}>
                <Picker
                  selectedValue={state}
                  style={[
                    styles.textInput,
                    {borderWidth: 1, width: width * 0.4, marginRight: 10,color:textColor},
                  ]}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) => {
                    setState(itemValue);
                    fetchAllCity(itemValue);
                  }}>
                  <Picker.Item label="-Select State-" value="0" />
                  {fillState()}
                </Picker>
                <Picker
                  selectedValue={city}
                  style={[
                    styles.textInput,
                    {borderWidth: 1, width: width * 0.4,color:textColor},
                  ]}
                  mode="dropdown"
                  onValueChange={(itemValue, itemIndex) => {
                    setCity(itemValue);
                  }}>
                  <Picker.Item label="-Select City-" value="" />
                  {fillCity()}
                </Picker>
              </View>

              <TextInput
                value={phone}
                onChangeText={text => setPhone(text)}
                style={[styles.textInput, {borderBottomColor: 'gray',color:textColor}]}
                placeholder="Contact Number"
                placeholderTextColor="#999"
              />
              <TextInput
                value={email}
                editable={false}
                onChangeText={text => setEmail(text)}
                style={[styles.textInput, {borderBottomColor: 'gray',color:textColor}]}
                placeholder="Email"
                placeholderTextColor="#999"
              />
              <TextInput
                value={currentPassword}
                secureTextEntry
                onChangeText={text => setCurrentPassword(text)}
                style={[styles.textInput, {borderBottomColor: 'gray',color:textColor}]}
                placeholder="Current Password"
                placeholderTextColor="#999"
              />
              <TextInput
                value={newPassword}
                secureTextEntry
                onChangeText={text => setNewPassword(text)}
                style={[styles.textInput, {borderBottomColor: 'gray',color:textColor}]}
                placeholder="New Password"
                placeholderTextColor="#999"
              />
              <TextInput
                secureTextEntry
                value={confirmPassword}
                onChangeText={text => setConfirmPassword(text)}
                style={[styles.textInput, {borderBottomColor: 'gray',color:textColor}]}
                placeholder="Confirm Password"
                placeholderTextColor="#999"
              />
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
                onPress={() => toggleOverlay()}
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
        </View>
      </Modal>
    );
  };

  const handleLogout = async () => {
    setShow(true);
    signOut()
    await removeDatasync(userData.id);
    storeDatasync('isLogin', false);
    dispatch({
      type: 'SET_STATUS',
      payload: {isLogin: false, isSubscribed: false},
    });
    storeDatasync('isSubscribed', false);
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
              icon={{name: 'user', type: 'antdesign', color: 'black'}}
              containerStyle={{backgroundColor: '#ff9000'}}>
              <Avatar.Accessory
                size={44}
                color="black"
                onPress={() => toggleOverlay()}
              />
            </Avatar>
          </View>
          <View>
            <Text style={[styles.username, {color: textColor}]}>
              {userData.user_name}
            </Text>
            <Text style={[styles.useremail, {color: textColor}]}>
              {userData.useremail}
            </Text>
            <Text style={[styles.usertype, {color: textColor}]}>
              {userData.usertype}
            </Text>
          <Text style={{color: 'red',fontSize:9}}>
          Update your profile & Activate Free Trial Without Adding Any Debit or Credit Card</Text>

          </View>
        </View>
      </Card>
      <Divider />
      <View style={styles.listWrapper}>
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
        <TouchableOpacity>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              My Books
            </ListItem.Title>
            <ListItem.Subtitle
              style={{fontSize: 12, fontWeight: '300', color: textColor}}>
              View all your books
            </ListItem.Subtitle>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('FavouriteBooks')}>
          <ListItem
            containerStyle={[
              styles.listContainer,
              {backgroundColor: backgroundColor},
            ]}>
            <ListItem.Title
              style={{fontSize: 18, fontWeight: '800', color: textColor}}>
              My Favorites
            </ListItem.Title>
            <ListItem.Subtitle
              style={{fontSize: 12, fontWeight: '300', color: textColor}}>
              View all your favorite books
            </ListItem.Subtitle>
          </ListItem>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.navigate('UserSubscriptions')}>
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
        <TouchableOpacity>
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
      </View>
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
    fontWeight: '800',
    textAlign: 'center',
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
    alignItems: 'flex-start',
    width: width * 0.95,
    padding: 10,
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
    height:height*0.083
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
});
