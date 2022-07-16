import React, { useEffect, useLayoutEffect, } from 'react';
import {Login} from './Login';
import Homepage from './Homepage';
import BottomSheet from './BottomSheet';
import InfoPage from './InfoPage';
import MusicPlayer from './MusicPlayer';
import {Subscriptions} from './Subscriptions';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContent} from './DrawerContent';
import {AboutUs} from './AboutUs';
import {FAQ} from './FAQ';
import {connect, useDispatch, useSelector} from 'react-redux';
import {WelcomePage} from './WelcomePage';
import {CategoryPage} from './CategoryPage';
import {AppHeader} from './AppHeader';
import {EditProfile} from './EditProfile';
import {Legal} from './Legal';
import {JoinUs} from './JoinUs';
import {Search} from './Search';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import { getSyncData} from './AsyncStorage';
import {FavouriteBooks} from './FavouriteBooks';
import {Settings} from './Settings';
import { createStackNavigator } from '@react-navigation/stack';
import { Dimensions, View } from 'react-native';
import { UserSubscriptions } from './UserSubscriptions';
import { PaymentScreen } from './PaymentScreen';
import { PaymentSummary } from './PaymentSummary';
import { Download } from './Download';
import { fetchProfile, notificationListener, requestUserPermission } from './NotificationServices';
import { useNavigation } from '@react-navigation/native';
import { Comment } from './Comment';
import { Cart } from './Cart';
import { OfflineScreen } from './OfflineScreen';
import { MyBooks } from './MyBooks';
import AssignSub from './AssignSub';
import ActivationLink from './ActivationLink';
import Invoice from './Invoice';

export default function RootNavigator() {

  const Stack = createStackNavigator();
  const Tab = createMaterialTopTabNavigator();

  const { width, height } = Dimensions.get("window")

  var dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(()=>{
    requestUserPermission();
    notificationListener(navigation);
    fetchProfile(dispatch);
    
  },[])

  function MyTabs() {
    return (
    //   <View style={{
    //     width:width,
    //     height:height*1.05,
    // }}>
      <Tab.Navigator
        // screenOptions={({ route }) => {
        //   console.log('route', route)
        // }}
        // initialRouteName="Homepage"
        tabBarPosition="bottom"
        tabBar={props => <BottomSheet {...props} />}
        >
        <Tab.Screen
          name="HomeComponent"
          component={HomepageComponent}
          options={{tabBarLabel: 'Home',}}
        />
        <Tab.Screen
          name="SearchComponent"
          component={SearchComponent}
          options={{tabBarLabel: 'Search'}}
        />
        <Tab.Screen
          name="SubscriptionComponent"
          component={SubscriptionComponent}
          options={{tabBarLabel: 'Subscriptions'}}
        />
        <Tab.Screen
          name="EditProfile"
          component={ProfileComponent}
          options={{tabBarLabel: 'Profile', lazy: true}}
        />
      </Tab.Navigator>
      // </View> 
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
        <Stack.Screen
          name="OfflineScreen"
          component={OfflineScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="MusicPlayer"
          component={MusicPlayer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Download"
          component={Download}
          options={{header: AppHeader}}
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
            name="Subscriptions"
            component={Subscriptions}
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
       <Stack.Screen
          name="AssignSub"
          component={AssignSub}
          options={{header: AppHeader}}
        />
      </Stack.Navigator>
    );
  }

  const check = async () => {
    var isLogin = await getSyncData('isLogin');
    var isSub = await getSyncData('isSubscribed');
    dispatch({type: 'SET_STATUS', payload: {isLogin: isLogin, isSubscribed: isSub}});
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
        {/* <Stack.Screen
            name="Subscriptions"
            component={Subscriptions}
            options={{header: AppHeader}}
          /> */}
          <Stack.Screen
            name="UserSubscriptions"
            component={UserSubscriptions}
            options={{header: AppHeader}}
          />
        <Stack.Screen
          name="MyBooks"
          component={MyBooks}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="AssignSub"
          component={AssignSub}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="ActivationLink"
          component={ActivationLink}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="MusicPlayer"
          component={MusicPlayer}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Download"
          component={Download}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="Invoice"
          component={Invoice}
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
          name="Comment"
          component={Comment}
          options={{headerShown: false}}
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
          options={{header: AppHeader}}
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
          name="CategoryPage"
          component={CategoryPage}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="FavouriteBooks"
          component={FavouriteBooks}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          options={{header: AppHeader}}
        />
        <Stack.Screen
          name="Legal"
          component={Legal}
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
        <Stack.Screen
          name="Download"
          component={Download}
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
        <Stack.Screen
          name="Comment"
          component={Comment}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cart"
          component={Cart}
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
