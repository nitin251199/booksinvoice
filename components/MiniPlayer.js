import React, { useRef } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import RBSheet from 'react-native-raw-bottom-sheet'
import SwipeUpDown from 'react-native-swipe-up-down'



export const MiniPlayer = (props) => {
   const reference = useRef(props.ref)
    

  return (
      <View
    style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
      }}
    >
      <RBSheet
        ref={reference}
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          wrapper: {
            backgroundColor: "transparent"
          },
          draggableIcon: {
            backgroundColor: '#FFF',

          },
          container: {backgroundColor: '#FFD369',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,},
        }}
        height={300}
      >
        <View style={{width:'100%', backgroundColor: '#FFD369', borderTopLeftRadius: 20, borderTopRightRadius: 20,}}>
            <Text>HIII</Text>
        </View>
        </RBSheet>
    </View>
  )
}
