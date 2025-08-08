import React, {useState} from "react";
import {View,Text} from "react-native";
import Onboarding from "./Onboarding";

export default function App() {
  const [showRealApp, setShowRealApp] = useState(false);
  if(!showRealApp) {
    return <Onboarding onDone={()=> setShowRealApp(true)} />;
  }

  return (
    <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
      <Text style={{fontSize:32}}> Main App Content</Text>
    </View>
  );
}
























