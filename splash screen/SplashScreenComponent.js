import { useRef,useEffect } from 'react';
import {View} from "react-native";
import LottieView from 'lottie-react-native';

export default function SplashScreenComponent({navigation}) {
  const animationRef = useRef(null);

  useEffect(()=> {
    animationRef.current?.play();
  },[]);

  return (
    <View style={{flex:1, backgroundColor:'green'}}>
      <LottieView
        ref={animationRef}
        source={require('./assets/splashscreen.json')}
        style={{ flex: 1, width: '100%', height: '100%' }}
        resizeMode="cover"

        autoPlay
        loop={false}
        onAnimationFinish={async()=>{
          navigation.replace("Home");
        }}
      />
    </View>
  );
}























