import LottieView from 'lottie-react-native';
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Image,
  StatusBar,
  Alert,
  Linking,
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {postData} from './FetchApi';
import {checkSyncData, getSyncData, storeDatasync} from './AsyncStorage';

export const WelcomePage = ({navigation}) => {
  var dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const fetch = async () => {
    let languageid = await getSyncData('languageid');
    let theme = await getSyncData('theme');
    var body = {type: 1, languageid: languageid || '1'};
    var data = await postData('api/getHome', body);
    // console.log('data', data);
    // console.log('data.status', body);

    dispatch({type: 'SET_HOME', payload: data});
    dispatch({type: 'SET_THEME', payload: theme || 'dark'});
    let infoPageData = {
      newArrivals: data?.new_arrival,
      popular: data?.populars_books,
      topRated: data?.top_rated,
      premium: data?.Premium_books,
    };
    await storeDatasync('infoPageData', infoPageData); // store infopage data in async storage
    dispatch({type: 'SET_LANG', payload: languageid || '1'});
    fetchProfile();
    setShow(true);
  };

  var isLogin = useSelector(state => state.isLogin);

  const fetchProfile = async () => {
    var key = await checkSyncData();

    if (isLogin) {
      var userData = await getSyncData(key[0]);
      fetchUserData(userData);
      var body1 = {
        type: 1,
        user_id: userData?.id,
        user_type: userData?.usertype,
      };
      var result = await postData('api/getSubscription', body1);
      if (result?.msg === 'Subscribed') {
        dispatch({
          type: 'SET_STATUS',
          payload: {isLogin: true, isSubscribed: true},
        });
        // storeDatasync('isSubscribed', true);
      } else {
        dispatch({
          type: 'SET_STATUS',
          payload: {isLogin: true, isSubscribed: false},
        });
        // storeDatasync('isSubscribed', false);
      }
      var cart = await postData('api/getShowcart', body1);
      // console.log('cart', cart);
      if (cart.msg === 'Success') {
        cart?.data?.map(item => {
          dispatch({type: 'ADD_CART', payload: [item?.book_id, item]});
        });
      }
      // var cartData = await getSyncData('cart');
      // if (cartData != null) {
      //   dispatch({type: 'ADD_ALL_CART', payload: cartData});
      // }
    }
  };

  const fetchUserData = async userData => {
    if (userData.usertype === 'individual') {
      var body = {
        type: 1,
        user_id: userData?.id,
        user_type: 'individual',
      };
      var result = await postData('api/getProfile', body);

      if (result.free_id !== null) {
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
      }
    } else if (userData.usertype === 'organisation') {
      var body = {
        type: 1,
        user_id: userData?.id,
        user_type: 'organisation',
      };
      var result = await postData('api/getProfile', body);
      if (result.free_id !== null) {
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
    }
  };

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        fetch();
      } else {
        navigation.navigate('OfflineScreen');
      }
    });
  }, []);

  useEffect(() => {
    if (show) {
      const checkLinking = async () => {
        const initialUrl = await Linking.getInitialURL();
        if (initialUrl) {
          var matches = initialUrl.match(/\d+/g);
          // navigation.navigate('InfoPage', { category : matches[0],state : matches[1] });
          navigation.navigate('MyTabs', {
            screen: 'HomeComponent',
            params: {
              screen: 'InfoPage',
              params: {category: matches[0], state: matches[1], nested: true},
            },
          });
        } else {
          navigation.navigate('MyTabs');
        }
      };
      checkLinking();
    }
  }, [show]);

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#e30047'}]}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="#bf6d01"
      />
      <Image
        style={{
          width: 300,
          height: 300,
          borderRadius: 0,
          marginTop: 100,
          marginBottom: 20,
        }}
        source={require('../images/logo.jpg')}
      />

      <LottieView
        source={require('../images/loader2.json')}
        style={{width: 100, height: 100}}
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
