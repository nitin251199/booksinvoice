import {Picker} from '@react-native-picker/picker';
import React from 'react';
import {ActivityIndicator, Share, StyleSheet, Switch, Text, TouchableOpacity, View} from 'react-native';
import { ThemeContext } from './ThemeContext';
import pkg from '../package.json';


export const Settings = ({navigation}) => {
    
    const { theme, toggleTheme, darkMode } = React.useContext(ThemeContext);
    const [loading, setLoading ] = React.useState(false)
    const [quality, setQuality ] = React.useState('')

  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const textColor  = theme === 'dark' ? '#FFF' : '#191414';
  const menuColor = theme === 'dark' ? '#000' : '#99999950'

  // const switchMode = async() => {
  //   setLoading(true)
  //   // setLoading(false)
  // }

  // const switchLoader = async() =>{
  //   await toggleTheme()
  //       setLoading(false)
  // }
//

const onShare = async () => {
  try {
    const result = await Share.share({
      message:
        `Booksinvoice - Download and listen books for free.\nDownload from playstore: https://play.google.com/store/apps/details?id=com.booksinvoice`,
        
    });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else if (result.action === Share.dismissedAction) {
      // dismissed
    }
  } catch (error) {
    alert(error.message);
  }
};

  return (
    <View style={[styles.container,{backgroundColor: backgroundColor}]}>
      <Text style={[styles.title,{color: textColor}]}>Settings</Text>
      <View style={{paddingVertical: 10}}>
        <Text style={[styles.itemText,{color: textColor}]}>Theme</Text>
        <View style={[styles.menuitem,{backgroundColor: menuColor}]}>
          <Text style={[styles.itemText,{color: textColor}]}>Dark Mode</Text>
          <View style={{flexDirection:'row',justifyContent:'center'}}>
            <ActivityIndicator animating={loading}/>
          <Switch
            thumbColor="#ff9000"
            trackColor={{ false: "#999", true: "#bf6d01" }}
            value={darkMode}
            onValueChange={val => {
              toggleTheme()
            }}
          />
          </View>
        </View>
      </View>
      <View>
        <Text style={[styles.itemText,{color: textColor}]}>Music & Playback</Text>
        <View style={[styles.menuitem,{backgroundColor: menuColor}]}>
          <View>
            <Text style={[styles.itemText,{color: textColor}]}>Streaming Quality</Text>
            <Text style={{fontSize: 12,color: textColor}}>Higher quality uses more data</Text>
          </View>
          <Picker
            mode="dropdown"
            selectedValue={quality}
            onValueChange={(itemValue, itemIndex) => {
              setQuality(itemValue);
            }}
            style={{width: 113, fontSize: 12,color: textColor}}>
            <Picker.Item label="High" value="high" />
            <Picker.Item label="Medium" value="medium" />
            <Picker.Item label="Low" value="low" />
          </Picker>
        </View>
      </View>
      <View style={{paddingVertical: 10}}>
        <Text style={[styles.itemText,{color: textColor}]}>About</Text>
        <View
          style={[
            styles.menuitem,
            {flexDirection: 'column', paddingVertical: 25,backgroundColor: menuColor},
          ]}>
          <View style={styles.menu}>
            <View>
              <Text style={[styles.itemText,{color: textColor}]}>Version</Text>
              <Text style={{fontSize: 12,color: textColor}}>App Version</Text>
            </View>
            <Text style={[styles.itemText,{color: textColor}]}>{pkg.version}</Text>
          </View>
          <TouchableOpacity onPress={onShare} style={[styles.menu, {paddingTop: 20}]}>
          <View >
            <View>
              <Text style={[styles.itemText,{color: textColor}]}>Share</Text>
              <Text style={{fontSize: 12,color: textColor}}>Let your friends know about us</Text>
            </View>
          </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.menu, {paddingTop: 20}]} onPress={()=>navigation.navigate('Legal', {page: 'Support'})}>
          <View >
            <View>
              <Text style={[styles.itemText,{color: textColor}]}>Contact Us</Text>
              <Text style={{fontSize: 12,color: textColor}}>Feedback</Text>
            </View>
          </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#212121',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFF',
    paddingBottom: 30,
  },
  menuitem: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#000',
    borderRadius: 6,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  menu: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontWeight: '600',
    color: '#FFF',
  },
});
