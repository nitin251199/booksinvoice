import React, { useEffect, useState } from 'react'
import { useColorScheme, View } from 'react-native'
import WebView from 'react-native-webview'
import { postData } from './FetchApi'
import { ThemeContext } from './ThemeContext'

export const PrivacyPolicy = () => {

    const { theme } = React.useContext(ThemeContext);

    const textColor = theme === 'dark' ? '#FFF' : '#191414';
    const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

    const [text,setText] = useState('')

    const fetchPolicy = async() => {
        var body = {"type": '1'}
        var result = await postData("api/getPages", body);
        setText(result.data[0].content)
    }

    useEffect(()=>{
        fetchPolicy()
    },[])

  return (
      <View style={{flex: 1, backgroundColor: backgroundColor}}>
    <WebView
        style={{flex: 1, backgroundColor: backgroundColor}}
          originWhitelist={['*']}
          source={{ html:  `<style>
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
          </style>
          <div class="root">
          <h1 class="heading">Privacy Policy</h1>
          ${text}</div>` }}
        />
        </View>
  )
}
