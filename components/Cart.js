import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating, Divider} from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import {useDispatch, useSelector} from 'react-redux';
import {postData, ServerURL} from './FetchApi';
import {SamplePlay} from './SamplePlay';
import {ThemeContext} from './ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Button } from 'react-native-paper';
import { Button as Button2 } from 'react-native-elements';
import { checkSyncData, getSyncData } from './AsyncStorage';

const {width, height} = Dimensions.get('window');

export const Cart = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';

  var dispatch = useDispatch();

  var carts = useSelector(state => state?.cart);
  var cartItems = Object.values(carts);
  var keys = Object.keys(carts);
  const [user,setUser] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponStatus, setCouponStatus] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState([]);
  const [subtotal, setSubTotal] = useState(cartItems.reduce(calculateAmount, 0));
  const [total, setTotal] = useState(cartItems.reduce(calculateAmount, 0));

  var phone = '';
  var pinCode = '';
  var address = '';
  var country = '';
  var state = '';
  var city = '';
  var couponid = '';

  function calculateAmount(a, b) {
    a = parseFloat(a);
    b = parseFloat(b.price);
		return (a + b)
	}

  const getUser = async() =>{
    var key = await checkSyncData()
    if (key[0] !== 'fcmToken') {
      var userData = await getSyncData(key[0]).then(async(res) => {
        setUser(res)
      })
  }
}

useEffect(()=>{
  getUser()
},[])

