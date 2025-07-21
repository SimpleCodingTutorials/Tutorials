import { useFonts,Inter_400Regular,Inter_700Bold } from '@expo-google-fonts/inter';
import { Montserrat_400Regular,Montserrat_700Bold } from '@expo-google-fonts/montserrat';
import {Text,View} from 'react-native';

export default function App() {
  const [fontsLoaded] = useFonts({
    "MyCustomFont": require("./assets/customfont.ttf"),
    Inter_400Regular,
    Inter_700Bold,
    Montserrat_400Regular,
    Montserrat_700Bold
  });

  if(!fontsLoaded) {
    return null;
  }

  return (
    <View style={{flex:1, justifyContent: "center", alignItems: "center"}} >
      <Text style={{fontFamily:"Inter_400Regular",fontSize:20}} >Regular Text</Text>
     <Text style={{fontFamily:"Inter_700Bold",fontSize:40}} >Bold Text</Text>
 <Text style={{fontFamily:"Montserrat_400Regular",fontSize:20}} >Regular Text</Text>
     <Text style={{fontFamily:"Montserrat_700Bold",fontSize:40}} >Bold Text</Text>
    <Text style={{fontFamily:"MyCustomFont",fontSize:40}} >Custom Font</Text>

    </View>
  );

}  
































