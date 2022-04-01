import React from 'react';
import {
  PermissionsAndroid,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const Download = () => {
;
  const requestToPermissions = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Music',
          message: 'App needs access to your Files... ',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED)
        console.log('startDownload...');

      startDownload();
    } catch (err) {
      console.log(err);
    }
  };

  const startDownload = () => {
    // const {tunes, token, currentTrackIndex} = this.state;
    // let url, name = tunes[currentTrackIndex];
    RNFetchBlob.config({
      fileCache: true,
      appendExt: 'mp3',
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: 'name',
        path: `/storage/emulated/0/Android/data/com.booksinvoice/files/` + `name`, // Android platform
        description: 'Downloading the file',
      },
    })
      .fetch('GET', 'https://booksinvoice.com/admin/upload/bookaudio/1706.mp3')
      .then(res => {
        console.log('res', res.base64());
        console.log('The file is save to ', res.path());
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => requestToPermissions()}>
        <Text style={{color: '#FFF', fontSize: 22}}>Download</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
});
