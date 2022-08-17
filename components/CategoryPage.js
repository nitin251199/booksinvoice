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
import {Button} from 'react-native-paper';
import {postData, ServerURL} from './FetchApi';
import TextTicker from 'react-native-text-ticker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {SamplePlay} from './SamplePlay';
import {useDispatch, useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {useSwipe} from './useSwipe';
import {checkSyncData, getSyncData} from './AsyncStorage';

const {width, height} = Dimensions.get('window');

export const CategoryPage = ({navigation, route}) => {
  const theme = useSelector(state => state.theme);

  const listRef = React.useRef(null);

  const alphabetArray = [
    'Select Alphabet',
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
  ];

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [filterState, setFilterState] = React.useState('');
  const [subfilterState, setSubfilterState] = React.useState('');
  // const [cartLoading, setCartLoading] = React.useState(false);
  // const [cartStatus, setCartStatus] = React.useState(false);

  const displayBooks = ({item}) => {
    return (
      <View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
            marginLeft: 20,
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
            {item.premiumtype === 'Premium' || item.premiumtype === 'Both' ? (
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
              starContainerStyle={{marginLeft: -140}}
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
  const languageid = useSelector(state => state.language);
  const [userData, setUserData] = React.useState([]);

  const [showSubFilter, setShowSubFilter] = React.useState(false);

  // const isLogin = useSelector(state => state.isLogin);

  const dispatch = useDispatch();

  const fetchBooksbyid = async id => {
    setIsLoading(true);
    let type = route.params.item.bookcategory;
    switch (type) {
      case 'New Arrivals':
        var body = {type: 1, skip: skip, languageid: languageid};
        var newarrivals = await postData('api/getNewarrival', body);
        if (newarrivals.msg === 'New User') {
          setBooks([...books, ...newarrivals.data]);
          setAllBooks([...books, ...newarrivals.data]);
        }
        setIsLoading(false);
        break;

      case 'Top Rated':
        var body = {type: 1, skip: skip, languageid: languageid};
        var top = await postData('api/getToprated', body);
        if (top.msg === 'New User') {
          setBooks([...books, ...top.data]);
          setAllBooks([...books, ...top.data]);
        }
        setIsLoading(false);
        break;

      case 'Popular Books':
        var body = {type: 1, skip: skip, languageid: languageid};
        var popular = await postData('api/getPopulerbooks', body);
        if (popular.msg === 'New User') {
          setBooks([...books, ...popular.data]);
          setAllBooks([...books, ...popular.data]);
        }
        setIsLoading(false);
        break;

      case 'Premium':
        var body = {type: 1, skip: skip, languageid: languageid};
        var premium = await postData('api/getPremiumbooks', body);
        if (premium.msg === 'New User') {
          setBooks([...books, ...premium.data]);
          setAllBooks([...books, ...premium.data]);
        }
        setIsLoading(false);
        break;

      default:
        var body = {
          type: '1',
          category_id: id,
          skip: skip,
          languageid: languageid,
        };
        var result = await postData('api/getBooksbyid', body);
        if (result.msg === 'New User') {
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

  useEffect(() => {
    fetchBooksbyid(route.params.item.id);
  }, [skip]);

  const getUser = async () => {
    var key = await checkSyncData();
    if (isLogin) {
      await getSyncData(key[0]).then(async res => {
        var {id, usertype} = res;
        setUserData({id, usertype});
      });
    }
  };

  const addToCart = async () => {
    if (isLogin) {
      setCartLoading(true);
      let tempArr = [];
      books.map(item => {
        dispatch({type: 'ADD_CART', payload: [item.id, item]});
        tempArr.push(item.id);
      });
      let body = {
        user_id: userData.id,
        user_type: userData.usertype,
      };
      setCartLoading(false);
    } else {
      navigation.navigate('Login');
    }
  };

  // useEffect(() => {
  //   getUser();
  // }, []);

  var category = route.params.category;

  const subfilterData = val => {
    switch (filterState) {
      case 'Author':
        let filtered = allBooks.filter(
          item => item.bookauthor.charAt(0) === val,
        );
        setBooks([...filtered]);
        break;
      case 'Alphabet':
        let filtered2 = allBooks.filter(
          item => item.bookname.charAt(0) === val,
        );
        setBooks([...filtered2]);
        break;
      default:
        break;
    }
  };

  const filterData = type => {
    switch (type) {
      case 'All':
        setShowSubFilter(false);
        setBooks([...allBooks]);
        break;
      case 'Author':
        setShowSubFilter(true);
        break;
      case 'Alphabet':
        setShowSubFilter(true);
        break;
      case 'Non Premium':
        setShowSubFilter(false);
        let tempBooks6 = [...allBooks];
        let filteredData6 = tempBooks6.filter(item => {
          return (
            item.premiumtype === 'Non Premium' ||
            item.premiumtype === 'BIV' ||
            item.premiumtype === undefined
          );
        });
        setBooks([...filteredData6]);
        break;
      case 'Premium':
        setShowSubFilter(false);
        let tempBooks5 = [...allBooks];
        let filteredData = tempBooks5.filter(item => {
          return item.premiumtype === 'Premium' || item.premiumtype === 'Both';
        });
        setBooks([...filteredData]);
        break;
      case 'By A-Z':
        setShowSubFilter(false);
        let tempBooks = [...allBooks];
        let filteredData2 = tempBooks.sort((a, b) =>
          a.bookname.localeCompare(b.bookname),
        );
        setBooks([...filteredData2]);
        break;
      case 'By Z-A':
        setShowSubFilter(false);
        let tempBooks2 = [...allBooks];
        let filteredData3 = tempBooks2.sort((a, b) =>
          b.bookname.localeCompare(a.bookname),
        );
        setBooks([...filteredData3]);
        break;
      case 'New Arrivals':
        setShowSubFilter(false);
        let tempBooks9 = [...allBooks];
        let filteredData9 = tempBooks9.sort(
          (a, b) =>
            new Date(Date.parse(b.created_on)) -
            new Date(Date.parse(a.created_on)),
        );
        setBooks([...filteredData9]);
      case 'Popular':
        setShowSubFilter(false);
        let tempBooks7 = [...allBooks];
        let viewFilter = tempBooks7.filter(item => {
          return item.viewcount == null;
        });
        let notNullView = tempBooks7.filter(item => {
          return item.viewcount !== null;
        });
        let filteredData7 = notNullView.sort(
          (a, b) => parseInt(b.viewcount) - parseInt(a.viewcount),
        );
        setBooks([...filteredData7, ...viewFilter]);
        break;
      case 'Top Rated':
        setShowSubFilter(false);
        let tempBooks8 = [...allBooks];
        let percentageFilter2 = tempBooks8.filter(item => {
          return item.percentage == null;
        });
        let notNullPercentage2 = tempBooks8.filter(item => {
          return item.percentage !== null;
        });
        let filteredData8 = notNullPercentage2.sort(
          (a, b) => parseInt(b.percentage) - parseInt(a.percentage),
        );
        setBooks([...filteredData8, ...percentageFilter2]);
        break;
      case 'Price Low to High':
        setShowSubFilter(false);
        let tempBooks3 = [...allBooks];
        // let pricefilter = tempBooks3.filter(item => {
        //   return item.price !== '';
        // });
        let filteredData4 = tempBooks3.sort(function (a, b) {
          return parseFloat(a.price) - parseFloat(b.price);
        });
        setBooks([...filteredData4]);
        break;
      case 'Price High to Low':
        setShowSubFilter(false);
        let tempBooks4 = [...allBooks];
        // let pricefilter2 = tempBooks4.filter(item => {
        //   return item.price !== '';
        // });
        let filteredData5 = tempBooks4.sort(function (a, b) {
          return parseFloat(b.price) - parseFloat(a.price);
        });
        setBooks([...filteredData5]);
        break;
      default:
        break;
    }
  };

  const renderHeader = () => {
    return (
      <React.Fragment>
        <View style={styles.imageWrapper}>
          <ImageBackground
            style={{
              flex: 1,
              justifyContent: 'flex-end',
              alignItems: 'center',
            }}
            source={{
              uri: `${ServerURL}/admin/upload/bookcat/${
                category ? category.catphoto : route.params.item.catphoto
              }`,
            }}
            resizeMode="cover"
            blurRadius={5}>
            <Image
              source={{
                uri: `${ServerURL}/admin/upload/bookcat/${
                  category ? category.catphoto : route.params.item.catphoto
                }`,
              }}
              resizeMode="contain"
              style={{width: 200, height: 200}}
            />
          </ImageBackground>
        </View>
        <View>
          <Text style={[styles.categoryTitle, {color: textColor}]}>
            {route.params.item.bookcategory}
          </Text>
        </View>
        <View
          style={{
            width: width * 0.9,
            marginLeft: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <MaterialCommunityIcons name="filter" color={textColor} size={25} />
          <Picker
            selectedValue={filterState}
            style={{
              borderWidth: 1,
              color: textColor,
              borderColor: textColor,
              width: showSubFilter ? width * 0.4 : width * 0.8,
            }}
            mode="dropdown"
            onValueChange={(itemValue, itemIndex) => {
              listRef.current.scrollToIndex({animated: true, index: 0});
              filterData(itemValue);
              setFilterState(itemValue);
            }}>
            <Picker.Item label="All" value="All" />
            <Picker.Item label="Author" value="Author" />
            <Picker.Item label="Alphabet" value="Alphabet" />
            <Picker.Item label="Non Premium" value="Non Premium" />
            <Picker.Item label="Premium" value="Premium" />
            <Picker.Item label="By A-Z" value="By A-Z" />
            <Picker.Item label="By Z-A" value="By Z-A" />
            <Picker.Item label="New Arrivals" value="New Arrivals" />
            <Picker.Item label="Popular" value="Popular" />
            <Picker.Item label="Top Rated" value="Top Rated" />
            <Picker.Item label="Price Low to High" value="Price Low to High" />
            <Picker.Item label="Price High to Low" value="Price High to Low" />
          </Picker>
          <View>
            <Picker
              selectedValue={subfilterState}
              style={{
                borderWidth: 1,
                color: textColor,
                borderColor: textColor,
                width: showSubFilter ? width * 0.35 : 0,
                opacity: showSubFilter ? 1 : 0,
              }}
              mode="dropdown"
              onValueChange={(itemValue, itemIndex) => {
                listRef.current.scrollToIndex({animated: true, index: 0});
                subfilterData(itemValue);
                setSubfilterState(itemValue);
              }}>
              {alphabetArray.map((item, index) => {
                return (
                  <Picker.Item
                    label={item}
                    value={item}
                    enabled={index != 0}
                    key={index}
                  />
                );
              })}
            </Picker>
          </View>
        </View>
      </React.Fragment>
    );
  };

  const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    navigation.popToTop();
  }

  function onSwipeRight() {
    navigation.popToTop();
  }

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <ActivityIndicator
        animating={isLoading}
        size={'large'}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
      {renderHeader()}
      {/* {route.params.item.bookcategory == 'Premium' && (
        <Button
          mode="contained"
          loading={cartLoading}
          color="#ff9000"
          dark={theme !== 'dark'}
          contentStyle={{
            width: width * 0.9,
            padding: width * 0.01,
          }}
          onPress={() => addToCart()}>
          Add All Books to Cart
        </Button>
      )} */}
      <View style={{alignItems: 'center'}}>
        <View style={styles.categoryImage}>
          <FlatList
            ref={listRef}
            data={books}
            removeClippedSubviews
            renderItem={displayBooks}
            keyExtractor={(item, index) => index.toString()}
            ListFooterComponent={
              <TouchableOpacity onPress={() => loadMore()}>
                <Text
                  style={{
                    color: textColor,
                    fontSize: 16,
                    fontWeight: '800',
                    textAlign: 'center',
                  }}>
                  Load More...
                </Text>
              </TouchableOpacity>
            }
            ListFooterComponentStyle={{
              opacity: isLoading ? 0 : 1,
              padding: 20,
              width: width,
              height: height * 0.6,
            }}
            // onEndReached={() => loadMore(route.params.item.id)}
            // onEndReachedThreshold={0.3}
          />
        </View>
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
    // paddingLeft: 15,
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
