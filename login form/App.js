import React,{useState,useEffect,useRef} from "react";
import { StyleSheet,KeyboardAvoidingView,Platform,Dimensions,ImageBackground,ScrollView,View } from "react-native";
import Svg,{Path} from "react-native-svg";
import { DefaultTheme,TextInput,Button,Card,Text,Provider as PaperProvider } from "react-native-paper";
import Animated,{useSharedValue,useAnimatedStyle,withTiming,withDelay} from "react-native-reanimated";


const {width} = Dimensions.get("window");

const Header = () => (
  <View style={{backgroundColor:"#1e9de7ff"}} >
    <ImageBackground 
      source={require("./assets/bg.jpg")}
      style={{height:200, width,justifyContent:"center",alignItems:"center"}}
      resizeMode="cover"
    >
      <Text style={{fontSize:32,color:"#fff",fontWeight:"bold"}} >App Name</Text>
    </ImageBackground>
    <Svg height={60} width={width} style={{position:"absolute", bottom:0}} >
      <Path 
        fill="#fff" fillOpacity="1" 
        d={`M0,30 C${width/4},0 ${width*3/4},60 ${width},30 L${width},60 L0,60 Z`}
      />
    </Svg>
  </View>
);

export default function App() {
  const [isLogin,setIsLogin] = useState(true);
  const [name,setName] = useState(""),[email,setEmail]=useState(""),[password,setPassword] = useState("");

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);


  const clearFields = () => {
    setName("");setEmail("");setPassword("");
  }

  const blurAll = () => {
    nameRef.current?.blur();
    emailRef.current?.blur();
    passwordRef.current?.blur();
  };


  const translateX = useSharedValue(0);
  const fadeName = useSharedValue(0);
  const fadeEmail = useSharedValue(0);
  const fadePassword = useSharedValue(0);

  useEffect(()=>{
    translateX.value = withTiming(isLogin ? 0 : -width, {duration:350});
    fadeName.value=0;
    fadeEmail.value=0;
    fadePassword.value=0;

    if(!isLogin) {
      fadeName.value = withDelay(200,withTiming(1,{duration:200}));
      fadeEmail.value = withDelay(350,withTiming(1,{duration:200}));
      fadePassword.value = withDelay(500,withTiming(1,{duration:200}));
    } else {
      fadeEmail.value = withDelay(200,withTiming(1,{duration:200}));
      fadePassword.value = withDelay(350,withTiming(1,{duration:200}));
    }
  },[isLogin]);

  const cardAnimStyle = useAnimatedStyle(()=>({
    transform: [{translateX:translateX.value}],
  }));
  const fadeNameStyle = useAnimatedStyle(()=>({opacity: fadeName.value}));
  const fadeEmailStyle = useAnimatedStyle(()=>({opacity: fadeEmail.value}));
  const fadePasswordStyle = useAnimatedStyle(()=>({opacity: fadePassword.value}));

  const loginForm = () => (
    <>
      <Card style={styles.card} >
        <Card.Content>
          <Text style={styles.title} >Login</Text>
          <Animated.View style={fadeEmailStyle} >
            <TextInput ref={emailRef} label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
          </Animated.View>
           <Animated.View  style={fadePasswordStyle} >
            <TextInput secureTextEntry ref={passwordRef} label="Password" value={password} onChangeText={setPassword} mode="outlined" style={styles.input} />
          </Animated.View>
          <Button mode="contained" onPress={()=>{}} style={styles.button} >
            Login
          </Button>
          <Button mode="text" onPress={()=>{setIsLogin(false);clearFields();blurAll()}}>
            Don't have an account? Sign Up
          </Button>
        </Card.Content>
      </Card>
    </>
  );
  const signupForm = () => (
    <>
      <Card style={styles.card} >
        <Card.Content>
          <Text style={styles.title} >Sign Up</Text>
           <Animated.View style={fadeNameStyle} >
            <TextInput ref={nameRef} label="Name" value={name} onChangeText={setName} mode="outlined" style={styles.input} />
          </Animated.View>
          <Animated.View style={fadeEmailStyle}  >
            <TextInput ref={emailRef} label="Email" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} />
          </Animated.View>
           <Animated.View style={fadePasswordStyle}   >
            <TextInput ref={passwordRef} secureTextEntry label="Password" value={password} onChangeText={setPassword} mode="outlined" style={styles.input} />
          </Animated.View>
          <Button mode="contained" onPress={()=>{}} style={styles.button} >
            Sign Up
          </Button>
          <Button mode="text" onPress={()=>{setIsLogin(true);clearFields();blurAll()}}>
              Already have an account? Login
          </Button>
        </Card.Content>
      </Card>
    </>
  );

  return (
    <PaperProvider theme={customTheme}>
      <ScrollView keyboardShouldPersistTaps="handled" >
        <Header />
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding":"height"}
          style={[styles.container,{flex:1,justifyContent:"center"}]}
        >
            <View style={styles.slider}>
              <Animated.View style={[styles.cardWrapper,cardAnimStyle]} >
                {loginForm()}
                {signupForm()}
              </Animated.View>
            </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#fff"
  },
  slider:{
    width:width
  },
  cardWrapper: {
    flexDirection:"row",
    width:width*2
  },
  card:{
    width:width*0.9,
    borderRadius:8,
    backgroundColor:"#fff",
    marginHorizontal:width*0.05,
    alignSelf:"center"
  },
  input:{
    marginBottom:10
  },
  button:{
    marginTop:10
  },
  title:{
    fontSize:24,
    marginBottom:16,
    textAlign:"center"
  }
});

const customTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1e9de7ff",
    background:"#f5f5f5"
  },
};
































// const customTheme = {
//   ...DefaultTheme,
//   colors: {
//     ...DefaultTheme.colors,
//     primary: "#1e9de7ff",
//     background: "#f5f5f5",
//   },
// };
