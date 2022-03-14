import React, { useEffect, useState } from 'react'
import { Dimensions, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Header as HeaderRNE, Icon } from 'react-native-elements';

const {width, height} = Dimensions.get('window');

export const AppHeader = ({navigation}) => {

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
      containerStyle={{alignItems:'center',justifyContent:'center',height:height*0.105}}
      backgroundColor='#ff9000'
      barStyle='dark-content'
      elevated
        leftComponent={
        <TouchableOpacity
          onPress={() => navigation.openDrawer()}
          style={{ marginLeft: 10,marginTop:0 }}
        >
          <Icon type="feather" name="menu" color='white' />
        </TouchableOpacity>
        }
        
        centerComponent={ { text: 'Booksinvoice', style: styles.heading }}
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