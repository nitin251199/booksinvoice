import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  useColorScheme,
  Image,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { postData } from './FetchApi';

const {width, height} = Dimensions.get('window');

export const WelcomePage = ({navigation}) => {
  const textColor = useColorScheme() === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = useColorScheme() === 'dark' ? '#191414' : '#FFF';

  var dispatch = useDispatch();

  const [show, setShow] = useState(false);

  const fetch = async () => {
    var body = {type: 1};
    var data = await postData('api/getHome', body);
    // var newarrivals = await postData('api/getNewarrival', body);
    // var top = await postData('api/getToprated', body);
    // var premium = await postData('api/getPremiumbooks', body);
    // var banner = await postData('api/getBanner', body);
    // var category = await postData('api/getCategory', body);
    // var othercategory = await postData('api/getBooksbycat', body);


    dispatch({type: 'SET_POPULAR', payload: data.populars_books});
    dispatch({type: 'SET_NEWARRIVAL', payload: data.new_arrival});
    dispatch({type: 'SET_TOPRATED', payload: data.top_rated});
    dispatch({type: 'SET_PREMIUM', payload: data.Premium_books});
    dispatch({type: 'SET_BANNER', payload: data.Banner_image});
    dispatch({type: 'SET_CATEGORY', payload: data.category});
    dispatch({type: 'SET_OTHERCATEGORY', payload: data.books_by_cate});
    dispatch({type: 'SET_ADVERTISE', payload: data.advertise});
    setShow(true);
  };

  


  useEffect(() => {
    fetch();
  }, []);

  useEffect(()=> {
    if(show){
        navigation.navigate('Homepage')
    }
  },[show])

  return (
    <View style={[styles.container, {backgroundColor: '#e30047'}]}>
      <Image
        style={{width: 100, height: 100, borderRadius: 0}}
        source={require('../images/logo.jpg')}
      />
      <Text style={{fontWeight: '800', color: textColor, fontSize: 22,padding:20}}>
          Booksinvoice
        </Text>

        <ActivityIndicator style={{padding:30}} size="large" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
