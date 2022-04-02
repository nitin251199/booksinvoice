import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  Share,
  FlatList,
  ImageBackground,
  ActivityIndicator,
  Modal,
  ToastAndroid,
} from 'react-native';
import {AirbnbRating} from 'react-native-elements';
import TextTicker from 'react-native-text-ticker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MI from 'react-native-vector-icons/MaterialIcons';
import {postData, ServerURL} from './FetchApi';
import {SamplePlay} from './SamplePlay';
import {ThemeContext} from './ThemeContext';

const {width, height} = Dimensions.get('window');

export default function InfoPage({route, navigation}) {
  var id = route.params.state;
  var categoryid = route.params.category;

  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#000';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#FFF';

  const [book, setBook] = useState([]);
  const [similar, setSimilar] = useState([]);
  // const [refresh, setRefresh] = useState(false);

  const [newArrivals, setNewArrivals] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [popularBooks, setPopularBooks] = useState([]);
  const [premiumBooks, setPremiumBooks] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentModal, setCommentModal] = useState(false);
  const [chapters, setChapters] = useState([]);
  const [show, setShow] = useState(false);
 
  const fetchBook = async id => {
    var body = {type: '1', books_id: id};
    var result = await postData('api/getBooksid', body);
    setBook(result.data[0]);
    setChapters(result.chapters)
  };

  const fetchSimilarBooks = async id => {
    var body = {type: '1', category_id: id};
    var result = await postData('api/getSimiler', body);
    setSimilar(result.data);
  };

  const fetchNewArrivals = async () => {
    var body = {type: '1', skip: 0};
    var result = await postData('api/getNewarrival', body);
    setNewArrivals(result.data);
  };

  const fetchTopRated = async () => {
    var body = {type: '1', skip: 0};
    var result = await postData('api/getToprated', body);
    setTopRated(result.data);
  };

  const fetchPopularBooks = async () => {
    var body = {type: '1', skip: 0};
    var result = await postData('api/getPopulerbooks', body);
    setPopularBooks(result.data);
  };

  const fetchPremiumBooks = async () => {
    var body = {type: '1', skip: 0};
    var result = await postData('api/getPremiumbooks', body);
    setPremiumBooks(result.data);
  };

  const fetchAllComments = async () => {
    var body = {type: '1', books_id: id};
    var result = await postData('api/getComment', body);
    if (result.msg === 'Success') {
      setComments(result.data);
    }
  };

  const renderComments = ({item}) => {
    return (
      <View style={styles.commentContainer}>
        <View>
          <Text style={[styles.commentFooter, {color: '#999'}]}>
            By {item.name} on {item.created_on}
          </Text>
        </View>
        <View>
          <Text style={[styles.commentHeader, {color: textColor}]}>
            {item.comment}
          </Text>
        </View>
      </View>
    );
  };

  const commentsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={commentModal}
        onRequestClose={() => {
          setCommentModal(false);
        }}>
          <View style={styles.centeredView}>
            <View  style={[
              {
                backgroundColor: modelBackgroundColor,
                padding: 20,
                borderRadius: 10,
              },
            ]}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingBottom:20}}>
              <Text style={[styles.modalText, {color: textColor}]}>
                Comments
              </Text>
              <TouchableOpacity onPress={()=>setCommentModal(false)}>
              <MaterialCommunityIcons name="close" size={20} color={textColor} />
              </TouchableOpacity>
              </View>
        <FlatList
          data={comments}
          // persistentScrollbar
          // nestedScrollEnabled
          maxHeight={height * 0.43}
          renderItem={renderComments}
          keyExtractor={item => item.id}
        />
        </View>
        </View>
      </Modal>
    );
  };

  useEffect(() => {
    fetchBook(id);
    fetchAllComments();
    fetchSimilarBooks(categoryid);
    fetchNewArrivals();
    fetchTopRated();
    fetchPopularBooks();
    fetchPremiumBooks();
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const [showMoreButton, setShowMoreButton] = useState(false);
  const [textShown, setTextShown] = useState(false);
  const [numLines, setNumLines] = useState(undefined);

  const toggleTextShown = () => {
    setTextShown(!textShown);
  };

  const onTextLayout = useCallback(
    e => {
      if (e.nativeEvent.lines.length > 3 && !textShown) {
        setShowMoreButton(true);
        setNumLines(3);
      }
    },
    [textShown],
  );

  useEffect(() => {
    setNumLines(textShown ? undefined : 3);
  }, [textShown]);

  const DisplayItem = ({item}) => {
    return (
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          // width: width * 0.30,
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.push('InfoPage', {
              state: item.id,
              category: item.bookcategoryid,
            })
          }>
          <Image
            style={[styles.nextImage]}
            source={{
              uri: `${ServerURL}/admin/upload/bookcategory/${item.bookcategoryid}/${item.photo}`,
            }}
          />
        </TouchableOpacity>
        <SamplePlay
          item={item}
          propsStyles={{
            position: 'absolute',
            top: '45%',
            left: '5%',
            elevation: 10,
          }}
        />
        <View
          style={{
            width: width * 0.28,
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 5,
            justifyContent: 'space-between',
          }}>
          <MaterialCommunityIcons
            style={{paddingRight: 1}}
            name="account-voice"
            size={15}
            color={textColor}
          />
          <TextTicker
            style={[
              styles.moreimageText,
              {
                color: textColor,
              },
            ]}
            duration={10000}
            loop
            bounce
            repeatSpacer={50}
            marqueeDelay={1000}
            useNativeDriver>
            {item.narrator}
          </TextTicker>
        </View>
        <View style={{flexDirection: 'row'}}>
          <MI
            style={{paddingRight: 3}}
            name="remove-red-eye"
            size={15}
            color={textColor}
          />
          <View
            style={{
              width: width * 0.24,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <Text
              style={{
                paddingLeft: 5,
                // width: width * 0.55,
                fontSize: 12,
                overflow: 'hidden',
                color: textColor,
              }}>
              {item.viewcount !== null ? item.viewcount : 0}
            </Text>
            <AirbnbRating
              starContainerStyle={{paddingLeft: 0}}
              count={5}
              showRating={false}
              defaultRating={item.percentage !== null ? item.percentage : 0}
              size={7}
            />
          </View>
        </View>
      </View>
    );
  };

  // const onRefresh = () => {
  //   setRefresh(true);
  //   fetchBook(id);
  //   fetchAllComments();
  //   fetchSimilarBooks(categoryid);
  //   fetchNewArrivals();
  //   fetchTopRated();
  //   fetchPopularBooks();
  //   fetchPremiumBooks();
  //   setRefresh(false);
  // }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          //  refreshControl={
          //   <RefreshControl
          //     refreshing={refresh}
          //     onRefresh={onRefresh}
          //   />
          // }
        >
          <ImageBackground
            resizeMode="cover"
            source={require('../../images/musicbg.jpg')}
            imageStyle={{opacity: 0.4}}
            style={{paddingVertical: 20}}>
            <View style={styles.wrapper}>
              <Image
                source={{
                  uri: `${ServerURL}/admin/upload/bookcategory/${book.bookcategoryid}/${book.photo}`,
                }}
                style={styles.image}
              />
            </View>
          </ImageBackground>
          <Text
            style={[
              styles.imageText,
              {
                color: textColor,
              },
            ]}>
            {book.bookname}
          </Text>
          <View style={styles.textContainer}>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Written By :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.bookauthor}
              </Text>
            </View>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Narrated By :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.narrator}
              </Text>
            </View>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Category :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.bookcategory}
              </Text>
            </View>
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Views :{' '}
              </Text>
              <Text style={[styles.text, {color: textColor}]}>
                {book.viewcount}
              </Text>
            </View>

            {(book.premiumtype === 'Premium' || book.premiumtype === 'Both') ? (
              <>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Premium Type :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {book.premiumtype}
                  </Text>
                </View>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Validity :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    {book.validity} days
                  </Text>
                </View>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    ₹ {book.price}
                  </Text>
                </View>
                <View style={[styles.textWrapper, {alignItems: 'center'}]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        width: width * 0.48,
                      },
                    ]}>
                    Doller Price :{' '}
                  </Text>
                  <Text style={[styles.text, {color: textColor}]}>
                    $ {book.dollerprice}
                  </Text>
                </View>
              </>
            ) : (
              <></>
            )}
            <View style={[styles.textWrapper, {alignItems: 'center'}]}>
              <Text
                style={[
                  styles.text,
                  {
                    color: textColor,
                    width: width * 0.48,
                  },
                ]}>
                Rating :{' '}
              </Text>
              <AirbnbRating
                starContainerStyle={{paddingLeft: 0}}
                count={5}
                showRating={false}
                defaultRating={book.percentage !== null ? book.percentage : 0}
                size={11}
              />
            </View>
            {book.description !== '' ? (
              <View
                style={[
                  styles.textWrapper,
                  {
                    flexDirection: 'column',
                    // alignItems: 'center'
                  },
                ]}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        fontSize: 16,
                        width: width * 0.48,
                      },
                    ]}>
                    Description :{' '}
                  </Text>
                  {showMoreButton ? (
                    <TouchableOpacity onPress={toggleTextShown}>
                      <Text style={{color: '#FFD369'}}>
                        {textShown ? 'Read Less' : 'Read More'}
                      </Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
                <View>
                  <Text
                    style={[
                      styles.text,
                      {
                        width: width * 0.9,
                        textAlign: 'justify',
                        color: textColor,
                      },
                    ]}
                    numberOfLines={numLines}
                    ellipsizeMode="tail"
                    onTextLayout={onTextLayout}>
                    {book.description}
                  </Text>
                </View>
              </View>
            ) : null}

            <View
              style={[
                styles.textWrapper,
                {
                  flexDirection: 'column',
                  // alignItems: 'center'
                },
              ]}>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity onPress={()=>{
                  if(comments.length == 0){
                    ToastAndroid.show('No Comments yet', ToastAndroid.SHORT)
                  }
                  else{
                    setCommentModal(true)
                  }
                  }}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: textColor,
                        fontSize: 16,
                        width: width * 0.48,
                        paddingVertical: 5,
                      },
                    ]}>
                    Show All Comments...
                  </Text>
                </TouchableOpacity>
              </View>
              <View>{commentsModal()}</View>
            </View>
          </View>

          <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() =>
           { 
             navigation.navigate('MusicPlayer', {state: book, chapters: chapters})
            // setShow(true)
          }
          }>
          <View
            style={[
              styles.btn,
              {
                width: width * 0.62,
                marginRight: 10,
              },
            ]}>
            <Text style={{fontSize: 18, fontWeight: '800', color: '#fff'}}>
              PLAY
            </Text>
            <MaterialCommunityIcons name="play" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={onShare}>
          <View style={styles.btn}>
            <Text style={{fontSize: 18, fontWeight: '800', color: '#fff'}}>
              SHARE
            </Text>
            <MaterialCommunityIcons name="share" size={30} color="#fff" />
          </View>
        </TouchableOpacity>
      </View>

          <View style={{paddingBottom: 10, paddingLeft: 20}}>
            <Text
              style={[
                styles.imageText,
                {
                  color: textColor,
                  paddingVertical: 20,
                  paddingHorizontal: 0,
                  fontSize: 16,
                },
              ]}>
              Similar Books
            </Text>
            <FlatList
              data={similar}
              renderItem={({item, index}) => (
                <DisplayItem item={item} index={index} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View style={{padding: 30, marginHorizontal: 150}}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CategoryPage', {
                  item: {
                    id: '0',
                    bookcategory: 'New Arrivals',
                    catphoto: 'custom_img.jpg',
                  },
                })
              }>
              <Text
                style={[
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                New Arrivals
              </Text>
            </TouchableOpacity>
            <FlatList
              data={newArrivals}
              renderItem={({item, index}) => (
                <DisplayItem item={item} index={index} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View style={{padding: 30, marginHorizontal: 150}}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CategoryPage', {
                  item: {
                    id: '0',
                    bookcategory: 'Top Rated',
                    catphoto: 'custom_img.jpg',
                  },
                })
              }>
              <Text
                style={[
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                Top Rated
              </Text>
            </TouchableOpacity>
            <FlatList
              data={topRated}
              renderItem={({item, index}) => (
                <DisplayItem item={item} index={index} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View style={{padding: 30, marginHorizontal: 150}}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CategoryPage', {
                  item: {
                    id: '0',
                    bookcategory: 'Popular Books',
                    catphoto: 'custom_img.jpg',
                  },
                })
              }>
              <Text
                style={[
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                Popular Books
              </Text>
            </TouchableOpacity>
            <FlatList
              data={popularBooks}
              renderItem={({item, index}) => (
                <DisplayItem item={item} index={index} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View style={{padding: 30, marginHorizontal: 150}}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            />
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('CategoryPage', {
                  item: {
                    id: '0',
                    bookcategory: 'Premium',
                    catphoto: 'custom_img.jpg',
                  },
                })
              }>
              <Text
                style={[
                  styles.imageText,
                  {
                    color: textColor,
                    paddingVertical: 20,
                    paddingHorizontal: 0,
                    fontSize: 16,
                  },
                ]}>
                Premium Books
              </Text>
            </TouchableOpacity>
            <FlatList
              data={premiumBooks}
              renderItem={({item, index}) => (
                <DisplayItem item={item} index={index} />
              )}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              ListEmptyComponent={() => (
                <View style={{padding: 30, marginHorizontal: 150}}>
                  <ActivityIndicator size="large" />
                </View>
              )}
            />
          </View>
        </ScrollView>
      </View>
      {/* <BottomSheet navigation={navigation} /> */}
      {/* <MiniPlayer show={show} /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: width,
    // paddingTop: 20,
  },
  image: {
    width: 300,
    height: 340,
    resizeMode: 'stretch',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 0,
    // backgroundColor:"blue",
  },
  imageText: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    fontSize: 22,
    fontWeight: '800',
    paddingHorizontal: 20,
    flexWrap: 'wrap',
    paddingTop: 5,
  },
  textContainer: {
    paddingHorizontal: 20,
    display: 'flex',
  },
  textWrapper: {
    flexDirection: 'row',
    width: width * 0.9,
    paddingVertical: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    display: 'flex',
    flexWrap: 'wrap',
    // backgroundColor:'red',
    width: width * 0.5,
  },
  btn: {
    padding: 10,
    backgroundColor: '#ff9000',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 5,
    borderRadius: 5,
  },
  btnContainer: {
    width: width,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextWrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: width * 0.32,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  nextImage: {
    height: height * 0.17,
    width: width * 0.28,
    marginRight: 15,
    resizeMode: 'stretch',
    borderRadius: 5,
  },
  nextImageText: {
    fontWeight: '600',
    fontSize: 12,
    width: width * 0.25,
    overflow: 'hidden',
    paddingTop: 5,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Calibri',
    paddingTop: 6,
    paddingBottom: 15,
  },
  categoryImage: {
    height: height * 0.24,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    // alignItems: 'center',
    overflowX: 'scroll',
  },
  moreimage: {
    height: height * 0.17,
    width: width * 0.28,
    marginRight: 15,
    resizeMode: 'stretch',
    borderRadius: 5,
    // elevation: 5,
    // shadowOpacity: 2,
    // shadowRadius: 14,
    // shadowColor: 'red',
    // shadowOffset: {width: 0, height: 0},
  },
  moreimageText: {
    fontWeight: '600',
    fontSize: 12,
    paddingLeft: 5,
    // width: width * 0.24,
    overflow: 'hidden',
  },
  commentContainer: {
    // height: 70,
    width: width * 0.8,
    paddingTop: 10,
    flexDirection: 'column',
    // alignItems:'center',
    // justifyContent:'space-between',
  },
  commentHeader: {
    fontSize: 14,
    // width: width * 0.5,
  },
  commentFooter: {
    fontSize: 10,
    // textAlign: 'right',
    paddingRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText : {
    fontSize: 20,
    fontWeight: '800'
  }
});
