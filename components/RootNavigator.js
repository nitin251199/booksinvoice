import React, {useEffect, useLayoutEffect, useState} from 'react';
import {Login} from './admin/Login';
import Test from './admin/test';
import Homepage from './Homepage';
import BottomSheet from './BottomSheet';
import InfoPage from './InfoPage';
import MusicPlayer from './MusicPlayer';
import {Subscriptions} from './Subscriptions';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './DrawerContent';
import {AboutUs} from './AboutUs';
import {FAQ} from './FAQ';
import {Disclaimer} from './Disclaimer';
import {useDispatch, useSelector} from 'react-redux';
import {WelcomePage} from './WelcomePage';
import {CategoryPage} from './CategoryPage';
import {AppHeader} from './AppHeader';
import {EditProfile} from './EditProfile';
import {PrivacyPolicy} from './PrivacyPolicy';
import {JoinUs} from './JoinUs';
import {Search} from './Search';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {FavouriteBooks} from './FavouriteBooks';
import {Settings} from './Settings';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions, View } from 'react-native';
import { UserSubscriptions } from './UserSubscriptions';
import { PaymentScreen } from './PaymentScreen';
import { PaymentSummary } from './PaymentSummary';

export default function RootNavigator() {
  // const Stack = createNativeStackNavigator();

  const Stack = createStackNavigator();
  const Tab = createMaterialTopTabNavigator();

  const { width, height } = Dimensions.get("window")

  var dispatch = useDispatch();

  function MyTabs() {
    return (
      <View style={{
        width:width,
        height:height*1.05,
    }}>
      <Tab.Navigator
        screenOptions={{
          swipeEnabled: false,
        }}
        initialRouteName="Homepage"
        tabBarPosition="bottom"
        tabBar={props => <BottomSheet {...props} />}>
        <Tab.Screen
          name="HomeComponent"
          component={HomepageComponent}
          options={{tabBarLabel: 'Home'}}
        />
        <Tab.Screen
          name="SearchComponent"
          component={SearchComponent}
          options={{tabBarLabel: 'Search'}}
        />
        <Tab.Screen
          name="Subscriptions"
          component={SubscriptionComponent}
          options={{tabBarLabel: 'Subscriptions'}}
        />
        <Tab.Screen
          name="EditProfile"
          component={ProfileComponent}
          options={{tabBarLabel: 'Profile', lazy: true}}
        />
      </Tab.Navigator>
      </View>
    );
  }

  function Component() {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Welcome"
          component={WelcomePage}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    );
  }

  function SubscriptionComponent() {
    return (
      <Stack.Navigator screenOptions={{
        presentation: "modal"
      }}>
        <Stack.Screen
          name="Subscription"
          component={Subscriptions}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="UserSubscriptions"
          component={UserSubscriptions}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="PaymentScreen"
          component={PaymentScreen}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="PaymentSummary"
          component={PaymentSummary}
          options={{header: AppHeader}}
        />
      </Stack.Navigator>
    );
  }

  const check = async () => {
    var isLogin = await getSyncData('isLogin');
    dispatch({type: 'SET_LOGIN', payload: isLogin});
    // return isLogin;
  };

  useLayoutEffect(() => {
    check();
  }, []);

  const ProfileComponent = () => {
    var isLogin = useSelector(state => state.isLogin);

    return (
      <Stack.Navigator screenOptions={{
        presentation: "modal"
      }}>
        {isLogin ? (
          <Stack.Screen
            name="Profile"
            component={EditProfile}
            options={{header: AppHeader}}
          />
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            options={{header: AppHeader}}
          />
        )}
        <Stack.Screen
          name="FavouriteBooks"
          component={FavouriteBooks}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="InfoPage"
          component={InfoPage}
          options={{header: AppHeader}}
        />
      </Stack.Navigator>
    );
  };

  function SearchComponent() {
    return (
      <Stack.Navigator screenOptions={{
        presentation: "modal"
      }}>
        <Stack.Screen
          name="Search"
          component={Search}
          options={{header: AppHeader}}
        />
      </Stack.Navigator>
    );
  }

  function HomepageComponent() {
    return (
      <Stack.Navigator screenOptions={{
        presentation: "modal"
      }}>
        <Stack.Screen
          name="Homepage"
          component={Homepage}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="InfoPage"
          component={InfoPage}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="MusicPlayer"
          component={MusicPlayer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Subscriptions"
          component={Subscriptions}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="AboutUs"
          component={AboutUs}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="FAQ"
          component={FAQ}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="Disclaimer"
          component={Disclaimer}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="CategoryPage"
          component={CategoryPage}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="PrivacyPolicy"
          component={PrivacyPolicy}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="JoinUs"
          component={JoinUs}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="Search"
          component={Search}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="Settings"
          component={Settings}
          options={{header: AppHeader}}
        />
      </Stack.Navigator>
    );
  }

  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      screenOptions={{
        presentation: "modal"
      }}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen
        name="Home"
        component={Component}
        options={{headerShown: false}}
      />
      <Drawer.Screen
        name="MyTabs"
        component={MyTabs}
        options={{headerShown: false}}
      />
    </Drawer.Navigator>
  );
}
