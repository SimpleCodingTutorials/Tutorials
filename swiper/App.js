import React from 'react';
import {View,Dimensions,StyleSheet,Image,Text} from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
  useAnimatedStyle,
  interpolate
} from 'react-native-reanimated';

import { LinearGradient } from 'expo-linear-gradient';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width*0.8;
const ITEM_SPACING = (width-ITEM_WIDTH)/2;

const data = [
  {image:require('./assets/pic1.jpg'),title: 'First Picture'},
  {image:require('./assets/pic2.jpg'),title: 'Second Picture'},
  {image:require('./assets/pic3.jpg'),title: 'Third Picture'},
  {image:require('./assets/pic4.jpg'),title: 'Fourth Picture'},
  {image:require('./assets/pic5.jpg'),title: 'Fifth Picture'},
]

export default function AnimatedSwiper() {
  const scrollX = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });
   return (
    <View style={{flex:1, justifyContent:'center'}}>
      <View style={{alignItems: 'center'}}>
        <Animated.FlatList
          data = {data}
          keyExtractor={(item)=>item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{paddingHorizontal: ITEM_SPACING}}
          snapToInterval={ITEM_WIDTH}
          decelerationRate="fast"
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          renderItem={({item,index})=>{
            return <AnimatedItem item={item} index={index} scrollX={scrollX} />;
          }}
          />
          <Dots data={data} scrollX={scrollX}  />
      </View>
    </View>
   );
}

function AnimatedItem({item,index,scrollX}) {
  const animatedStyle = useAnimatedStyle(()=> {
    const inputRange = [
      (index-1) * ITEM_WIDTH,
      index * ITEM_WIDTH,
      (index+1) *  ITEM_WIDTH
    ];
    const scale = interpolate(
      scrollX.value,
      inputRange,
      [0.8,1,0.8],
      'clamp'
    );
    return {
      transform:[{scale}],
    };
  });
  return (
    <Animated.View style={[styles.item,animatedStyle]}>
      <View style={styles.innerItem}>
        <Image
          source={item.image}
          style={styles.image}
          resizeMode='cover'
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.6)','rgba(0,0,0,0)']}
          start={{x:0,y:1}}
          end={{x:0,y:0}}
          style={styles.gradientOverlay}
        >
           <Text style={[styles.title]}>
                {item.title}
            </Text> 
        </LinearGradient>
      </View>
    </Animated.View>
  );
}

function Dots({data,scrollX}) {
  return (
    <View style={styles.dotsContainer}>
      {data.map((_,index)=>{
        return <Dot key={index} index={index} scrollX={scrollX} />;
      })
      }
    </View>
  );
}

function Dot({index,scrollX}) {
  const animatedStyle = useAnimatedStyle(()=> {
    const width = interpolate(
      scrollX.value,
      [
        (index-1)*ITEM_WIDTH,
        index*ITEM_WIDTH,
        (index+1)*ITEM_WIDTH,

      ],
      [8,16,8],
      'clamp'
    );
    return {
      width,
    };
  });
  return <Animated.View style={[styles.dot,animatedStyle]} />;
}


const styles = StyleSheet.create({
  item: {
    width: ITEM_WIDTH,
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerItem: {
    width: '100%',
    height: '80%',
    backgroundColor: 'whiteSmoke',
    borderRadius:16
  },
  image: {
    width: '100%',
    height:'100%',
    borderRadius:16
  },
  title: {
    position:'absolute',
    textAlignVertical: 'center',
    textAlign: 'center',
    bottom: 0,
    fontSize:22,
    fontWeight:'bold',
    color: 'whitesmoke',
    zIndex:1,
    width: '100%',
    paddingVertical: 30
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height:'30%',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1
  },
   dot: {
    height: 8,
    backgroundColor: 'black',
    borderRadius:4,
    marginHorizontal: 4
   }
});

































