import React, {useEffect, useState} from 'react';
import {
  Alert,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Header as HeaderRNE, Icon} from 'react-native-elements';
import {Badge} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {SafeAreaView} from 'react-native-safe-area-context';

const {width, height} = Dimensions.get('window');

export const AppHeader = ({navigation}) => {
  var cart = useSelector(state => state?.cart);
  var keys = Object.keys(cart);

  const appHeader = () => {
    return (
      <SafeAreaView>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="#bf6d01"
        />
        <View
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: width,
            backgroundColor: '#ff9000',
            height: height * 0.065,
            flexDirection: 'row',
            paddingHorizontal: 10,
          }}>
          <View
            style={{flexDirection: 'row', width: 200, alignItems: 'center'}}>
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={{marginLeft: 10, marginTop: 0}}>
              <Icon type="feather" name="menu" color="white" size={27} />
              {keys.length > 0 && (
                <Badge
                  size={15}
                  style={{
                    backgroundColor: '#e30047',
                    position: 'absolute',
                    top: 0,
                    right: 0,
                  }}></Badge>
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Homepage')}>
              <Text style={styles.heading}>Booksinvoice</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => navigation.push('Subscriptions')}>
            <View style={styles.btn}>
              <Text style={styles.btnText}>Subscribe</Text>
            </View>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  return (
    // appHeader()
    <HeaderRNE
      outerContainerStyles={{zIndex: 1}}
      statusBarProps={{
        backgroundColor: '#bf6d01',
        translucent: true,
      }}
      containerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.105,
        paddingBottom:0,
        paddingTop:0
      }}
      backgroundColor="#ff9000"
      barStyle="dark-content"
      elevated
      leftComponent={
        <View style={{flexDirection: 'row', width: 200, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{marginLeft: 10, marginTop: 0}}>
            <Icon type="feather" name="menu" color="white" size={27} />
            {keys.length > 0 && (
              <Badge
                size={12}
                style={{
                  backgroundColor: '#e30047',
                  position: 'absolute',
                  top: 0,
                  right: 0,
                }}></Badge>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Homepage')}>
            <Text  style={styles.heading}>Booksinvoice</Text>
          </TouchableOpacity>
        </View>
      }
      rightComponent={
        <TouchableOpacity onPress={() => navigation.push('Subscriptions')}>
          <View style={styles.btn}>
            <Text style={styles.btnText}>Subscribe</Text>
          </View>
        </TouchableOpacity>
      }
      // centerComponent={ { text: 'Booksinvoice', style: styles.heading }}
    />
  );
};

const styles = StyleSheet.create({
  container: {
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
    letterSpacing: 0,
    marginLeft: 15,
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
    fontSize: 14,
    color: 'black',
    width: width * 0.75,
  },
  btn: {
    width: 75,
    backgroundColor: '#e30047',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
  },
  btnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
