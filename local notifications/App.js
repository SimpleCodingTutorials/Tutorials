import React, { useEffect, useRef } from 'react';
import { View, Button, Platform, Text } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForNotifications();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, []);

  async function registerForNotifications() {
    if (Device.isDevice && Platform.OS !== 'web') {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
      }
    }
  }

  async function scheduleNotification() {
    const triggerTime = new Date(Date.now() + 5000); 
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hello!',
        body: 'This is a local notification.',
      },
      trigger: triggerTime,
    });
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Schedule Notification" onPress={scheduleNotification} />
    </View>
  );
}
