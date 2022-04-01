import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Image,
  ToastAndroid,
} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { postData } from './FetchApi';


export const WelcomePage = ({navigation}) => {

  var dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const fetch = async () => {
    var body = {type: 1};
    var data = await postData('api/getHome', body);

    dispatch({type: 'SET_HOME', payload: data});
    setShow(true);
  };

  
  const unsubscribe = NetInfo.addEventListener(state => {
    if( state.isConnected == true )
    {
       fetch();
    }
  });

  useEffect(() => {
    NetInfo.fetch().then(state => {
      if( state.isConnected == true )
      {
         fetch();
      }
      else
      {
         let error_msg =  'Please connect your device with internet and try again.';
         ToastAndroid.show(error_msg, ToastAndroid.SHORT);
      }
   
     });
  }, []);

  useEffect(()=> {
    if(show){
        navigation.navigate('MyTabs')
        unsubscribe()
    }
  },[show])

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: '#e30047'}]}>
      <Image
        style={{width: 150, height: 150, borderRadius: 0,marginTop:100,marginBottom:40}}
        source={require('../images/logo.jpg')}
      />
      {/* <Text style={{fontWeight: '800', color: '#FFF', fontSize: 22,padding:10}}>
          Booksinvoice
        </Text> */}
        <LottieView
	        source={require("../images/loader3.json")}
	        style={{ width: 100, height: 100 }}
	        autoPlay
	        loop
	      />
        {/* <ActivityIndicator style={{padding:20}} size="large" /> */}
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
