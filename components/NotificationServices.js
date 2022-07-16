import messaging from '@react-native-firebase/messaging';
import {
  checkSyncData,
  getSyncData,
  removeDatasync,
  storeDatasync,
} from './AsyncStorage';
import PushNotification from 'react-native-push-notification';
import {postData} from './FetchApi';
import {Alert, NativeModules, Platform} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LoginManager} from 'react-native-fbsdk-next';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission({
    sound: true,
    alert: true,
  });
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    // console.log('Authorization status:', authStatus);
    getFcmToken();
  }
}

const getFcmToken = async () => {
  let fcmToken = await getSyncData('fcmToken');
  console.log('the old token', fcmToken);
  if (!fcmToken) {
    try {
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log('the new token', fcmToken);
        await storeDatasync('fcmToken', fcmToken);
        var body = {type: 1, token_no_id: fcmToken};
        await postData('api/getAddToken', body);
      }
    } catch (error) {
      console.log('error getting token', error);
    }
  }
};

export const notificationListener = async navigation => {
  messaging().onNotificationOpenedApp(remoteMessage => {
    // navigation.navigate('CategoryPage', {
    //   item: {
    //     id: '0',
    //     bookcategory: 'New Arrivals',
    //     catphoto: 'custom_img.jpg',
    //   },
    // })
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
  });

  messaging().onMessage(async remoteMessage => {
    console.log('received in foreground', remoteMessage);
    PushNotification.localNotification({
      channelId: 'fcm_fallback_notification_channel',
      message: remoteMessage.notification.body,
      title: remoteMessage.notification.title,
      bigPictureUrl: remoteMessage.notification.android.imageUrl,
      smallIcon: remoteMessage.notification.android.imageUrl,
    });
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
      }
    });
};

export const fetchProfile = async dispatch => {
  var key = await checkSyncData();

  if (key[0] != 'fcmToken') {
    var userData = await getSyncData(key[0]);
    var body = {
      type: 1,
      user_id: userData.id,
      user_type: userData.usertype,
    };
    var result = await postData('api/getProfile', body);
    await checkDeviceID(result.data[0].device_id, userData, dispatch);
  }
};

const checkDeviceID = async (deviceID, userData, dispatch) => {
  let originalID =
    Platform.OS === 'android'
      ? NativeModules.PlatformConstants.getAndroidID()
      : NativeModules.SettingsManager.clientUniqueId;
  if (deviceID !== originalID) {
    // console.log('Device ID is not same', deviceID, originalID);
    Alert.alert(
      'Different Device Detected',
      'You have been logged out of your account. Please login again.',
    );
    await handleLogout(userData, dispatch);
  }
};

const signOut = async () => {
  try {
    await GoogleSignin.signOut();
    // this.setState({ user: null }); // Remember to remove the user from your app's state as well
  } catch (error) {
    console.error(error);
  }
};

const signOutFb = () => {
  try {
    LoginManager.logOut();
    // this.setState({ user: null }); // Remember to remove the user from your app's state as well
  } catch (error) {
    console.error(error);
  }
};

const handleLogout = async (userData, dispatch) => {
  signOut();
  signOutFb();
  await removeDatasync(userData.id);
  storeDatasync('isLogin', false);
  dispatch({
    type: 'SET_STATUS',
    payload: {isLogin: false, isSubscribed: false},
  });
  dispatch({type: 'REMOVE_ALL_CART'});
  await storeDatasync('isSubscribed', false);
};
