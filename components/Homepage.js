import React, {useEffect, useState} from 'react';
import {
  FlatList,
  ScrollView,
  Text,
  BackHandler,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Carousel from 'react-native-banner-carousel';
import MI from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, View, Dimensions} from 'react-native';
import {AirbnbRating, Divider, Image, Tile} from 'react-native-elements';
import {postData, ServerURL} from './FetchApi';
import TextTicker from 'react-native-text-ticker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {SamplePlay} from './SamplePlay';
import {useDispatch, useSelector} from 'react-redux';
import {ThemeContext} from './ThemeContext';
import {useFocusEffect} from '@react-navigation/native';
import { checkSyncData, getSyncData } from './AsyncStorage';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 140;

const {width, height} = Dimensions.get('window');

export default function Homepage({navigation, route}) {
  const {theme} = React.useContext(ThemeContext);

  const setdata = useSelector(state => state?.home?.new_arrival) || [];
  const setbanner = useSelector(state => state?.home?.Banner_image) || [];
  const settop = useSelector(state => state?.home?.top_rated) || [];
  const setpopular = useSelector(state => state?.home?.populars_books) || [];
  const setpremium = useSelector(state => state?.home?.Premium_books) || [];
  const setcategory = useSelector(state => state?.home?.category) || [];
  const setother = useSelector(state => state?.home?.books_by_cate) || [];
  const setad = useSelector(state => state?.home?.advertise) || [];

  const [data, setData] = useState(Object.values(setdata));

  const [banner, setBanner] = useState(Object.values(setbanner));

  const [topRated, setTopRated] = useState(Object.values(settop));

  const [popularBooks, setPopularBooks] = useState(Object.values(setpopular));

  const [premiumBooks, setPremiumBooks] = useState(Object.values(setpremium));

  const [category, setCategory] = useState(Object.values(setcategory));

  const [otherCategory, setOtherCategory] = useState(setother);

  const [advertise, setAdvertise] = useState(setad);

  const [refreshing, setRefreshing] = React.useState(false);

  var dispatch = useDispatch();

  const fetchProfile = async () => {
    var key = await checkSyncData();

    if (key[0]) {
      var userData = await getSyncData(key[0]);
      // setUserData(userData);
      if (userData === null) {
        Alert.alert(
          'Update Your Profile & Activate Free Trial',
          'Without Adding Any Debit or Credit Card',
          [
            {
              text: 'Ask me later',
              // onPress: () => console.log("Cancel Pressed"),
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => navigation.navigate('Login'),
            },
          ],
        );
      }
      else{

        fetchUserData(userData);
      }
    }
  };

  const fetchUserData = async userData => {
    if (userData.usertype === 'Individual') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'individual',
      };
      var result = await postData('api/getProfile', body);
      if (
        result.data[0].username ||
        result.data[0].address ||
        result.data[0].zip_pin ||
        result.state[0].name ||
        result.city[0].name ||
        result.data[0].telephone ||
        result.data[0].email === ''
      ) {
        Alert.alert(
          'Update Your Profile & Activate Free Trial',
          'Without Adding Any Debit or Credit Card',
          [
            {
              text: 'Ask me later',
              // onPress: () => console.log("Cancel Pressed"),
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => navigation.navigate('EditProfile'),
            },
          ],
        );
      }
    } else if (userData.usertype === 'Organisation') {
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: 'organisation',
      };
      var result = await postData('api/getProfile', body);
      if (
        result.data[0].orgnisationname ||
        result.data[0].address ||
        result.data[0].postalcode ||
        result.city[0].name ||
        result.state[0].name ||
        result.data[0].orgnisationcontact ||
        result.data[0].orgnisationemail === ''
      ) {
        Alert.alert(
          'Update Your Profile & Activate Free Trial',
          'Without Adding Any Debit or Credit Card',
          [
            {
              text: 'Ask me later',
              // onPress: () => console.log("Cancel Pressed"),
              style: 'cancel',
            },
            {
              text: 'Proceed',
              onPress: () => navigation.navigate('EditProfile'),
            },
          ],
        );
      }
    }
  };

  // useEffect(() => {
  //   fetchUserData();
  // }, [userData]);

  useEffect(() => {
    setTimeout(() => {
      fetchProfile();
    }, 2500);
  }, []);


  const fetch = async () => {
    var body = {type: 1};
    var data = await postData('api/getHome', body);
    setRefreshing(false);

    dispatch({type: 'SET_HOME', payload: data});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    fetch();
  };

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const DisplayBanner = ({item}) => {
    return (
        <View key={item.id}>
          <Image
            style={{
              width: BannerWidth,
              height: BannerHeight,
              resizeMode: 'stretch',
            }}
            source={{
              uri: `${ServerURL}/admin/upload/banner/${item.bannername}`,
            }}
          />
        </View>
    );
  };

  const DisplayCategory = ({item}) => {
    return (
      <View style={{display: 'flex', flexDirection: 'column'}}>
        <Image
          onPress={() => navigation.navigate('CategoryPage', {item: item})}
          style={{
            height: height * 0.12,
            width: width * 0.45,
            resizeMode: 'stretch',
            marginTop: 10,
            marginRight: 10,
            borderRadius: 2,
          }}
          source={{
            uri: `${ServerURL}/admin/upload/bookcat/${item.catphoto}`,
          }}
        />
        <Text
          style={[
            styles.imageText,
            {
              color: textColor,
              paddingTop: 5,
            },
          ]}>
          {item.bookcategory}
        </Text>
      </View>
    );
  };

  const DisplayOtherCategory = ({item, index, categoryname}) => {
    return (
      <View style={{display: 'flex', flexDirection: 'column'}} key={index}>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CategoryPage', {
                item: categoryname,
                category: category[index],
              })
            }>
            <Text
              style={[
                styles.categoryTitle,
                {
                  color: textColor,
                },
              ]}>
              {categoryname.bookcategory}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CategoryPage', {
                item: categoryname,
                category: category[index],
              })
            }>
            <Text
              style={{
                fontSize: 12,
                fontWeight: '500',
                paddingRight: 15,
                color: '#999',
              }}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryImage}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {otherCategory[index].map((item, index) => {
              return <DisplayItem item={item} key={index} />;
            })}
          </ScrollView>
        </View>
      </View>
    );
  };

  const DisplayItem = ({item}) => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          // width: width * 0.30,
        }}>
        <Image
          onPress={() =>
            navigation.navigate('InfoPage', {
              state: item.id,
              category: item.bookcategoryid,
              new_arrival: data,
              top_rated: topRated,
              populars_books: popularBooks,
              premium_books: premiumBooks,
            })
          }
          style={[styles.image]}
          source={{
            uri: `${ServerURL}/admin/upload/bookcategory/${item.bookcategoryid}/${item.photo}`,
          }}
        />
        <SamplePlay
          navigation={navigation}
          item={item}
          propsStyles={{
            position: 'absolute',
            top: '45%',
            left: '5%',
            elevation: 10,
          }}
        />
        <View
          style={{
            width: width * 0.28,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 5,
            justifyContent: 'space-between',
          }}>
          <MaterialCommunityIcons
            style={{paddingRight: 1}}
            name="account-voice"
            size={15}
            color={textColor}
          />
          <TextTicker
            style={[
              styles.imageText,
              {
                color: textColor,
              },
            ]}
            duration={10000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            useNativeDriver>
            {item.narrator}
          </TextTicker>
        </View>
        <View style={{flexDirection: 'row'}}>
          <MI
            style={{paddingRight: 3}}
            name="remove-red-eye"
            size={15}
            color={textColor}
          />
          <View
            style={{
              width: width * 0.24,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                paddingLeft: 5,
                // width: width * 0.55,
                fontSize: 12,
                overflow: 'hidden',
                color: textColor,
              }}>
              {item.viewcount !== null ? item.viewcount : 0}
            </Text>
            <AirbnbRating
              starContainerStyle={{paddingLeft: 0}}
              count={5}
              showRating={false}
              defaultRating={item.percentage !== null ? item.percentage : 0}
              size={7}
            />
          </View>
        </View>
      </View>
    );
  };
  

  return (
    <View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        // refreshControl={
        //     <RefreshControl
        //       refreshing={refreshing}
        //       onRefresh={onRefresh}
        //     />
        //   }
      >
        <View
          style={[
            styles.container,
            {
              backgroundColor: backgroundColor,
            },
          ]}>
          <View>
            <Carousel
              autoplay
              showsPageIndicator={false}
              autoplayTimeout={3500}
              loop
              pageSize={BannerWidth}>
              {banner.map((item, index) => {
                return <DisplayBanner key={item.id} item={item} />;
              })}
            </Carousel>
          </View>
          <View
            style={{
              paddingLeft: 20,
            }}>
            <Text
              style={[
                styles.categoryTitle,
                {
                  color: textColor,
                  paddingBottom: 4,
                },
              ]}>
              Books Category
            </Text>
            <View
              style={{
                height: height * 0.18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{display: 'flex', flexDirection: 'row'}}>
                {category.map((item, index) => {
                  return <DisplayCategory key={item.id} item={item} />;
                })}
              </ScrollView>
            </View>
          </View>
          <View
            style={{
              paddingLeft: 20,
              // paddingTop: 20,
            }}>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'New Arrivals',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={[
                    styles.categoryTitle,
                    {
                      color: textColor,
                    },
                  ]}>
                  New Arrivals !
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'New Arrivals',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    paddingRight: 15,
                    color: '#999',
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
              <View style={styles.categoryImage}>
                <FlatList
                  data={data}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  ListEmptyComponent={<View style={{display:'flex',justifyContent:'center',alignItems:'center',width:width}}><ActivityIndicator  size={'large'}/></View>}
                  renderItem={({item}) => <DisplayItem item={item} />}
                  keyExtractor={item => item.id}
                />
              </View>

            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'Top Rated',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={[
                    styles.categoryTitle,
                    {
                      color: textColor,
                    },
                  ]}>
                  Top Rated
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'Top Rated',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    paddingRight: 15,
                    color: '#999',
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryImage}>
              <FlatList
                data={topRated}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<View style={{display:'flex',justifyContent:'center',alignItems:'center',width:width}}><ActivityIndicator  size={'large'}/></View>}
                renderItem={({item}) => <DisplayItem item={item} />}
                keyExtractor={item => item.id}
              />
            </View>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'Popular Books',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={[
                    styles.categoryTitle,
                    {
                      color: textColor,
                    },
                  ]}>
                  Popular Books
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'Popular Books',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    paddingRight: 15,
                    color: '#999',
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryImage}>
              <FlatList
                data={popularBooks}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<View style={{display:'flex',justifyContent:'center',alignItems:'center',width:width}}><ActivityIndicator  size={'large'}/></View>}
                renderItem={({item}) => <DisplayItem item={item} />}
                keyExtractor={item => item.id}
              />
            </View>
            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'Premium',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={[
                    styles.categoryTitle,
                    {
                      color: textColor,
                    },
                  ]}>
                  Premium
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('CategoryPage', {
                    item: {
                      id: '0',
                      bookcategory: 'Premium',
                      catphoto: 'custom_img.jpg',
                    },
                  })
                }>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    paddingRight: 15,
                    color: '#999',
                  }}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoryImage}>
              <FlatList
                data={premiumBooks}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={<View style={{display:'flex',justifyContent:'center',alignItems:'center',width:width}}><ActivityIndicator  size={'large'}/></View>}
                renderItem={({item}) => <DisplayItem item={item} />}
                keyExtractor={item => item.id}
              />
            </View>
          </View>
          <Tile
            onPress={() => navigation.navigate('Subscriptions')}
            imageSrc={{
              uri: `https://booksinvoice.com/admin/${advertise[0]?.url}`,
            }}
            title={`${advertise[0]?.title}`}
            titleStyle={{fontSize: 15}}
            featured
            caption="Buy Subscription Plans"
            captionStyle={{fontSize: 20, fontWeight: '800'}}
            height={height * 0.2}
            activeOpacity={1}
            width={width}
            containerStyle={{marginVertical: 10}}
          />
          <View style={{paddingLeft: 20}}>
            <FlatList
              data={otherCategory}
              ListEmptyComponent={<View style={{display:'flex',justifyContent:'center',alignItems:'center',width:width}}><ActivityIndicator  size={'large'}/></View>}
              renderItem={({item, index}) => (
                <DisplayOtherCategory
                  item={item}
                  index={index}
                  categoryname={category[index]}
                />
              )}
            />
          </View>
        </View>
      </ScrollView>
      {/* <MiniPlayer /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    paddingBottom: 60,
  },
  input: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    margin: 10,
    width: width * 0.82,
    borderWidth: 1,
  },
  inputIcon: {
    marginLeft: 10,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Calibri',
    paddingTop: 6,
    paddingBottom: 15,
  },
  categoryImage: {
    height: height * 0.24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    overflowX: 'scroll',
  },
  image: {
    height: height * 0.17,
    width: width * 0.28,
    marginRight: 15,
    resizeMode: 'stretch',
    borderRadius: 5,
    // elevation: 5,
    // shadowOpacity: 2,
    // shadowRadius: 14,
    // shadowColor: 'red',
    // shadowOffset: {width: 0, height: 0},
  },
  imageText: {
    fontWeight: '600',
    fontSize: 12,
    paddingLeft: 5,
    // width: width * 0.24,
    overflow: 'hidden',
  },
});
