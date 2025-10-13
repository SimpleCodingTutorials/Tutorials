import React,{useState,useEffect} from "react";
import {View,Text,TouchableWithoutFeedback,StyleSheet,Dimensions,TouchableOpacity} from "react-native";
import Animated, {useSharedValue,useAnimatedStyle,withTiming,interpolate} from "react-native-reanimated";

const symbols = ["🍎","🍌","🍇","🍓","🍍","🥝","🍑","🍒"];
const numColumns = 4;
const screenWidth = Dimensions.get("window").width;
const cardMargin = 8;
const cardSize = (screenWidth - cardMargin*2*numColumns)/numColumns;

export default function App() {
  const [cards, setCards] = useState([]);
  const [selected,setSelected] = useState([]);
  const [matched,setMatched] = useState([]);

  useEffect(()=>resetGame(),[]);

  const resetGame = ()=> {
    const deck = [...symbols,...symbols].sort(()=>Math.random()-0.5).map((symbol,index)=>({
      id:index,
      symbol,
    }));
    setCards(deck);
    setSelected([]);
    setMatched([]);
  };

  const handleSelect = (card) => {
    if(selected.length === 2 || selected.some(c=>c.id === card.id)) return;
    const newSelected = [...selected,card];
    setSelected(newSelected);

    if(newSelected.length === 2) {
      if(newSelected[0].symbol === newSelected[1].symbol) {
        setMatched([...matched,newSelected[0].id,newSelected[1].id]);
        setSelected([]);
      } else {
        setTimeout(()=>setSelected([]),1000);
      }
    }
  };
  return(
    <View style={styles.container} >
      <Text style={styles.title} >Memory Game</Text>
      <View style={styles.grid} >
        {cards.map(card => (
          <Card 
            key={card.id}
            card={card}
            isFlipped={selected.some(c=>c.id === card.id) || matched.includes(card.id)}
            isMatched={matched.includes(card.id)}
            onSelect={()=>handleSelect(card)}
          />
        ))}
      </View>
      <View style={{height:80, justifyContent: "center"}}>
        {matched.length === cards.length && (
          <TouchableOpacity style={styles.resetButton} onPress={resetGame} >
            <Text style={styles.resetText} >Play Again</Text>
          </TouchableOpacity>
        ) }
      </View>
    </View>
  );
}

function Card({card,isFlipped,isMatched,onSelect}) {
   const rotation = useSharedValue(0);
   React.useEffect(()=>{
    rotation.value = withTiming(isFlipped ? 180 : 0, {duration: 400});
   },[isFlipped]);
   const frontStyle = useAnimatedStyle(()=>({
    transform: [{rotateY: `${interpolate(rotation.value,[0,180],[0,180])}deg`}],
    backfaceVisibility: "hidden",
   }));
   const backStyle = useAnimatedStyle(()=>({
    transform:[{rotateY: `${interpolate(rotation.value,[0,180],[180,360])}deg`}],
    backfaceVisibility: "hidden",
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0
   }));
   return (
     <TouchableWithoutFeedback onPress={onSelect} disabled={isMatched} >
        <View style={styles.card} >
          <Animated.View style={[styles.cardFace, frontStyle]} >
            <Text style={styles.symbol} >❓</Text>
          </Animated.View>
          <Animated.View style={[styles.cardFace, backStyle]} >
            <Text style={styles.symbol} >{card.symbol}</Text>
          </Animated.View>
        </View>
     </TouchableWithoutFeedback>
   );
}

const gridHeight = cardSize*4+ cardMargin*2*4;

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    padding:10
  },
  title:{fontSize:24,fontWeight:"bold",marginBottom:20},
  grid: {
    width:screenWidth,
    height:gridHeight,
    flexDirection:"row",
    flexWrap:"wrap",
    justifyContent:"center"
  },
  card:{
    width:cardSize,
    height:cardSize,
    margin:cardMargin,
    perspective:1000,
  },
  cardFace: {
    ...StyleSheet.absoluteFillObject,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor: "#eee",
    borderRadius:10
  },
  resetButton:{
    backgroundColor:"green",
    marginTop: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  resetText:{
    color:"white",
    fontWeight: "bold"
  },
  symbol: {fontSize:40},
});























// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",   // vertical centering
//     alignItems: "center",       // horizontal centering
//     padding: 10,
//   },
//   title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
//   grid: {
//     width: screenWidth,
//     height: gridHeight,
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "center",
//   },
//   card: {
//     width: cardSize,
//     height: cardSize,
//     margin: cardMargin,
//     perspective: 1000,
//   },
//   cardFace: {
//     ...StyleSheet.absoluteFillObject,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#eee",
//     borderRadius: 10,
//   },
//   resetButton: {
//     backgroundColor:"green",
//     marginTop: 20,
//     paddingHorizontal:  20,
//     paddingVertical:  10,
//     borderRadius: 5,

//   },
//   resetText:{
//     color: "white",
//     fontWeight: "bold"
//   },
//   symbol: { fontSize: 40 },
// });
