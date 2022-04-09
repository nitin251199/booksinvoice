import React, { useEffect, useState } from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView} from 'react-native';
import {ListItem} from 'react-native-elements';
import {List} from 'react-native-paper';
import {ThemeContext} from './ThemeContext';
import {postData} from './FetchApi';

const {width, height} = Dimensions.get('window');

export const FAQ = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [text, setText] = useState([]);

  const fetchFaq =async () => {
    var body = { type: 1, pagename: 'Faq' };
    var result = await postData('api/getPages', body); 
    setText(result.data);
  }

  useEffect(()=>{
    fetchFaq();
  },[])

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ScrollView style={{paddingHorizontal: 15, paddingTop: 10}}>
        <Text style={{fontWeight: '800', color: '#ff9000', fontSize: 22}}>
          FAQs
        </Text>
        {
          text.map(item=>{
            return <List.Accordion
            style={{backgroundColor: backgroundColor}}
            titleNumberOfLines={3}
            titleStyle={[
              styles.text,
              {
                color: textColor,
              },
            ]}
            title={item.title}
            >
            <Text
              style={{
                textAlign: 'justify',
                color: '#ff9000',
                paddingHorizontal: 20,
              }}>
              {item.content}
            </Text>
          </List.Accordion>
          })
        }
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: width,
    height: height * 0.15,
    resizeMode: 'contain',
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 0,
  },
});
