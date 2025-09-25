import React,{useState,useRef,useEffect} from "react";
import {View,TouchableOpacity,StyleSheet,Animated} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function App() {
  const [open, setOpen] = useState(false);
  const radius = 100;
  const angles = [90,135,180];
  const icons = ["camera-alt","edit","mic"];

  const animations = useRef(
    angles.map(()=>({
      translate: new Animated.Value(0),
      opacity:new Animated.Value(0),
    }))
  ).current;

  const getPosition = (angle) => {
    const rad = (angle*Math.PI)/180;
    return {x:radius*Math.cos(rad),y:-radius*Math.sin(rad)};
  };

  useEffect(()=>{
    const sequence = animations.map(({translate,opacity})=>{
      const toValue = open ? 1:0;
      return Animated.parallel([
        Animated.timing(translate,{
          toValue,
          duration:open ? 200 : 150,
          useNativeDriver : true
        }),
        Animated.timing(opacity,{
          toValue,
          duration:open ? 200 : 150,
          useNativeDriver:true
        }),
      ]);
    });
    Animated.stagger(50,open ? sequence : sequence.reverse()).start();
  },[open]);


  return (
    <View style={styles.container} >
      <View style={styles.overlay} >
        {angles.map((angle,i)=> {
          const {x,y} = getPosition(angle);
          const translate = animations[i].translate.interpolate({
            inputRange: [0,1],
            outputRange: [0,1],
          });
          return (
            <Animated.View
              key={i}
              style = {[
                styles.option,
                {
                  transform: [
                    {translateX: Animated.multiply(translate,x)},
                    {translateY: Animated.multiply(translate,y)},
                  ],
                  opacity:animations[i].opacity,
                },
              ]}
            >
              <TouchableOpacity style={styles.optionInner} >
                <MaterialIcons name={icons[i]} size={20} color="dodgerblue" />
              </TouchableOpacity>
            </Animated.View>
          );
        })}
      </View>
      <TouchableOpacity style={styles.fab} onPress={()=>setOpen(!open)}  >
        <MaterialIcons name={open ? "close" :"add"} size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent: "flex-end",
    alignItems: "flex-end",
    padding: 24,
    backgroundColor: "#e7e7e7"
  },
  fab:{
    width:60,
    height:60,
    borderRadius:30,
    backgroundColor: "dodgerblue",
    justifyContent:"center",
    alignItems: "center",
    zIndex:2
  },
  overlay: {
    position: "absolute",
    bottom: 24,
    right:24,
    width:40,
    height:40,
    alignItems: "center",
    justifyContent: "center"
  },
  option:{
    position:"absolute",
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    justifyContent: "center"
  },
  optionInner: {
    width:50,
    height:50,
    borderRadius:25,
    backgroundColor:"#ffffff",
    justifyContent:"center",
    alignItems: "center",
    borderWidth:1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: {width:2 ,height:3},
    shadowOpacity: 0.25,
    shadowRadius:4,
    elevation:6
  }
});





















