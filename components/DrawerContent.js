import React, {useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {Avatar, ListItem} from 'react-native-elements';
import { checkSyncData, getSyncData } from './AsyncStorage';
import {postData, ServerURL} from './FetchApi';
import { useDrawerStatus } from '@react-navigation/drawer';

const {width, height} = Dimensions.get('window');

export const DrawerContent = ({navigation}) => {
  const textColor = useColorScheme() === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = useColorScheme() === 'dark' ? '#212121' : '#FFF';
  const isDrawerOpen = useDrawerStatus() === 'open';

  const [category, setCategory] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [userData, setUserData] = React.useState([]);

  const fetchAllCategory = async () => {
    var body = {type: 1};
    var result = await postData('api/getCategory', body);
    setCategory(result.data);
  };

  useEffect(() => {
    fetchAllCategory(); 
  }, []);

  useEffect(()=>{
    checkLogin()
  },[isDrawerOpen])

  const checkLogin = async() => {
    var key = await checkSyncData()

    if (key) {

      var userData = await getSyncData(key[0])
      setUserData(userData)
    }
    else {
      setUserData([])
    }
    
  }

  const DisplayCategory = ({item, index}) => {
    return (
      <View style={{paddingVertical: 0}}>
        <ListItem
          onPress={() => navigation.navigate('CategoryPage', {item: item})}
          containerStyle={{backgroundColor: backgroundColor}}
          key={index}
          bottomDivider>
          <ListItem.Content>
            <ListItem.Title
              style={{
                fontSize: 14,
                color: useColorScheme() === 'dark' ? '#ff9000' : '#000',
              }}>
              {item.bookcategory}
            </ListItem.Title>
          </ListItem.Content>
        </ListItem>
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: backgroundColor,
        },
      ]}>
      <View
        style={{
          display: 'flex',
          padding: 20,
          marginTop: 40,
        }}>
        <Image
          style={{width: 50, height: 50, borderRadius: 5}}
          source={require('../../images/logo.jpg')}
        />
      </View>
      <View style={{paddingHorizontal:20}}>
        <Text
          style={[
            styles.text,
            {
              color: textColor,fontSize:20
            },
          ]}>
          Welcome !
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: textColor,fontSize:22
            },
          ]}>
          {userData.user_name}
        </Text>
      </View>
      <ListItem.Accordion
        containerStyle={{backgroundColor: backgroundColor}}
        content={
          <>
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                  },
                ]}>
                Categories
              </ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={expanded}
        onPress={() => {
          setExpanded(!expanded);
        }}>
        <FlatList
          data={category}
          nestedScrollEnabled
          maxHeight={height * 0.43}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <DisplayCategory item={item} />}
          keyExtractor={item => item.id}
        />
      </ListItem.Accordion>
      <ListItem
        onPress={() => {
          navigation.navigate('AboutUs');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <ListItem.Content>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>About Us</Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        onPress={() => {navigation.navigate('PrivacyPolicy')
        navigation.closeDrawer();}}
       containerStyle={{backgroundColor: backgroundColor}}>
        <ListItem.Content>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>
              Privacy Policy
            </Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        onPress={() => {navigation.navigate('FAQ')
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
        <ListItem.Content>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>FAQ</Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>

      <ListItem
        onPress={() => {navigation.navigate('Disclaimer')
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
        <ListItem.Content>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Disclaimer</Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron />
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});
