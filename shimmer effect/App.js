import React,{useEffect,useRef} from "react";
import {View,Animated,StyleSheet,Dimensions} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function SkeletonLoader() {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(()=>{
    Animated.loop(
      Animated.timing(shimmerAnim,{
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      })
    ).start();
  },[]);

  const translateX = shimmerAnim.interpolate({
    inputRange: [0,1],
    outputRange: [-SCREEN_WIDTH,SCREEN_WIDTH],
  });

  return (
    <View style={styles.container} >
      <View style={styles.avatar} />
    <View style={styles.textContainer} >
      <View style={styles.textLineFull} />
      <View style={styles.textLineHalf} />
    </View>
    <Animated.View
      style={[
        StyleSheet.absoluteFillObject,
        {transform: [{translateX}]},
      ]}
    >
      <LinearGradient
        colors={['transparent','rgba(255,255,255,0.7)','transparent']}
        start={{x:0,y:0}}
        end={{x:1,y:0}}
        style={styles.shimmer}
      />
    </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    marginTop:60,
    marginHorizontal:20,
    borderRadius:10,
    overflow:"hidden",
    backgroundColor:"#ccc",
    height:140,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16
  },
  avatar:{
    width:70,
    height:70,
    borderRadius:35,
    backgroundColor:"#d1d1d1"
  },
  textContainer:{
    marginLeft:16,
    flex:1,
    justifyContent:"center"
  },
  textLineFull:{
    height:14,
    backgroundColor:"#d1d1d1",
    borderRadius:4,
    marginBottom:18,
    width:"100%"
  },
  textLineHalf:{
    height:14,
    backgroundColor:"#d1d1d1",
    borderRadius:4,
    width:"60%"
  },
  shimmer:{
    width:80,
    height:"100%"
  }
})





















// const styles = StyleSheet.create({
//   container: {
//     marginTop: 60,
//     marginHorizontal: 20,
//     borderRadius: 10,
//     overflow: 'hidden',
//     backgroundColor: '#ccc',
//     height: 140,
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//   },
//   avatar: {
//     width: 70,
//     height: 70,
//     borderRadius: 35,
//     backgroundColor: '#d1d1d1',
//   },
//   textContainer: {
//     marginLeft: 16,
//     flex: 1,
//     justifyContent: 'center',
//   },
//   textLineFull: {
//     height: 14,
//     backgroundColor: '#d1d1d1',
//     borderRadius: 4,
//     marginBottom: 18,
//     width: '100%',
//   },
//   textLineHalf: {
//     height: 14,
//     backgroundColor: '#d1d1d1',
//     borderRadius: 4,
//     width: '60%',
//   },
//   shimmer: {
//     width: 80,
//     height: '100%',
//   },
// });
