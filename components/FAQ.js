import React from 'react';
import {
  StyleSheet,
  View,
  useColorScheme,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { ListItem } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const {width, height} = Dimensions.get('window');

export const FAQ = ({navigation}) => {
  const textColor = useColorScheme() === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = useColorScheme() === 'dark' ? '#212121' : '#FFF';

  const [expanded, setExpanded] = React.useState(false);

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      
      <ScrollView style={{padding: 20,marginBottom:30}}>
        <Text style={{fontWeight: '800', color: textColor, fontSize: 22}}>
          FAQs
        </Text>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
              <ListItem.Content>
                <ListItem.Title
                  style={[
                    styles.text,
                    {
                      color: textColor,fontWeight:'bold',
                    },
                  ]}>
                  बुक्स इन वॉइस डॉट कॉम का उद्देश्य क्या है?
                </ListItem.Title>
              </ListItem.Content>
          }
          isExpanded={expanded}
          onPress={() => {
            setExpanded(!expanded);
          }}>
          {/* <DisplayCategory /> */}
          <Text style={{textAlign: 'justify',
            color: textColor}}>
          बुक्स इन वॉइस डॉट कॉम का उद्देश्य हिंदी भाषा की पुस्तकें, कहानी, उपन्यास, जीवन परिचय, लेख आदि को ऑडियो रूप में उपलब्ध कराना है। वेबसाईट के माध्यम से हिंदी भाषा में लिखित सामग्री का विस्तार ऑडियो के रूप में होगा वहीं शिक्षा के क्षेत्र में नए द्वार खुलेंगे। वेबसाईट पर विश्व की संस्कृति, साहित्य, परिवेश, परिधान, विरासत, विज्ञान, मनोरंजन, मीडिया आदि विषयों सहित अनेक पाठ्यक्रमों से संबंधित सामग्री ऑडियो के रूप में उपलब्ध होगी। वेबसाईट दिव्यांगों (दृष्टिहीन) को विशेष रूप से अध्ययन-अध्यापन, मनोरंजन एवं सहयोग देने में मील का पत्थर साबित होगी।
          </Text>
        </ListItem.Accordion>
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
