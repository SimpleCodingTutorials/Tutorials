import {View,Text,StyleSheet} from "react-native";

function HomeScreen({navigation}) {
  return (
    <View style={styles.container} >
      <Text style={styles.title} >Welcome to the Home Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center"

  },
});

export default HomeScreen;



















