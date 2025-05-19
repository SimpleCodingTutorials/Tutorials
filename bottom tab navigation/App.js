import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text,View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const Tab = createBottomTabNavigator();

function HomeScreen() {
    return (
      <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
        <Text style={{fontSize:32}}>Home</Text>
      </View>
    );
}
function ProfileScreen() {
  return (
    <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
      <Text style={{fontSize:32}}>Profile</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{flex:1,justifyContent: 'center',alignItems:'center'}}>
      <Text style={{fontSize:32}}>Settings</Text>
    </View>
  );
}

export default function App() {
   return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route})=> ({
          tabBarIcon: ({focused,color,size}) => {
            let iconName;

            if(route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return <Ionicons name={iconName} size={size} color={color} />
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopLeftRadius:20,
            borderTopRightRadius:20,
            height:70,
            paddingBottom:10
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5
          },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />

      </Tab.Navigator>
    </NavigationContainer>
   );
}

























