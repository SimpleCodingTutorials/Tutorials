import React, { useState, useEffect, cloneElement } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons'; // Use FontAwesome icons

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10); // Increment by 10ms
      }, 10); // Update every 10ms
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const resetTimer = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <View style={styles.container}>
       <LinearGradient
      colors={['rgba(245, 245, 245, 1)', 'rgba(204, 204, 204, 1)']}
      style={styles.gradient}
    >
      <View style={styles.circle}>
        <Text style={styles.timer}>{formatTime(time)}</Text>
      </View>    
     </LinearGradient>
       <View style={styles.buttons}>
        <TouchableOpacity
          style={[styles.button, isRunning ? styles.stopButton : styles.startButton]}
          onPress={() => setIsRunning(!isRunning)}
        >
          <FontAwesome
            name={isRunning ? 'pause' : 'play'}
            size={20}
            color="white"
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={resetTimer}>
        <FontAwesome name="refresh" size={20} color="white"
 />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const formatTime = (milliseconds) => {
  const mins = Math.floor(milliseconds / 60000);
  const secs = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor((milliseconds % 1000) / 10);
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgb(241 241 241)',
  },
  gradient: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    height: 250,
    borderRadius: "50%", 
    marginBottom: 40,
    borderWidth: 10, // Border thickness
    borderColor: 'lightgray', // Border color
  },
  circle: {
    width: 250, // Circle width
    height: 250, // Circle height
    borderRadius: "50%", 
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
  },
  button: {
    padding: 15,
    margin: 10,
    width:55,
    height:55,
    borderRadius: "50%",
    backgroundColor: 'rgb(103 209 96)',
    justifyContent:"center",
    alignItems:"center"
  },
  startButton: {
    backgroundColor: 'deepskyblue',
  },
  stopButton: {
    backgroundColor: 'rgb(225 0 0)',
  },

});

export default Stopwatch;
