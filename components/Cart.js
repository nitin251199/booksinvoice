import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating, Divider} from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import {useDispatch, useSelector} from 'react-redux';
import {ServerURL} from './FetchApi';
import {SamplePlay} from './SamplePlay';
import {ThemeContext} from './ThemeContext';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export const Cart = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  var dispatch = useDispatch();

  var carts = useSelector(state => state?.cart);
  var cartItems = Object.values(carts);
  var keys = Object.keys(carts);
  const [cart, setCart] = useState(cartItems);
  const [refresh, setRefresh] = useState(false);

  const removeBook = (item) => {
    dispatch({type: 'REMOVE_CART', payload: item.id});
    setCart(cartItems);
    setRefresh(!refresh);
    ToastAndroid.show('Book Removed from Cart', ToastAndroid.SHORT);
    navigation.setParams({x:''})
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
              top: '67%',
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

  if (carts.length === 0) {
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
    <ScrollView style={[styles.container, {backgroundColor: backgroundColor}]}>
      <Text
        style={{
          fontSize: 20,
          color: textColor,
          fontWeight: '800',
          padding: 20,
        }}>
        My Cart ({keys.length})
      </Text>

      <FlatList
        data={cart}
        renderItem={displayBooks}
        keyExtractor={item => item.id}
      />
    </ScrollView>
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
});
