import React, { useState } from 'react'
import { FlatList, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import { useSelector } from 'react-redux';
import { ThemeContext } from './ThemeContext';

export const Cart = () => {
    const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  var carts = useSelector(state => state?.cart) || [];
  var cartItems = Object.values(carts);
  const [cart, setCart] = useState([]);

  if(carts.length === 0)
  {
    return <View style={{flex: 1, backgroundColor: backgroundColor,alignItems:'center',justifyContent:'center'}}>
      <Image 
       style={{width:105,height:90,margin:20}}
       source={require('../images/emptycart1.png')}
      />
      <Text style={{color: textColor, fontSize: 20, textAlign: 'center',alignItems:'center',marginLeft:20}}>
      No Book in Cart</Text>
    </View>
  }
  
  return (
    <ScrollView 
      style={[styles.container, {backgroundColor: backgroundColor}]}
    >
      {
        console.log(cartItems)
      }
      <FlatList
        data={cartItems}
        keyExtractor={item => item.id}
       />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})