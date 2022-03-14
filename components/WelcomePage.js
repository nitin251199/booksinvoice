import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
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

  


  useEffect(() => {
    fetch();
  }, []);

  useEffect(()=> {
    if(show){
        navigation.navigate('MyTabs')
    }
  },[show])

  return (
    <View style={[styles.container, {backgroundColor: '#e30047'}]}>
      <Image
        style={{width: 100, height: 100, borderRadius: 0,marginTop:100}}
        source={require('../images/logo.jpg')}
      />
      <Text style={{fontWeight: '800', color: '#FFF', fontSize: 22,padding:10}}>
          Booksinvoice
        </Text>

        <ActivityIndicator style={{padding:20}} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
