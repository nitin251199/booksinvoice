import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  ScrollView,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import {ThemeContext} from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const FAQ = ({navigation}) => {
  const {theme} = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';

  const [expanded, setExpanded] = React.useState(false);

  const handleExpand = id => {
    setExpanded(id);
  };

  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ScrollView style={{padding: 20,}}>
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
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                बुक्स इन वॉइस डॉट कॉम का उद्देश्य क्या है?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 1}
          onPress={() => handleExpand(1)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            बुक्स इन वॉइस डॉट कॉम का उद्देश्य हिंदी भाषा की पुस्तकें, कहानी,
            उपन्यास, जीवन परिचय, लेख आदि को ऑडियो रूप में उपलब्ध कराना है।
            वेबसाईट के माध्यम से हिंदी भाषा में लिखित सामग्री का विस्तार ऑडियो
            के रूप में होगा वहीं शिक्षा के क्षेत्र में नए द्वार खुलेंगे। वेबसाईट
            पर विश्व की संस्कृति, साहित्य, परिवेश, परिधान, विरासत, विज्ञान,
            मनोरंजन, मीडिया आदि विषयों सहित अनेक पाठ्यक्रमों से संबंधित सामग्री
            ऑडियो के रूप में उपलब्ध होगी। वेबसाईट दिव्यांगों (दृष्टिहीन) को
            विशेष रूप से अध्ययन-अध्यापन, मनोरंजन एवं सहयोग देने में मील का पत्थर
            साबित होगी।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                ऑडियो सुनने के लिए कहां जाएं?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 2}
          onPress={() => handleExpand(2)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            ऑडियो सुनने के लिए सबसे पहले रजिस्टर कर अपना लॉगिन आईडी बनाएं। लॉगिन
            के बाद आप प्रीमियम ऑडियो सुनने के लिए सब्स‍क्राइब करें। अन्य सभी
            फ्री पुस्तकों को सुनने के लिए सदस्यता ग्रहण करें।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                अपनी पसंदीदा ऑडियो पुस्तक सब्सक्राइब करने के लिए क्या करें?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 3}
          onPress={() => handleExpand(3)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            अपनी पसंदीदा पुस्तक सब्सक्राइब करने के लिए पहले वेबसाईट पर अपना
            अकाउंट बनाएं। अकाउंट बनाने के बाद अपनी पसंदीदा पुस्तक पर क्लिक कर
            निर्धारित धनराशि देकर सब्सक्राइब करें। पुस्तक सब्सक्राइब करने के बाद
            उसे सुनने की समय सीमा निर्धारित होगी।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                क्या इस वेबसाईट पर सभी सामग्री ऑडियो में ही उपलब्ध‍ कराई जाती
                है?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 4}
          onPress={() => handleExpand(4)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            वेबसाईट पर सभी सामग्री ऑडियो रूप में ही उपलब्ध कराई जाती है।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                क्या आप व्यक्ति विशेष या संस्था विशेष के आग्रह पर उसके द्वारा दी
                जा रही सामग्री का ऑडियो उपलब्ध कराते हैं?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 5}
          onPress={() => handleExpand(5)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            व्यक्ति विशेष या संस्था विशेष के आग्रह पर उसके द्वारा दी गई सामग्री
            को जांच के बाद वेबसाईट पर ऑडियो के रूप में उपलब्ध कराते हैं।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                क्या वेबसाईट पर दिव्यांगों (दृष्टिबाधित) के लिए विशेष सुविधा दी
                जा रही है?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 6}
          onPress={() => handleExpand(6)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            बुक्स इन वॉइस डॉट कॉम दिव्यांगजनों के लिए विशेष सामग्री को ऑडियो रूप
            में उपलब्ध करने के लिए प्रतिबद्ध है तथा उनकी विशेष मांग पर उनकी
            मनचाही सामग्री भी उपलब्ध कराते हैं।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                क्या इस वेबसाईट पर ऑडियो सिर्फ हिंदी में ही उपलब्ध है?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 7}
          onPress={() => handleExpand(7)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            वेबसाईट पर सभी ऑडियो सामग्री हिंदी में ही उपलब्ध है। इसका मुख्य
            उद्देश्य हिंदी भाषा को समृद्ध करते हुए उसका प्रचार-प्रसार करना है।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                प्रीमियम ऑडियो क्या है?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 8}
          onPress={() => handleExpand(8)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            वेबसाईट पर उपलब्ध महत्वपूर्ण कृतियां जिनका शुल्क निर्धारित है। उन
            कृतियों को मूल्य देकर निर्धारित समय के लिए सब्सक्राइब कर सुना जा
            सकता है।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                क्या बच्चों के लिए कविता, कहानी का ऑडियो उपलब्ध है?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 9}
          onPress={() => handleExpand(9)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            वेबसाईट पर बच्चों के लिए विशेष रूप से कविता, कहानी का ऑडियो उपलब्ध
            कराया गया है।
          </Text>
        </ListItem.Accordion>
        <ListItem.Accordion
          containerStyle={{backgroundColor: backgroundColor}}
          content={
            <ListItem.Content>
              <ListItem.Title
                style={[
                  styles.text,
                  {
                    color: textColor,
                    fontWeight: 'bold',
                  },
                ]}>
                क्या ऑडियो बुक मेरे करियर में मददगार है?
              </ListItem.Title>
            </ListItem.Content>
          }
          isExpanded={expanded === 10}
          onPress={() => handleExpand(10)}>
          <Text style={{textAlign: 'justify', color: textColor}}>
            ऑडियो बुक जीवन की मुश्किल राहों को आसान बनाती है। इसे आप कभी भी,
            कहीं भी सुनकर किसी भी क्षेत्र में आगे बढ़ सकते हैं साथ ही निश्चित तौर
            पर यह वेबसाईट आपके करियर के लिए मददगार साबित होगी।
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
