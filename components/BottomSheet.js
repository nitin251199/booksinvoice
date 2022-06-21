import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Text,
} from 'react-native';
import { Badge } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export default function BottomSheet({ state, descriptors, navigation, position }) {
  const { theme } = React.useContext(ThemeContext);

  const bottomBackground = theme === 'dark' ? '#000' : '#fff';
  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  // const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';
  // const [user, setUser] = React.useState('Login & Buy');

  var cart = useSelector(state => state?.cart);
  var keys = Object.keys(cart);

  return (
  <>
  {/* <Modal
    animationType="slide"
    transparent={true}
    visible={show}
    onShow={async () => {
      var key = await checkSyncData();

      if (key[0] !== 'isLogin') {
        setUser('Buy Subscription');
      }
    }}
    onRequestClose={() => {
      setShow(false)
    }}
  >
    <View style={styles.centeredView}>
    <View
            style={[styles.modalView, {backgroundColor: modelBackgroundColor}]}>
            <Text style={[styles.modalText, {color: textColor}]}>
              Please Buy Subscription to listen further !
            </Text>
            <Pressable
              style={[styles.button, {backgroundColor: '#ff9000'}]}
              onPress={() => {
                user === 'Login & Buy'
                  ? navigation.navigate('Login')
                  : navigation.navigate('Subscriptions');
                setShow(false);
              }}>
              <Text style={[styles.textStyle, {color: textColor}]}>{user}</Text>
            </Pressable>
          </View>
    </View>
  </Modal> */}

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

          if (options.tabBarLabel == 'Cart') {
            return (
            <>
            <FontAwesome5 name="shopping-cart" size={18} color={isFocused ? '#ff9000' : textColor} />
            {
              keys.length > 0 && <Badge size={15} style={{color:textColor,backgroundColor:'#ff9000',position:'absolute',top:0,right:0}}>
              {keys.length}
              </Badge>
            }
            </>)
            ;
          }

          if (options.tabBarLabel == 'Profile') {
            return <FontAwesome5 name="user-alt" size={17} color={isFocused ? '#ff9000' : textColor} />;
          }
        };

        const onPress = () => {
          navigation.navigate('Homepage')
          navigation.navigate('Search')
          navigation.navigate('Subscriptions')
          navigation.navigate('EditProfile')
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
  </>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    paddingHorizontal: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: width * 0.7,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
