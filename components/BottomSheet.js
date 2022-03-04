import React, {useRef} from 'react';
import {
  View,
  Button,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import RBSheet from 'react-native-raw-bottom-sheet';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { checkSyncData } from './AsyncStorage';

const {width, height} = Dimensions.get('window');

export default function BottomSheet(props, navigation) {

  const bottomBackground = useColorScheme() === 'dark' ? '#000' : '#fff';
  const bottomColor = useColorScheme() === 'dark' ? '#fff' : '#000';

  const refRBSheet = useRef();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
      }}>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: bottomColor,
          },
          container: {
            backgroundColor: bottomBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        height={height * 0.5}>
        <View
          style={{
            height: height * 0.5,
            // backgroundColor: '#ff9000',
            paddingVertical: 15,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}>
          <ListItem
            containerStyle={{backgroundColor: bottomBackground}}
            onPress={async() => {
              var key = await checkSyncData();

              if (key) {
                props.navigation.navigate('EditProfile');
                refRBSheet.current.close();
              }
              else{
                props.navigation.navigate('Login');
                refRBSheet.current.close();
              }
            }}>
            <ListItem.Content>
              <ListItem.Title style={[styles.title,{color:bottomColor}]}>My Profile</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{backgroundColor: bottomBackground}}
            onPress={() => {
              props.navigation.navigate('Subscriptions');
              refRBSheet.current.close();
            }}>
            <ListItem.Content>
              <ListItem.Title style={[styles.title,{color:bottomColor}]}>
                Buy Subscription
              </ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{backgroundColor: bottomBackground}}
            onPress={() => refRBSheet.current.close()}>
            <ListItem.Content>
              <ListItem.Title style={[styles.title,{color:bottomColor}]}>Downloads</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{backgroundColor: bottomBackground}}
            onPress={() => refRBSheet.current.close()}>
            <ListItem.Content>
              <ListItem.Title style={[styles.title,{color:bottomColor}]}>Favourites</ListItem.Title>
            </ListItem.Content>
          </ListItem>
          <ListItem
            containerStyle={{backgroundColor: bottomBackground}}
            onPress={() => refRBSheet.current.close()}>
            <ListItem.Content>
              <ListItem.Title style={[styles.title,{color:bottomColor}]}>Settings</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        </View>
      </RBSheet>
      <View
        style={{
          display: 'flex',
          position: 'absolute',
          bottom: 0,
          width: width,
          padding: 15,
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 15,
          backgroundColor: bottomBackground,
        }}>
        <View
          style={{
            width: width * 0.8,
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity onPress={() => {
              props.navigation.navigate('Homepage');
              refRBSheet.current.close();
            }}>
            <MaterialIcons name="home" size={30} color={bottomColor} />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialCommunityIcons name="repeat" size={30} color={bottomColor} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Subscriptions');
              refRBSheet.current.close();
            }}>
            <FontAwesome5 name="crown" size={22} color={bottomColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => refRBSheet.current.open()}>
            <Ionicons name="ellipsis-horizontal" size={30} color={bottomColor} />
          </TouchableOpacity>
        </View>
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
