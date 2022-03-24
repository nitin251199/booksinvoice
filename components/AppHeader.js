import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Header as HeaderRNE, Icon} from 'react-native-elements';

const {width, height} = Dimensions.get('window');

export const AppHeader = ({navigation}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(false);
    return () => {
      setShow(false);
    };
  }, []);

  return (
    <HeaderRNE
      statusBarProps={{
        backgroundColor: '#bf6d01',
      }}
      containerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        height: height * 0.105,
      }}
      backgroundColor="#ff9000"
      barStyle="dark-content"
      elevated
      leftComponent={
        <View style={{flexDirection: 'row', width: 200, alignItems: 'center'}}>
          <TouchableOpacity
            onPress={() => navigation.openDrawer()}
            style={{marginLeft: 10, marginTop: 0}}>
            <Icon type="feather" name="menu" color="white" size={27}/>
          </TouchableOpacity>
          <Text style={styles.heading}>Booksinvoice</Text>
        </View>
      }
      rightComponent={
        <TouchableOpacity onPress={() => navigation.navigate('Subscriptions')}>
          <View
            style={styles.btn}>
            <Text
              style={styles.btnText}>
              Subscribe
            </Text>
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
  btn : {
    backgroundColor: '#e30047',
    paddingVertical: 3,
    paddingHorizontal: 7,
    borderRadius: 5,
    marginRight: 5,
    marginTop: 5,
  },
  btnText : {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 10,
    textTransform: 'uppercase',
  }
});
