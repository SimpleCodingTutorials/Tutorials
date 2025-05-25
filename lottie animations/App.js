import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LottieView from 'lottie-react-native';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function SplashScreen({ navigation }) {
  const animationRef = useRef(null);

  useEffect(() => {
    animationRef.current?.play();
    const timer = setTimeout(() => {
      navigation.replace('Home');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <LottieView
        ref={animationRef}
        source={require('./assets/splash.json')}
        autoPlay
        loop={false}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}

function HomeScreen() {
  const heartRef = useRef(null);
  const secondRef = useRef(null);
  const [liked, setLiked] = useState(false);

  const toggleHeart = () => {
    if (liked) {
      heartRef.current?.play(40, 0);
    } else {
      heartRef.current?.play(0, 40);
    }
    setLiked(!liked);
  };

  const handlePress = () => {
    secondRef.current?.play(0, 60); // adjust frame range
    setTimeout(() => {
      secondRef.current?.reset(); // snap back to first frame
      // or run another function here
    }, 600); // match animation duration
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <TouchableOpacity onPress={toggleHeart}>
        <LottieView
          ref={heartRef}
          source={require('./assets/heart-button.json')}
          loop={false}
          style={{ width: 180, height: 180 }}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={handlePress} style={{ marginTop: 30 }}>
        <LottieView
          ref={secondRef}
          source={require('./assets/button.json')}
          loop={false}
          style={{ width: 400, height: 200 }}
        />
      </TouchableOpacity>
    </View>
  );
}

