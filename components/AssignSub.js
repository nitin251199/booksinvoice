import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {ThemeContext} from './ThemeContext';
import {Button, RadioButton} from 'react-native-paper';
import {postData} from './FetchApi';
import {checkSyncData, getSyncData} from './AsyncStorage';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {Divider} from 'react-native-elements';

const {width, height} = Dimensions.get('window');

export default function AssignSub({route}) {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [email, setEmail] = React.useState('');
  const [contactNo, setContactNo] = React.useState('');
  const [code, setCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [remainingCopies, setRemainingCopies] = React.useState(0);
  const [assigns, setAssigns] = React.useState([]);
  const [userData, setUserData] = React.useState([]);
  const [status, setStatus] = React.useState();
  const [statusValue, setStatusValue] = React.useState();

  const generateRandom = () => {
    var letters = '0123456789ABCDEF';
    var code = 'BIV';
    for (var i = 0; i < 6; i++) {
      code += letters[Math.floor(Math.random() * 16)];
    }
    setCode(code);
    // return code;
  };

  const getAssigndata = async () => {
    var key = await checkSyncData();

    if (key !== 'fcmToken') {
      await getSyncData(key[0]).then(async res => {
        setUserData(res);
        var body = {
          type: '1',
          user_id: res.id,
          subcrib_id: route.params.packageid,
        };
        var result = await postData('api/getAssignsubtouser', body);
        setRemainingCopies(result.subscription[0].no_of_copies);
        setAssigns(result.myshare);
      });
    }
  };

  const handleStatus = async value => {
    setStatus('');
    var body = {
      subcrib_id: route.params.packageid,
      email: value.email_id,
      status: statusValue,
      id: value.aid,
    };
    var result = await postData('api/getAssignsubtouserstatus', body);
    if(result.msg === 'Update')
    {
      ToastAndroid.show('Status Updated Successfully', ToastAndroid.SHORT);
      getAssigndata();
    }
  };

  useEffect(() => {
    getAssigndata();
    generateRandom();
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            // width: width * 0.30,
            paddingVertical: 15,
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
            <Text style={{color: textColor}}>
              Package Name: {item.packagename}
            </Text>
            <Text style={{color: textColor}}>Coupon Code : {item.cid}</Text>
            <Text style={{color: textColor}}>
              Status : {item.astatus == '1' ? 'Active' : 'Deactive'}
            </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() =>{ setStatus(index)
            setStatusValue(item.astatus)
            }}>
              <View>
                {status === index ? (
                  <FontAwesome5Icon
                    onPress={() => handleStatus(item)}
                    name="check"
                    size={21}
                    color={textColor}
                  />
                ) : (
                  <FontAwesome5Icon name="edit" size={21} color={textColor} />
                )}
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {status === index && (
          <View>
            <RadioButton.Group
              onValueChange={newValue => setStatusValue(newValue)}
              value={statusValue}
              >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center',
                  paddingBottom: 5,
                }}>
                <TouchableWithoutFeedback onPress={() => setStatusValue('1')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: textColor}}>Active</Text>
                    <RadioButton
                      color="#ff9000"
                      uncheckedColor={textColor}
                      value="1"
                    />
                  </View>
                </TouchableWithoutFeedback>
                <TouchableWithoutFeedback onPress={() => setStatusValue('0')}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Text style={{color: textColor}}>Deactive</Text>
                    <RadioButton
                      color="#ff9000"
                      uncheckedColor={textColor}
                      value="0"
                    />
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </RadioButton.Group>
          </View>
        )}
        <Divider />
      </View>
    );
  };

  const handleAssign = async () => {
    Keyboard.dismiss();
    setLoading(true);
    var body = {
      type: '1',
      email: email,
      mobile: contactNo,
      user_id: userData.id,
      subcrib_id: route.params.packageid,
      code: code,
    };
    var result = await postData('api/getAssignsubtouseradd', body);
    setLoading(false);
    if (result.msg === 'added') {
      ToastAndroid.show('Assign Successfully', ToastAndroid.SHORT);
      getAssigndata();
      setEmail('');
      setContactNo('');
      generateRandom();
    } else {
      ToastAndroid.show('Assign Failed', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      {/* <ActivityIndicator
        animating={loading}
        size={'large'}
        style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,zIndex:1}}
      /> */}
      <ScrollView style={{paddingBottom: 60}} keyboardShouldPersistTaps>
        <View style={styles.header}>
          <Text style={[styles.headerContent, {color: textColor}]}>
            Assign Subscriptions
          </Text>
        </View>
        <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
          <Text style={{fontSize: 18, fontWeight: '600', color: textColor}}>
            {route.params.packagename}
          </Text>
        </View>
        <View style={{paddingHorizontal: 30, paddingBottom: 10}}>
          <Text style={{fontSize: 14, fontWeight: '400', color: textColor}}>
            Remaining Users : {remainingCopies}
          </Text>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{padding: 5}}>
            <TextInput
              value={email}
              onChangeText={text => setEmail(text)}
              style={[
                styles.textInput,
                {borderBottomColor: 'gray', color: textColor},
              ]}
              placeholder="Enter Email ID"
              placeholderTextColor="#999"
            />
          </View>
          <View style={{padding: 5}}>
            <TextInput
              value={contactNo}
              onChangeText={text => setContactNo(text)}
              style={[
                styles.textInput,
                {borderBottomColor: 'gray', color: textColor},
              ]}
              placeholder="Enter Contact No"
              placeholderTextColor="#999"
            />
          </View>
          <View style={{padding: 5, marginBottom: 10}}>
            <TextInput
              spellCheck={false}
              autoCorrect={false}
              onChangeText={text => setCode(text)}
              value={code}
              style={[
                styles.textInput,
                {borderBottomColor: 'gray', color: textColor},
              ]}
              placeholder="Code"
              placeholderTextColor="#999"
            />
          </View>
          <View style={{padding: 10}}>
            <Button
              // icon="refresh"
              onPress={handleAssign}
              loading={loading}
              style={{backgroundColor: '#FF9000'}}
              contentStyle={{
                height: 55,
                width: width * 0.84,
                alignItems: 'center',
              }}
              dark={theme === 'dark'}
              mode="contained">
              Assign To User
            </Button>
          </View>
          <FlatList
            data={assigns}
            renderItem={renderItem}
            keyExtractor={item => item.aid}
            ListEmptyComponent={() => <ActivityIndicator size="large" />}
          />
        </View>
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
});
