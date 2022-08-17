import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import {List} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {postData} from './FetchApi';
import {useSwipe} from './useSwipe';

const {width, height} = Dimensions.get('window');

export const FAQ = ({navigation}) => {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [text, setText] = useState([]);

  const fetchFaq = async () => {
    var body = {type: 1, pagename: 'Faq'};
    var result = await postData('api/getPages', body);
    setText(result.data);
  };

  useEffect(() => {
    fetchFaq();
  }, []);

  const {onTouchStart, onTouchEnd} = useSwipe(onSwipeLeft, onSwipeRight, 6);

  function onSwipeLeft() {
    navigation.popToTop();
  }

  function onSwipeRight() {
    navigation.popToTop();
  }

  const renderItem = item => {
    return (
      <List.Accordion
        style={{backgroundColor: backgroundColor}}
        titleNumberOfLines={5}
        titleStyle={[
          styles.text,
          {
            color: textColor,
          },
        ]}
        title={item.title}>
        <Text
          style={{
            textAlign: 'justify',
            color: '#ff9000',
            paddingHorizontal: 10,
          }}>
          {/* {item.content} */}
          {item.content.split('\n').map((item, index) => {
            return <Text key={index}>{item}</Text>;
          })}
        </Text>
      </List.Accordion>
    );
  };

  return (
    <View
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={[styles.container, {backgroundColor: backgroundColor}]}>
      <View style={{paddingHorizontal: 15, paddingTop: 20}}>
        <Text style={{fontWeight: '800', color: '#ff9000', fontSize: 22}}>
          FAQs
        </Text>
        <FlatList
          data={text}
          renderItem={({item}) => renderItem(item)}
          keyExtractor={(item, i) => i.toString()}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={() => <View style={{height: 120}} />}
        />
      </View>
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
