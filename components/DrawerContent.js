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
import {Avatar, ListItem, Icon} from 'react-native-elements';
import { checkSyncData, getSyncData } from './AsyncStorage';
import {postData, ServerURL} from './FetchApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'; 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useDrawerStatus } from '@react-navigation/drawer';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const DrawerContent = ({navigation}) => {

  const { theme } = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const textColor2 = theme === 'dark' ? '#ff9000' : '#191414';
  const isDrawerOpen = useDrawerStatus() === 'open';

  const [category, setCategory] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [lexpanded, setLExpanded] = React.useState(false);
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
                fontSize: 12,
                color: textColor2,
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
                    fontWeight: '700'
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
          persistentScrollbar
          maxHeight={height * 0.43}
          renderItem={({item}) => <DisplayCategory item={item} />}
          keyExtractor={item => item.id}
        />
      </ListItem.Accordion>

      <ListItem
        onPress={() => {
          if (userData.length !== 0) {
          navigation.navigate('EditProfile')
          }
          else {
            navigation.navigate('Login')
          }
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
          <FontAwesome5 name="user-alt" size={20} color={textColor} />
        <ListItem.Content style={{paddingLeft:15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Profile</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
          navigation.navigate('Subscriptions');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
           <Icon name="category" type="materialicons" color={textColor} />
        <ListItem.Content style={{paddingLeft:15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Membership</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        onPress={() => {
          navigation.navigate('AboutUs');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
           <Icon name="info-outline" type="materialicons" color={textColor} />
        <ListItem.Content style={{paddingLeft:15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>About Us</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        onPress={() => {
          navigation.navigate('AboutUs');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
           <Icon name="questioncircle" type="antdesign" color={textColor} size={22}/>
        <ListItem.Content style={{paddingLeft:20}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor,}]}>Help</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
      <ListItem
        onPress={() => {
          navigation.navigate('JoinUs');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
           <Icon name="free-breakfast" type="materialicons" color={textColor} size={22}/>
        <ListItem.Content style={{paddingLeft:20}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor,}]}>Join Us</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {navigation.navigate('FAQ')
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
          <MaterialCommunityIcons name="frequently-asked-questions" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft:15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>FAQ</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {navigation.navigate('Disclaimer')
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
          <MaterialCommunityIcons name="exclamation-thick" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft:15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Disclaimer</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {navigation.navigate('Settings')
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
          <MaterialIcons name="settings" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft:15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Settings</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>


      <ListItem.Accordion
        containerStyle={{backgroundColor: backgroundColor}}
        content={
          <>
          <Icon name="privacy-tip" type="materialicons" color={textColor} size={22}/>
            <ListItem.Content style={{paddingLeft:35}}>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: '700'
                  },
                ]}>
                Legal
              </ListItem.Title>
            </ListItem.Content>
          </>
        }
        isExpanded={lexpanded}
        onPress={() => {
          setLExpanded(!lexpanded)
        }}>
        <ListItem
        onPress={() => {navigation.navigate('PrivacyPolicy')
        navigation.closeDrawer();}}
       containerStyle={{backgroundColor: backgroundColor}}>
        <ListItem.Content style={{paddingLeft:15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor2}]}>
              Privacy Policy
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      
      </ListItem.Accordion>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
});
