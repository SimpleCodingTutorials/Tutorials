import React,{useState} from "react";
import {View,Button,Image,StyleSheet} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
    const [imageUri,setImageUri] = useState(null);

    const pickImageFromGallery = async () => {
      const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if(status !== "granted") return;

      const result = await ImagePicker.launchImageLibraryAsync({
        quality:1,
      });

      if(!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    const takePhotoWithCamera = async () => {
      const {status} = await ImagePicker.requestCameraPermissionsAsync();
      if(status !== "granted") return;

      const result = await ImagePicker.launchCameraAsync({
        quality:1,
      });

      if(!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.imageArea} >
          {imageUri && (
            <Image source={{uri: imageUri}} style={styles.image} />
          )}
        </View>
        <View style={styles.buttonContainer} >
          <Button title="Pick from Gallery" onPress={pickImageFromGallery} />
          <View style={{height: 10 }} />
          <Button title="Take Photo" onPress={takePhotoWithCamera} />

        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:20
  },
  imageArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  image: {
    width: "100%",
    height: "90%",
    resizeMode: "contain",
    borderRadius: 10
  },
  buttonContainer: {
    paddingBottom: 20
  },
});























