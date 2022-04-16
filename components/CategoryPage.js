import React, {useEffect} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {AirbnbRating, Divider} from 'react-native-elements';
import {postData, ServerURL} from './FetchApi';
import TextTicker from 'react-native-text-ticker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SamplePlay} from './SamplePlay';
import {ThemeContext} from './ThemeContext';
import {Picker} from '@react-native-picker/picker';

const {width, height} = Dimensions.get('window');

export const CategoryPage = ({navigation, route}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [filterState, setFilterState] = React.useState('');

  const displayBooks = ({item}) => {
    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
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
          <SamplePlay
          navigation={navigation}
            item={item}
            propsStyles={{
              position: 'absolute',
              top: '73%',
              left: '1%',
              elevation: 10,
            }}
          />
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
                paddingBottom: 5,
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
            <Text style={{color: textColor}}>Views: {item.viewcount}</Text>
            {item.premiumtype === 'Premium' ? (
              <>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Premium Type :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {item.premiumtype}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Validity :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {item.validity} days
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    ₹ {item.price}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                      },
                    ]}>
                    Doller Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    $ {item.dollerprice}
                  </Text>
                </View>
              </>
            ) : (
              <></>
            )}
            <AirbnbRating
              starContainerStyle={{marginLeft: -160}}
              count={5}
              showRating={false}
              defaultRating={item.percentage !== null ? item.percentage : 0}
              size={14}
            />
          </View>
          {/* <SamplePlay item={item} /> */}
        </View>
        <Divider />
      </View>
    );
  };

  const [books, setBooks] = React.useState([]);
  const [allBooks, setAllBooks] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [skip, setSkip] = React.useState(0);

  const fetchBooksbyid = async id => {
    setIsLoading(true);
    let type = route.params.item.bookcategory;
    switch (type) {
      case 'New Arrivals':
        var body = {type: 1, skip: skip};
        var newarrivals = await postData('api/getNewarrival', body);
        setBooks([...books, ...newarrivals.data]);
        setAllBooks([...books, ...newarrivals.data]);
        setIsLoading(false);
        break;

      case 'Top Rated':
        var body = {type: 1, skip: skip};
        var top = await postData('api/getToprated', body);
        setBooks([...books, ...top.data]);
        setAllBooks([...books, ...top.data]);
        setIsLoading(false);
        break;

      case 'Popular Books':
        var body = {type: 1, skip: skip};
        var popular = await postData('api/getPopulerbooks', body);
        setBooks([...books, ...popular.data]);
        setAllBooks([...books, ...popular.data]);
        setIsLoading(false);
        break;

      case 'Premium':
        var body = {type: 1, skip: skip};
        var premium = await postData('api/getPremiumbooks', body);
        setBooks([...books, ...premium.data]);
        setAllBooks([...books, ...premium.data]);
        setIsLoading(false);
        break;

      default:
        var body = {type: '1', category_id: id, skip: skip};
        var result = await postData('api/getBooksbyid', body);
        if (result.msg !== 'Profile Not Available') {
          setBooks([...books, ...result.data]);
          setAllBooks([...books, ...result.data]);
        }
        setIsLoading(false);
        break;
    }
  };

  const loadMore = () => {
    setSkip(skip + 20);
  };

  const renderLoader = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  };

  useEffect(() => {
    fetchBooksbyid(route.params.item.id);
  }, [skip]);

  var category = route.params.category;

  const filterData = type => {
    switch (type) {
      case 'All':
        setBooks([...allBooks]);
        break;
      case 'Non Premium':
        let filteredData6 = books.filter(item => {
          return (
            item.premiumtype === 'Non Premium' ||
            item.premiumtype === 'BIV' ||
            item.premiumtype === undefined
          );
        });
        setBooks([...filteredData6]);
        break;
      case 'Premium':
        let filteredData = books.filter(item => {
          return item.premiumtype === 'Premium' || item.premiumtype === 'Both';
        });
        setBooks([...filteredData]);
        break;
      case 'By A-Z':
        let filteredData2 = books.sort((a, b) =>
          a.bookname.localeCompare(b.bookname),
        );
        setBooks([...filteredData2]);
        break;
      case 'By Z-A':
        let filteredData3 = books.sort((a, b) =>
          b.bookname.localeCompare(a.bookname),
        );
        setBooks([...filteredData3]);
        break;
      case 'Price Low to High':
        let filteredData4 = books.sort(function (a, b) {
          return a.price - b.price;
        });
        setBooks([...filteredData4]);
        break;
      case 'Price High to Low':
        let filteredData5 = books.sort(function (a, b) {
          return b.price - a.price;
        });
        setBooks([...filteredData5]);
        break;
      default:
        break;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={{alignItems: 'center'}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {category ? (
            <View style={styles.imageWrapper}>
              <ImageBackground
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                source={{
                  uri: `${ServerURL}/admin/upload/bookcat/${category.catphoto}`,
                }}
                resizeMode="cover"
                blurRadius={5}>
                <Image
                  source={{
                    uri: `${ServerURL}/admin/upload/bookcat/${category.catphoto}`,
                  }}
                  resizeMode="contain"
                  style={{width: 200, height: 200}}
                />
              </ImageBackground>
            </View>
          ) : (
            <View style={styles.imageWrapper}>
              <ImageBackground
                style={{
                  flex: 1,
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                }}
                source={{
                  uri: `${ServerURL}/admin/upload/bookcat/${route.params.item.catphoto}`,
                }}
                resizeMode="cover"
                blurRadius={5}>
                <Image
                  source={{
                    uri: `${ServerURL}/admin/upload/bookcat/${route.params.item.catphoto}`,
                  }}
                  resizeMode="contain"
                  style={{width: 200, height: 200}}
                />
              </ImageBackground>
            </View>
          )}
          <View>
            <Text style={[styles.categoryTitle, {color: textColor}]}>
              {route.params.item.bookcategory}
            </Text>
          </View>
          <View style={{width: width * 0.9, marginLeft: 25,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
            <MaterialCommunityIcons name='filter' color={textColor} size={25}/>
            <Picker
              selectedValue={filterState}
              style={{borderWidth: 1, color: textColor, borderColor: textColor, width:width*0.8}}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) => {  
                filterData(itemValue);
                setFilterState(itemValue);
              }}>
              <Picker.Item label="All" value="All" />
              <Picker.Item label="Non Premium" value="Non Premium" />
              <Picker.Item label="Premium" value="Premium" />
              <Picker.Item label="By A-Z" value="By A-Z" />
              <Picker.Item label="By Z-A" value="By Z-A" />
              <Picker.Item
                label="Price Low to High"
                value="Price Low to High"
              />
              <Picker.Item
                label="Price High to Low"
                value="Price High to Low"
              />
            </Picker>
          </View>
          <View style={styles.categoryImage}>
            <FlatList
              data={books}
              renderItem={displayBooks}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={renderLoader}
              onEndReached={() => loadMore(route.params.item.id)}
              onEndReachedThreshold={0.3}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  imageWrapper: {
    width: width,
    height: height * 0.25,
  },
  categoryTitle: {
    fontWeight: '800',
    fontSize: 22,
    textAlign: 'center',
    margin: 10,
  },
  categoryImage: {
    width: width,
    display: 'flex',
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    height: height * 0.17,
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
  imageText: {
    fontWeight: '600',
    fontSize: 12,
    paddingLeft: 5,
    // width: width * 0.24,
    overflow: 'hidden',
  },
});
