import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {Alert, Linking, LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import RootReducer from './components/RootReducer';
import {Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './components/RootNavigator';
import SplashScreen from 'react-native-splash-screen';
import VersionCheck from 'react-native-version-check';

const App = () => {

  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    LogBox.ignoreLogs(['new NativeEventEmitter()']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['[react-native-gesture-handler]']);
  }, []);

  useEffect(()=> {
    SplashScreen.hide();
    checkVersion()
  },[])

  const checkVersion = async () => {
    try {
      let updateNeeded = await VersionCheck.needUpdate();
      if (updateNeeded && updateNeeded.isNeeded) {
        Alert.alert(
          'Update Needed',
          'Please update the app to the latest version',
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'Update', onPress: () => Linking.openURL(updateNeeded.storeUrl)},
          ],
          {cancelable: true},
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  const store = createStore(RootReducer);

  const linking = {
    prefixes: ['https://www.booksinvoice.com'],
  };

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
          <PaperProvider>
            <RootNavigator />
          </PaperProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
