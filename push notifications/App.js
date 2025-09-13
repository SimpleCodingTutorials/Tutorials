import React, {useEffect,useState,useRef} from "react";
import {View,Text,Platform} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { getNotificationChannelsAsync } from 'expo-notifications';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  }),
});

async function registerForPushNotificationsAsync(setToken) {
  if(!Device.isDevice) return;
  const  {status: existingStatus} = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if(existingStatus !== "granted") {
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if( finalStatus !== "granted") return;

  if(Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("high-priority", {
      name: "High Priority",
      importance: Notifications.AndroidImportance.MAX,
      sound: "default",
    });

  }
  try {
    const projectId = Constants.expoConfig.extra.eas.projectId;
    const tokenData = await Notifications.getExpoPushTokenAsync({projectId});
    const expoPushToken = tokenData.data;

    setToken(expoPushToken);
    await fetch("https://sct--c04a76ea75d611f08a41022t638636fgtw34g678h.web.val.run",{
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({expoPushToken}),
    });

  } catch(err) {
    console.log("Error getting token:", err);
  }
}

export default function App() {
  const [token,setToken] = useState("");
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(()=> {
    registerForPushNotificationsAsync(setToken);
    if (Platform.OS === 'android') {
      getNotificationChannelsAsync().then(channels => {
        console.log('Registered channels:', channels.map(c => c.id));
        console.log("Channels on device:", channels);

      });
    }
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Channel used:', notification.request.content.channelId);
    });
    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  },[]);

  return (
    <View style={{padding: 20}} >
      <Text> Push notification setup complete. </Text>
    </View>
  );
}




















