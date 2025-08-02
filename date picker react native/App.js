import React, { useState } from 'react';
import { View, Button, Text, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function App() {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(Platform.OS === 'ios');
    if (selectedDate) setDate(selectedDate);
  };

  const showMode = (currentMode) => {
    setMode(currentMode);
    setShow(true);
  };

  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  <View style={{ flexDirection: 'row', gap: 10 }} >
    <Button title="Pick Date" onPress={() => showMode('date')} />
    <Button title="Pick Time" onPress={() => showMode('time')} />
  </View>

  <Text style={{ marginTop: 20 }}>{date.toLocaleString()}</Text>
      {show && (
        <DateTimePicker
          value={date}
          mode={mode}
          is24Hour={true}
          display="default"
          onChange={onChange}
        />
      )}
</View>

  );
}
