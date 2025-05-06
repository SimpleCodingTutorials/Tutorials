
import React from "react";
import {Text,StyleSheet,ScrollView} from "react-native";

export default function ResultScreen({route}) {
  const {text} = route.params;
  const cleanedText = text
  .replace(/\n{2,}/g, '\n')
  .replace(/\n/g, ' ');

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Recognized Text</Text>
      <Text selectable style={styles.result}>{cleanedText}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding:20,
    flexGrow:1,
    backgroundColor: "#fff"
  },
  heading: {
    fontSize:18,
    fontWeight: "bold",
    marginBottom: 10
  },
  result: {
    fontSize: 16,
    lineHeight: 22
  }
});




















