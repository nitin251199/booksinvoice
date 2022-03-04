import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { EditProfile } from './EditProfile';
import Homepage from './Homepage';
import { Subscriptions } from './Subscriptions';

const Tab = createMaterialTopTabNavigator();

export default function MyTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Homepage"
      screenOptions={{
        tabBarActiveTintColor: '#e91e63',
        tabBarLabelStyle: { fontSize: 12 },
        tabBarStyle: { backgroundColor: 'powderblue' },
      }}
    >
      <Tab.Screen
        name="Homepage"
        component={Homepage}
        options={{ tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="Subscriptions"
        component={Subscriptions}
        options={{ tabBarLabel: 'Updates' }}
      />
      <Tab.Screen
        name="EditProfile"
        component={EditProfile}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}