import messaging from '@react-native-firebase/messaging';
import { getSyncData, storeDatasync } from './AsyncStorage';

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
