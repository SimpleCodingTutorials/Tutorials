import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';

const slides = [
  {
    key: "one",
    title: "Welcome",
    text: "Simple onboarding with React Native",
    image: require("./assets/slide1.png")
  },
    {
    key: "two",
    title: "Fast Setup",
    text: "Built using Expo and ready to go",
    image: require("./assets/slide2.png")
  },
    {
    key: "three",
    title: "Get Started",
    text: "Let's dive in!",
    image: require("./assets/slide3.png")
  },
]

export default function Onboarding({ onDone }) {
  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.text}>{item.text}</Text>
    </View>
  );

  return (
    <AppIntroSlider dotStyle={{backgroundColor: "lightgray"}} activeDotStyle={{backgroundColor: "cornflowerblue"}} renderItem={renderItem} data={slides}
    onDone={onDone} showSkipButton={true}

      renderNextButton={()=>(
        <View style={{paddingHorizontal:12, paddingVertical:6}}>
          <Text style={{color: "black", fontSize:16}}>Next</Text>
        </View>
      )}
      renderDoneButton={()=>(
        <View style={{paddingHorizontal:12, paddingVertical:6}}>
          <Text style={{color: "black", fontSize:16}}>Done</Text>
        </View>
      )}
     renderSkipButton={()=>(
        <View style={{paddingHorizontal:12, paddingVertical:6}}>
          <Text style={{color: "black", fontSize:16}}>Skip</Text>
        </View>
      )}

    />
  );
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  image: {
    width: Dimensions.get('window').width * 1,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
  },
});




