useEffect(()=>{
  setTotal(cartItems.reduce(calculateAmount, 0));
},[cartItems])

  const removeBook = async(item) => {
    dispatch({type: 'REMOVE_CART', payload: item.id});
    setRefresh(!refresh);
    ToastAndroid.show('Book Removed from Cart', ToastAndroid.SHORT);
    navigation.setParams({y:''})
    var body = {type:1, book_id:item.id, user_id:user.id, user_type:user.usertype};
    var res = await postData('api/getRemovecart',body);
  };

  const handleCouponProceed = async() => {
    setCouponLoading(true);
    var body = {"coupons": coupon, coupon_type: 'Discount Coupons'}
    var result = await postData('api/getCoupon', body);
    if(result.msg === 'Success') {
      let percentage = parseFloat(result.data[0].percentage);
      let d = subtotal*(percentage/100);
       d = d.toFixed(2)
        let s = (subtotal - d).toFixed(2);
        setTotal(parseFloat(s))
        couponid = result.data[0].id;
        setCouponStatus(true);
        setCouponLoading(false)
        fetchDetails()  
    }
    else
    {
      ToastAndroid.show('Invalid Coupon', ToastAndroid.SHORT);
      setCouponLoading(false);
    }
  }

  const fetchDetails = async () => {
    var key = await checkSyncData();

    if (key[0] !== 'fcmToken') {
      await getSyncData(key[0]).then(async res => {
        await fetchUserData(res).then(async result => {
          var body = {
            type: '1',
            user_type: res.usertype,
            user_id: res.id,
            packgesid:"",
            price: total,
            forccavenu:  'INR',
            name: res.user_name,
            address: address,
            postalcode: pinCode,
            usermobile: phone,
            email: res.useremail,
            copies: "",
            coupons: couponid,
            country: country,
            state: state,
            city: city,
          };
          var result = await postData('api/getPaymentbooks', body);
          setPaymentDetails(result.data);
          setLoading(false);
          setCouponLoading(false)
          setShowModal(false)
        });
      });
    }
  };

  const handleProceed = () => {
    navigation.navigate('PaymentScreen', {paymentDetails,total});
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


  const displayBooks = ({item, index}) => {
    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
            paddingLeft: 15,
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('InfoPage', {
                state: item.id,
                category: item.bookcategoryid,
              })
            }>
            <Image
              style={[styles.image]}
              source={{
                uri: `${ServerURL}/admin/upload/bookcategory/${item.bookcategoryid}/${item.photo}`,
              }}
            />
          </TouchableOpacity>
          <SamplePlay
            navigation={navigation}
            item={item}
            propsStyles={{
              position: 'absolute',
              top: '59%',
              left: '6%',
              elevation: 10,
            }}
          />
          <View style={{width: width * 0.57, justifyContent: 'flex-start'}}>
            <TextTicker
              onPress={() =>
                navigation.navigate('InfoPage', {
                  state: item.id,
                  category: item.bookcategoryid,
                })
              }
              style={{
                fontSize: 17,
                color: textColor,
                fontWeight: '700',
                paddingBottom: 5,
              }}
              duration={10000}
              loop
              bounce
              repeatSpacer={50}
              marqueeDelay={1000}
              useNativeDriver>
              {item.bookname}
            </TextTicker>
            <Text style={{color: textColor}}>{item.bookauthor}</Text>
            <Text style={{color: textColor}}>{item.bookcategory}</Text>
            <Text style={{color: textColor}}>₹ {item.price}</Text>
            <Text style={{color: textColor}}>$ {item.dollerprice}</Text>
            <Text style={{color: textColor}}>Narrator: {item.narrator}</Text>
            <Text style={{color: textColor}}>Views: {item.viewcount}</Text>
            {item.premiumtype === 'Premium' ? (
              <>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Premium Type :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {item.premiumtype}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Validity :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {item.validity} days
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    ₹ {item.price}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Doller Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    $ {item.dollerprice}
                  </Text>
                </View>
              </>
            ) : (
              <></>
            )}
            <AirbnbRating
              starContainerStyle={{marginLeft: -130}}
              count={5}
              showRating={false}
              defaultRating={item.percentage !== null ? item.percentage : 0}
              size={14}
            />
          </View>
          <TouchableOpacity onPress={() => removeBook(item)}>
            <View>
              <MaterialCommunityIcons
                name="delete"
                size={25}
                color={textColor}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Divider />
      </View>
    );
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
                  { couponLoading ? <ActivityIndicator color={'#000'}/> : 'Apply Coupon'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  if (keys.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Image
          style={{width: 105, height: 90, margin: 20}}
          source={require('../images/emptycart1.png')}
        />
        <Text
          style={{
            color: textColor,
            fontSize: 20,
            textAlign: 'center',
            alignItems: 'center',
            marginLeft: 20,
          }}>
          No Book in Cart
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ActivityIndicator
        animating={loading}
        size={'large'}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
      />
      <ScrollView contentContainerStyle={{paddingBottom: 60}}>
      <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <Text
        style={{
          fontSize: 20,
          color: textColor,
          fontWeight: '800',
          padding: 20,
        }}>
        My Cart ({keys.length})
      </Text>
      <Text
        style={{
          fontSize: 20,
          color: textColor,
          fontWeight: '800',
          padding: 20,
        }}>
        ₹ {total}
      </Text>
      </View>

      <FlatList
        data={cartItems}
        renderItem={displayBooks}
        keyExtractor={item => item.id}
      />

    </ScrollView>
    {couponModal()}
      <View style={{position:'absolute',bottom:0,flexDirection:'row',width:width}}>
      
      <Button
      dark
      labelStyle={{fontSize:16,letterSpacing:0}} 
      mode="contained"
      style={{backgroundColor: '#ff9000',borderRadius:0}}
      contentStyle={{width:width*0.5}}
      onPress={() => handleProceed()}
      >
       Checkout</Button>
       <Button2
              disabled={couponStatus}
              onPress={() => setShowModal(true)}
              title={couponStatus ? 'Coupon Applied' : 'Apply Coupon'}
              type="outline"
              titleStyle={{color: 'red'}}
              buttonStyle={{borderColor: 'red',borderRadius:0,paddingBottom:10, backgroundColor:backgroundColor}}
              disabledStyle={{borderColor: 'green',borderRadius:0, backgroundColor:backgroundColor}}
              disabledTitleStyle={{color: 'green'}}
              containerStyle={{width: width * 0.5}}
            />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    height: height * 0.17,
    width: width * 0.24,
    marginRight: 20,
    resizeMode: 'stretch',
    borderRadius: 5,
    // elevation: 5,
    // shadowOpacity: 2,
    // shadowRadius: 14,
    // shadowColor: 'red',
    // shadowOffset: {width: 0, height: 0},
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
