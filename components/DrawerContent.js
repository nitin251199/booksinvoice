import React, {useEffect} from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  Linking,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import {ListItem, Icon} from 'react-native-elements';
import {checkSyncData, getSyncData} from './AsyncStorage';
import {postData} from './FetchApi';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {useDrawerStatus} from '@react-navigation/drawer';
import {ThemeContext} from './ThemeContext';
import {Badge, List} from 'react-native-paper';
import {useSelector} from 'react-redux';
import pkg from '../package.json';

const {width, height} = Dimensions.get('window');

export const DrawerContent = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  const isDrawerOpen = useDrawerStatus() === 'open';

  const [category, setCategory] = React.useState([]);
  const [expanded, setExpanded] = React.useState(false);
  const [languageExpanded, setLanguageExpanded] = React.useState(false);
  const [lexpanded, setLExpanded] = React.useState(false);
  const [userData, setUserData] = React.useState([]);

  var cart = useSelector(state => state?.cart);
  var isSub = useSelector(state => state.isSubscribed);
  var keys = Object.keys(cart);

  const fetchAllCategory = async () => {
    var body = {type: 1};
    var result = await postData('api/getCategory', body);
    setCategory(result.data);
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  useEffect(() => {
    checkLogin();
    setExpanded(false);
    setLanguageExpanded(false);
    setLExpanded(false);
  }, [isDrawerOpen]);

  const checkLogin = async () => {
    var key = await checkSyncData();

    if (key[0]) {
      var userData = await getSyncData(key[0]);
      setUserData(userData);
    } else {
      setUserData([]);
    }
  };

  const DisplayCategory = ({item, index}) => {
    return (
      <View style={{paddingVertical: 0}}>
        <List.Item
          title={item.bookcategory}
          titleStyle={{
            fontSize: 12,
            color: '#ff9000',
          }}
          onPress={() => navigation.navigate('CategoryPage', {item: item})}
          style={{backgroundColor: backgroundColor}}
          key={index}></List.Item>
      </View>
    );
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          `Booksinvoice - Download and listen books for free.\nDownload from playstore: https://play.google.com/store/apps/details?id=com.booksinvoice`,
          
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

  return (
    <ScrollView
      persistentScrollbar
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
      <View style={{paddingHorizontal: 20}}>
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: 20,
            },
          ]}>
          Welcome !
        </Text>
        <Text
          style={[
            styles.text,
            {
              color: textColor,
              fontSize: 22,
            },
          ]}>
          {userData?.user_name}
        </Text>
      </View>

      <ListItem
        onPress={() => {
          if (userData) {
            navigation.navigate('EditProfile');
            navigation.closeDrawer();
          } else {
            navigation.navigate('Login');
            navigation.closeDrawer();
          }
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <FontAwesome5 name="user-alt" size={20} color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>
              {userData ? 'Dashboard' : 'Log In'}
            </Text>
          </ListItem.Title>
          <ListItem.Subtitle style={{fontSize: 12, color: '#999'}}>
            <Text>Listen Best Audiobooks</Text>
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
          navigation.navigate('Settings');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialIcons name="settings" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Settings</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
          if (userData) {
            navigation.navigate('FavouriteBooks');
            navigation.closeDrawer();
          } else {
            navigation.navigate('Login');
            navigation.closeDrawer();
          }
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialIcons name="queue-music" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>My Playlist</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
          navigation.navigate('Cart');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <View>
          <FontAwesome5 name="shopping-cart" size={18} color={textColor} />
          {keys.length > 0 && (
            <Badge
              size={15}
              style={{
                color: textColor,
                backgroundColor: '#ff9000',
                position: 'absolute',
                top: 0,
                right: 0,
              }}>
              {keys.length}
            </Badge>
          )}
        </View>
        <ListItem.Content style={{paddingLeft: 17}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>My Cart</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
          navigation.navigate('Subscriptions');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialCommunityIcons name="crown" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>
              { isSub ? 'My Subscription' : 'Buy Subscription'}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        // onPress={() => {
        //   navigation.navigate('Download');
        //   navigation.closeDrawer();
        // }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <Icon name="file-download" type="materialicons" color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Downloads</Text>
          </ListItem.Title>
          <ListItem.Subtitle style={{fontSize: 12, color: '#999'}}>
            <Text>Listen Favorite Audiobooks offline</Text>
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>

      <List.Accordion
        title="Categories"
        left={props => (
          <Icon
            name="category"
            type="materialicons"
            color={textColor}
            style={{paddingLeft: 9}}
          />
        )}
        right={props => (
          <Icon
            name="keyboard-arrow-down"
            type="materialicons"
            color={textColor}
          />
        )}
        expanded={expanded}
        titleStyle={{
          color: textColor,
          paddingLeft: 20,
          fontWeight: '700',
          fontSize: 14,
        }}
        style={{backgroundColor: backgroundColor}}
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
      </List.Accordion>

      <List.Accordion
        title="Languages"
        left={props => (
          <Icon
            name="language"
            type="materialicons"
            color={textColor}
            style={{paddingLeft: 9}}
          />
        )}
        right={props => (
          <Icon
            name="keyboard-arrow-down"
            type="materialicons"
            color={textColor}
          />
        )}
        expanded={languageExpanded}
        titleStyle={{
          color: textColor,
          paddingLeft: 20,
          fontWeight: '700',
          fontSize: 14,
        }}
        style={{backgroundColor: backgroundColor}}
        onPress={() => {
          setLanguageExpanded(!languageExpanded);
        }}>
        <List.Item
          title="Hindi"
          titleStyle={{
            fontSize: 12,
            color: '#ff9000',
          }}
          // onPress={() => navigation.navigate('CategoryPage', {item: item})}
          style={{backgroundColor: backgroundColor}}></List.Item>
        <List.Item
          title="English"
          titleStyle={{
            fontSize: 12,
            color: '#ff9000',
          }}
          // onPress={() => navigation.navigate('CategoryPage', {item: item})}
          style={{backgroundColor: backgroundColor}}></List.Item>
        <List.Item
          title="Marathi"
          titleStyle={{
            fontSize: 12,
            color: '#ff9000',
          }}
          // onPress={() => navigation.navigate('CategoryPage', {item: item})}
          style={{backgroundColor: backgroundColor}}></List.Item>
      </List.Accordion>

      <List.Accordion
        title="Legal"
        left={props => (
          <Icon
            name="privacy-tip"
            type="materialicons"
            color={textColor}
            style={{paddingLeft: 9}}
          />
        )}
        right={props => (
          <Icon
            name="keyboard-arrow-down"
            type="materialicons"
            color={textColor}
          />
        )}
        expanded={lexpanded}
        titleStyle={{
          color: textColor,
          paddingLeft: 20,
          fontWeight: '700',
          fontSize: 14,
        }}
        style={{backgroundColor: backgroundColor}}
        onPress={() => {
          setLExpanded(!lexpanded);
        }}>
        <List.Item
          title="Disclaimer"
          titleStyle={{
            fontSize: 12,
            color: '#ff9000',
          }}
          onPress={() => {
            navigation.navigate('Legal', {page: 'Disclaimer'});
            navigation.closeDrawer();
          }}
          style={{backgroundColor: backgroundColor}}></List.Item>

        <List.Item
          title="Privacy Policy"
          titleStyle={{
            fontSize: 12,
            color: '#ff9000',
          }}
          onPress={() => {
            navigation.navigate('Legal', {page: 'PrivacyPolicy'});
            navigation.closeDrawer();
          }}
          style={{backgroundColor: backgroundColor}}></List.Item>

        <List.Item
          title="Terms & Conditions"
          titleStyle={{
            fontSize: 12,
            color: '#ff9000',
          }}
          onPress={() => {
            navigation.navigate('Legal', {page: 'TermAndConditions'});
            navigation.closeDrawer();
          }}
          style={{backgroundColor: backgroundColor}}></List.Item>
      </List.Accordion>

      <ListItem
        onPress={() => {
          navigation.navigate('AboutUs');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <Icon name="info-outline" type="materialicons" color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>About Us</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
          navigation.navigate('FAQ');
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialCommunityIcons
          name="frequently-asked-questions"
          size={23}
          color={textColor}
        />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>FAQ</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
          navigation.navigate('Legal', {page: 'Support'});
          navigation.closeDrawer();
        }}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialIcons name="support-agent" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Support</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {
        Linking.openURL("https://play.google.com/store/apps/details?id=com.booksinvoice")
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialIcons name="star-rate" size={23} color={textColor} />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>
              Rate us on Play Store
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        onPress={() => {onShare()
        navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialCommunityIcons
          name="share-variant"
          size={23}
          color={textColor}
        />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>Share App</Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>

      <ListItem
        // onPress={() => {navigation.navigate('FAQ')
        // navigation.closeDrawer();}}
        containerStyle={{backgroundColor: backgroundColor}}>
        <MaterialCommunityIcons
          name="robot-happy"
          size={23}
          color={textColor}
        />
        <ListItem.Content style={{paddingLeft: 15}}>
          <ListItem.Title>
            <Text style={[styles.text, {color: textColor}]}>
              App Version v{pkg.version}
            </Text>
          </ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </ScrollView>
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
