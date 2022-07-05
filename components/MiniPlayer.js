import React, { useRef } from 'react'
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import TextTicker from 'react-native-text-ticker'

const { width, height } = Dimensions.get('window')


export const MiniPlayer = (props) => {
   const reference = useRef(props.ref)
    // const { theme, song } = React.useContext(ThemeContext)
    
   if(!song)
   {
     return null;
   }

  return (
    <View style={styles.container}>
    <View style={styles.row}>
      <View style={styles.rightContainer}>
        <View style={styles.nameContainer}>
          <TextTicker
          duration={9000}
          loop
          bounce
          repeatSpacer={50}
          marqueeDelay={1000}
          useNativeDriver
           style={styles.title}
           >
             {song?.title}
           </TextTicker>
          <Text style={styles.artist}>{song?.artist}</Text>
        </View>

        <View style={styles.iconsContainer}>
          {/* <AntDesign name="hearto" size={30} color={"white"}/> */}
          <TouchableOpacity>
            <FontAwesome name='pause' size={24} color={"white"}/>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </View>
  )
}


const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#131313',
    width: '100%',
  },
  progress: {
    height: 2,
    backgroundColor: '#ff9000'
  },
  row: {
    flexDirection: 'row',
  },
  image: {
    width: 75,
    height: 75,
    marginRight: 10,
  },
  rightContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  nameContainer: {
    flexDirection: 'column',
    paddingLeft:15,
    paddingVertical:7,
    width: width*0.8,
  },
  iconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:'center',
    width: width*0.2,
    paddingHorizontal:20,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  artist: {
    color: 'lightgray',
    fontSize: 14,
    
  }
})