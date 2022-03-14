import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {LogBox} from 'react-native';
import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from '@react-navigation/native';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import RootReducer from './components/RootReducer';
import RootNavigator from './components/RootNavigator';
import {ThemeProvider} from './components/ThemeContext';

const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
    LogBox.ignoreLogs(['[react-native-gesture-handler]']);
  }, []);

  const store = createStore(RootReducer);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
