import React, {useRef,useState,useEffect} from "react";
import {View,Button,StyleSheet,ActivityIndicator,Pressable,Image} from "react-native";
import { CameraView,useCameraPermissions } from "expo-camera";
import TextRecognition from "@react-native-ml-kit/text-recognition";


export default function CameraScreen({navigation}) {
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing,setIsProcessing] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const cameraRef = useRef(null);

  useEffect(()=>{
    if(!permission?.granted) {
      requestPermission();
    }
  },[permission]);

  const takePicture = async ()=> {
    if(!cameraRef.current) return;

    const photo = await cameraRef.current.takePictureAsync();
    setPhotoUri(photo.uri);
    setIsProcessing(true);

    try {
      const result = await TextRecognition.recognize(photo.uri);
      navigation.navigate("Result", {text: result.text});
    } catch (err) {
      navigation.navigate("Result", {text: "Error: " + JSON.stringify(err)});
    } finally {
      setIsProcessing(false);
    }
  };

  if(!permission?.granted) {
    return (
      <View style={styles.centered}>
        <Button title="Request Camera Permission" onPress={requestPermission} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {photoUri && isProcessing ? (
        <Image source={{uri:photoUri}} style={styles.camera} resizeMode="cover" />
      ) : (
        <CameraView ref={cameraRef} style={styles.camera} facing="back" />
      )}
      <View style={styles.controls}>
         {isProcessing && <ActivityIndicator size="large" color="#888888" />}
         <Pressable onPress={takePicture} style={styles.button}></Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1},
  camera: {flex: 1},
  controls:{
    position: "absolute",
    bottom: 40,
    width: "100%",
    alignItems: "center"
  },
  centered: {
    flex:1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    backgroundColor: "white",
    width: 75,
    height:75,
    borderRadius: "50%",
    borderWidth:5,
    borderColor:"#595a59"
  }
});


















