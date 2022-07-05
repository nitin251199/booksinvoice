import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import RootReducer from './components/RootReducer';
import {Provider as PaperProvider} from 'react-native-paper';
import RootNavigator from './components/RootNavigator';
import SplashScreen from 'react-native-splash-screen';

const App = () => {

  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['[react-native-gesture-handler]']);
  }, []);

  useEffect(()=> {
    SplashScreen.hide();
  },[])

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
