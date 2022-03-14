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
import { ThemeContext } from './ThemeContext';

const {width, height} = Dimensions.get('window');

export const Disclaimer = ({navigation}) => {

  const { theme } = React.useContext(ThemeContext);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <Image
        source={{
          uri: `https://booksinvoice.com/disclaimer-banner.jpg`,
        }}
        style={styles.image}
      />
      <ScrollView style={{padding: 20, marginBottom: 30}}>
        <Text style={{fontWeight: '800', color: textColor, fontSize: 22}}>
          Disclaimer
        </Text>
        <Text
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            textAlign: 'justify',
            color: textColor,
          }}>
          अगस्त्य वॉइस एंड इंफोटेनमेंट सर्विसेज प्राइवेट लिमिटेड कंपनी हिंदी के
          प्रचार-प्रसार और दिव्यांगजनों की सेवा के लिए संकल्पित है। इससे भी
          महत्वपूर्ण यह है कि बुक्स इन वॉइस डॉट कॉम हिंदी को विश्व भर में
          प्रसारित करने का एक सशक्त माध्यम है। सामग्री के चयन और अपलोड करने से
          पहले रचनाकारों से सहमति ली जाती है। साथ ही बुक्स इन वॉइस डॉट कॉम पर
          अपलोड के माध्यम से भी अनेक प्रकार की रचनाएं प्राप्त होती हैं जिनको
          जांच-परख के बाद वेबसाईट पर अपलोड किया जाता है। इस प्रक्रिया में
          प्रतिलिप्याधिकार संबंधी भूल-चूक हो सकती है। यदि इस संबंध में किसी
          रचनाकार को किसी रचना के संबंध में किसी भी प्रकार की शिकायत है तो वह
          हमें सूचित करें। किसी भी विवाद की स्थिति में न्याय क्षेत्र जबलपुर,
          मध्य प्रदेश, भारत होगा।
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
    height: height * 0.2,
    resizeMode: 'contain',
    display: 'flex',
    justifyContent: 'center',
  },
});
