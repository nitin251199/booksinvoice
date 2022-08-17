import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
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
import {useSelector} from 'react-redux';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {postData, ServerURL} from './FetchApi';
import {useSwipe} from './useSwipe';

const {width, height} = Dimensions.get('window');

export const FavouriteBooks = ({navigation}) => {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  var isLogin = useSelector(state => state.isLogin);

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (isLogin) {
      var userData = await getSyncData(key[0]).then(async res => {
        fetchFavourites(res);
      });
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
            paddingLeft: 20,
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
          <View style={{width: width * 0.65, justifyContent: 'flex-start'}}>
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
        </View>
        <Divider />
      </View>
    );
  };

  const fetchFavourites = async res => {
    setLoading(true);
    var body = {type: '1', user_id: res.id, user_type: res.usertype};
    var result = await postData('api/getFavourite', body);
    if (result.msg === 'Success') {
      setLoading(false);
      setBooks(result.data);
    } else {
      setLoading(false);
      ToastAndroid.show('No Favourites Added', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    navigation.popToTop();
  }

  function onSwipeRight() {
    navigation.popToTop();
  }

  if (!loading && books.length === 0) {
    return (
      <View
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        style={[styles.container, {backgroundColor: backgroundColor}]}>
        <View style={{paddingBottom: 60}}>
          <View style={styles.header}>
            <Text style={[styles.headerContent, {color: textColor}]}>
              Your Playlist
            </Text>
          </View>
          <View>
            <Text style={{color: textColor, padding: 20}}>
              No books in playlist yet
            </Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerContent, {color: textColor}]}>
            Your Playlist
          </Text>
        </View>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            <ActivityIndicator size="large" animating={loading} />
          )}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerContent: {
    fontSize: 22,
    fontWeight: 'bold',
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
});
