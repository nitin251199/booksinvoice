import React from 'react';
import {StyleSheet, View, Text, Dimensions, ScrollView} from 'react-native';

const {width, height} = Dimensions.get('window');

export const JoinUs = ({navigation}) => {
  const theme = useSelector(state => state.theme);

  const textColor = theme === 'dark' ? '#FFF' : '#191414';
  const backgroundColor = theme === 'dark' ? '#212121' : '#FFF';
  return (
    <View style={[styles.container, {backgroundColor: backgroundColor}]}>
      <ScrollView style={{padding: 20, marginBottom: 30}}>
        <Text style={{fontWeight: '800', color: textColor, fontSize: 24}}>
          Join Us
        </Text>
        <Text
          style={{
            paddingTop: 10,
            textAlign: 'justify',
            fontSize: 18,
            color: textColor,
          }}>
          Your Idea We Care
        </Text>
        <Text
          style={{
            paddingTop: 10,
            paddingBottom: 10,
            textAlign: 'justify',
            color: textColor,
          }}>
          AVIS (अगस्त्य वॉइस एंड इनफोटेनमेंट सर्विसेस प्रा.लि.) आपके विचारों का।
          सम्मान करते हुए उन्हें आगे बढ़ाने का प्रयास करती है। हम आपकी नई सोच और
          नए विचारों को अपनाने के लिए सदैव तत्पर रहते हुए आगे बढ़ने का प्रयास
          करते हैं। एक परिवार की तरह आपकी सफलता में हम अपनी सफलता को देखते हैं।
          Join our Hindi family विश्व में दूसरी सबसे ज्यादा बोली जाने वाली भाषा
          होने के बाद भी हिंदी साहित्य के प्रचार-प्रसार में कुछ कमी रही, आईए
          इसको गति प्रदान करें। हमारे साथ एक परिवार के रूप में जुड़ कर इस दिशा
          में आगे बढ़ने का सुनहरा अवसर AVIS | (अगस्त्य वॉइस एंड इनफोटेनमेंट
          सर्विसेस प्रा.लि.) उपलब्ध करवा रहा है। Hindi Language in World Market
          आपके विचारों को विश्व तक पहुंचाने के लिए एक मंच उपलब्ध कराते हैं। आईए
          हमारे साथ हिंदी को सुदृढ करने की इस मुहिम में भागीदार बनिए। किसी भी
          विचार को विश्व पटल पर रखने के लिए माध्यम की आवश्यकता होती है। ध्वनि
          ऐसा । माध्यम है जो सदियों से मानव जाति को सशक्त और समग्र बनाते आ रहा
          है।। आचार्य विनोबा ने जबलपुर की धरती को संस्कारधानी के नाम से नवाजा
          था, उसी धरा पर इस मुहीम की शुरूआत AVIS ने की है। हमारा उद्देश्य
          विश्वभर के । शैक्षणिक संस्थानों तक पहुँच कर हिंदी को बढ़ाना है। यह वे
          संस्थान है जहाँ हमारा युवा आज के समय में ज्ञान वर्धन के लिए जाता है,
          ज्ञान हासिल करने के लिए। किसी भी मुसीबत से लड़ने को तैयार दृष्टिबाधित
          लोगों के जज्बे को ख्याल में रखते हुए यह मुहीम एक मील का पत्थर साबित
          होगी।।
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
