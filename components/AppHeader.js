import React, { useEffect, useState } from 'react'
import { Dimensions, StatusBar, StyleSheet, Text, useColorScheme, View, TextInput } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MI from 'react-native-vector-icons/MaterialIcons'
import { Header as HeaderRNE, HeaderProps, Icon, Input } from 'react-native-elements';

const {width, height} = Dimensions.get('window');

export const AppHeader = ({navigation}) => {

    const textColor = useColorScheme() === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = useColorScheme() === 'dark' ? '#191414' : '#FFF';

  const [show,setShow] = useState(false)

  useEffect(() => {
        setShow(false)
    return () => {
      setShow(false)
    }
  }, [])
  

  return (
      
      <HeaderRNE
      statusBarProps={{
        backgroundColor: '#bf6d01',
     }}
      containerStyle={{alignItems:'center',justifyContent:'center',height:height*0.115}}
      backgroundColor='#ff9000'
      barStyle='dark-content'
      elevated
        leftComponent={
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginLeft: 10,marginTop:7 }}
        >
          <Icon type="feather" name="menu" color='white' />
        </TouchableOpacity>
        }
        rightComponent={
            <View style={styles.headerRight}>
              <TouchableOpacity
                onPress={() => setShow(!show)}
                style={{ marginRight: 10 }}
              >
                <Icon type="materialicons" name="search" color='white' />
              </TouchableOpacity>
            </View>
        }
        centerComponent={ !show ? { text: 'Booksinvoice', style: styles.heading } : 
        <View>
        <TextInput
        autoFocus
        style={styles.input}
        placeholder="search your books"
        placeholderTextColor="white"
      />

      </View>}
      />
  )
}

const styles = StyleSheet.create({
    container : {
        display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          width: width,
          flexDirection: 'row',
          paddingTop: 30,
    },
    inputIcon: {
        marginLeft: 10,
      },
      headerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#397af8',
        marginBottom: 20,
        width: '100%',
        paddingVertical: 15,
      },
      heading: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing:0.5
      },
      headerRight: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: 5,
      },
      subheaderText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
      },
      input: {
        height: 38,
        fontSize:14,
        color:'black',
        width:width*0.75
      },
})