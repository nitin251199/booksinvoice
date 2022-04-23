import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Divider} from 'react-native-elements';
import {checkSyncData, getSyncData} from './AsyncStorage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {postData} from './FetchApi';
import {ThemeContext} from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const UserSubscriptions = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [subs, setSubs] = useState([]);
  const [expired, setExpired] = useState(false);
  const [notSubText, setNotSubText] = useState('');

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (key) {
      var userData = await getSyncData(key[0]).then(async res => {
        fetchSubscriptions(res);
      });
    }
  };

  const renderItem = ({item,index}) => {
    return (
      <View key={index}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
            paddingLeft: 20,
          }}>
          <View style={{width: width * 0.85, justifyContent: 'flex-start'}}>
            <Text
              style={{
                fontSize: 17,
                color: textColor,
                fontWeight: '700',
                paddingVertical: 5,
              }}>
              {item.packagename}
            </Text>
            <Text style={{color: textColor}}>Days: {item.days}</Text>
            <Text style={{color: textColor}}>
              No. of Copies: {item.no_of_copies}
            </Text>
            <Text style={{color: textColor}}>
              Valid From : {item.valid_from}
            </Text>
            <Text style={{color: textColor}}>
              Valid To : {item.valid_to}
            </Text>
            <Text style={{color: textColor}}>Order Id: {item.oid}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Invoice',{item});
            }}>
            <View>
              <FontAwesome5
                name="file-invoice"
                size={21}
                color={textColor}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Divider />
      </View>
    );
  };

  const fetchSubscriptions = async res => {
    var body = {type: 1, user_id: res.id, user_type: res.usertype};
    var result = await postData('api/getSubscription', body);
    if (result.data === 'Not Subscribed yet') {
      setNotSubText('Not Subscribed yet');
    } else {
      setSubs(result?.data);
    }
  };

  useEffect(() => {
    checkLogin();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={[styles.headerContent, {color: textColor}]}>
            Your Subscriptions
          </Text>
        </View>
        {notSubText === 'Not Subscribed yet' ? (
          <View>
            <Text style={{color: textColor,padding:20}}>{notSubText}</Text>
            <Pressable 
            onPress={() => navigation.navigate('Subscriptions')}
             style={[styles.button,{backgroundColor: '#ff9000'}]}>
            <Text style={{color: textColor,padding:20, fontSize: 18,fontWeight:'700'}}>Buy Subscription</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={subs}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListEmptyComponent={() => <ActivityIndicator size="large" />}
          />
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
  },
  headerContent: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  image: {
    height: height * 0.15,
    width: width * 0.24,
    marginRight: 20,
    resizeMode: 'stretch',
    borderRadius: 5,
    // elevation: 5,
    // shadowOpacity: 2,
    // shadowRadius: 14,
    // shadowColor: 'red',
    // shadowOffset: {width: 0, height: 0},
  },
  button : {
    width: width * 0.85,
    borderRadius: 10,
    marginHorizontal:20,
    elevation: 2
  }
});
