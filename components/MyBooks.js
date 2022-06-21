import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {AirbnbRating, Divider} from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {postData, ServerURL} from './FetchApi';
import {ThemeContext} from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const MyBooks = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (key) {
      var userData = await getSyncData(key[0]).then(async res => {
        fetchBooks(res);
      });
    }
  };

  const renderItem = ({item}) => {
    let currentDate = new Date();
    let dat = currentDate.getFullYear() +
    "-" +
    (currentDate.getMonth() + 1 > 9
      ? currentDate.getMonth() + 1
      : "0" + (currentDate.getMonth() + 1)) +
    "-" +
    (currentDate.getDate() > 9
      ? currentDate.getDate()
      : "0" + currentDate.getDate())
    let cDate = new Date(dat);
    let expDate = new Date(item.expiry_date);
    // console.log('currentDate', cDate > expDate, cDate, expDate);
    return (
      <View>
        {cDate > expDate ? (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              // width: width * 0.30,
              paddingVertical: 15,
              paddingLeft: 20,
            }}>
            <View
              style={{
                position: 'absolute',
                zIndex: 1,
                left: 28,
                top: 60,
                transform: [{rotate: '-45deg'}],
                backgroundColor: '#21212190',
                borderRadius: 5,
                paddingHorizontal: 3,
              }}>
              <Text style={{fontSize: 18, fontWeight: '800', color: 'red'}}>
                Expired
              </Text>
            </View>
            <Image
              style={[styles.image]}
              source={{
                uri: `${ServerURL}/admin/upload/bookcategory/${item.bookcategoryid}/${item.photo}`,
              }}
            />
            <View style={{width: width * 0.65, justifyContent: 'flex-start'}}>
              <TextTicker
                style={{
                  fontSize: 17,
                  color: textColor,
                  fontWeight: '700',
                  paddingVertical: 5,
                }}
                duration={10000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
                useNativeDriver>
                {item.bookname}
              </TextTicker>
              <Text style={{color: textColor, lineHeight: 20}}>
                Order Id: {item.cid}
              </Text>
              <Text style={{color: textColor, lineHeight: 20}}>Quality: 1</Text>
              <Text style={{color: textColor, lineHeight: 20}}>
                Date of Purchase: {item.date}
              </Text>
              <Text style={{color: textColor, lineHeight: 20}}>
                Validity: {item.from_date} to {item.expiry_date}
              </Text>
            </View>
          </View>
        ) : (
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              // width: width * 0.30,
              paddingVertical: 15,
              paddingLeft: 20,
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('InfoPage', {
                  state: item.id,
                  category: item.bookcategoryid,
                })
              }>
              <Image
                style={[styles.image]}
                source={{
                  uri: `${ServerURL}/admin/upload/bookcategory/${item.bookcategoryid}/${item.photo}`,
                }}
              />
            </TouchableOpacity>
            <View style={{width: width * 0.65, justifyContent: 'flex-start'}}>
              <TextTicker
                onPress={() =>
                  navigation.navigate('InfoPage', {
                    state: item.id,
                    category: item.bookcategoryid,
                  })
                }
                style={{
                  fontSize: 17,
                  color: textColor,
                  fontWeight: '700',
                  paddingVertical: 5,
                }}
                duration={10000}
                loop
                bounce
                repeatSpacer={50}
                marqueeDelay={1000}
                useNativeDriver>
                {item.bookname}
              </TextTicker>
              <Text style={{color: textColor, lineHeight: 20}}>
                Order Id: {item.cid}
              </Text>
              <Text style={{color: textColor, lineHeight: 20}}>Quality: 1</Text>
              <Text style={{color: textColor, lineHeight: 20}}>
                Date of Purchase: {item.date}
              </Text>
              <Text style={{color: textColor, lineHeight: 20}}>
                Validity: {item.from_date} to {item.expiry_date}
              </Text>
            </View>
          </View>
        )}
        <Divider />
      </View>
    );
  };

  const fetchBooks = async res => {
    setLoading(true);
    var body = {type: '1', user_id: res.id, user_type: res.usertype};
    var result = await postData('api/getPurchasebook', body);
    if (result.msg === 'Books') {
      setLoading(false);
      setBooks(result.data);
    } else {
      setLoading(false);
      ToastAndroid.show('No Books Added', ToastAndroid.SHORT);
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
            Your Books
          </Text>
        </View>
        <FlatList
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            <ActivityIndicator size="large" animating={loading} />
          )}
        />
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
});
