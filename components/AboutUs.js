import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const AboutUs = ({navigation}) => {

  const { theme } = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
  
      <Image
        source={{
          uri: `https://booksinvoice.com/about-us-banner.png`,
        }}
        style={styles.image}
      />
      <ScrollView style={{padding: 20}} showsVerticalScrollIndicator={false}>
        <Text style={{fontWeight: '800', color: textColor, fontSize: 22}}>
          About Us
        </Text>
        <Text
          style={{
            paddingTop: 10,
            paddingBottom:10,
            textAlign: 'justify',
            color: textColor
          }}>
          अगस्त्य वॉइस एंड इंफोटेनमेंट सर्विसेज प्राइवेट लिमिटेड कंपनी की
          स्थापना शिक्षा एवं मनोरंजन के क्षेत्र में डिजिटल क्रांति, भारतीय
          इतिहास और विश्व संस्कृति की जानकारी श्रव्य माध्यम में उपलब्ध कराने
          हेतु की गई है। किसी भी देश के विकास में नागरिक का योगदान महत्वपूर्ण
          होता है क्योंकि कुल जनसंख्या की आय के आधार पर विकासशील या विकसित होने
          का पैमाना माना जाता है। आधुनिक युग में डिजिटल तकनीक के क्षेत्र में
          क्रांति आई है। जिसका प्रभाव रोजमर्रा की जरूरतों से लेकर अध्ययन-अध्यापन
          के क्षेत्र में भी देखा जा रहा है। इसी डिजिटल क्रांति को लेकर भारतीय
          प्रधानमंत्री ने देश को डिजिटल इंडिया बनाने का सपना देखा है। शिक्षा के
          क्षेत्र में डिजिटल क्रांति के सपने को साकार करने का प्रयास है। शिक्षा
          के डिजिटलीकरण से शिक्षा की पहुंच सबके पास होगी। शिक्षा पर किसी एक
          व्यक्ति का एकाधिकार नहीं रह जाएगा। 2011 की जनगणना के अनुसार कुल
          दिव्यांगजनों की संख्या 2 करोड़ 68 लाख 10 हजार 577 है। इसमें से 50 लाख
          32 हजार 463 लोग दृष्टिहीन हैं। आज भी भारत की लगभग 25 प्रतिशत जनसंख्या
          शिक्षा से वंचित है। जबकि वैश्विक स्तर पर शिक्षा से वंचितों की संख्या
          और भी ज्यादा है। ऐसे में शिक्षा के साथ-साथ मनोरंजन के स्तर को बढ़ाने
          के लिए सभी विषयों की पुस्तकों को ऑडियो रूप में लाने का प्रयास है।
          पर्याप्त संसाधन व समय नहीं होने के कारण बहुत से लोग पुस्तकों का अध्ययन
          नहीं कर पाते हैं। अध्ययन के क्षेत्र में इस तरह की समस्याओं को ध्यान
          में रखते हुए अगस्त्य वॉइस एंड इंफोटेनमेंट सर्विसेज प्राइवेट लिमिटेड
          कंपनी बुक्स इन वॉइस डॉट कॉम के माध्यम से हिंदी में लिखित समस्त प्रकार
          की रचित सामग्री को ऑडियो रूप में निर्मित कर रही है। जिसे आसानी से
          बुक्स इन वॉइस डॉट कॉम पर सुना जा सकता है।
        </Text>
        <Text style={{fontWeight: '800', color: textColor, fontSize: 22}}>
          Mission
        </Text>
        <Text
          style={{
            paddingVertical: 20,
            textAlign: 'justify',
            color: textColor
          }}>
              अगस्त्य वॉइस एंड इंफोटेनमेंट सर्विसेज प्राइवेट लिमिटेड कंपनी विश्वभर में हिंदी को समृद्ध
                            करने और हिंदी के प्रचार-प्रसार हेतु कार्य कर रही है। शिक्षा के क्षेत्र में कंपनी विश्व
                            समुदाय को हिंदी में रचित साहित्य से परिचित कराने की दिशा में प्रयासरत है। इसके अंतर्गत
                            भारत एवं विश्व की महान विभूतियों द्वारा रचित ग्रंथों को स्वर माध्यम में रिकॉर्ड कर विश्व
                            समुदाय तक उसकी पहुँच को आसान बनाने के लिए प्रयास कर रही है। विशेष रूप से पढ़ने में
                            असमर्थ एवं दिव्यांग (दृष्टिहीन) व्यक्तियों को विश्व की सभ्यता, संस्कृति और साहित्य से
                            अवगत कराना है। अब घर बैठे एक क्लिक से आप किसी भी पुस्तक को सुन सकते हैं। डिजिटल तकनीक के
                            कदम से कदम मिलाकर चलने के लिए पुस्तक, उपन्यास, कविता, शहर के प्रसिद्ध स्थलों का परिचय
                            ऑडियो फॉर्मेट में उपलब्ध कराना है।
          </Text>
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
