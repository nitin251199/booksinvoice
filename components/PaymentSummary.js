import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Button, Divider} from 'react-native-elements';
import {RadioButton} from 'react-native-paper';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {postData} from './FetchApi';
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
  const [couponLoading, setCouponLoading] = useState(false);

  const [paymentDetails, setPaymentDetails] = useState([]);
  const [value, setValue] = React.useState('Discount Coupons');
  const [couponStatus, setCouponStatus] = useState(false);

  const selected = route.params.selected;
  var copies = route.params.copies;
  const [discount, setDiscount] = useState(0);
  const [subtotal, setSubTotal] = useState(
    selected.packageprice * copies || selected.packagepricedoller * copies,
  );
  const [gst, setGst] = useState((subtotal * 0.18).toFixed(2));
  const [sgst, setSgst] = useState((subtotal * 0.09).toFixed(2));

  var total = (parseFloat(subtotal) + parseFloat(gst)).toFixed(2);
  var phone = '';
  var pinCode = '';
  var address = '';
  var country = '';
  var state = '';
  var city = '';
  var couponid = '';

  const handleProceed = () => {
    navigation.navigate('PaymentScreen', {paymentDetails, value});
  };

  const handleCouponProceed = async () => {
    setCouponLoading(true);
    var body = {coupons: coupon, coupon_type: value};
    var result = await postData('api/getCoupon', body);
    if (result.msg === 'Success') {
      if (
        result.data[0].coupons_type === 'Promotional Coupons' 
      ) {
        setSubTotal(0);
        selected.packagedays = result.data[0].days;
        // copies = '1';
        setGst(0);
        setSgst(0);
        total = 0;
        couponid = result.data[0].id;
        setCouponStatus(true);
        return fetchDetails();
      }
      else if(result.data[0].coupons_type === 'Recharge Coupons')
      {
        let val = result.data[0].couponsvalue;
        let sTotal = (val - (val * 0.18)).toFixed(2);
        setSubTotal(sTotal);
        setGst((val * 0.18).toFixed(2))
        setSgst((val * 0.09).toFixed(2))
        // total = 1999
        couponid = result.data[0].id;
        setCouponStatus(true);
        return fetchDetails();
      }
      let percentage = parseFloat(result.data[0].percentage);
      let d = subtotal * (percentage / 100);
      d = d.toFixed(2);
      setDiscount(d);
      let s = (subtotal - d).toFixed(2);
      setSubTotal(s);
      setGst(((subtotal - d) * 0.18).toFixed(2))
      setSgst(((subtotal - d) * 0.09).toFixed(2))
      total = (parseFloat(subtotal - d) + parseFloat(((subtotal - d) * 0.18).toFixed(2))).toFixed(2);
      couponid = result.data[0].id;
      setCouponStatus(true);
      fetchDetails();
    } else {
      ToastAndroid.show('Invalid Coupon', ToastAndroid.SHORT);
      setCouponLoading(false);
    }
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
            forccavenu: selected.currency === '$' ? 'USD' : 'INR',
            name: res.user_name,
            address: address,
            postalcode: pinCode,
            usermobile: phone,
            email: res.useremail,
            copies: copies,
            coupons: couponid,
            coupons_codes: coupon,
            country: country,
            state: state,
            city: city,
          };
          var result = await postData('api/getPaymentlink', body);
          setPaymentDetails(result.data);
          setLoading(false);
          setCouponLoading(false);
          setShowModal(false);
        });
      });
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchUserData = async res => {
    if (res.usertype === 'individual') {
      var body = {
        type: 1,
        user_id: res.id,
        user_type: 'individual',
      };
      var result = await postData('api/getProfile', body);
      address = result.data[0].address;
      pinCode = result.data[0].zip_pin;
      phone = result.data[0].telephone;
      country = result.country[0].name;
      state = result.state[0].name;
      city = result.city[0].name;
    } else if (res.usertype === 'organisation') {
      var body = {
        type: 1,
        user_id: res.id,
        user_type: 'organisation',
      };
      var result = await postData('api/getProfile', body);
      address = result.data[0].address;
      pinCode = result.data[0].postalcode;
      phone = result.data[0].orgnisationcontact;
      country = result.country[0].name;
      state = result.state[0].name;
      city = result.city[0].name;
    }
  };

  const handleCoupon = async value => {
    setValue(value);
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
              Enter Coupon Code
            </Text>
            <TextInput
              value={coupon}
              onChangeText={text => setCoupon(text)}
              style={{
                borderWidth: 1,
                borderColor: textColor,
                borderRadius: 10,
                paddingLeft: 10,
                color: textColor,
              }}
              placeholder="Coupon Code"
              placeholderTextColor="#999"
            />
            <View style={{marginVertical: 10}}>
              <RadioButton.Group
                onValueChange={newValue => handleCoupon(newValue)}
                value={value}>
                <TouchableWithoutFeedback
                  onPress={() => setValue('Discount Coupons')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{color: textColor}}>Discount Coupon</Text>
                    <RadioButton
                      color="#ff9000"
                      uncheckedColor={textColor}
                      value="Discount Coupons"
                    />
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setValue('Promotional Coupons')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{color: textColor}}>Promotional Coupon</Text>
                    <RadioButton
                      color="#ff9000"
                      uncheckedColor={textColor}
                      value="Promotional Coupons"
                    />
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback
                  onPress={() => setValue('Recharge Coupons')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{color: textColor}}>Recharge Coupon</Text>
                    <RadioButton
                      color="#ff9000"
                      uncheckedColor={textColor}
                      value="Recharge Coupons"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </RadioButton.Group>
            </View>
            <TouchableOpacity onPress={() => handleCouponProceed()}>
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
                  {couponLoading ? (
                    <ActivityIndicator color={'#000'} />
                  ) : (
                    'Apply Coupon'
                  )}
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
      <ActivityIndicator
        animating={loading}
        size={'large'}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      />
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
            <Text style={{color: 'gray'}}>
              {selected.packageprice || selected.packagepricedoller}
            </Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>Validity</Text>
            <Text style={{color: 'gray'}}>{selected.packagedays} Days</Text>
          </View>
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>No. of Users</Text>
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
          {selected.currency === '$' ? (
            <View style={styles.item}>
              <Text style={[styles.text, {color: textColor}]}>
                IGST Tax (18%)
              </Text>
              <Text style={{color: 'gray'}}>{gst}</Text>
            </View>
          ) : (
            <>
              <View style={styles.item}>
                <Text style={[styles.text, {color: textColor}]}>
                  SGST Tax (9%)
                </Text>
                <Text style={{color: 'gray'}}>{sgst}</Text>
              </View>
              <View style={styles.item}>
                <Text style={[styles.text, {color: textColor}]}>
                  CGST Tax (9%)
                </Text>
                <Text style={{color: 'gray'}}>{sgst}</Text>
              </View>
            </>
          )}
          <Divider />
          <View style={styles.item}>
            <Text style={[styles.text, {color: textColor}]}>
              Total Price (Including All Taxes)
            </Text>
            <Text style={{color: 'gray'}}>{total}</Text>
          </View>
          <Divider />
          <View style={styles.btn}>
            <Button
              disabled={loading}
              onPress={() => handleProceed()}
              title="Proceed to pay"
              buttonStyle={{padding: 10}}
              containerStyle={{
                width: width * 0.47,
                marginTop: 20,
                marginRight: 10,
              }}
            />
            <Button
              disabled={couponStatus}
              onPress={() => setShowModal(true)}
              title={couponStatus ? 'Coupon Applied' : 'Apply Coupon'}
              type="outline"
              titleStyle={{color: 'red'}}
              buttonStyle={{borderColor: 'red', padding: 10}}
              disabledStyle={{borderColor: 'green', padding: 10}}
              disabledTitleStyle={{color: 'green'}}
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
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
