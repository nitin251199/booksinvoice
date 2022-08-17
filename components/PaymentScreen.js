import {useFocusEffect} from '@react-navigation/native';
import AnimatedLottieView from 'lottie-react-native';
import React from 'react';
import {
  BackHandler,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import WebView from 'react-native-webview';
import {useDispatch} from 'react-redux';
import {storeDatasync} from './AsyncStorage';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('window');

export const PaymentScreen = ({route, navigation}) => {
  const paymentDetails = route.params.paymentDetails;

  const [modalVisible, setModalVisible] = React.useState(false);

  const theme = useSelector(state => state.theme);

  const dispatch = useDispatch();

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';

  let urlEncodedData = '',
    urlEncodedDataPairs = [],
    key;
  for (key in paymentDetails) {
    urlEncodedDataPairs.push(
      encodeURIComponent(key) + '=' + encodeURIComponent(paymentDetails[key]),
    );
  }
  urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

  const onMessage = data => {
    if (data.nativeEvent.data === 'success') {
      ToastAndroid.show('Payment Successful', ToastAndroid.SHORT);
      setModalVisible(true);
      dispatch({
        type: 'SET_STATUS',
        payload: {isLogin: true, isSubscribed: true},
      });
      dispatch({type: 'REMOVE_ALL_CART'});
      // storeDatasync('isSubscribed', true);
    } else if (data.nativeEvent.data === 'failure') {
      ToastAndroid.show('Payment Failed', ToastAndroid.SHORT);
    }
  };

  const thanksModal = () => {
    return (
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          navigation.navigate('Homepage');
          // navigation.popToTop();
        }}>
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, {backgroundColor: modelBackgroundColor}]}>
            <Text style={[styles.modalText, {color: textColor}]}>
              Thank you for purchasing.
            </Text>
            <AnimatedLottieView
              source={require('../images/check2.json')}
              style={{width: 100, height: 100}}
              autoPlay
              loop={false}
            />
            <Pressable
              style={[styles.button, {backgroundColor: '#ff9000'}]}
              onPress={() => {
                navigation.navigate('Homepage');
                setModalVisible(false);
              }}>
              <Text style={[styles.textStyle, {color: textColor}]}>Enjoy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  var url = 'https://booksinvoice.com/Cart/getRedirectToCcAvenu/';
  if (
    route.params.value === undefined ||
    route.params.value === 'Discount Coupons'
  ) {
    url = 'https://booksinvoice.com/Cart/getRedirectToCcAvenu/';
  } else {
    url = 'https://booksinvoice.com/Cart/getRedirectToPromotion/';
  }

  return (
    <>
      <WebView
        javaScriptEnabled
        originWhitelist={['*']}
        source={{
          uri: url,
          method: 'POST',
          body: urlEncodedData,
        }}
        startInLoadingState={true}
        onMessage={onMessage}
      />
      {thanksModal()}
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    height: height * 0.35,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: width * 0.7,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
});
