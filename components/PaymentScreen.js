import { useFocusEffect } from '@react-navigation/native';
import React from 'react';
import { BackHandler, StyleSheet, ToastAndroid } from 'react-native';
import WebView from 'react-native-webview';
import { useDispatch } from 'react-redux';

export const PaymentScreen = ({route,navigation}) => {
  const paymentDetails = route.params.paymentDetails;

  
  let urlEncodedData = '',
  urlEncodedDataPairs = [],
  key;
for (key in paymentDetails) {
  urlEncodedDataPairs.push(
    encodeURIComponent(key) + '=' + encodeURIComponent(paymentDetails[key]),
  );
}
urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');


useFocusEffect(
  React.useCallback(() => {
    const onBackPress =() => {
      navigation.jumpTo('Subscriptions');
        return false;
    };

    BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () =>
      BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  }, [])
);

function onMessage(data) {
  navigation.popToTop();
  ToastAndroid.show('Payment Successful', ToastAndroid.SHORT);
  if(data==='success')
  {
    useDispatch().dispatch({type:'SET_SUB',payload:true});
    storeDatasync('isSubscribed', true);
  }
}

  return (
    <WebView
      javaScriptEnabled
      originWhitelist={['*']}
      source={{
        uri: 'https://booksinvoice.com/Cart/getRedirectToCcAvenu/',
        method: 'POST',
        body: urlEncodedData,
      }}
      startInLoadingState={true}
      onMessage={onMessage}
    />
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})