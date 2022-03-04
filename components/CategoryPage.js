import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {AirbnbRating, FAB} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MI from 'react-native-vector-icons/MaterialIcons';
import {postData, ServerURL} from './FetchApi';
import TextTicker from 'react-native-text-ticker';
import {SamplePlay} from './SamplePlay';
import BottomSheet from './BottomSheet';

const {width, height} = Dimensions.get('window');

export const CategoryPage = ({navigation, route}) => {
  const textColor = useColorScheme() === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = useColorScheme() === 'dark' ? '#212121' : '#FFF';

  const DisplayBooks = ({item}) => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          // width: width * 0.30,
          paddingBottom: 30,
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
        {/* <SamplePlay item={item} /> */}
        <View
          style={{
            width: width * 0.28,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 5,
            justifyContent: 'space-between',
          }}>
          <MaterialCommunityIcons
            style={{paddingRight: 3}}
            name="account-voice"
            size={15}
            color={useColorScheme() === 'dark' ? '#FFD369' : '#000'}
          />
          <TextTicker
            style={[
              styles.imageText,
              {
                color: useColorScheme() === 'dark' ? '#FFD369' : '#000',
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
            color={useColorScheme() === 'dark' ? '#FFD369' : '#000'}
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
                color: useColorScheme() === 'dark' ? '#FFD369' : '#000',
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

  const [books, setBooks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const fetchBooksbyid = async id => {
    let type = route.params.item.bookcategory;
    switch (type) {
      case "New Arrivals":
        var body = {type: 1};
        var newarrivals = await postData('api/getNewarrival', body);
        setBooks(newarrivals.data);
        setLoading(false);
        break;

      case "Top Rated":
        var body = {type: 1};
        var top = await postData('api/getToprated', body);
        setBooks(top.data);
        setLoading(false);
        break;

      case "Popular Books":
        var body = {type: 1};
        var popular = await postData('api/getPopulerbooks', body);
        setBooks(popular.data);
        setLoading(false);
        break;

      case "Premium":
        var body = {type: 1};
        var premium = await postData('api/getPremiumbooks', body);
        setBooks(premium.data);
        setLoading(false);
        break;

      default:
        var body = {type: '1', category_id: id};
        var result = await postData('api/getBooksbyid', body);
        setBooks(result.data);
        setLoading(false);
        break;
    }
  };

  useEffect(() => {
    fetchBooksbyid(route.params.item.id);
  }, []);

  var category = route.params.category;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={{alignItems: 'center', paddingBottom: 60}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {category ? (
            <View style={styles.imageWrapper}>
              <ImageBackground
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                source={{
                  uri: `${ServerURL}/admin/upload/bookcat/${category.catphoto}`,
                }}
                resizeMode="cover"
                blurRadius={5}>
                <Image
                  source={{
                    uri: `${ServerURL}/admin/upload/bookcat/${category.catphoto}`,
                  }}
                  resizeMode="contain"
                  style={{width: 200, height: 200}}
                />
              </ImageBackground>
            </View>
          ) : (
            <View style={styles.imageWrapper}>
              <ImageBackground
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                source={{
                  uri: `${ServerURL}/admin/upload/bookcat/${route.params.item.catphoto}`,
                }}
                resizeMode="cover"
                blurRadius={5}>
                <Image
                  source={{
                    uri: `${ServerURL}/admin/upload/bookcat/${route.params.item.catphoto}`,
                  }}
                  resizeMode="contain"
                  style={{width: 200, height: 200}}
                />
              </ImageBackground>
            </View>
          )}
          <View>
            <Text style={[styles.categoryTitle, {color: textColor}]}>
              {route.params.item.bookcategory}
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MusicPlayer', {
                  data: books,
                  state: books[1],
                })
              }>
              <Ionicons
                name="ios-play-circle"
                size={75}
                color="#FFD369"
                style={{paddingBottom: 10}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryImage}>
            {loading ? (
              <View style={{alignItems: 'center', justifyContent: 'center'}}>
                <ActivityIndicator
                  size="large"
                  style={{alignItems: 'center', justifyContent: 'center'}}
                />
              </View>
            ) : (
              <FlatList
                data={books}
                numColumns={3}
                renderItem={({item}) => <DisplayBooks item={item} />}
                keyExtractor={item => item.id}
              />
            )}
          </View>
        </ScrollView>
      </View>
      <BottomSheet navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageWrapper: {
    width: width,
    height: height * 0.25,
  },
  categoryTitle: {
    fontWeight: '800',
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
  categoryImage: {
    width: width,
    display: 'flex',
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: height * 0.17,
    width: width * 0.28,
    marginRight: 20,
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
