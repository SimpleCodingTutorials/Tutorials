import React,{useState,useEffect,useRef} from "react";
import {View,Text,TouchableOpacity,StyleSheet,Modal,TextInput} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {Audio} from "expo-av";

export default function App() {
  const [whiteTime,setWhiteTime] = useState(300);
  const [blackTime,setBlackTime] = useState(300);
  const [activePlayer,setActivePlayer] = useState(null);
  const [isRunning,setIsRunning] = useState(false);
  const [whiteMoves,setWhiteMoves] = useState(0);
  const [blackMoves,setBlackMoves] = useState(0);
  const [modalVisible,setModalVisible] = useState(false);
  const [editingPlayer,setEditingPlayer] = useState(null);
  const [inputMinutes,setInputMinutes] = useState("5");
  const [inputSeconds,setInputSeconds] = useState("0");
  const [inputIncrement,setInputIncrement] = useState("0");
  const [incrementSeconds,setIncrementSeconds] = useState(0);


  const intervalRef = useRef(null);
  const [clickSound, setClickSound] = useState(null);

  useEffect(() => {
    const loadSound = async () => {
      const {sound} = await Audio.Sound.createAsync(
        require("./assets/click.mp3")
      );
      setClickSound(sound);
    };
    loadSound();
    return () => {
      if(clickSound) clickSound.unloadAsync();
    };
  },[]);

  const playClick = async () => {
    if(clickSound) await clickSound.replayAsync();
  };

  useEffect(()=> {
    if(isRunning && activePlayer) {
      intervalRef.current = setInterval(()=>{
        if(activePlayer === "white") setWhiteTime((t)=> Math.max(t-1,0));
        else setBlackTime((t)=>Math.max(t-1,0));
      },1000);
    }
    return () => clearInterval(intervalRef.current);
  },[isRunning,activePlayer]);

  useEffect(()=> {
    if(whiteTime ===0 || blackTime === 0) {
      setIsRunning(false);
      setActivePlayer(null);
    }
  },[whiteTime,blackTime]);

  const switchTurn = (player) => {
    if(!isRunning) return;
    if(player !== activePlayer) return;
    if(player === "white") {
      playClick();
      setWhiteMoves((m)=> m+1);
      setActivePlayer("black");
      setWhiteTime((t)=>t+incrementSeconds);
    } else if (player === "black") {
      playClick();
      setBlackMoves((m)=> m+1);
      setActivePlayer("white");
      setBlackTime((t)=>t+incrementSeconds);
    }
  };
  const toggleRun = () => {
    if(!isRunning) {
      const noMoves = whiteMoves === 0 && blackMoves === 0;
      const nextPlayer = noMoves
      ? "white"
      :whiteMoves>blackMoves
      ? "black"
      : "white";
      if(
        (nextPlayer === "white" && whiteTime === 0) ||
        (nextPlayer === "black" && blackTime === 0)
      )
      return;
      setActivePlayer(nextPlayer);
      setIsRunning(true);
      return;
    }
    setIsRunning(false);
    setActivePlayer(null);
  };

  const resetGame = () => {
    const total = parseInt(inputMinutes || "5")*60;
    setWhiteTime(total);
    setBlackTime(total);
    setWhiteMoves(0);
    setBlackMoves(0);
    setActivePlayer(null);
    setIsRunning(false);
    setIncrementSeconds(parseInt(inputIncrement || "0"));
  };
  const formatTime = (seconds) => {
    const h = Math.floor(seconds/3600);
    const m =Math.floor((seconds%3600)/60);
    const s = seconds % 60;
    if(h>0)
      return `${h}:${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
    return `${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
  };

  const openAdjustTime = (player) => {
    setEditingPlayer(player);
    setModalVisible(true);
    setInputMinutes("");
    setInputSeconds("");
    setInputIncrement("");
  };

  const saveAdjustTime = () => {
    const totalSeconds = parseInt(inputMinutes || "0") * 60+ parseInt(inputSeconds || "0");
    if(editingPlayer === "white") setWhiteTime(totalSeconds);
    else if (editingPlayer === "black") setBlackTime(totalSeconds);
    else resetGame();
    setModalVisible(false);
    setEditingPlayer(null);
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.timer,
          activePlayer === "white" && styles.active,
          whiteTime === 0 && styles.timeUp,
        ]}
        onPress={() => switchTurn("white")}
      >
        <View style={{alignItems:"center", marginTop: 10}} >
          <TouchableOpacity disabled={isRunning} onPress={()=> openAdjustTime("white")} >
            <Ionicons name="options-outline" size={32} color="black" style={{transform:[{rotate:"180deg"}], opacity: isRunning? 0 : 0}} />
          </TouchableOpacity>
        </View>

        <Text
          style={[
            styles.timerText,
            activePlayer === "white" && styles.activeText,
            {transform: [{rotate: "180deg"}]},
          ]}
        >
          {formatTime(whiteTime)}
        </Text>
        <Text style={[
          styles.moveCount,
          {
            transform: [{rotate: "180deg"}],
            bottom: 15,
            left: 15,
            top:undefined,
            right: undefined
          },
        ]} >
           Moves:{whiteMoves} 
        </Text>
      </TouchableOpacity>
      <View style={styles.controlBar}  >
        <TouchableOpacity onPress={toggleRun} >
          <Ionicons
            name={isRunning ? "pause": "play"}
            size={32}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={resetGame} >
          <Ionicons
            name="refresh"
            size={32}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>{setModalVisible(true);setEditingPlayer(null);setInputMinutes("");setInputSeconds("");setInputIncrement("");}} >
          <Ionicons
            name="settings"
            size={32}
            color="white"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[
          styles.timer,
          activePlayer === "black" && styles.active,
          blackTime === 0 && styles.timeUp,
        ]}
        onPress={() => switchTurn("black")}
      >
     
        <Text
          style={[
            styles.timerText,
            activePlayer === "black" && styles.activeText,         
          ]}
        >
          {formatTime(blackTime)}
        </Text>
        <View style={{alignItems:"center", marginTop: 10}} >
          <TouchableOpacity disabled={isRunning} onPress={()=> openAdjustTime("black")} >
            <Ionicons name="options-outline" size={32} color="black" style={{transform:[{rotate:"0deg"}], opacity: isRunning? 0 : 0}} />
          </TouchableOpacity>
        </View>
        <Text style={styles.moveCount} >
           Moves:{blackMoves} 
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide" >
          <View style={styles.modalContainer} >
            <View style={[styles.modalContent,editingPlayer === "white" && {transform:[{rotate:"180deg"}]}]} >
              <Text>{editingPlayer ? `Adjust ${editingPlayer} time:` : "Set Game Time:"}</Text>
              <TextInput style={styles.input} keyboardType="number-pad" placeholder="Minutes" value={inputMinutes} onChangeText={setInputMinutes} />
              {editingPlayer &&   <TextInput style={styles.input} keyboardType="number-pad" placeholder="Seconds" value={inputSeconds} onChangeText={setInputSeconds} />}
              {!editingPlayer &&   <TextInput style={styles.input} keyboardType="number-pad" placeholder="Increment (seconds)" value={inputIncrement} onChangeText={setInputIncrement} />}
              <TouchableOpacity style={[styles.modalButton, {backgroundColor:"#1fd1c2"}]} onPress={saveAdjustTime} >
                <Text style={styles.modalButtonText} >{editingPlayer ? "Save Time" : "Save & Reset"}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, {backgroundColor:"#1fd1c2"}]} onPress={()=>{setModalVisible(false);setEditingPlayer(null);}} >
                <Text style={styles.modalButtonText} >Cancel</Text>
              </TouchableOpacity>
              
            </View>
          </View>
      </Modal>

    </View>
  );

}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#f0f0f0",
    justifyContent:"center"
  },
  timer:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    opacity:0.5
  },
  active:{
    backgroundColor:"#1fd1c2",
    opacity:1
  },
  timeUp:{
    backgroundColor:"red"
  },
  timerText:{
    fontSize:70,
    fontWeight:"bold"
  },
  activeText:{
    color:"white"
  },
  moveCount:{
    position:"absolute",
    top: 15,
    right: 15,
    fontSize: 16,
    fontWeight: "bold",
    color:"black",
    opacity: 0.5
  },
  controlBar:{
    flexDirection:"row",
    justifyContent:"space-around",
    alignItems:"center",
    paddingVertical: 10,
    backgroundColor: "#3f4545"
  },
  modalContainer:{
    flex:1,
    justifyContent:"center",
    backgroundColor:"rgba(0,0,0,0.5)",
  },
  modalContent:{
    margin:20,
    padding:20,
    backgroundColor:"white",
    borderRadius:10
  },
  input: {
    borderWidth:1,
    borderColor:"#ccc",
    marginVertical:10,
    padding:10,
    borderRadius:5
  },
  modalButton:{
    padding:12,
    borderRadius:8,
    marginTop:10,
    alignItems:"center",
    backgroundColor:"#1fd1c2",
  },
  modalButtonText:{
    color:"white",
    fontWeight:"bold"
  }
});




































