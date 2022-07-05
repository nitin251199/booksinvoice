import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {FAB} from 'react-native-paper';
import RBSheet from 'react-native-raw-bottom-sheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {postData} from './FetchApi';
import {useSelector} from 'react-redux';

const {width, height} = Dimensions.get('window');

export const Comment = ({route, navigation}) => {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userData, setUserData] = useState([]);
  const refRBSheet = useRef(null);
  const id = route.params.id;

  const fetchAllComments = async () => {
    setLoading(true);
    var body = {type: '1', books_id: id};
    var result = await postData('api/getComment', body);
    if (result.msg === 'Success') {
      setComments(result.data);
      setLoading(false);
    } else {
      setLoading(false);
      ToastAndroid.show('No comments', ToastAndroid.SHORT);
    }
  };

  const fetchUser = async () => {
    var key = await checkSyncData();

    if (key[0] != 'fcmToken') {
      var userData = await getSyncData(key[0]);
      setUserData(userData);
      setName(userData?.user_name);
      setEmail(userData?.useremail);
    } else {
      setUserData([]);
    }
  };

  const renderLoader = () => {
    return loading ? (
      <View
        style={{
          width: width,
          height: height,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="large" />
      </View>
    ) : null;
  };

  const renderComments = ({item}) => {
    return (
      <View style={{flexDirection: 'row', paddingLeft: 20, marginVertical: 5}}>
        <Avatar
          overlayContainerStyle={{backgroundColor: '#999'}}
          size="small"
          rounded
          title={item.name.substring(0, 1)}
          //   activeOpacity={0.7}
        />
        <View style={styles.commentContainer}>
          <View>
            <Text style={[styles.commentFooter, {color: '#999'}]}>
              {item.name}
            </Text>
          </View>
          <View>
            <Text style={[styles.commentHeader, {color: textColor}]}>
              {item.comment}
            </Text>
          </View>
          <View>
            <Text style={[styles.commentFooter, {color: '#999'}]}>
              {item.created_on}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  useEffect(() => {
    fetchAllComments();
    fetchUser();
  }, []);

  const postComment = async () => {
    if (name == '' || email == '') {
      return ToastAndroid.show(
        'Name and Email are required!',
        ToastAndroid.SHORT,
      );
    }
    var body = {
      type: 1,
      c_name: name,
      c_email: email,
      c_msg: commentText,
      books_id: id,
    };
    var result = await postData('api/getAddcomment', body);

    if (result.msg === 'added') {
      fetchAllComments();
      ToastAndroid.show('Comment Added Successfully', ToastAndroid.SHORT);
      refRBSheet.current.close();
    } else {
      ToastAndroid.show('Something went wrong', ToastAndroid.SHORT);
      refRBSheet.current.close();
    }
  };

  const commentBottomSheet = () => {
    return (
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: 'transparent',
          },
          draggableIcon: {
            backgroundColor: textColor,
          },
          container: {
            backgroundColor: backgroundColor,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
        height={userData.length != 0 ? height * 0.25 : height * 0.6}>
        {userData.length != 0 ? (
          <View
            style={{
              borderWidth: 4,
              borderRadius: 30,
              margin: 10,
              borderColor: '#99999950',
              height: 50,
            }}>
            <TextInput
              placeholder="Write your comment here"
              placeholderTextColor="#999"
              onChangeText={text => setCommentText(text)}
              autoFocus
              style={{paddingLeft: 15, color: textColor}}
            />
            <TouchableOpacity onPress={() => postComment()}>
              <View
                style={{
                  backgroundColor: '#ff9000',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 10,
                  marginVertical: 15,
                  borderRadius: 5,
                  height: 50,
                }}>
                <Text style={{color: '#FFF', fontWeight: 'bold', fontSize: 18}}>
                  Post Comment
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text
              style={{
                color: textColor,
                margin: 10,
                marginHorizontal: 20,
                fontWeight: '800',
                fontSize: 22,
              }}>
              Write A review
            </Text>
            <Text
              style={{color: textColor, marginHorizontal: 20, fontSize: 14}}>
              We will not publish your email address. Required fields are
              marked*
            </Text>
            <View style={{marginTop: 20, marginHorizontal: 20}}>
              <Text style={{color: textColor, fontSize: 14}}>Comment</Text>
              <TextInput
                onChangeText={text => setCommentText(text)}
                style={{
                  borderWidth: 1,
                  borderRadius: 5,
                  marginVertical: 10,
                  borderColor: textColor,
                  color: textColor,
                  paddingHorizontal: 10,
                }}
                multiline
                numberOfLines={3}
                placeholder="Write your comment here"
                placeholderTextColor="#999"
              />
              <View style={{flexDirection: 'row'}}>
                <View style={{flexDirection: 'column', width: '50%'}}>
                  <Text style={{color: textColor, fontSize: 14}}>Name*</Text>
                  <TextInput
                    onChangeText={text => setName(text)}
                    placeholder="Name"
                    placeholderTextColor="#999"
                    style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      marginVertical: 10,
                      marginRight: 10,
                      borderColor: textColor,
                      color: textColor,
                      paddingHorizontal: 10,
                    }}
                  />
                </View>
                <View style={{flexDirection: 'column', width: '50%'}}>
                  <Text style={{color: textColor, fontSize: 14}}>Email*</Text>
                  <TextInput
                    onChangeText={text => setEmail(text)}
                    placeholder="Email"
                    placeholderTextColor="#999"
                    style={{
                      borderWidth: 1,
                      borderRadius: 5,
                      marginVertical: 10,
                      borderColor: textColor,
                      color: textColor,
                      paddingHorizontal: 10,
                    }}
                  />
                </View>
              </View>
              <TouchableOpacity onPress={() => postComment()}>
                <View
                  style={{
                    backgroundColor: '#ff9000',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 20,
                    marginVertical: 10,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{color: '#FFF', fontWeight: 'bold', fontSize: 18}}>
                    Post Comment
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </RBSheet>
    );
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View style={{padding: 15, flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="chevron-down" color={textColor} size={23} />
        </TouchableOpacity>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '800',
            width: width * 0.85,
            color: textColor,
          }}>
          {comments.length} Comments
        </Text>
      </View>
      <FlatList
        data={comments}
        ListEmptyComponent={renderLoader()}
        ListFooterComponentStyle={{paddingBottom: 60}}
        ListFooterComponent={<View></View>}
        renderItem={renderComments}
        keyExtractor={item => item.id}
      />
      <FAB
        style={styles.fab}
        icon="plus"
        label="Comment"
        onPress={() => refRBSheet.current.open()}
      />
      {commentBottomSheet()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  commentContainer: {
    // height: 70,
    width: width * 0.8,
    marginBottom: 10,
    flexDirection: 'column',
    marginLeft: 10,
    // alignItems:'center',
    // justifyContent:'space-between',
  },
  commentHeader: {
    fontSize: 14,
    // width: width * 0.5,
    marginVertical: 5,
  },
  commentFooter: {
    fontSize: 12,
    // textAlign: 'right',
    paddingRight: 10,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#ff9000',
  },
});
