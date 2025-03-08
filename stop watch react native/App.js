import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const startTimeRef = useRef(null);

  useEffect(() => {
    let interval;
    if(isRunning) {
      startTimeRef.current = Date.now() - time;
      interval = setInterval(() => {
        const now = Date.now();
        setTime(now - startTimeRef.current);
      },10);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  },[isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <View style={styles.container}>
      <LinearGradient 
        colors={['rgba(245,245,245,1)','rgba(204,204,204,1']}
        style={styles.gradient}
        >
          <View style={styles.circle}>
            <Text style={styles.timer}> {formatTime(time)} </Text>
          </View>
        </LinearGradient>
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.button,isRunning ? styles.stopButton : styles.startButton]}
            onPress={() => setIsRunning(!isRunning)}
            >
              <FontAwesome
                 name = {isRunning ? "pause" : "play"}
                 size = {25}
                 color = "white"
              />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,styles.refreshButton]} onPress={resetTimer}>
              <FontAwesome name="refresh" size={25} color="white" />
            </TouchableOpacity>
        </View>
    </View>
  );

};

const formatTime = (milliseconds) => {
  const mins = Math.floor(milliseconds / 60000);
  const secs = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) /10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2,'0')}.${String(ms).padStart(2,'0')}`;
};

export default Stopwatch;


const styles = StyleSheet.create({
  container: {
      flex:1,
      justifyContent:"center",
      alignItems: "center",
      backgroundColor: "rgb(241,241,241)"
  },
  gradient: {
    justifyContent: "center",
    alignItems: "center",
    width: 250,
    height: 250,
    borderRadius: 125,
    marginBottom: 40,
    borderWidth:10,
    borderColor: "lightgray"
  },
  circle: {
    width:250,
    height:250,
    borderRadius: 125,
    justifyContent: "center",
    alignItems: "center"
  },
  timer: {
    fontSize:36,
    fontWeight:"bold"
  },
  button: {
    padding:15,
    margin:10,
    width:70,
    height:70,
    borderRadius:35,
    justifyContent: "center",
    alignItems: "center"
  },
  buttons: {
    flexDirection: "row"
  },
  startButton: {
    backgroundColor: "#E91E62"
  },
  stopButton: {
    backgroundColor: "#001F3F"
  },
  refreshButton: {
    backgroundColor: "green"
  },
});


















