import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  Animated,
  Modal,
  Pressable,
  ImageBackground,
  ToastAndroid,
  ActivityIndicator,
  ScrollView,
  FlatList,
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import {postData, ServerURL} from './FetchApi';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {ThemeContext} from './ThemeContext';
import {Slider as SpeedSlider} from 'react-native-elements';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';
import Share from 'react-native-share';

const {width, height} = Dimensions.get('window');

const MusicPlayer = ({route, navigation}) => {
  const playBackState = usePlaybackState();
  const progress = useProgress();
  //   custom states
  const [songIndex, setsongIndex] = useState(0);
  const [repeatMode, setRepeatMode] = useState('off');
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();
  const [tracks, setTracks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState('Login & Buy');
  const [userData, setUserData] = useState({id: '', usertype: ''});
  const [status, setStatus] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [isFavourite, setIsFavourite] = useState(false);
  const [speedModalVisible, setSpeedModalVisible] = useState(false);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [chapter, setChapter] = useState([]);
  const [timerValue, setTimerValue] = useState(0);
  const [likeCount, setLikeCount] = useState('');
  const [isLike, setIsLike] = useState(false);

  var isSub = useSelector(state => state.isSubscribed);

  // custom referecnces
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);
  const refRBSheet = useRef(null);

  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';

  const togglePlayBack = async playBackState => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (currentTrack != null) {
      if (playBackState == State.Paused) {
        if (progress.position == 0) {
          await TrackPlayer.play();
          backgroundTimer();
        } else {
          await TrackPlayer.play();
        }
      } else {
        await TrackPlayer.pause();
        setSelected({index: ''});
      }
    }
  };

  const index = route.params.index;
  const chapters = [];

  if (index !== null) {
    var temp = [
      {
        id: route.params.state.id,
        url: `${ServerURL}/admin/upload/bookaudio/${route.params.chapters[index].audiofile}`,
        title: route.params.chapters[index].chaptername,
        artist: route.params.state.bookauthor,
        artwork: `${ServerURL}/admin/upload/bookcategory/${route.params.state.bookcategoryid}/${route.params.state.photo}`,
        album: route.params.state.bookcategory,
        duration: route.params.state.sampleplay_time,
        index: 0,
      },
    ];
  } else {
    var temp = [
      {
        id: route.params.state.id,
        url: `${ServerURL}/admin/upload/bookaudio/${route.params.state.audiofile}`,
        title: route.params.state.bookname,
        artist: route.params.state.bookauthor,
        artwork: `${ServerURL}/admin/upload/bookcategory/${route.params.state.bookcategoryid}/${route.params.state.photo}`,
        album: route.params.state.bookcategory,
        duration: route.params.state.sampleplay_time,
        index: 0,
      },
    ];
  }

  const mapTracks = async () => {
    if (index !== null) {
      temp.push({
        id: route.params.state.id,
        url: `${ServerURL}/admin/upload/bookaudio/${route.params.state.audiofile}`,
        title: route.params.state.bookname,
        artist: route.params.state.bookauthor,
        artwork: `${ServerURL}/admin/upload/bookcategory/${route.params.state.bookcategoryid}/${route.params.state.photo}`,
        album: route.params.state.bookcategory,
        duration: route.params.state.sampleplay_time,
        index: 1,
      });
    }
    await route.params.chapters.map((track, index) => {
      temp.push({
        id: route.params.state.id,
        url: `${ServerURL}/admin/upload/bookaudio/${track.audiofile}`,
        title: track.chaptername,
        artist: route.params.state.bookauthor,
        artwork: `${ServerURL}/admin/upload/bookcategory/${route.params.state.bookcategoryid}/${route.params.state.photo}`,
        album: route.params.state.bookcategory,
        duration: route.params.state.sampleplay_time,
        index: index + 1,
      });
      chapters.push({
        id: route.params.state.id,
        url: `${ServerURL}/admin/upload/bookaudio/${track.audiofile}`,
        title: track.chaptername,
        artist: route.params.state.bookauthor,
        artwork: `${ServerURL}/admin/upload/bookcategory/${route.params.state.bookcategoryid}/${route.params.state.photo}`,
        album: route.params.state.bookcategory,
        duration: route.params.state.sampleplay_time,
        index: index + 1,
      });
    });
    setTracks(temp);
    setChapter(chapters);
  };

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        capabilities: [
          Capability.Play,
          Capability.Pause,
          // Capability.SkipToNext,
          // Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
        stopWithApp: true,
      });
      await TrackPlayer.add(temp);
      TrackPlayer.play();
      backgroundTimer();
    } catch (error) {
      console.log(error);
    }
  };

  //   changing the track on complete
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async event => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const {title, artwork, artist} = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  const repeatIcon = () => {
    if (repeatMode == 'off') {
      return 'repeat-off';
    }

    if (repeatMode == 'track') {
      return 'repeat-once';
    }

    if (repeatMode == 'repeat') {
      return 'repeat';
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode == 'off') {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode('track');
    }

    if (repeatMode == 'track') {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode('repeat');
    }

    if (repeatMode == 'repeat') {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode('off');
    }
  };

  const skipTo = async trackId => {
    await TrackPlayer.skip(trackId);
    backgroundTimer();
  };

  useEffect(() => {
    checkLogin();
    mapTracks();
    setupPlayer();
    scrollX.addListener(({value}) => {
      //   console.log(`ScrollX : ${value} | Device Width : ${width} `);

      const index = Math.round(value / width);
      skipTo(index);
      setsongIndex(index);

      //   console.log(`Index : ${index}`);
    });
    return () => {
      scrollX.removeAllListeners();
      // TrackPlayer.stop();
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
    TrackPlayer.play();
    backgroundTimer();
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
    TrackPlayer.play();
    backgroundTimer();
  };

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (key[0] !== 'fcmToken') {
      await getSyncData(key[0]).then(async res => {
        checkFavourite(res);
        var body = {
          type: 1,
          user_id: res.id,
          user_type: res.usertype.toLowerCase(),
          book_id: route.params.state.id,
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

  const skipForward = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    if (!isSub) {
      if (Math.floor(progress.position) >= temp[currentTrack].duration) {
        console.log('end', temp[currentTrack].duration, Math.floor(progress.position));
        await TrackPlayer.seekTo(0);
        await TrackPlayer.pause();
        setModalVisible(true);
      } else {
        console.log('starts', temp[currentTrack].duration, Math.floor(progress.position));
        await TrackPlayer.seekTo(progress.position + 10);
      }
    } else {
      
      await TrackPlayer.seekTo(progress.position + 10);
    }
  };

  const skipBackward = async () => {
    await TrackPlayer.seekTo(progress.position - 10);
  };

  // const getSectionDone = async () => {
  //   if (status) {
  //     const currentTrack = await TrackPlayer.getCurrentTrack();
  //     if (currentTrack != null) {
  //       if (Math.floor(progress.position) >= tracks[currentTrack].duration) {
  //         await TrackPlayer.stop();
  //         setModalVisible(true);
  //       }
  //     }
  //   }
  // };

  // useEffect(() => {
  //   getSectionDone();
  // }, [progress.position]);

  const backgroundTimer = async () => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    // Start a timer that runs once after X milliseconds
    if (status) {
      if (!isSub) {
        BackgroundTimer.start();
        const timeoutId = BackgroundTimer.setTimeout(async () => {
          if (currentTrack != null) {
            await TrackPlayer.seekTo(0);
            await TrackPlayer.pause();
            setModalVisible(true);
          }
          // this will be executed once after 10 seconds
          // even when app is the the background
        }, temp[currentTrack].duration * 1000);
      }
    }
    // Cancel the timeout if necessary
    // BackgroundTimer.clearTimeout(timeoutId);
  };

  const buySubscriptionModel = () => {
    return (
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onShow={async () => {
          var key = await checkSyncData();
          if (key[0] !== 'fcmToken') {
            setUser('Buy Subscription');
          }
        }}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={style.centeredView}>
          <View
            style={[style.modalView, {backgroundColor: modelBackgroundColor}]}>
            <Text style={[style.modalText, {color: textColor}]}>
              Buy Subscription Listen Great Audiobooks !
            </Text>
            <Pressable
              style={[style.button, {backgroundColor: '#ff9000'}]}
              onPress={() => {
                user === 'Login & Buy'
                  ? navigation.navigate('Login')
                  : navigation.navigate('Subscriptions');
                setModalVisible(false);
              }}>
              <Text style={[style.textStyle, {color: textColor}]}>{user}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  // const closePlayer = () => {
  //   refMiniRBSheet.current.close()
  //   console.log('close', refMiniRBSheet);
  // }

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const onBackPress =() => {
  //       // closePlayer()
  //         return true;
  //     };

  //     BackHandler.addEventListener('hardwareBackPress', onBackPress);

  //     return () =>
  //       BackHandler.removeEventListener('hardwareBackPress', onBackPress);
  //   }, [progress.position])
  // );

  const renderSongs = ({item, index}) => {
    return (
      <ImageBackground
        resizeMode="cover"
        source={require('../../images/musicbg.jpg')}
        imageStyle={{opacity: 0.4}}
        // style={{marginTop:20}}
        style={style.mainWrapper}>
        <Animated.View>
          <View style={[style.imageWrapper, style.elevation]}>
            <Image
              //   source={item.artwork}
              source={{uri: trackArtwork}}
              style={style.musicImage}
            />
          </View>
        </Animated.View>
      </ImageBackground>
    );
  };

  const handleTrackSpeed = async () => {
    await TrackPlayer.setRate(speed);
    setSpeedModalVisible(false);
  };

  const speedModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={speedModalVisible}
        onRequestClose={() => {
          setSpeedModalVisible(false);
        }}>
        <View style={style.centeredView}>
          <View
            style={[
              {
                backgroundColor: modelBackgroundColor,
                padding: 20,
                borderRadius: 10,
              },
            ]}>
            <Text
              style={[
                {
                  color: textColor,
                  padding: 10,
                  fontSize: 20,
                  fontWeight: '600',
                  marginBottom: 20,
                },
              ]}>
              Set Speed
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 22,
                color: textColor,
                fontWeight: '800',
                padding: 10,
              }}>
              {speed}x
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '300',
                  padding: 10,
                  color: textColor,
                }}>
                0.5
              </Text>
              <View style={{width: 150}}>
                <SpeedSlider
                  value={speed * 10}
                  onValueChange={value => setSpeed(value / 10)}
                  maximumValue={35}
                  minimumValue={5}
                  step={1}
                  allowTouchTrack
                  trackStyle={{height: 2, backgroundColor: '#999'}}
                  thumbStyle={{
                    height: 20,
                    width: 20,
                    backgroundColor: '#ff9000',
                  }}
                />
              </View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '300',
                  padding: 10,
                  color: textColor,
                }}>
                3.5
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setSpeed(1)}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    backgroundColor: speed === 1 ? '#ff9000' : '#99999950',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 20,
                  }}>
                  <Text style={{color: textColor}}>1x</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSpeed(2)}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    backgroundColor: speed === 2 ? '#ff9000' : '#99999950',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 20,
                  }}>
                  <Text style={{color: textColor}}>2x</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSpeed(3)}>
                <View
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 50,
                    backgroundColor: speed === 3 ? '#ff9000' : '#99999950',
                    justifyContent: 'center',
                    alignItems: 'center',
                    margin: 20,
                  }}>
                  <Text style={{color: textColor}}>3x</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                padding: 20,
              }}>
              <TouchableOpacity onPress={() => setSpeedModalVisible(false)}>
                <View
                  style={{
                    backgroundColor: 'transparent',
                    padding: 10,
                    borderRadius: 2,
                  }}>
                  <Text
                    style={{fontSize: 18, fontWeight: '500', color: textColor}}>
                    Cancel
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleTrackSpeed()}>
                <View
                  style={{
                    backgroundColor: '#ff9000',
                    paddingVertical: 10,
                    borderRadius: 3,
                    paddingHorizontal: 40,
                  }}>
                  <Text
                    style={{fontSize: 18, fontWeight: '500', color: textColor}}>
                    OK
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const checkFavourite = async res => {
    var body = {
      type: '1',
      user_id: res.id,
      user_type: res.usertype,
      books_id: route.params.state.id,
    };
    var result = await postData('api/getFavouritebook', body);
    if (result.msg === 'Success') {
      setIsFavourite(true);
    }
    var likes = await postData('api/getLikebook', body);
    setLikeCount(likes.count);
    if (likes.msg === 'Success') {
      setIsLike(true);
    }
  };

  const addLike = async () => {
    if (userData.id !== '' && userData.id !== undefined) {
      var body = {
        type: '1',
        user_id: userData.id,
        user_type: userData.usertype,
        books_id: route.params.state.id,
      };
      var result = await postData('api/getLikeadd', body);
      if (result.msg === 'Added') {
        setIsLike(true);
        setLikeCount(parseInt(likeCount) + 1);
        ToastAndroid.show('You liked the book !', ToastAndroid.SHORT);
      } else if (result.msg === 'Deleted') {
        setIsLike(false);
        setLikeCount(parseInt(likeCount) - 1);
        ToastAndroid.show('You disliked the book !', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show('Please Log in to like the book !', ToastAndroid.SHORT);
    }
  };

  const addFavourite = async () => {
    if (userData.id !== '' && userData.id !== undefined) {
      var body = {
        type: '1',
        user_id: userData.id,
        user_type: userData.usertype,
        books_id: route.params.state.id,
      };
      var result = await postData('api/getFavouriteadd', body);
      if (result.msg === 'Added') {
        setIsFavourite(true);
        ToastAndroid.show('Added To Favourites !', ToastAndroid.SHORT);
      } else if (result.msg === 'Deleted') {
        setIsFavourite(false);
        ToastAndroid.show('Removed From Favourites !', ToastAndroid.SHORT);
      }
    } else {
      ToastAndroid.show(
        'Please Log in to add favourites !',
        ToastAndroid.SHORT,
      );
    }
  };

  const [selected, setSelected] = useState({index: 0});

  const playChapter = (item, i) => {
    var {index} = item;
    setSelected({index});
    skipTo(i + 1);
    if (playBackState == State.Paused) {
      TrackPlayer.play();
    }
  };

  const pauseChapter = () => {
    setSelected({index: ''});
    TrackPlayer.pause();
  };

  const showChapters = ({item, index}) => {
    return (
      <View
        style={{
          flexDirection: 'row',
          padding: 10,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            width: width * 0.8,
            overflow: 'hidden',
          }}>
          <Image
            source={{
              uri: `${ServerURL}/admin/upload/bookcategory/${route.params.state.bookcategoryid}/${route.params.state.photo}`,
            }}
            style={{width: 35, height: 35, borderRadius: 5}}
          />
          <TouchableOpacity onPress={() => playChapter(item, index)}>
            <Text
              style={{
                fontSize: 15,
                color: textColor,
                marginLeft: 15,
                fontWeight: '700',
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
        {selected.index === item.index ? (
          <TouchableOpacity onPress={() => pauseChapter()}>
            <FontAwesome5 name="pause" color={'#ff9000'} size={20} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => playChapter(item, index)}>
            <FontAwesome5 name="play" color={'#ff9000'} size={20} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  function fancyTimeFormat(duration) {
    // Hours, minutes and seconds
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    // Output like "1:01" or "4:03:59" or "123:03:59"
    var ret = '';

    if (hrs > 0) {
      ret += '' + hrs + ':' + (mins < 10 ? '0' : '');
    }

    ret += '' + mins + ':' + (secs < 10 ? '0' : '');
    ret += '' + secs;
    return ret;
  }

  const timerBS = () => {
    {
      return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={timerModalVisible}
          onRequestClose={() => {
            setTimerModalVisible(false);
          }}>
          <View style={style.centeredView}>
            <View
              style={[
                {
                  backgroundColor: modelBackgroundColor,
                  padding: 20,
                  borderRadius: 10,
                },
              ]}>
              <Text
                style={[
                  {
                    color: textColor,
                    padding: 10,
                    fontSize: 20,
                    fontWeight: '600',
                    marginBottom: 20,
                  },
                ]}>
                Set Sleep timer
              </Text>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 22,
                  color: textColor,
                  fontWeight: '800',
                  padding: 10,
                }}>
                {fancyTimeFormat(timerValue)} min
              </Text>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={() => setTimerValue(600)}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      backgroundColor:
                        timerValue === 600 ? '#ff9000' : '#99999950',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 20,
                    }}>
                    <Text style={{color: textColor}}>10m</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTimerValue(1200)}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      backgroundColor:
                        timerValue === 1200 ? '#ff9000' : '#99999950',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 20,
                    }}>
                    <Text style={{color: textColor}}>20m</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setTimerValue(1800)}>
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      backgroundColor:
                        timerValue === 1800 ? '#ff9000' : '#99999950',
                      justifyContent: 'center',
                      alignItems: 'center',
                      margin: 20,
                    }}>
                    <Text style={{color: textColor}}>30m</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-around',
                  padding: 20,
                }}>
                <TouchableOpacity onPress={() => setTimerModalVisible(false)}>
                  <View
                    style={{
                      backgroundColor: 'transparent',
                      padding: 10,
                      borderRadius: 2,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: textColor,
                      }}>
                      Cancel
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleTimerValue()}>
                  <View
                    style={{
                      backgroundColor: '#ff9000',
                      paddingVertical: 10,
                      borderRadius: 3,
                      paddingHorizontal: 40,
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '500',
                        color: textColor,
                      }}>
                      OK
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    }
  };

  const handleTimerValue = () => {
    setTimerModalVisible(false);
    BackgroundTimer.start();
    const timeoutId = BackgroundTimer.setTimeout(async () => {
      await TrackPlayer.pause();
      // this will be executed once after 10 seconds
      // even when app is the the background
    }, timerValue * 1000);
  };

  const onShare = async () => {
    try {
      let imagePath = null;
      let currentTrack = await TrackPlayer.getCurrentTrack();
      console.log('onShare',temp[currentTrack].artwork);
      RNFetchBlob.config({
        fileCache: true,
      })
        .fetch('GET', temp[currentTrack].artwork)
        // the image is now dowloaded to device's storage
        .then(resp => {
          // the image path you can use it directly with Image component
          imagePath = resp.path();
          return resp.readFile('base64');
        })
        .then(async base64Data => {
          var base64Data = `data:image/png;base64,` + base64Data;
          // here's base64 encoded image
          await Share.open({
            // title: `Booksinvoice - Download and listen books for free.`,
            message: `Listen to ${temp[currentTrack].title} by ${temp[currentTrack].artist} only on Booksinvoice.com\nBooksinvoice - Download and listen books for free.\nDownload from playstore: https://play.google.com/store/apps/details?id=com.booksinvoice`,
            url: base64Data,
          });
          // remove the file from storage
          return RNFetchBlob.fs.unlink(imagePath);
        });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          justifyContent: 'center',
        }}
        style={[
          style.container,
          {
            backgroundColor: backgroundColor,
          },
        ]}>
        {/* music player section */}
        <View style={style.mainContainer}>
          {/* Image */}

          <Animated.FlatList
            ref={songSlider}
            renderItem={renderSongs}
            data={tracks}
            keyExtractor={(item, index) => index}
            horizontal
            pagingEnabled
            ListEmptyComponent={() => <ActivityIndicator size="large" />}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={16}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {x: scrollX},
                  },
                },
              ],
              {useNativeDriver: true},
            )}
          />

          {/* Title & Artist Name */}
          <View>
            <Text
              style={[style.songContent, style.songTitle, {color: textColor}]}>
              {/* {songs[songIndex].title} */ trackTitle}
            </Text>
            <Text
              style={[style.songContent, style.songArtist, {color: textColor}]}>
              {/* {songs[songIndex].artist} */ trackArtist}
            </Text>
          </View>

          {/* songslider */}
          <View>
            <Slider
              style={style.progressBar}
              value={progress.position}
              minimumValue={0}
              maximumValue={progress.duration}
              thumbTintColor="#ff9000"
              minimumTrackTintColor="#ff9000"
              maximumTrackTintColor={textColor}
              onSlidingComplete={async value => {
                const currentTrack = await TrackPlayer.getCurrentTrack();
                if (!isSub) {
                  if (Math.floor(value) >= temp[currentTrack].duration) {
                    await TrackPlayer.seekTo(0);
                    await TrackPlayer.pause();
                    setModalVisible(true);
                  } else {
                    await TrackPlayer.seekTo(value);
                  }
                } else {
                  await TrackPlayer.seekTo(value);
                }
              }}
            />

            {/* Progress Durations */}
            <View style={style.progressLevelDuraiton}>
              <Text
                style={[
                  style.progressLabelText,
                  {
                    color: textColor,
                  },
                ]}>
                {new Date(progress.position * 1000).toISOString().substr(14, 5)}
              </Text>
              <Text
                style={[
                  style.progressLabelText,
                  {
                    color: textColor,
                  },
                ]}>
                {new Date((progress.duration - progress.position) * 1000)
                  .toISOString()
                  .substr(14, 5)}
              </Text>
            </View>
          </View>

          {/* music control */}
          <View style={style.musicControlsContainer}>
            <TouchableOpacity onPress={skipBackward}>
              <MaterialIcons name="replay-10" size={30} color="#ff9000" />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToPrevious}>
              <Ionicons
                name="play-skip-back-outline"
                size={35}
                color="#ff9000"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
              <Ionicons
                name={
                  playBackState === State.Playing
                    ? 'ios-pause-circle'
                    : 'ios-play-circle'
                }
                size={75}
                color="#ff9000"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipToNext}>
              <Ionicons
                name="play-skip-forward-outline"
                size={35}
                color="#ff9000"
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={skipForward}>
              <MaterialIcons name="forward-10" size={30} color="#ff9000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* <MiniPlayer ref={refMiniRBSheet} /> */}
        {/* bottom section */}
        <View
          style={{...style.bottomSection, backgroundColor: backgroundColor}}>
          <View style={style.bottomIconContainer}>
            <TouchableOpacity onPress={() => addLike()}>
              {isLike ? (
                <Ionicons name="heart-sharp" size={30} color="red" />
              ) : (
                <Ionicons name="heart-outline" size={30} color="#888888" />
              )}
              <Text
                style={{
                  fontSize: 14,
                  position: 'absolute',
                  top: -9,
                  right: -10,
                  fontWeight: '500',
                }}>
                {likeCount}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={changeRepeatMode}>
              <MaterialCommunityIcons
                name={`${repeatIcon()}`}
                size={30}
                color={repeatMode !== 'off' ? '#ff9000' : '#888888'}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate('Comment', {id: route.params.id})
              }>
              <Fontisto
                style={{marginTop: 4}}
                name="commenting"
                size={26}
                color="#888888"
              />
            </TouchableOpacity>

            {/* <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <Fontisto
              style={{marginTop:4}}
              name="commenting"
              size={26}
              color="#888888"
            />
          </TouchableOpacity> */}

            <TouchableOpacity onPress={() => setSpeedModalVisible(true)}>
              <MaterialCommunityIcons
                name="speedometer"
                size={30}
                color="#888888"
              />
              <Text
                style={{
                  fontSize: 12,
                  textAlign: 'center',
                  marginTop: -12,
                  fontWeight: '800',
                  color: '#888888',
                }}>
                {speed}x
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{...style.bottomSection, backgroundColor: backgroundColor}}>
          <View style={style.bottomIconContainer}>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="download"
                size={30}
                color="#888888"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => addFavourite()}>
              {isFavourite ? (
                <Ionicons name="bookmark" size={28} color="#0652DD" />
              ) : (
                <Ionicons name="bookmark-outline" size={28} color="#888888" />
              )}
            </TouchableOpacity>

            <TouchableOpacity>
              <MaterialCommunityIcons
                onPress={() => setTimerModalVisible(true)}
                name="timer-outline"
                size={30}
                color="#888888"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={onShare}>
              <MaterialCommunityIcons name="share" size={30} color="#888888" />
            </TouchableOpacity>
          </View>
        </View>

        {route.params.chapters.length > 1 && (
          <View
            style={{
              width: width,
              backgroundColor: backgroundColor,
              padding: 15,
            }}>
            <FlatList
              data={chapter}
              renderItem={showChapters}
              keyExtractor={(item, index) => index}
            />
          </View>
        )}

        {timerBS()}
        {buySubscriptionModel()}
        {speedModal()}
      </ScrollView>
    </>
  );
};

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    // position:'absolute',
    // bottom:10,
    borderTopColor: '#393E46',
    borderWidth: 1,
    width: width,
    alignItems: 'center',
    paddingVertical: 15,
  },

  bottomIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
  },

  mainWrapper: {
    width: width,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },

  imageWrapper: {
    width: 250,
    height: 290,
    marginBottom: 25,
    marginTop: 30,
  },
  musicImage: {
    width: '100%',
    height: '100%',
    borderRadius: 0,
    resizeMode: 'stretch',
  },
  elevation: {
    elevation: 5,

    shadowColor: '#ccc',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songContent: {
    textAlign: 'center',
    color: '#EEEEEE',
  },
  songTitle: {
    fontSize: 18,
    fontWeight: '600',
    // paddingTop:20
  },

  songArtist: {
    fontSize: 16,
    fontWeight: '300',
  },

  progressBar: {
    width: width * 0.9,
    height: 40,
    marginTop: 25,
    flexDirection: 'row',
  },
  progressLevelDuraiton: {
    width: width * 0.9,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabelText: {
    color: '#FFF',
  },

  musicControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 15,
    width: '80%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: width * 0.7,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
