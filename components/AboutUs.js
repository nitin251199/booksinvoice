import React, {useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import {useSelector} from 'react-redux';
import WebView from 'react-native-webview';
import {postData} from './FetchApi';
import {useSwipe} from './useSwipe';

const {width, height} = Dimensions.get('window');

export const AboutUs = ({navigation}) => {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const [text, setText] = React.useState('');

  const fetchPolicy = async () => {
    var body = {type: '1', pagename: 'About_Us'};
    var result = await postData('api/getPages', body);
    setText(result.data[0].content);
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    navigation.popToTop();
  }

  function onSwipeRight() {
    navigation.popToTop();
  }

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={[styles.container, {backgroundColor: backgroundColor}]}>
      <Image
        source={{
          uri: `https://booksinvoice.com/about-us-banner.jpg`,
        }}
        style={styles.image}
      />
      {/* <ScrollView style={{padding: 20}} showsVerticalScrollIndicator={false}> */}
      {/* <Text style={{fontWeight: '800', color: textColor, fontSize: 22,paddingHorizontal:20}}>
        About Us
      </Text> */}
      <WebView
        style={{flex: 1, backgroundColor: backgroundColor}}
        originWhitelist={['*']}
        source={{
          html: `<style>
          font {
            font-size: 36px!important;
            color: ${textColor}!important;
          }
          .MsoNormal b span {
            font-size: 66px!important;
            color: ${textColor}!important;
          }
          .MsoNormal span {
            font-size: 36px!important;
            color: ${textColor}!important;
          }
          .root {
              flex: 1;
              background-color: ${backgroundColor};
              color: ${textColor};
              font-size: 36px;
              padding: 40px;
          }
          .heading {
              padding: 20px;
          }
          div.text > p > span {
            color: ${textColor}!important;
            font-size: 36px!important;
            line-height: 1.5em;
          }
          div.text > span {
            color: ${textColor}!important;
            font-size: 36px!important;
            line-height: 1.5em;
          }
          div.text >  div > span {
            color: ${textColor}!important;
            font-size: 36px!important;
            line-height: 1.5em;
          }
          </style>
          <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
          <div class="root">
          <div class="text">${text}</div>
          </div>`,
        }}
      />
      {/* </ScrollView> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height * 0.15,
    resizeMode: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 0,
  },
});
