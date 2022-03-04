import 'react-native-gesture-handler';
import React, {useEffect, useState} from 'react';
import {Login} from './components/admin/Login';
import Test from './components/admin/test';
import Homepage from './components/Homepage';
import {LogBox} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomSheet from './components/BottomSheet';
import InfoPage from './components/InfoPage';
import MusicPlayer from './components/MusicPlayer';
import {Subscriptions} from './components/Subscriptions';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './components/DrawerContent';
import {AboutUs} from './components/AboutUs';
import {FAQ} from './components/FAQ';
import {Disclaimer} from './components/Disclaimer';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import RootReducer from './components/RootReducer';
import { WelcomePage } from './components/WelcomePage';
import { CategoryPage } from './components/CategoryPage';
import { AppHeader } from './components/AppHeader';
import { EditProfile } from './components/EditProfile';
import { PrivacyPolicy } from './components/PrivacyPolicy';

const App = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    LogBox.ignoreLogs(['[react-native-gesture-handler]']);
  }, []);

  const Stack = createNativeStackNavigator();

  function Component() {
    return (
      <Stack.Navigator mode="modal">
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="BottomSheet"
          component={BottomSheet}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InfoPage"
          component={InfoPage}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="MusicPlayer"
          component={MusicPlayer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Subscriptions"
          component={Subscriptions}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="FAQ"
          component={FAQ}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="Disclaimer"
          component={Disclaimer}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="CategoryPage"
          component={CategoryPage}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{header: AppHeader,}}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{header: AppHeader,}}
        />
      </Stack.Navigator>
    );
  }

  const Drawer = createDrawerNavigator();

  const store = createStore(RootReducer);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Drawer.Navigator mode="modal" drawerContent={props => <DrawerContent {...props} />}>
          <Drawer.Screen
            name="Home"
            component={Component}
            options={{headerShown: false}}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
