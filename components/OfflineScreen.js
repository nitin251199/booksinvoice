import React, {useContext, useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import {useSelector} from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
import {postData} from './FetchApi';
import {useDispatch} from 'react-redux';
import {checkSyncData, getSyncData, storeDatasync} from './AsyncStorage';

const {width, height} = Dimensions.get('window');

export const OfflineScreen = ({navigation}) => {
  const theme = useSelector(state => state.theme);

  const dispatch = useDispatch();

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    let languageid = await getSyncData('languageid');
    var body = {type: 1, languageid: languageid || '1'};
    var data = await postData('api/getHome', body);

    dispatch({type: 'SET_HOME', payload: data});
    let infoPageData = {
      newArrivals: data.new_arrival,
      popular: data.populars_books,
      topRated: data.top_rated,
      premium: data.Premium_books,
    };
    await storeDatasync('infoPageData', infoPageData);
    fetchProfile();
    setShow(true);
    setLoading(false);
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
    if (show) {
      navigation.navigate('MyTabs');
    }
  }, [show]);

  const handleClick = () => {
    setLoading(true);
    NetInfo.fetch().then(state => {
      if (state.isConnected == true) {
        fetch();
      } else {
      }
    });
  };

  return (
    <View style={{...styles.container, backgroundColor: backgroundColor}}>
      <StatusBar barStyle={'dark-content'} />
      <Image source={require('../images/nowifi.png')} style={styles.image} />
      <Text style={{...styles.heading1, color: textColor}}>Dear BIV User,</Text>
      <Text style={{...styles.heading2, color: textColor}}>You're offline</Text>
      <Text style={{...styles.heading3, color: '#999', textAlign: 'center'}}>
        Please check your internet connection and try again
      </Text>
      <Button
        icon="refresh"
        onPress={handleClick}
        loading={loading}
        style={{backgroundColor: '#2196F3'}}
        contentStyle={{height: 55, width: width * 0.87, alignItems: 'center'}}
        dark
        mode="contained">
        Try Again
      </Button>
      <Button
        icon="download"
        onPress={() => navigation.navigate('Download')}
        style={{backgroundColor: '#ff9000', marginTop: 10}}
        contentStyle={{height: 55, width: width * 0.87, alignItems: 'center'}}
        dark
        mode="contained">
        Go To Downloads
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 170,
    height: 170,
    margin: 20,
  },
  heading1: {
    fontSize: 20,
    fontWeight: '600',
    padding: 10,
  },
  heading2: {
    fontSize: 24,
    fontWeight: '700',
    padding: 5,
  },
  heading3: {
    fontSize: 14,
    fontWeight: '500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
});
