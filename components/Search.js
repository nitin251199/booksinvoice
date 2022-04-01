import React, {useState} from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {AirbnbRating, Divider, Icon } from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import {postData, ServerURL} from './FetchApi';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const Search = ({navigation}) => {

  const { theme } = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBook = async text => {
    setLoading(true);
    var body = {global_search: text};
    var result = await postData('api/getSearch', body);
    if (result.msg === 'Success') {
      setBooks(result.data);
      setLoading(false);
    } else if (result.msg === 'Parameter not match') {
      setBooks([]);
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    return (
      <View>
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
            <Text style={{color: textColor}}>{item.bookauthor}</Text>
            <Text style={{color: textColor}}>{item.bookcategory}</Text>
            <Text style={{color: textColor}}>Narrator: {item.narrator}</Text>
            <AirbnbRating
              starContainerStyle={{marginLeft: -160}}
              count={5}
              showRating={false}
              defaultRating={item.percentage !== null ? item.percentage : 0}
              size={14}
            />
          </View>
        </View>
        <Divider />
      </View>
    );
  };

  const renderLoader = () => {
    return loading ? (
      <View>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 20,
        }}>
        <Text style={[styles.title, {color: textColor}]}>Search Books !</Text>
        <View style={styles.inputContainer}>
          <Icon type="materialicons" name="search" color={textColor} />
          <TextInput
            style={[styles.input, {color: textColor}]}
            placeholder="Search your books"
            placeholderTextColor={textColor}
            onChangeText={text => searchBook(text)}
          />
        </View>
      </View>
      <View style={{flex: 1}}>
        <FlatList
          removeClippedSubviews
          initialNumToRender={10}
          ListEmptyComponent={renderLoader()}
          data={books}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    paddingBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    width: width * 0.9,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    alignItems: 'center',
  },
  input: {
    padding: 10,
    fontSize: 14,
    width: width * 0.9,
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
