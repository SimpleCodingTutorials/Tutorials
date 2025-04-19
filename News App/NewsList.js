import React, {useEffect,useState} from "react";
import {View, Text, FlatList, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {Image} from "react-native";
import {Feather} from "@expo/vector-icons";

const API_KEY = "023fe94da976437fa6ac5014facd2d53";

const NewsList = () => {
  const [news, setNews] = useState([]);
  const navigation = useNavigation();

  useEffect(()=> {
    const fetchNews = async () => {
      try {
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=us&pageSize=50&apiKey=${API_KEY}`
        );
        const data = await response.json();
        setNews([...data.articles]);
      } catch (error) {
        console.error(error);
      }
    };
     fetchNews();
  },[]);


  const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString))/1000);
    const intervals = {year: 31536000, month: 2592000, week: 604800, day: 86400, hour: 3600};

    if(seconds<intervals.day) return `${Math.floor(seconds/intervals.hour)} hours ago`;

    for (let [unit, value] of Object.entries(intervals)) {
      if(seconds >= value) return `${Math.floor(seconds/value)} ${unit}s ago`;
    }
    return "Just now";
  };

  return (
    <View style= {{flex: 1}} >
      <FlatList 
        data={news}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item})=>(
          <TouchableOpacity
            onPress={()=> navigation.navigate("Details", {article: item})}
            style = {{
              padding:10,
              marginBottom:10,
              backgroundColor: "#f8f8f8",
              borderRadius: 5,
            }}
          >
            {item.urlToImage && (
              <Image
                source={{uri: item.urlToImage}}
                style = {{width: "100%", height:200, borderRadius: 5}}
              />
            )}
            <Text style={{fontSize:16, fontWeight: "bold", marginTop:5}} >
              {item.title}
            </Text>
            <Text style={{fontSize:12, color: "green", marginTop:5}} >
              {item.source.name+" / "+timeAgo(item.publishedAt)}
            </Text>
          </TouchableOpacity>
        )}
        showsVerticalScrollIndicator = {true}
        contentContainerStyle = {{
          paddingBottom: 70
        }}
      />
      <View
        style={{
          position: "fixed",
          bottom: 0,
          left:0,
          right:0,
          height:60,
          backgroundColor: "whitesmoke",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          zIndex:1,
        }}
      >
        <TouchableOpacity onPress={()=>navigation.navigate("Search")}>
            <Feather name="search" size={24} color="black" />
        </TouchableOpacity>

      </View>

    </View>
  );
};

export default NewsList;






















