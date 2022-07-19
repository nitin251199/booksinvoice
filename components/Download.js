import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
} from 'react-native';
import {Divider} from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import {getSyncData, storeDatasync} from './AsyncStorage';
import {useSelector} from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import RNFetchBlob from 'rn-fetch-blob';

const {width, height} = Dimensions.get('window');

export const Download = ({navigation}) => {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [books, setBooks] = useState([]);
  const [notDownloadText, setNotDownloadText] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchDownloads = async () => {
    const books = await getSyncData('savedBooks');
    if (books && books.length > 0) {
      setBooks(books);
    } else {
      setNotDownloadText('No books downloaded yet');
      ToastAndroid.show('No books in download', ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    fetchDownloads();
  }, []);

  const deleteBook = async book => {
    const books = await getSyncData('savedBooks');
    const newBooks = books.filter(item => item.title !== book.title);
    setBooks(newBooks);
    storeDatasync('savedBooks', newBooks);
    RNFetchBlob.fs
      .unlink(book.url)
      .then(() => {
        ToastAndroid.show('Book deleted', ToastAndroid.SHORT);
      })
      .catch(err => {
        console.log('Error in deleting book', err);
      });
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
              navigation.navigate('MusicPlayer', {
                offlineBook: item,
                offline: true,
                index: null,
                chapters: [],
                playFromChapters: false
              })
            }>
            <Image
              style={[styles.image]}
              source={{
                uri:
                  Platform.OS === 'android'
                    ? 'file://' + item.artwork
                    : '' + item.artwork,
              }}
            />
          </TouchableOpacity>
          <View style={{width: width * 0.55, justifyContent: 'flex-start'}}>
            <TextTicker
              onPress={() =>
                navigation.navigate('MusicPlayer', {
                  offlineBook: item,
                  offline: true,
                  index: null,
                  chapters: [],
                  playFromChapters: false
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
              {item.title}
            </TextTicker>
            <Text style={{color: textColor, lineHeight: 20}}>
              Artist: {item.artist}
            </Text>
            <Text style={{color: textColor, lineHeight: 20}}>
              Album: {item.album}
            </Text>
          </View>
          <TouchableOpacity onPress={() => deleteBook(item)}>
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

  if (books.length === 0) {
    return (
      <View style={[styles.container, {backgroundColor: backgroundColor}]}>
        <View style={{paddingBottom: 60}}>
          <View style={styles.header}>
            <Text style={[styles.headerContent, {color: textColor}]}>
              Your Downloads
            </Text>
          </View>
          <View>
            <Text style={{color: textColor, padding: 20}}>
              No books downloaded yet
            </Text>
          </View>
        </View>
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
      <View style={{paddingBottom: 60}}>
        <View style={styles.header}>
          <Text style={[styles.headerContent, {color: textColor}]}>
            Your Downloads
          </Text>
        </View>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => <ActivityIndicator size="large" />}
        />
      </View>
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
  button: {
    width: width * 0.9,
    borderRadius: 10,
    paddingVertical: 10,
  },
});
