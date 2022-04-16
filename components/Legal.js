import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import WebView from 'react-native-webview';
import {postData} from './FetchApi';
import {ThemeContext} from './ThemeContext';

export const Legal = ({route}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [text, setText] = useState('');

  const fetchPolicy = async () => {
    var body = {type: '1', pagename: route.params.page};
    var result = await postData('api/getPages', body);
    setText(result.data[0].content);
  };

  const pagename = () => {
    if (route.params.page === 'PrivacyPolicy') {
      return 'Privacy Policy';
    } else if (route.params.page === 'TermAndConditions') {
      return 'Terms and Conditions';
    } else if (route.params.page === 'Disclaimer') {
      return 'Disclaimer';
    } else if (route.params.page === 'Faq') {
      return 'FAQ';
    } else if (route.params.page === 'Support') {
      return 'Support';
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: backgroundColor}}>
      <WebView
        style={{flex: 1, backgroundColor: backgroundColor}}
        originWhitelist={['*']}
        source={{
          html: `<style>
          font {
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
          <h1 class="heading">${pagename()}</h1>
          <div class="text clrwhite">${text}</div>
          </div>`,
        }}
      />
    </View>
  );
};
