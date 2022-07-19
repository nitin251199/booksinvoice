import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import SkeletonContent from 'react-native-skeleton-content-nonexpo';
import {Button} from 'react-native-paper';
import TextTicker from 'react-native-text-ticker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MI from 'react-native-vector-icons/MaterialIcons';
import {useDispatch, useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import {checkSyncData, getSyncData} from './AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {postData, ServerURL} from './FetchApi';
import { SamplePlay } from "./SamplePlay";

const {width, height} = Dimensions.get('window');

export default function InfoPage({route, navigation}) {
  var id = route.params.state;
  var categoryid = route.params.category;

  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#000';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [book, setBook] = useState([]);
  const [similar, setSimilar] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [selected, setSelected] = useState({chaptername: ''});

  const layout = [
    {
      height: height * 0.17,
      width: width * 0.28,
      marginRight: 15,
      resizeMode: 'stretch',
      borderRadius: 5,
    },
    {
      height: height * 0.17,
      width: width * 0.28,
      marginRight: 15,
      resizeMode: 'stretch',
      borderRadius: 5,
    },
    {
      height: height * 0.17,
      width: width * 0.28,
      marginRight: 15,
      resizeMode: 'stretch',
      borderRadius: 5,
    },
  ]

  var dispatch = useDispatch();

  var cart = useSelector(state => state?.cart);
  var keys = Object.keys(cart);
  var isSub = useSelector(state => state.isSubscribed);
  var languageid = useSelector(state => state.language);

  const [newArrivals, setNewArrivals] = useState([]);
  const [newArrivalsLoading, setNewArrivalsLoading] = useState(true);
  const [topRated, setTopRated] = useState([]);
  const [topRatedLoading, setTopRatedLoading] = useState(true);
  const [popularBooks, setPopularBooks] = useState([]);
  const [popularBooksLoading, setPopularBooksLoading] = useState(true);
  const [premiumBooks, setPremiumBooks] = useState([]);
  const [premiumBooksLoading, setPremiumBooksLoading] = useState(true);
  const [chapters, setChapters] = useState([]);
  const [status, setStatus] = useState(true);
  const [userData, setUserData] = useState({id: '', usertype: ''});

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (route.params.nested) {
          navigation.replace('Homepage');
          return true;
        } else {
          navigation.goBack();
          return true;
        }
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, []),
  );

  const fetchBook = async id => {
    var body = {type: '1', books_id: id, languageid: languageid};
    var result = await postData('api/getBooksid', body);
    setBook(result.data[0]);
    setChapters(result.chapters);
  };

  const fetchSimilarBooks = async id => {
    var body = {type: '1', category_id: id, languageid: languageid};
    var result = await postData('api/getSimiler', body);
    setSimilar(result.data);
    setSimilarLoading(false);
  };

  const fetchNewArrivals = async () => {
    var body = {type: '1', skip: 0, languageid: languageid};
    var result = await postData('api/getNewarrival', body);
    setNewArrivals(result.data);
    setNewArrivalsLoading(false);
  };

  const fetchTopRated = async () => {
    var body = {type: '1', skip: 0, languageid: languageid};
    var result = await postData('api/getToprated', body);
    setTopRated(result.data);
    setTopRatedLoading(false);
  };

  const fetchPopularBooks = async () => {
    var body = {type: '1', skip: 0, languageid: languageid};
    var result = await postData('api/getPopulerbooks', body);
    setPopularBooks(result.data);
    setPopularBooksLoading(false);
  };

  const fetchPremiumBooks = async () => {
    var body = {type: '1', skip: 0, languageid: languageid};
    var result = await postData('api/getPremiumbooks', body);
    setPremiumBooks(result.data);
    setPremiumBooksLoading(false);
  };

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (key[0] !== 'fcmToken') {
      await getSyncData(key[0]).then(async res => {
        var body = {
          type: 1,
          user_id: res?.id,
          user_type: res?.usertype?.toLowerCase(),
          book_id: route?.params?.state,
        };
        var result = await postData('api/getActivebook', body);

        if (result.msg == true) {
          setStatus(false);
        }
        var {id, usertype} = res;
        setUserData({id, usertype});
      });
    }
  };

  useEffect(() => {
    fetchBook(id);
    checkLogin();
    fetchSimilarBooks(categoryid);
    fetchNewArrivals();
    fetchTopRated();
    fetchPopularBooks();
    fetchPremiumBooks();
  }, []);

  const [showMoreButton, setShowMoreButton] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [numLines, setNumLines] = useState(undefined);

  const toggleTextShown = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(
    e => {
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

  const requestDownload = item => {
    setSelected({chaptername: item.chaptername});
    if (isSub) {
      requestToPermissions(item);
    } else if (!status) {
      requestToPermissions(item);
    } else {
      ToastAndroid.show(
        'Please subscribe or purchase the book to download!',
        ToastAndroid.SHORT,
      );
    }
  };

  const [savedBooks, setSavedBooks] = useState([]);

  const offLineBooks = useMemo(() => {
    getSyncData('savedBooks').then(res => {
      setSavedBooks(res);
      return res;
    });
  }, [setBook]);

  const requestToPermissions = async item => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Booksinvoice',
          message: 'App needs access to your Files... ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) startDownload(item);
    } catch (err) {
      console.log(err);
    }
  };

  const startDownload = async item => {
    let url = `${ServerURL}/admin/upload/bookaudio/${item.audiofile}`;

    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', url)
      .progress((received, total) => {
        setDownloadProgress(((received / total) * 100).toFixed(0));
      })
      .then(res => {
        RNFetchBlob.config({
          fileCache: true,
        })
          .fetch(
            'GET',
            `${ServerURL}/admin/upload/bookcategory/${book.bookcategoryid}/${book.photo}`,
          )
          .then(imgres => {
            saveToStorage(item, res.path(), imgres.path());
            setDownloadProgress(100);
            ToastAndroid.show('Downloaded Successfully', ToastAndroid.SHORT);
          });
      });
  };

  const tryme = async (dest, currentTrack) => {
    await RNFetchBlob.fs
      .exists(dest)
      .then(ext => {
        if (ext) {
          return RNFetchBlob.fs.stat(dest).then(stat => stat);
        } else {
          return Promise.resolve({size: 0});
        }
      })
      .then(stat => {
        console.log('stat', stat);
        return RNFetchBlob.config({
          path: dest,
          fileCache: true,
          overwrite: false,
        })
          .fetch('GET', `${temp[currentTrack].url}`, {
            Range: `bytes=${stat.size}-`,
          })
          .progress((received, total) => {
            // setDownloadProgress(received / total);
          });
      });
  };

  const saveToStorage = async (item, path, imgPath) => {
    try {
      let tempObj = {
        id: book.id,
        url: path,
        title: item.chaptername,
        artist: book.bookauthor,
        artwork: imgPath,
        album: book.bookcategory,
        duration: book.sampleplay_time,
        index: 0,
      };
      // return console.log('temp', tempObj);
      await AsyncStorage.getItem('savedBooks').then(savedBooks => {
        const c = savedBooks ? JSON.parse(savedBooks) : [];
        c.push(tempObj);
        setSavedBooks(c);
        setDownloadProgress(0);
        AsyncStorage.setItem('savedBooks', JSON.stringify(c));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const ShowChapters = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MusicPlayer', {
              state: book,
              chapters: chapters,
              index: index,
              id: id,
              playFromChapters: true,
            });
            // setShow(true)
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              width: width * 0.75,
            }}>
            <Image
              source={{
                uri: `${ServerURL}/admin/upload/bookcategory/${book.bookcategoryid}/${book.photo}`,
              }}
              style={{width: 35, height: 35, borderRadius: 5}}
            />

            <Text
              style={{
                fontSize: 15,
                color: textColor,
                marginLeft: 15,
                fontWeight: '700',
              }}>
              {item.chaptername}
            </Text>
          </View>
        </TouchableOpacity>

        {savedBooks &&
        savedBooks.some(saved => saved['title'] === item.chaptername) ? (
          <MI name="file-download-done" size={30} color="#ff9000" />
        ) : selected['chaptername'] === item.chaptername ? (
          downloadProgress == 100 ? (
            <MI name="file-download-done" size={30} color="#ff9000" />
          ) : 
          downloadProgress > 0 ?
            <Text
              style={{
                fontSize: 16,
              }}>
              {downloadProgress} %
            </Text>
            :
            <TouchableOpacity
            onPress={() =>
              downloadProgress > 0
                ? ToastAndroid.show(
                    'One Download Already in Progress, Please wait...',
                    ToastAndroid.SHORT,
                  )
                : requestDownload(item)
            }>
            <MaterialCommunityIcons name="download" size={30} color="#888888" />
          </TouchableOpacity>
        ) : 
          <TouchableOpacity
            onPress={() =>
              downloadProgress > 0
                ? ToastAndroid.show(
                    'One Download Already in Progress, Please wait...',
                    ToastAndroid.SHORT,
                  )
                : requestDownload(item)
            }>
            <MaterialCommunityIcons name="download" size={30} color="#888888" />
          </TouchableOpacity>
        }

        {/* {checkChapterDownload(item) ? (
          <MI name="file-download-done" size={30} color="#ff9000" />
        ) : downloadProgress == 0 ? (
          <TouchableOpacity onPress={() => requestDownload(item)}>
            <MaterialCommunityIcons name="download" size={30} color="#888888" />
          </TouchableOpacity>
        ) : (downloadProgress * 100).toFixed(0) <= 99 &&
          selected.chaptername == item.chaptername ? (
          <Text
            style={{
              fontSize: 16,
            }}>
            {(downloadProgress * 100).toFixed(0)} %
          </Text>
        ) : selected.chaptername == item.chaptername ? (
          <MI name="file-download-done" size={30} color="#ff9000" />
        ) : (
          <TouchableOpacity onPress={() => 
            downloadProgress == 100 ? requestDownload(item) :
            ToastAndroid.show('Please wait for the current download to complete', ToastAndroid.SHORT)
          }>
            <MaterialCommunityIcons name="download" size={30} color="#888888" />
          </TouchableOpacity>
        )} */}
      </View>
    );
  };

  const renderItem = (item) => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          // width: width * 0.30,
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.push('InfoPage', {
              state: item.id,
              category: item.bookcategoryid,
            })
          }>
          <Image
            style={[styles.nextImage]}
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
            paddingVertical: 5,
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
              styles.moreimageText,
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
  }

  const addToCart = async () => {
    setLoading(true);
    if (userData !== null) {
      dispatch({type: 'ADD_CART', payload: [book.id, book]});
      var body = {
        type: 1,
        user_id: userData.id,
        user_type: userData.usertype,
        book_id: id,
      };
      var result = await postData('api/getAddcart', body);
      ToastAndroid.show('Book added to Cart', ToastAndroid.SHORT);
      navigation.setParams({x: ''});
      setLoading(false);
    } else {
      navigation.navigate('Login');
    }
  };

  // const onRefresh = () => {
  //   setRefresh(true);
  //   fetchBook(id);
  //   fetchAllComments();
  //   fetchSimilarBooks(categoryid);
  //   fetchNewArrivals();
  //   fetchTopRated();
  //   fetchPopularBooks();
  //   fetchPremiumBooks();
  //   setRefresh(false);
  // }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          //  refreshControl={
          //   <RefreshControl
          //     refreshing={refresh}
          //     onRefresh={onRefresh}
          //   />
          // }
        >
          <ImageBackground
            resizeMode="cover"
            source={require('../../images/musicbg.jpg')}
            imageStyle={{opacity: 0.4}}
            style={{paddingVertical: 20}}>
            <View style={styles.wrapper}>
              <Image
                source={{
                  uri: `${ServerURL}/admin/upload/bookcategory/${book.bookcategoryid}/${book.photo}`,
                }}
                style={styles.image}
              />
            </View>
          </ImageBackground>
          <Text
            style={[
              styles.imageText,
              {
                color: textColor,
              },
            ]}>
            {book.bookname}
          </Text>
          <View style={styles.textContainer}>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Written By :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.bookauthor}
              </Text>
            </View>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Narrated By :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.narrator}
              </Text>
            </View>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Category :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.bookcategory}
              </Text>
            </View>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Views :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.viewcount}
              </Text>
            </View>

            {book.premiumtype === 'Premium' || book.premiumtype === 'Both' ? (
              <>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Premium Type :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {book.premiumtype}
                  </Text>
                </View>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Validity :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {book.validity} days
                  </Text>
                </View>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    ₹ {book.price}
                  </Text>
                </View>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Doller Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    $ {book.dollerprice}
                  </Text>
                </View>
              </>
            ) : (
              <></>
            )}
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Rating :{' '}
              </Text>
              <AirbnbRating
                starContainerStyle={{paddingLeft: 0}}
                count={5}
                showRating={false}
                defaultRating={book.percentage !== null ? book.percentage : 0}
                size={11}
              />
            </View>
            {book.description !== '' ? (
              <View
                style={[
                  styles.textWrapper,
                  {
                    flexDirection: 'column',
                    // alignItems: 'center'
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        fontSize: 16,
                        width: width * 0.48,
                      },
                    ]}>
                    Description :{' '}
                  </Text>
                  {showMoreButton ? (
                    <TouchableOpacity onPress={() => toggleTextShown()}>
                      <Text style={{color: '#FFD369'}}>
                        {textShown ? 'Read Less' : 'Read More'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View>
                  <Text
                    style={[
                      styles.text,
                      {
                        width: width * 0.9,
                        textAlign: 'justify',
                        color: textColor,
                      },
                    ]}
                    numberOfLines={numLines}
                    ellipsizeMode="tail"
                    onTextLayout={onTextLayout}>
                    {book.description}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>

          <View style={styles.btnContainer}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('MusicPlayer', {
                  state: book,
                  chapters: chapters,
                  index: null,
                  id: id,
                  playFromChapters: false,
                });
                // setShow(true)
              }}>
              <View
                style={[
                  styles.btn,
                  {
                    width: width * 0.92,
                  },
                ]}>
                <Text style={{fontSize: 18, fontWeight: '800', color: '#fff'}}>
                  PLAY
                </Text>
                <MaterialCommunityIcons name="play" size={22} color="#fff" />
              </View>
            </TouchableOpacity>
          </View>
          {book.premiumtype === 'Premium' || book.premiumtype === 'Both' ? (
            status && (
              <View
                style={{
                  ...styles.btnContainer,
                  paddingHorizontal: 0,
                  paddingVertical: 0,
                }}>
                {keys.includes(book.id) ? (
                  <View
                    style={[
                      styles.btn,
                      {
                        width: width * 0.92,
                        marginBottom: 10,
                        backgroundColor: backgroundColor,
                        borderColor: textColor,
                        borderWidth: 1,
                      },
                    ]}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '800',
                        color: '#fff',
                        marginRight: 10,
                      }}>
                      ADDED TO CART
                    </Text>
                    <MaterialCommunityIcons
                      name="cart"
                      size={20}
                      color="#fff"
                    />
                  </View>
                ) : (
                  <Button
                    onPress={() => addToCart()}
                    style={{backgroundColor: '#ff9000', marginBottom: 10}}
                    mode="contained"
                    loading={loading}
                    dark
                    icon="cart"
                    labelStyle={{
                      fontSize: 18,
                      fontWeight: '800',
                      color: '#fff',
                    }}
                    contentStyle={[
                      // styles.btn,
                      {
                        width: width * 0.92,
                        padding: 2,
                        display: 'flex',
                        flexDirection: 'row-reverse',
                        justifyContent: 'center',
                        alignItems: 'center',
                        // margin: 5,
                        borderRadius: 5,
                      },
                    ]}>
                    ADD TO CART
                  </Button>
                )}
              </View>
            )
          ) : (
            <></>
          )}

          {chapters.length > 1 && (
            <View
              style={{
                width: width,
                backgroundColor: backgroundColor,
                padding: 15,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '800',
                  color: textColor,
                  marginBottom: 15,
                  paddingLeft: 5,
                }}>
                Chapters
              </Text>
              {/* <FlatList
                data={chapters}
                renderItem={showChapters}
                keyExtractor={(item, index) => index}
              /> */}
              {chapters.map((chapter, index) => {
                return (
                  <ShowChapters key={index} item={chapter} index={index} />
                );
              })}
            </View>
          )}

          <View style={{paddingBottom: 10, paddingLeft: 20}}>
            <Text
              style={[
                styles.imageText,
                {
                  color: textColor,
                  paddingVertical: 20,
                  paddingHorizontal: 0,
                  fontSize: 16,
                },
              ]}>
              Similar Books
            </Text>
            <SkeletonContent
              containerStyle={styles.skeletonContainer}
              boneColor="#333333"
              highlightColor={backgroundColor}
              isLoading={similarLoading}
              layout={layout}>
            <FlatList
              data={similar}
              renderItem={({item})=>renderItem(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
            </SkeletonContent>
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
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                New Arrivals
              </Text>
            </TouchableOpacity>
            <SkeletonContent
              containerStyle={styles.skeletonContainer}
              boneColor="#333333"
              highlightColor={backgroundColor}
              isLoading={newArrivalsLoading}
              layout={layout}>
              <FlatList
                data={newArrivals}
                renderItem={({item})=>renderItem(item)}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
              />
            </SkeletonContent>
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
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                Top Rated
              </Text>
            </TouchableOpacity>
            <SkeletonContent
              containerStyle={styles.skeletonContainer}
              boneColor="#333333"
              highlightColor={backgroundColor}
              isLoading={topRatedLoading}
              layout={layout}>
            <FlatList
              data={topRated}
              renderItem={({item})=>renderItem(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
            </SkeletonContent>
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
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                Popular Books
              </Text>
            </TouchableOpacity>
            <SkeletonContent
              containerStyle={styles.skeletonContainer}
              boneColor="#333333"
              highlightColor={backgroundColor}
              isLoading={popularBooksLoading}
              layout={layout}>
            <FlatList
              data={popularBooks}
              renderItem={({item})=>renderItem(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
            </SkeletonContent>
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
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                Premium Books
              </Text>
            </TouchableOpacity>
            <SkeletonContent
              containerStyle={styles.skeletonContainer}
              boneColor="#333333"
              highlightColor={backgroundColor}
              isLoading={premiumBooksLoading}
              layout={layout}>
            <FlatList
              data={premiumBooks}
              renderItem={({item})=>renderItem(item)}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
            />
            </SkeletonContent>
          </View>
        </ScrollView>
      </View>
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
    // paddingTop: 20,
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
    width: width * 0.5,
  },
  btn: {
    padding: 10,
    backgroundColor: '#ff9000',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 5,
    borderRadius: 5,
  },
  btnContainer: {
    width: width,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    paddingVertical: 10,
  },
  nextImage: {
    height: height * 0.17,
    width: width * 0.28,
    marginRight: 15,
    resizeMode: 'stretch',
    borderRadius: 5,
  },
  nextImageText: {
    fontWeight: '600',
    fontSize: 12,
    width: width * 0.25,
    overflow: 'hidden',
    paddingTop: 5,
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
  moreimage: {
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
  moreimageText: {
    fontWeight: '600',
    fontSize: 12,
    paddingLeft: 5,
    // width: width * 0.24,
    overflow: 'hidden',
  },
  commentContainer: {
    // height: 70,
    width: width * 0.8,
    paddingTop: 10,
    flexDirection: 'column',
    // alignItems:'center',
    // justifyContent:'space-between',
  },
  commentHeader: {
    fontSize: 14,
    // width: width * 0.5,
  },
  commentFooter: {
    fontSize: 10,
    // textAlign: 'right',
    paddingRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontWeight: '800',
  },
  skeletonContainer : {
    width: width,
    flexDirection: 'row',
    flex: 1,
  }
});
