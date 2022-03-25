import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
  Animated,
  Text
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export default function BottomSheet({ state, descriptors, navigation, position }) {
  const { theme } = React.useContext(ThemeContext);

  const bottomBackground = theme === 'dark' ? '#000' : '#fff';
  const textColor = theme === 'dark' ? '#FFF' : '#191414';


  return (
    <View
        style={{
          display: 'flex',
          width: width,
          padding: 8,
          alignItems: 'center',
          elevation: 15,
          backgroundColor: bottomBackground,
        }}>
        <View
          style={{
            width: width ,
            display: 'flex',
            justifyContent: 'space-evenly',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const icon = () => {
          if (options.tabBarLabel == 'Home') {
            return <MaterialIcons name="home" size={25} color={isFocused ? '#ff9000' : textColor} />;
          }
      
          if (options.tabBarLabel == 'Search') {
            return <MaterialIcons name="search" size={25} color={isFocused ? '#ff9000' : textColor} />;
          }
      
          if (options.tabBarLabel == 'Subscriptions') {
            return <FontAwesome5 name="crown" size={18} color={isFocused ? '#ff9000' : textColor} />;
          }

          if (options.tabBarLabel == 'Profile') {
            return <FontAwesome5 name="user-alt" size={17} color={isFocused ? '#ff9000' : textColor} />;
          }
        };

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const inputRange = state.routes.map((_, i) => i);
        const opacity = position.interpolate({
          inputRange,
          outputRange: inputRange.map(i => (i === index ? 1 : 0)),
        });

        return (
          <TouchableOpacity
            onPress={onPress}
            // style={{ marginHorizontal:20 }}
          >
            <Animated.View  style={{ backgroundColor: isFocused ? '#ff900020' : 'transparent' , flexDirection:'row',alignItems: 'center',paddingHorizontal:10, borderRadius:50,paddingVertical:5, }}>
              {/* {label} */}
              {icon()}
              {isFocused ? <Text style={{color: isFocused ? '#ff9000' : '#FFF',padding:5, fontWeight:'600'}}>{label}</Text> : null}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
      </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 15,
  },
});
