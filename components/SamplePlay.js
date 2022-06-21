import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {ServerURL} from './FetchApi';

export const SamplePlay = ({item, propsStyles, navigation}) => {
  var time = 0;
  var s = 0;
  var timeout;
  const selected = useSelector(state => state.currentSong);

  var dispatch = useDispatch();

  const setup = async i => {
    dispatch({type: 'SET_CURRENT_SONG', payload: {id: i.id}});
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: true,
      });
      await TrackPlayer.add({
        id: i.id,
        url: `${ServerURL}/admin/upload/bookaudio/${i.audiofile}`,
        title: 'Sample',
        artist: 'Sample',
        duration: i.sampleplay_time,
      });
      time = i.sampleplay_time;
      TrackPlayer.play();
      getSectionDone();
    } catch (error) {
      console.log(error);
    }
  };

  const status = useSelector(state => state.isSubscribed);

  const getSectionDone = async () => {
    s++;
    timeout = setTimeout(getSectionDone, 1000);
    if (!status) {
      if (s >= time) {
        await TrackPlayer.stop();
        dispatch({type: 'SET_CURRENT_SONG', payload: {id: ''}});
        // Alert.alert(
        //   'Booksinvoice',
        //   'Please subscribe to listen further!',
        //   [{
        //     text: 'Cancel',
        //     // onPress: () => console.log("Cancel Pressed"),
        //     style: 'cancel',
        //   },
        //     {text: 'OK', onPress: () => navigation.navigate('Subscriptions')}],
        //   {cancelable: true},
        // );
        clearTimeout(timeout);
      }
    }
  };

  return (
    <View style={propsStyles}>
      {selected.id === item.id ? (
        <TouchableWithoutFeedback
          onPress={() => {
            TrackPlayer.stop();
            dispatch({type: 'SET_CURRENT_SONG', payload: {id: ''}});
            clearTimeout(timeout)
          }}>
          <View style={styles.sample}>
            <MaterialCommunityIcons name="pause" size={25} color="black" />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            setup(item);
          }}>
          <View style={styles.sample}>
            <MaterialCommunityIcons name="play" size={25} color="black" />
          </View>
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sample: {
    backgroundColor: '#ff900050',
    // opacity: 0.5,
    width: 40,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    overflow: 'hidden',
    // elevation: 20,
  },
  sampleText: {
    color: '#000',
    fontWeight: '800',
    textAlign: 'center',
    opacity: 1,
  },
});
