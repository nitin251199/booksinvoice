import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Image,
  FlatList,
  Animated,
  Modal,
  Pressable,
  ImageBackground,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';

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
import {postData, ServerURL} from './FetchApi';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {ThemeContext} from './ThemeContext';
import RBSheet from 'react-native-raw-bottom-sheet';
import {TextInput} from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window');

const togglePlayBack = async playBackState => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  if (currentTrack != null) {
    if (playBackState == State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

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
  const [commentText, setCommentText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // custom referecnces
  const scrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);
  const refRBSheet = useRef(null);

  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#191414' : '#FFF';

  const setupPlayer = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        // capabilities: [
        //   Capability.Play,
        //   Capability.Pause,
        //   Capability.SkipToNext,
        //   Capability.SkipToPrevious,
        //   Capability.Stop,
        // ],
        // compactCapabilities: [Capability.Play, Capability.Pause],
        stopWithApp: true,
      });
      await TrackPlayer.add(temp);
      TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
  };

  var temp = [
    {
      id: route.params.state.id,
      url: `${ServerURL}/admin/upload/bookaudio/${route.params.state.audiofile}`,
      title: route.params.state.bookname,
      artist: route.params.state.bookauthor,
      artwork: `${ServerURL}/admin/upload/bookcategory/${route.params.state.bookcategoryid}/${route.params.state.photo}`,
      album: route.params.state.bookcategory,
      duration: route.params.state.sampleplay_time,
    },
  ];
  const mapTracks = async () => {
    await route.params.data.map((track, index) => {
      temp.push({
        id: track.id,
        url: `${ServerURL}/admin/upload/bookaudio/${track.audiofile}`,
        title: track.bookname,
        artist: track.bookauthor,
        artwork: `${ServerURL}/admin/upload/bookcategory/${track.bookcategoryid}/${track.photo}`,
        album: track.bookcategory,
        duration: track.sampleplay_time,
      });
    });
    setTracks(temp);
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
  };

  useEffect(() => {
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
      TrackPlayer.stop();
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
    TrackPlayer.play();
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
    TrackPlayer.play();
  };

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (key[0] !== 'isLogin') {
      var userData = await getSyncData(key[0]).then(async res => {
        checkFavourite(res);
        var body = {
          type: 1,
          user_id: res.id,
          user_type: res.usertype.toLowerCase(),
        };
        var result = await postData('api/getSubscription', body);
        if (result.msg === 'Subscribed') {
          setStatus(false);
        }
        var {id, usertype} = res;
        setUserData({id, usertype});
      });
    }
  };

  const skipForward = async () => {
    await TrackPlayer.seekTo(progress.position + 10);
  };

  const skipBackward = async () => {
    await TrackPlayer.seekTo(progress.position - 10);
  };

  useEffect(() => {
    checkLogin();
  }, []);

  const getSectionDone = async () => {
    if (status) {
      const currentTrack = await TrackPlayer.getCurrentTrack();
      if (currentTrack != null) {
        if (Math.floor(progress.position) >= tracks[currentTrack].duration) {
          await TrackPlayer.stop();
          setModalVisible(true);
        }
      }
    }
  };

  const buySubscriptionModel = () => {
    return (
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onShow={async () => {
          var key = await checkSyncData();

          if (key[0] !== 'isLogin') {
            setUser('Buy Subscription');
          }
        }}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={style.centeredView}>
          <View style={[style.modalView, {backgroundColor: backgroundColor}]}>
            <Text style={[style.modalText, {color: textColor}]}>
              Please Buy Subscription to listen further !
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

  useEffect(() => {
    getSectionDone();
  }, [progress.position]);

  const postComment = async() => {
    const currentTrack = await TrackPlayer.getCurrentTrack();
    var body = { "type":1 , "c_name": name, "c_email": email, "c_msg": commentText, "books_id": tracks[currentTrack].id}
    var result = await postData('api/getAddcomment', body);
    if(result.msg === 'added')
    {
      ToastAndroid.show('Comment Added Successfully', ToastAndroid.SHORT);
      refRBSheet.current.close()
    }
    else
    {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      refRBSheet.current.close()
    }
    
  }

  const commentBottomSheet = () => {
    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: textColor,
          },
          container: {
            backgroundColor: backgroundColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        height={height * 0.6}>
        <View>
          <Text style={{color: textColor, margin: 10,marginHorizontal: 20,fontWeight:'800',fontSize:22}}>
            Write A review
          </Text>
          <Text style={{color: textColor, marginHorizontal: 20, fontSize: 14}}>
            We will not publish your email address. Required fields are marked*
          </Text>
          <View style={{marginTop: 20, marginHorizontal: 20}}>
            <Text style={{color: textColor, fontSize: 14}}>Comment</Text>
            <TextInput
              onChangeText={(text)=>setCommentText(text)}
              style={{
                borderWidth: 1,
                borderRadius: 5,
                marginVertical: 10,
                borderColor: textColor,
                color: textColor,
                paddingHorizontal:10
              }}
              multiline
              numberOfLines={3}
              placeholder="Write your comment here"
              placeholderTextColor="#999"
            />
            <View style={{flexDirection: 'row',}}>
              <View style={{flexDirection: 'column',width:'50%'}}>
                <Text style={{color: textColor, fontSize: 14}}>Name*</Text>
                <TextInput
                  onChangeText={(text)=>setName(text)}
                  placeholder='Name'
                  placeholderTextColor="#999"
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    marginVertical: 10,
                    marginRight: 10,
                    borderColor: textColor,
                    color: textColor,
                    paddingHorizontal:10
                  }}
                />
              </View>
              <View style={{flexDirection: 'column',width:'50%'}}>
                <Text style={{color: textColor, fontSize: 14}}>Email*</Text>
                <TextInput
                  onChangeText={(text)=>setEmail(text)}
                  placeholder='Email'
                  placeholderTextColor="#999"
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    marginVertical: 10,
                    borderColor: textColor,
                    color: textColor,
                    paddingHorizontal:10
                  }}
                />
              </View>
            </View>
           <TouchableOpacity onPress={()=>postComment()}>
           <View style={{backgroundColor:'#ff9000',justifyContent:'center',alignItems:'center',padding:20,marginVertical:10,borderRadius:5}}>
              <Text style={{color: '#FFF',fontWeight:'bold',fontSize:18}}>Post Comment</Text>
            </View>
           </TouchableOpacity>
          </View>
        </View>
      </RBSheet>
    );
  };

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
    var speed = await TrackPlayer.getRate();
    if (speed == 1) {
      await TrackPlayer.setRate(1.5);
      setSpeed(1.5);
    } else if (speed == 1.5) {
      TrackPlayer.setRate(2);
      setSpeed(2);
    } else if (speed == 2) {
      TrackPlayer.setRate(0.5);
      setSpeed(0.5);
    } else if (speed == 0.5) {
      TrackPlayer.setRate(1);
      setSpeed(1);
    }
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
  };

  const addFavourite = async () => {
    if (userData.id !== '') {
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

  return (
    <SafeAreaView
      style={[
        style.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      {commentBottomSheet()}
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
              await TrackPlayer.seekTo(value);
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
            <MaterialIcons name="replay-10" size={25} color="#ff9000" />
          </TouchableOpacity>
          <TouchableOpacity onPress={skipToPrevious}>
            <Ionicons name="play-skip-back-outline" size={35} color="#ff9000" />
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
            <MaterialIcons name="forward-10" size={25} color="#ff9000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* bottom section */}
      <View style={style.bottomSection}>
        <View style={style.bottomIconContainer}>
          <TouchableOpacity onPress={() => addFavourite()}>
            {isFavourite ? (
              <Ionicons name="heart-sharp" size={30} color="red" />
            ) : (
              <Ionicons name="heart-outline" size={30} color="#888888" />
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={30}
              color={repeatMode !== 'off' ? '#ff9000' : '#888888'}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <MaterialCommunityIcons
              name="comment-text-outline"
              size={30}
              color="#888888"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handleTrackSpeed()}>
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
      {buySubscriptionModel()}
    </SafeAreaView>
  );
};

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#212121',
  },
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
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
    width: 300,
    height: 340,
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
    marginTop: 15,
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
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
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
