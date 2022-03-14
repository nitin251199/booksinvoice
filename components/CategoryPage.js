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
import {AirbnbRating, Divider, FAB} from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MI from 'react-native-vector-icons/MaterialIcons';
import {postData, ServerURL} from './FetchApi';
import TextTicker from 'react-native-text-ticker';
import {SamplePlay} from './SamplePlay';
import BottomSheet from './BottomSheet';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const CategoryPage = ({navigation, route}) => {

  const { theme } = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const displayBooks = ({item}) => {
    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
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
          item={item}
          propsStyles={{
            position: 'absolute',
            top: '73%',
            left: '1%',
            elevation: 10,
          }}
        />
          <View style={{width: width * 0.65, justifyContent: 'flex-start'}}>
            <TextTicker
              style={{
                fontSize: 17,
                color: textColor,
                fontWeight: '700',
                paddingVertical: 5,
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
            <AirbnbRating
              starContainerStyle={{marginLeft: -160}}
              count={5}
              showRating={false}
              defaultRating={item.percentage !== null ? item.percentage : 0}
              size={14}
            />
          </View>
          {/* <SamplePlay item={item} /> */}
        </View>
        <Divider />
      </View>
    );
  };

  const [books, setBooks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [skip, setSkip] = React.useState(0);

  const fetchBooksbyid = async id => {
    setIsLoading(true);
    let type = route.params.item.bookcategory;
    switch (type) {
      case 'New Arrivals':
        var body = {type: 1, skip: skip};
        var newarrivals = await postData('api/getNewarrival', body);
        setBooks([...books, ...newarrivals.data]);
        setIsLoading(false);
        break;

      case 'Top Rated':
        var body = {type: 1, skip: skip};
        var top = await postData('api/getToprated', body);
        setBooks([...books, ...top.data]);
        setIsLoading(false);
        break;

      case 'Popular Books':
        var body = {type: 1, skip: skip};
        var popular = await postData('api/getPopulerbooks', body);
        setBooks([...books, ...popular.data]);
        setIsLoading(false);
        break;

      case 'Premium':
        var body = {type: 1, skip: skip};
        var premium = await postData('api/getPremiumbooks', body);
        setBooks([...books, ...premium.data]);
        setIsLoading(false);
        break;

      default:
        var body = {type: '1', category_id: id, skip: skip};
        var result = await postData('api/getBooksbyid', body);
        if (result.msg !== 'Profile Not Available') {
          setBooks([...books, ...result.data]);
        }
        setIsLoading(false);
        break;
    }
  };

  const loadMore = () => {
    setSkip(skip + 20);
  };

  const renderLoader = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  };

  useEffect(() => {
    fetchBooksbyid(route.params.item.id);
  }, [skip]);

  var category = route.params.category;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={{alignItems: 'center'}}>
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
                  state: books[0],
                })
              }>
              <Ionicons
                name="ios-play-circle"
                size={75}
                color="#ff9000"
                style={{paddingBottom: 10}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryImage}>
            <FlatList
              data={books}
              renderItem={displayBooks}
              keyExtractor={item => item.id}
              ListFooterComponent={renderLoader}
              onEndReached={() => loadMore(route.params.item.id)}
              onEndReachedThreshold={0.1}
            />
          </View>
        </ScrollView>
      </View>
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
    height: height * 0.15,
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
  imageText: {
    fontWeight: '600',
    fontSize: 12,
    paddingLeft: 5,
    // width: width * 0.24,
    overflow: 'hidden',
  },
});
