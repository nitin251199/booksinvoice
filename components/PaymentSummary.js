import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import {checkSyncData, getSyncData} from './AsyncStorage';
import { postData } from './FetchApi';
import {ThemeContext} from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const PaymentSummary = ({route, navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';

  const [showModal, setShowModal] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [paymentDetails, setPaymentDetails] = useState([]);

  const selected = route.params.selected;
  const copies = route.params.copies;
  const discount = 0;
  const subtotal = selected.packageprice * copies || selected.packagepricedoller * copies;
  const gst = (subtotal * 0.18).toFixed(2);
  const total = (parseFloat(subtotal) + parseFloat(gst)).toFixed(2)
  var phone = ''
  var pinCode = ''
  var address = ''

  const handleProceed = () => {
      navigation.navigate('PaymentScreen', {paymentDetails})
  };

  const fetchDetails = async () => {
    var key = await checkSyncData();

    if (key) {
      await getSyncData(key[0]).then(async res => {
        await fetchUserData(res).then(async result => {
            var body = {
                type: '1',
                user_type: res.usertype,
                packgesid: selected.id,
                user_id: res.id,
                price: total,
                forccavenu: selected.currency === '$' ? 'USD': 'INR',
                name: res.user_name,
                address: address,
                postalcode: pinCode,
                usermobile: phone,
                email: res.useremail,
                copies: copies,
                coupons: coupon,
              };
              var result = await postData('api/getPaymentlink', body)
              setPaymentDetails(result.data)
              setLoading(false)
        })
      });
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [])
  

  const fetchUserData = async (res) => {
    if (res.usertype === 'Individual') {
      var body = {
        type: 1,
        user_id: res.id,
        user_type: 'individual',
      };
      var result = await postData('api/getProfile', body);
      
      address = result.data[0].address
      pinCode = result.data[0].zip_pin
      phone = result.data[0].telephone
    } else if (res.usertype === 'Organisation') {
      var body = {
        type: 1,
        user_id: res.id,
        user_type: 'organisation',
      };
      var result = await postData('api/getProfile', body);
      address = result.data[0].address
      pinCode = result.data[0].postalcode
      phone = result.data[0].orgnisationcontact
    }
  };

  const couponModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
        }}>
        <View style={styles.centeredView}>
          <View
            style={[
              {
                backgroundColor: modelBackgroundColor,
                padding: 20,
                borderRadius: 10,
              },
            ]}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                color: textColor,
                margin: 10,
              }}>
              Enter the coupon code
            </Text>
            <TextInput
              value={coupon}
              onChangeText={text => setCoupon(text)}
              style={{
                borderWidth: 1,
                borderColor: textColor,
                borderRadius: 10,
                paddingLeft: 10,
              }}
              placeholder="Coupon Code"
              placeholderTextColor="#999"
            />
            <TouchableOpacity onPress={() => handleProceed()}>
              <View
                style={{
                  marginVertical: 10,
                  padding: 15,
                  borderRadius: 10,
                  backgroundColor: '#ff9000',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: '800',
                    color: '#FFF',
                  }}>
                  Apply Coupon
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ActivityIndicator animating={loading} size={"large"} style={{position: 'absolute',top:0, left: 0, right: 0, bottom: 0}}/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          
          <Text style={[styles.headerContent, {color: textColor}]}>
            Payment Summary
          </Text>
        </View>
        <View
          style={{
            width: width * 0.9,
            height: height * 0.77,
            flexDirection: 'column',
          }}>
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>Package Price</Text>
            <Text style={{color: 'gray'}}>{selected.packageprice || selected.packagepricedoller}</Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>Validity</Text>
            <Text style={{color: 'gray'}}>{selected.packagedays} Days</Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>Mo. of Copies</Text>
            <Text style={{color: 'gray'}}>{copies}</Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>
              Discounted Price
            </Text>
            <Text style={{color: 'gray'}}>{discount}</Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>Subtotal</Text>
            <Text style={{color: 'gray'}}>{subtotal}</Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>
              IGST Tax( 18% )
            </Text>
            <Text style={{color: 'gray'}}>{gst}</Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>
              Total Price(Including All Taxes )
            </Text>
            <Text style={{color: 'gray'}}>{total}</Text>
          </View>
          <Divider />
          <View style={styles.btn}>
            <Button
              disabled={loading}
                onPress={()=>handleProceed()}
              title="Proceed to pay"
              buttonStyle={{padding: 10}}
              containerStyle={{
                width: width * 0.47,
                marginTop: 20,
                marginRight: 10,
              }}
            />
            <Button
            disabled={loading}
              onPress={() => setShowModal(true)}
              title="Apply Coupon"
              type="outline"
              titleStyle={{color: 'red'}}
              buttonStyle={{borderColor: 'red', padding: 10}}
              containerStyle={{width: width * 0.4, marginTop: 20}}
            />
          </View>
        </View>
        {couponModal()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  header: {
    padding: 20,
  },
  headerContent: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  item: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  btn: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingTop: 30,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
