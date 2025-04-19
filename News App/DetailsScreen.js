import React from "react";
import { View,Text,ScrollView,Image,TouchableOpacity,Linking,Share,SafeAreaView  } from "react-native";

const formatDate = (dateString) => {
  const options = {year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12:true};
  return new Date(dateString).toLocaleString("en-US",options);
};


const DetailsScreen = ({route})=> {
  const {article} = route.params;
  const shareArticle = async () => {
    try {
      await Share.share({
        message: `${article.title}\n\nRead more: ${article.url}`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const openWebsite = () => {
    if(article.url) {
      Linking.openURL(article.url);
    }
  };


  return(
    <SafeAreaView style={{flex: 1}}>
      <View style={{flex: 1}}>
      <ScrollView style={{flex:1, padding: 10,paddingBottom:20}} contentContainerStyle={{paddingBottom: 20}}>
        <Text style={{fontSize: 22, fontWeight: "bold", marginBottom: 10}}>
          {article.title}
        </Text>
        <Text style={{fontSize: 14, marginBottom: 10}}>
          <Text>{article.source.name}</Text>
            <Text style={{color: "#757575"}}>
                {" / by "}{article.author || "Unknown"}{" / "}{formatDate(article.publishedAt)}
            </Text>
        </Text>
        {article.urlToImage && (
          <Image
            source={{uri: article.urlToImage}}
            style={{width: "100%", height:200, borderRadius: 5}}
          />
        )}
        <Text style={{fontSize:16}}>{article.content || "No Description available"}</Text>
        <View style={{flexDirection: "row", marginTop:40, justifyContent:"space-between"}}>
          <TouchableOpacity onPress={shareArticle} style={{flex:1,backgroundColor:"#f5f5f5", padding:10,borderRadius:5,marginRight:5,alignItems:"center",borderColor:"black",borderWidth:1}}>
            <Text style={{color:"black",fontSize:16}}>Share</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={openWebsite} style={{flex:1,backgroundColor:"#f5f5f5", padding:10,borderRadius:5,marginLeft:5,alignItems:"center",borderColor:"black",borderWidth:1}}>
            <Text style={{color:"black",fontSize:16}}>Visit Website</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DetailsScreen;





















