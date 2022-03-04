import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  useColorScheme,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  FlatList,
} from 'react-native';
import TextTicker from 'react-native-text-ticker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import BottomSheet from './BottomSheet';
import {postData, ServerURL} from './FetchApi';

const {width, height} = Dimensions.get('window');

export default function InfoPage({route, navigation}) {
  var id = route.params.state;
  var categoryid = route.params.category;

  const [book, setBook] = useState([]);
  const [similar,setSimilar] = useState([]);

  const fetchBook = async(id) => {
    var body = {"type": '1', 'books_id': id }
    var result = await postData("api/getBooksid", body);
    setBook(result.data[0]);
  }

  const fetchSimilarBooks = async(id) => {
    var body = {"type": '2', "category_id": id }
    var result = await postData("api/getSimiler", body);
    setSimilar(result.data);
  }

  useEffect(() => {
    fetchBook(id);
    fetchSimilarBooks(categoryid);
  },[])

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [showMoreButton, setShowMoreButton] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [numLines, setNumLines] = useState(undefined);

  const toggleTextShown = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(
    (e) => {
      if (e.nativeEvent.lines.length > 3 && !textShown) {
        setShowMoreButton(true);
        setNumLines(3);
      }
    },
    [textShown],
  );

  useEffect(() => {
    setNumLines(textShown ? undefined : 3);
  }, [textShown]);

  const SimilarBooks = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() =>
          navigation.navigate('MusicPlayer', {state: item, data: similar})
        }>
        <View style={styles.nextWrapper}>
          <Image
            source={{
              uri: `${ServerURL}/admin/upload/bookcategory/${item.bookcategoryid}/${item.photo}`,
            }}
            style={styles.nextImage}
          />
          <View >
          <TextTicker
            style={[styles.nextImageText,{color: useColorScheme() === 'dark' ? '#FFF' : '#000'}]}
            duration={10000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            useNativeDriver>
            {item.bookname}
          </TextTicker>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: useColorScheme() === 'dark' ? '#212121' : '#FFF',
        },
      ]}>
      <View style={{paddingBottom: 60}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          
          <View style={styles.wrapper}>
            <Image
              source={{
                uri: `${ServerURL}/admin/upload/bookcategory/${book.bookcategoryid}/${book.photo}`,
              }}
              style={styles.image}
            />
          </View>
            <Text
              style={[
                styles.imageText,
                {
                  color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                },
              ]}>
              {book.bookname}
            </Text>
          <View style={styles.textContainer}>
            <View style={[styles.textWrapper,{alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                    width: width*0.48,
                  },
                ]}>
                Written By :{' '}
              </Text>
              <Text style={styles.text}>{book.bookauthor}</Text>
            </View>
            <View style={[styles.textWrapper,{alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                    width: width*0.48,
                  },
                ]}>
                Narrated By :{' '}
              </Text>
              <Text style={styles.text}>{book.narrator}</Text>
            </View>
            <View style={[styles.textWrapper,{alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                    width: width*0.48,
                  },
                ]}>
                Category :{' '}
              </Text>
              <Text style={styles.text}>{book.bookcategory}</Text>
            </View>
            <View style={[styles.textWrapper,{alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                    width: width*0.48,
                  },
                ]}>
                Views :{' '}
              </Text>
              <Text style={styles.text}>{book.viewcount}</Text>
            </View>
            <View style={[styles.textWrapper,{alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                    width: width*0.48,
                  },
                ]}>
                Rating :{' '}
              </Text>
              <Text style={styles.text}>{book.percentage}</Text>
            </View>
            <View
              style={[
                styles.textWrapper,
                {
                  flexDirection: 'column',
                  // alignItems: 'center'
                },
              ]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                    fontSize: 16,
                    width: width*0.48,
                  },
                ]}>
                Description :{' '}
              </Text>
              <View>
              <Text
                style={[styles.text,{
                  width: width*0.80,
                  textAlign: 'left',
                }]}
                numberOfLines={numLines}
                ellipsizeMode="tail"
                onTextLayout={onTextLayout}
                >
                {book.description}
              </Text>
              {showMoreButton ? (
                <Text onPress={toggleTextShown} style={{color: '#FFD369'}}>
                  {textShown ? 'Read Less' : 'Read More'}
                </Text>
              ) : null}
              </View>
            </View>
          </View>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('MusicPlayer', {state: book, data: similar})
              }
              >
              <View
                style={[
                  styles.btn,
                  {
                    width: width * 0.62,
                  },
                ]}>
                <Text style={{fontSize: 18, fontWeight: '800', color: '#fff'}}>
                  PLAY
                </Text>
                <MaterialCommunityIcons name="play" size={30} color="#fff" />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={onShare}>
              <View style={styles.btn}>
                <Text style={{fontSize: 18, fontWeight: '800', color: '#fff'}}>
                  SHARE
                </Text>
                <MaterialCommunityIcons name="share" size={30} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text
              style={[
                styles.imageText,
                {
                  color: useColorScheme() === 'dark' ? '#FFF' : '#000',
                  paddingHorizontal: 20,
                },
              ]}>
              Similar Books
            </Text>
          </View>
          <FlatList
            data={similar}
            renderItem={({item, index}) => (
              <SimilarBooks item={item} index={index} />
            )}
            keyExtractor={(item, index) => index.toString()}
            numColumns={3}
          />
        </ScrollView>
      </View>
      <BottomSheet navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: width,
    padding: 20,
  },
  image: {
    width: 300,
    height: 340,
    resizeMode: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 0,
    // backgroundColor:"blue",
  },
  imageText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontSize: 22,
    fontWeight: '800',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
  },
  textContainer: {
    paddingHorizontal: 20,
    display: 'flex',
  },
  textWrapper: {
    flexDirection: 'row',
    width: width * 0.9,
    paddingVertical: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    display: 'flex',
    flexWrap: 'wrap',
    // backgroundColor:'red',
  },
  btn: {
    padding: 10,
    backgroundColor: '#ff9000',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
  },
  btnContainer: {
    width: width,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: width * 0.32,
    paddingHorizontal: 15,
    paddingVertical:10
  },
  nextImage: {
    height: height * 0.17,
    width: width * 0.28,
    marginRight: 30,
    resizeMode: 'stretch',
    borderRadius:5,
  },
  nextImageText: {
    fontWeight: '600',
    fontSize: 12,
    width: width * 0.25,
    overflow: 'hidden',
    paddingTop: 5
  },
});
