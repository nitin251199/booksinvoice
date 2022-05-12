import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { postData } from './FetchApi';
import { checkSyncData, getSyncData } from './AsyncStorage';


export const WelcomePage = ({navigation}) => {

  var dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const fetch = async () => {
    var body = {type: 1 };
    var data = await postData('api/getHome', body);
    
    dispatch({type: 'SET_HOME', payload: data});
    fetchProfile();
    setShow(true);
  };

  const fetchProfile = async () => {
    var key = await checkSyncData();

    if (key[0] != 'fcmToken') {
      var userData = await getSyncData(key[0]);
        fetchUserData(userData);
    }
  };

  const fetchUserData = async userData => {
    if (userData.usertype === 'individual') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'individual',
      };
      var result = await postData('api/getProfile', body);

      if (
        result.data[0].username === '' ||
        result.data[0].address === '' ||
        result.data[0].zip_pin === '' ||
        result.state[0].name === '' ||
        result.city[0].name === '' ||
        result.data[0].telephone === '' ||
        result.data[0].email === ''
      ) {
        Alert.alert(
          'Update Your Profile & Activate Free Trial',
          'Without Adding Any Debit or Credit Card',
          [
            {
              text: 'Ask me later',
              // onPress: () => console.log("Cancel Pressed"),
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => navigation.navigate('EditProfile'),
            },
          ],
        );
      }
    } else if (userData.usertype === 'organisation') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'organisation',
      };
      var result = await postData('api/getProfile', body);
      if (
        result.data[0].orgnisationname === '' ||
        result.data[0].address === '' ||
        result.data[0].postalcode === '' ||
        result.city[0].name === '' ||
        result.state[0].name === '' ||
        result.data[0].orgnisationcontact === '' ||
        result.data[0].orgnisationemail === ''
      ) {
        Alert.alert(
          'Update Your Profile & Activate Free Trial',
          'Without Adding Any Debit or Credit Card',
          [
            {
              text: 'Ask me later',
              // onPress: () => console.log("Cancel Pressed"),
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => navigation.navigate('EditProfile'),
            },
          ],
        );
      }
    }
  };

  

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if( state.isConnected == true )
      {
         fetch();
      }
      else
      {
        navigation.navigate('OfflineScreen')
      }
   
     });
  }, []);

  useEffect(()=> {
    if(show){
        navigation.navigate('MyTabs')
    }
  },[show])

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#e30047'}]}>
      <StatusBar barStyle='dark-content' translucent backgroundColor='#bf6d01' />
      <Image
        style={{width: 150, height: 150, borderRadius: 0,marginTop:100,marginBottom:40}}
        source={require('../images/logo.jpg')}
      />
      
        <LottieView
	        source={require("../images/loader2.json")}
	        style={{ width: 100, height: 100 }}
	        autoPlay
	        loop
	      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
