import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {ThemeContext} from './ThemeContext';
import {Button} from 'react-native-paper';
import {postData} from './FetchApi';
import {checkSyncData, getSyncData} from './AsyncStorage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Divider} from 'react-native-elements';
import AnimatedLottieView from 'lottie-react-native';

const {width, height} = Dimensions.get('window');

export default function ActivationLink({route, navigation}) {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [modalVisible, setModalVisible] = React.useState(false);
  const modelBackgroundColor = theme === 'dark' ? '#191414' : '#999';

  const [assignData, setAssignData] = React.useState([]);

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
            paddingHorizontal: 20,
          }}>
          <View style={{width: width * 0.8, justifyContent: 'flex-start'}}>
            <Text
              style={{
                fontSize: 17,
                color: textColor,
                fontWeight: '700',
                paddingVertical: 5,
              }}>
              {item.email_id}
            </Text>
            <Text style={{color: textColor}}>Mobile No: {item.mob_no}</Text>
            <Text style={{color: textColor}}>Coupon Code : {item.cid}</Text>
            <Text style={{color: textColor}}>
              Subscription Name : {item.bookname}
            </Text>
            {item.is_activated === '1' ? (
              <>
                <Text style={{color: textColor}}>
                  Valid from : {item.a_dfrom}
                </Text>
                <Text style={{color: textColor}}>Valid To : {item.a_dto}</Text>
              </>
            ) : null}
            {item.is_activated === '1' ? (
              <Text style={{color: textColor}}>
                Status : {item.astatus == '1' ? 'Active' : 'Deactive'}
              </Text>
            ) : (
              <Button
                onPress={() => handleActivate(item)}
                mode="contained"
                style={{
                  backgroundColor: '#FF9000',
                  marginTop: 10,
                  width: width * 0.9,
                }}
                contentStyle={{
                  height: 40,
                  width: width * 0.9,
                  alignItems: 'center',
                }}
                dark={theme === 'dark'}>
                Activate
              </Button>
            )}
          </View>
        </View>
        <Divider />
      </View>
    );
  };

  const handleActivate = async(item) => {
    var body ={ type : 1, id : item.aid }
    var result = await postData('api/getActivatedsub', body);
    if(result.msg === "Success")
    {
        setModalVisible(true);
        fetchAssignedSubs()
    }
    // check.current.play(0, 50)
  };

  const thanksModal = () => {
    return (
      <Modal
        animationType="slide"
        visible={modalVisible}
        transparent
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, {backgroundColor: modelBackgroundColor}]}>
            <Text style={[styles.modalText, {color: textColor}]}>
              Congratulations, your subscription is now active.
            </Text>
            <AnimatedLottieView
              source={require('../images/check2.json')}
              style={{width: 100, height: 100}}
              autoPlay
              loop={false}
            />
            <Pressable
              style={[styles.button, {backgroundColor: '#ff9000'}]}
              onPress={() => {
                navigation.navigate('Homepage');
                setModalVisible(false);
              }}>
              <Text style={[styles.textStyle, {color: textColor}]}>Enjoy</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const fetchAssignedSubs = async () => {
    let userData = route.params.userData;
    var body = {
      type: '1',
      user_id: userData.id,
      user_type: userData.usertype,
      email: userData.useremail,
    };
    var result = await postData('api/getAssignsub', body);
    if (result.msg) {
      setAssignData(result.myshare);
    }
  };

  useEffect(() => {
    fetchAssignedSubs();
  }, []);

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      {thanksModal()}
      {/* <ActivityIndicator
          animating={loading}
          size={'large'}
          style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,zIndex:1}}
        /> */}
      <ScrollView
        style={{paddingBottom: 60}}
        keyboardShouldPersistTaps="always">
        <View style={styles.header}>
          <Text style={[styles.headerContent, {color: textColor}]}>
            Received Activation Link
          </Text>
        </View>
        <View style={{padding: 20, paddingTop: 0}}>
          <Text style={{fontSize: 14, fontWeight: '400', color: textColor}}>
            Here You Will Get Individual Account Activation Link From Your
            Organization
          </Text>
        </View>
        <FlatList
          data={assignData}
          renderItem={renderItem}
          keyExtractor={item => item.aid}
          ListEmptyComponent={() => <ActivityIndicator size="large" />}
        />
      </ScrollView>
    </View>
  );
}

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
  textInput: {borderBottomWidth: 1, width: width * 0.83},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    height: height * 0.35,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: width * 0.7,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  modalText: {
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
});
