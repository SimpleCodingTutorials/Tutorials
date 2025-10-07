import React, {useState} from "react";
import { StyleSheet,Text,View,TouchableOpacity } from "react-native";
import { SwipeListView } from "react-native-swipe-list-view";
import {MaterialIcons} from "@expo/vector-icons";

export default function App() {
  const [listData, setListData] = useState([
    {key: "1", text: "Work", icon: "work"},
    {key: "2", text: "School", icon: "school"},
    {key: "3", text: "Shopping", icon: "shopping-cart"},
    {key: "4", text: "Fitness", icon: "fitness-center"},
    {key: "5", text: "Music", icon: "music-note"},
    {key: "6", text: "TV", icon: "tv"},
    {key: "7", text: "Reading", icon: "book"},

  ]);

  const deleteRow = (rowKey) => {
    const newData = listData.filter((item)=> item.key !== rowKey);
    setListData(newData);
  };
  const archiveRow = (rowKey) => {
    alert(`Archived ${rowKey}`);
  }

  const renderItem = ({item}) => (
    <View style={styles.rowFront} >
      <MaterialIcons name={item.icon} size={24} color="#4caf50" style={styles.itemIcon} />
      <Text style={styles.itemText} >{item.text}</Text>
    </View>
  );
  const renderHiddenItem = ({item}) => (
    <View style={styles.rowBack} >
      <TouchableOpacity
        style={[styles.backBtn, {backgroundColor:"#4caf50"}]}
        onPress={() =>archiveRow(item.key)}
      >
        <MaterialIcons name="archive" size={24} color="#fff" />
        <Text style={styles.backText} >Archive</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backBtn, {backgroundColor:"#f44336"}]}
        onPress={() =>deleteRow(item.key)}
      >
        <MaterialIcons name="delete" size={24} color="#fff" />
        <Text style={styles.backText} >Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container} >
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        leftOpenValue={75}
        contentContainerStyle={{paddingVertical:10}}
      />
    </View>
  );

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#f0f0f0",
    marginTop: 60
  },
  rowFront:{
    flexDirection: "row",
    alignItems: "center",
    backgroundColor:"#fff",
    borderRadius:10,
    marginHorizontal: 15,
    marginVertical: 3,
    padding:20,
    shadowColor: "#000",
    shadowOffset: {width:0,height:2},
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation:3
  },
  itemIcon: {
    marginRight: 15,
  },
  itemText: {
    fontSize: 18
  },
  rowBack:{
    flex:1,
    flexDirection:"row",
    justifyContent:"space-between",
    alignItems:"center",
    marginHorizontal: 15,
    marginVertical: 7,
    borderRadius: 10,
    overflow: "hidden"
  },
  backBtn: {
    width:75,
    height:"100%",
    justifyContent:"center",
    alignItems:"center"
  },
  backText:{
    color: "#fff",
    fontWeight:"bold",
    marginTop:3,
  },
});




















// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f0f0f0",
//     marginTop:60
//   },
//   rowFront: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     marginHorizontal: 15,
//     marginVertical: 3,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.15,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   itemIcon: {
//     marginRight: 15,
//   },
//   itemText: {
//     fontSize: 18,
//   },
//   rowBack: {
//     flex: 1,
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginHorizontal: 15,
//     marginVertical: 7,
//     borderRadius: 10,
//     overflow: "hidden",
//   },
//   backBtn: {
//     width: 75,
//     height: "100%",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   backText: {
//     color: "#fff",
//     fontWeight: "bold",
//     marginTop: 3,
//   },
// });
