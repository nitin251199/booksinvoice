import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import TrackPlayer from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useSelector} from 'react-redux';
import {ServerURL} from './FetchApi';

export const SamplePlay = ({item, propsStyles, navigation}) => {
  const [selected, setSelected] = React.useState({id:''});
  var time = 0;
  var s = 0;

  const setup = async (i) => {
    
    setSelected({id: i.id});
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
    var t = setTimeout(getSectionDone, 1000);
    if (!status) {
      if (s >= time) {
        await TrackPlayer.stop();
        setSelected({id: ''});
        Alert.alert(
          'Booksinvoice',
          'Please subscribe to listen further!',
          [{text: 'OK',onPress: () => navigation.navigate('Subscriptions')}],
          {cancelable: true},
        );
        clearTimeout(t);
      }
    }
  };

  return (
    <View style={propsStyles}>
      { selected.id === item.id ? (
        <TouchableWithoutFeedback
          onPress={() => {
            TrackPlayer.stop();
            setSelected({id:''});
          }}>
          <View style={styles.sample}>
            <MaterialCommunityIcons name="pause" size={25} color="black" />
          </View>
        </TouchableWithoutFeedback>
      )
      : (
        <TouchableWithoutFeedback
          onPress={() => {
            setup(item);
          }}>
          <View style={styles.sample}>
            <MaterialCommunityIcons name="play" size={25} color="black" />
          </View>
        </TouchableWithoutFeedback>
      )
       }
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
