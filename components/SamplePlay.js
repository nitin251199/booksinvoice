import React, {useEffect, useState} from 'react';
import {Dimensions, Modal, Pressable, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import TrackPlayer, {useProgress} from 'react-native-track-player';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {postData, ServerURL} from './FetchApi';


export const SamplePlay = ({item, propsStyles}) => {
  const [isPlaying, setIsPlaying] = React.useState(false);
  // const progress = useProgress();

  const setup = async () => {
    try {
      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        stopWithApp: true,
      });
      await TrackPlayer.add({
        id: 'sample',
        url: `${ServerURL}/admin/upload/bookaudio/${item.audiofile}`,
        title: 'Sample',
        artist: 'Sample',
        duration: item.sampleplay_time,
      });
      TrackPlayer.play();
      setIsPlaying(true);
    } catch (error) {
      console.log(error);
    }
  };

  

  return (
    <View style={propsStyles}>
      {isPlaying ? (
        <TouchableWithoutFeedback
          onPress={() => {
            TrackPlayer.stop();
            setIsPlaying(false);
          }}>
          <View style={styles.sample}>
            <MaterialCommunityIcons name="pause" size={25} color="black" />
          </View>
        </TouchableWithoutFeedback>
      ) : (
        <TouchableWithoutFeedback
          onPress={() => {
            setup();
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
