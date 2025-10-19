import React, {useState,useEffect} from "react";
import {View,Text,StyleSheet,Dimensions,Button,TextInput,Keyboard,TouchableOpacity} from "react-native";
import { GestureHandlerRootView,GestureDetector,Gesture } from "react-native-gesture-handler";
import { overlay } from "react-native-paper";
import Animated,{useSharedValue,useAnimatedStyle,withSpring,withTiming} from "react-native-reanimated";

const {height} = Dimensions.get("window");
const SHEET_HEIGHT = height * 0.5;


export default function App() {
  const [text,setText] = useState("");
  const y = useSharedValue(SHEET_HEIGHT);
  const ctx = useSharedValue(0);
  const kbOffset = useSharedValue(0);

  useEffect(()=>{
    const show = Keyboard.addListener("keyboardDidShow", e=>{
      kbOffset.value = withTiming(e.endCoordinates.height,{duration:250});
    });
    const hide = Keyboard.addListener("keyboardDidHide",()=>{
      kbOffset.value = withTiming(0,{duration: 250});
    });
    return () => {show.remove(); hide.remove();};
  },[]);

  const gesture = Gesture.Pan()
  .onStart(()=>{ctx.value = y.value;})
  .onUpdate(e=>{
    y.value = Math.max(0,Math.min(SHEET_HEIGHT,ctx.value+e.translationY));
  })
  .onEnd(()=>{
    y.value = withSpring(y.value>SHEET_HEIGHT/2 ? SHEET_HEIGHT : 0);
  });
  const sheetStyle = useAnimatedStyle(()=>({
    transform: [{translateY:y.value - kbOffset.value}],
  }));
  const overlayStyle = useAnimatedStyle(()=>({
    opacity: (1-y.value/SHEET_HEIGHT) * 0.5,
  }));

  const openSheet = () => {y.value = withSpring(0); setText("")};
  const closeSheet = () => y.value = withSpring(SHEET_HEIGHT);
  
  return (
    <GestureHandlerRootView style={{flex: 1}} >
      <View style={styles.container} >
        <Text style={styles.title} >Main Screen</Text>
        <Button title="Open Sheet" onPress={openSheet} />
        <Animated.View style={[styles.overlay,overlayStyle]} pointerEvents="none" />
        <GestureDetector gesture={gesture} >
          <Animated.View style={[styles.sheet,sheetStyle]} >
            <View style={styles.handle} />
            <View style={styles.content}  >
              <Text style={styles.label} >Bottom Sheet</Text>
              <TextInput 
                style={styles.input}
                placeholder="Type here"
                value={text}
                onChangeText={setText}
              />
            </View>
            <View style={styles.closeButtonWrapper} >
              <TouchableOpacity style={styles.closeButton} onPress={closeSheet} >
                <Text style={styles.closeButtonText} >Close</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#eee"
  },
  title:{
    fontSize:22,
    marginBottom:20
  },
  overlay:{
    ...StyleSheet.absoluteFillObject,
    backgroundColor:"#000",
  },
  sheet:{
    position:"absolute",
    bottom:0,
    height:SHEET_HEIGHT,
    width:"100%",
    backgroundColor:"#fff",
    borderTopLeftRadius:20,
    borderTopRightRadius:20,
    elevation:10,
    shadowColor:"#000",
    shadowOffset:{width:0,height:-3},
    shadowOpacity:0.1,
    shadowRadius:6
  },
  handle:{
    width:40,
    height:5,
    borderRadius:3,
    backgroundColor:"#ccc",
    alignSelf:"center",
    marginVertical:10
  },
  content:{
    flex:1,
    padding:4,
    justifyContent:"center",
    alignItems:"center",
  },
  label: {
    fontSize:18,
    marginBottom:10
  },
  input:{
    width:"90%",
    borderColor:"#ccc",
    borderWidth:1,
    borderRadius:8,
    paddingHorizontal:10,
    marginBottom:20
  },
  closeButtonWrapper:{
    width:"90%",
    alignSelf:"center",
    marginBottom:45
  },
  closeButton:{
    backgroundColor:"green",
    paddingVertical:10,
    paddingHorizontal:20,
    borderRadius:10,
    justifyContent:"center",
    alignItems:"center"
  },
  closeButtonText:{
    color:"white",
    fontWeight:"bold",
    fontSize:16
  }
});

























// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' },
//   title: { fontSize: 22, marginBottom: 20 },
//   overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: '#000' },
//   sheet: {
//     position: 'absolute', bottom: 0, height: SHEET_HEIGHT, width: '100%',
//     backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
//     elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.1, shadowRadius: 6,
//   },
//   handle: {
//     width: 40,
//     height: 5,
//     borderRadius: 3,
//     backgroundColor: '#ccc',
//     alignSelf: 'center',
//     marginVertical: 10,
//   },
//   content: { flex: 1, padding: 4, justifyContent: 'center', alignItems: 'center' },
//   label: { fontSize: 18, marginBottom: 10 },
//   input: {
//     width: '90%', height: 40, borderColor: '#ccc', borderWidth: 1,
//     borderRadius: 8, paddingHorizontal: 10, marginBottom: 20,
//   },
//   closeButtonWrapper: {
//     width: '90%',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   closeButton: {
//     backgroundColor: "green",
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 10,
//     justifyContent:"center",
//     alignItems:"center",
//   },
//   closeButtonText: {
//     color: "white",
//     fontWeight: "bold",
//     fontSize: 16
//   }
// });
