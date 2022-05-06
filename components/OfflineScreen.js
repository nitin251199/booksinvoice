import React, {useContext, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Button} from 'react-native-paper';
import {ThemeContext} from './ThemeContext';
import NetInfo from '@react-native-community/netinfo';
import {postData} from './FetchApi';
import {useDispatch} from 'react-redux';

const {width, height} = Dimensions.get('window');

export const OfflineScreen = ({navigation}) => {
  const {theme} = useContext(ThemeContext);

  const dispatch = useDispatch();

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    var body = {type: 1};
    var data = await postData('api/getHome', body);

    dispatch({type: 'SET_HOME', payload: data});
    setShow(true);
    setLoading(false);
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
