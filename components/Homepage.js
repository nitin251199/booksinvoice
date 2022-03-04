import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  useColorScheme,
  RefreshControl,
  BackHandler,
} from 'react-native';
import Carousel from 'react-native-banner-carousel';
import MI from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {StyleSheet, View, Dimensions} from 'react-native';
import {AirbnbRating, Divider, Image, Tile} from 'react-native-elements';
import BottomSheet from './BottomSheet';
import {getData, postData, ServerURL} from './FetchApi';
import TextTicker from 'react-native-text-ticker';
import {TouchableOpacity} from 'react-native-gesture-handler';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {SamplePlay} from './SamplePlay';
import {useDispatch, useSelector} from 'react-redux';
import {WelcomePage} from './WelcomePage';

const BannerWidth = Dimensions.get('window').width;
const BannerHeight = 140;

const {width, height} = Dimensions.get('window');

export default function Homepage({navigation, route}) {
  const [data, setData] = useState(
    Object.values(useSelector(state => state.books.newArrivals)),
  );
  const [banner, setBanner] = useState(
    Object.values(useSelector(state => state.banner)),
  );
  const [topRated, setTopRated] = useState(
    Object.values(useSelector(state => state.books.topRated)),
  );
  const [popularBooks, setPopularBooks] = useState(
    Object.values(useSelector(state => state.books.popularBooks)),
  );
  const [premiumBooks, setPremiumBooks] = useState(
    Object.values(useSelector(state => state.books.premium)),
  );
  const [category, setCategory] = useState(
    Object.values(useSelector(state => state.categories)),
  );
  const [otherCategory, setOtherCategory] = useState(
    useSelector(state => state.otherCategory),
  );
  const [advertise, setAdvertise] = useState(
    useSelector(state => state.advertise),
  );

  const [show, setShow] = useState(false);
  const [refreshing, setRefreshing] = React.useState(false);

  var dispatch = useDispatch();

  const fetch = async () => {
    var body = {type: 1};
    var popular = await postData('api/getPopulerbooks', body);
    var newarrivals = await postData('api/getNewarrival', body);
    var top = await postData('api/getToprated', body);
    var premium = await postData('api/getPremiumbooks', body);
    var banner = await postData('api/getBanner', body);
    var category = await postData('api/getCategory', body);
    var othercategory = await postData('api/getBooksbycat', body);
    setRefreshing(false);

    dispatch({type: 'SET_POPULAR', payload: popular.data});
    dispatch({type: 'SET_NEWARRIVAL', payload: newarrivals.data});
    dispatch({type: 'SET_TOPRATED', payload: top.data});
    dispatch({type: 'SET_PREMIUM', payload: premium.data});
    dispatch({type: 'SET_BANNER', payload: banner.data});
    dispatch({type: 'SET_CATEGORY', payload: category.data});
    dispatch({type: 'SET_OTHERCATEGORY', payload: othercategory});
  };

  const onRefresh = async () => {
    setRefreshing(true);
    fetch();
  };

  const textColor = useColorScheme() === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = useColorScheme() === 'dark' ? '#212121' : '#FFF';

  // useEffect(() => {
  //   const backAction = () => {
  //     BackHandler.exitApp()
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     "hardwareBackPress",
  //     backAction
  //   );

  //   return () => backHandler.remove();
  // }, []);

  const DisplayBanner = ({item}) => {
    return (
      <SkeletonContent
        containerStyle={{flex: 1}}
        isLoading={show}
        boneColor={backgroundColor}
        highlightColor="#333333"
        layout={[
          {
            key: '1',
            width: width,
            height: 140,
          },
        ]}>
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
      </SkeletonContent>
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
              color: useColorScheme() === 'dark' ? '#fff' : '#000',
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
      <View style={{display: 'flex', flexDirection: 'column'}}>
        <Divider />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.categoryTitle,
              {
                color: useColorScheme() === 'dark' ? '#fff' : '#000',
              },
            ]}>
            {categoryname.bookcategory}
          </Text>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CategoryPage', {
                item: categoryname,
                category: category[index],
              })
            }>
            <Text style={{fontSize: 12, fontWeight: '500', paddingRight: 15}}>
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryImage}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {otherCategory[index].map((item, index) => {
              return (
                <SkeletonContent
                  containerStyle={{flex: 1}}
                  isLoading={show}
                  boneColor={backgroundColor}
                  highlightColor="#333333"
                  layout={[
                    {
                      key: '1',
                      width: width,
                      height: 140,
                    },
                  ]}>
                  <DisplayItem item={item} key={index} />
                </SkeletonContent>
              );
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
            })
          }
          style={[styles.image]}
          source={{
            uri: `${ServerURL}/admin/upload/bookcategory/${item.bookcategoryid}/${item.photo}`,
          }}
        />
        <SamplePlay
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
            color={useColorScheme() === 'dark' ? '#fff' : '#000'}
          />
          <TextTicker
            style={[
              styles.imageText,
              {
                color: useColorScheme() === 'dark' ? '#fff' : '#000',
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
            color={useColorScheme() === 'dark' ? '#fff' : '#000'}
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
                color: useColorScheme() === 'dark' ? '#fff' : '#000',
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
                  color: useColorScheme() === 'dark' ? '#fff' : '#000',
                  paddingBottom: 4
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
              <Text
                style={[
                  styles.categoryTitle,
                  {
                    color: useColorScheme() === 'dark' ? '#fff' : '#000',
                  },
                ]}>
                New Arrivals !
              </Text>
              <TouchableOpacity 
              onPress={() => navigation.navigate('CategoryPage', {item: {
                "id": "0",
                "bookcategory": "New Arrivals",
                "catphoto": "custom_img.jpg"
              }})}
              >
                <Text
                  style={{fontSize: 12, fontWeight: '500', paddingRight: 15}}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <SkeletonContent containerStyle={{flex: 1}} isLoading={show}>
              <View style={styles.categoryImage}>
                <FlatList
                  data={data}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item}) => <DisplayItem item={item} />}
                  keyExtractor={item => item.id}
                />
              </View>
            </SkeletonContent>

            <Divider />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text
                style={[
                  styles.categoryTitle,
                  {
                    color: useColorScheme() === 'dark' ? '#fff' : '#000',
                  },
                ]}>
                Top Rated
              </Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('CategoryPage', {item: {
                "id": "0",
                "bookcategory": "Top Rated",
                "catphoto": "custom_img.jpg"
              }})}
              >
                <Text
                  style={{fontSize: 12, fontWeight: '500', paddingRight: 15}}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryImage}>
              <FlatList
                data={topRated}
                horizontal
                showsHorizontalScrollIndicator={false}
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
              <Text
                style={[
                  styles.categoryTitle,
                  {
                    color: useColorScheme() === 'dark' ? '#fff' : '#000',
                  },
                ]}>
                Popular Books
              </Text>
              <TouchableOpacity 
              onPress={() => navigation.navigate('CategoryPage', {item: {
                "id": "0",
                "bookcategory": "Popular Books",
                "catphoto": "custom_img.jpg"
              }})}
              >
                <Text
                  style={{fontSize: 12, fontWeight: '500', paddingRight: 15}}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.categoryImage}>
              <FlatList
                data={popularBooks}
                horizontal
                showsHorizontalScrollIndicator={false}
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
              <Text
                style={[
                  styles.categoryTitle,
                  {
                    color: useColorScheme() === 'dark' ? '#fff' : '#000',
                  },
                ]}>
                Premium
              </Text>
              <TouchableOpacity
              onPress={() => navigation.navigate('CategoryPage', {item: {
                "id": "0",
                "bookcategory": "Premium",
                "catphoto": "custom_img.jpg"
              }})} 
              >
                <Text
                  style={{fontSize: 12, fontWeight: '500', paddingRight: 15}}>
                  View All
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.categoryImage}>
              <FlatList
                data={premiumBooks}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({item}) => <DisplayItem item={item} />}
                keyExtractor={item => item.id}
              />
            </View>
            </View>
            <Tile
              imageSrc={{
                uri: `https://booksinvoice.com/admin/${advertise[0].url}`,
              }}
              title={`${advertise[0].title}`}
              titleStyle={{fontSize: 15}}
              featured
              caption="Buy Subscription Plans"
              captionStyle={{fontSize: 20,fontWeight:'800'}}
              height={height * 0.2}
              activeOpacity={1}
              width={width}
              containerStyle={{marginVertical:10}}
            />
            <View style={{paddingLeft:20}}>
            <FlatList
              data={otherCategory}
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
      <BottomSheet navigation={navigation} />
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
    paddingBottom:15
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
