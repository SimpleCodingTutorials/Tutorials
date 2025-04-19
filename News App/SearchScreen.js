import React, {useState,useEffect} from "react";
import {View,TextInput,FlatList,Text,ActivityIndicator,TouchableOpacity,Image} from "react-native";
import {Menu,Button,Portal,Modal} from "react-native-paper";
import {Feather} from "@expo/vector-icons";

const API_KEY = "023fe94da976437fa6ac5014facd2d53";

const SearchScreen = ({navigation}) => {
  const [query,setQuery] = useState("");
  const [results,setResults] = useState([]);
  const [loading,setLoading] = useState(false);
  const [visible1,setVisible1] = useState(false);
  const [visible2,setVisible2] = useState(false);
  const [selectedTime,setSelectedTime] = useState("All Time");
  const [selectedSort,setSelectedSort] = useState("Newest");

  useEffect(()=> {
    fetchNews();
  },[selectedTime,selectedSort]);

  const getDateRange = () => {
    const today = new Date();
    let fromDate;

    if(selectedTime === "Last 30 Days") {
      fromDate = new Date();
      fromDate.setDate(today.getDate()-30);
    } else if (selectedTime === "Last 7 Days") {
      fromDate = new Date();
      fromDate.setDate(today.getDate()-7);     
    } else if (selectedTime === "Today") {
      fromDate = new Date();
    }
    return fromDate ? fromDate.toISOString().split("T")[0] : "";
  };

  const fetchNews = async () => {
    if(!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      let sortByParam = "publishedAt";
      if(selectedSort === "Most Popular") {
        sortByParam = "popularity";
      }
      let fromDate = getDateRange();
      let url = `https://newsapi.org/v2/everything?q=${query}&sortBy=${sortByParam}&apiKey=${API_KEY}`;
      if(fromDate) {
        url+=`&from=${fromDate}`;
      }
      const response = await fetch(url);
      const data = await response.json();
      let filteredResults = data.articles || [];

      if(selectedSort === "Oldest") {
        filteredResults.reverse();
      }
      setResults(filteredResults);
    } catch(error) {
      console.error("Error fetching news:",error);
    }
    setLoading(false);
  };

return (
  <View style={{flex:1, padding:10, alignItems:"center"}}>
      <View style={{flexDirection:"row", paddingHorizontal:30, borderColor: "gray", width:"90%", borderRadius: 5, borderWidth:1}}>
        <TextInput
          style={{
            height:40,
            width: "100%"
          }}
          placeholder="Search news..."
          value={query}
          onChangeText={(text)=> setQuery(text)}
        />
        <TouchableOpacity onPress={fetchNews} style={{
          height:40,justifyContent: "center",
        }}>
          <Feather name="search" size={24} color={"black"}/>         
        </TouchableOpacity>
    </View>
    <View style={{flexDirection:"row",justifyContent: "space-between", padding:10,width: "90%"}}>
      <Button onPress={()=>setVisible1(true)}>{selectedTime}</Button>
      <Button onPress={()=>setVisible2(true)}>{selectedSort}</Button>
    </View>
    {loading && <ActivityIndicator size="large" color="blue" />}
    <FlatList style= {{width:"100%"}}
      data={results}
      keyExtractor={(item,index)=>index.toString()}
      renderItem={({item})=>(
        <TouchableOpacity
          style={{
            flexDirection: "row",
            padding:10,
            borderBottomWidth:1,
            borderColor: "#ddd"
          }}
          onPress={()=> navigation.navigate("Details",{article:item})}
        >
          {item.urlToImage && (
            <Image
              source={{uri:item.urlToImage}}
              style={{width:80, height:80, borderRadius:5, marginRight:10}}
              />
          )}
          <View style={{flex:1}} >
            <Text style={{fontSize:16, fontWeight:"bold"}}>{item.title}</Text>
            <Text style={{fontSize:14, color: "gray"}}>{item.source.name}</Text>
          </View>
        </TouchableOpacity>
      )}
    />

  <Portal>
    <Modal visible={visible1} onDismiss={()=>setVisible1(false)} contentContainerStyle={{position:"absolute",bottom:0,width:"100%",backgroundColor:"white", padding:10,borderRadius:10}} >
        <Menu.Item onPress={()=>{setSelectedTime("All Time"); setVisible1(false);}} title ="All Time" />
        <Menu.Item onPress={()=>{setSelectedTime("Last 30 Days"); setVisible1(false);}} title ="Last 30 Days" />
        <Menu.Item onPress={()=>{setSelectedTime("Last 7 Days"); setVisible1(false);}} title ="Last 7 Days" />
        <Menu.Item onPress={()=>{setSelectedTime("Today"); setVisible1(false);}} title ="Today" />
    </Modal>
    <Modal visible={visible2} onDismiss={()=>setVisible2(false)} contentContainerStyle={{position:"absolute",bottom:0,width:"100%",backgroundColor:"white", padding:10,borderRadius:10}} >
        <Menu.Item onPress={()=>{setSelectedSort("Newest"); setVisible2(false);}} title ="Newest" />
        <Menu.Item onPress={()=>{setSelectedSort("Most Popular"); setVisible2(false);}} title ="Most Popular" />
    </Modal>

  </Portal>
   
  </View>
);
}

export default SearchScreen;





















