import React,{useState,useEffect} from 'react'
import { View, Text, StyleSheet, Dimensions, Image } from "react-native"
import { TouchableOpacity } from 'react-native-gesture-handler'
import Carousel,{Pagination} from 'react-native-snap-carousel'
import navigationString from '../Constants/navigationString'
import { UseContextState } from '../global/GlobalContext'

export const SLIDER_WIDTH = Dimensions.get('window').width + 70
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.74)

console.log("WIDTH=>",SLIDER_WIDTH,"WIDTH",ITEM_WIDTH)







const HomeBanner = ({navigation}) => {
  const [index, setIndex] = React.useState(0)
  const isCarousel = React.useRef(null)
  const { authState } = UseContextState();

  console.log(authState?.homeBanner)
  const data = authState?.homeBanner;


  const CarouselCardItem = ({ item, index }) => {
    // console.log("BANNER__item?.category_chain",item?.category_chain)
    // console.log("navi",navigation)

    return (
      <View>
       {item?.selected_category ?
        <TouchableOpacity
         onPress={()=>navigation.navigate(navigationString.SEARCH_RESULT,
          
          // {searchThroughSubCategory: item?.selected_category}
          {searchThroughSubCategory:item?.category_chain }
          
          )}
          activeOpacity={0.6} style={styles.container} key={index}>
        <Image
          source={{ uri: item.image_url }}
          style={styles.image}
        />
      
      </TouchableOpacity>
      :
      <View  style={styles.container} key={index}>
      <Image
        source={{ uri: item.image_url }}
        style={styles.image}
      />
      </View>
      }
     
      
      </View>
    )
  }
  
  const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      borderRadius: 8,
      width: '100%',
      paddingBottom: 0,
      shadowColor: "#000",
      paddingVertical:0,
  
    },
    image: {
      width:'100%',
      height: 160,
      borderRadius:12,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.29,
      shadowRadius: 4.65,
      elevation: 7,
  
    },
  })
  



  return (
    <View style={{alignItems:'center',justifyContent:'center'}} >
      <Carousel
        layout="default"      
        layoutCardOffset={9}
        ref={isCarousel}
        data={data}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH }
        inactiveSlideShift={1}
        useScrollView={true}
        loop={true}
        enableSnap={true}
        // loopClonesPerSide={1}
        autoplay={true}
        // autoplayDelay={1}

        onSnapToItem={(index) => setIndex(index )}
      />
      <View  style={{marginTop:-47}} >
       <Pagination
        dotsLength={data?.length}
        activeDotIndex={index}
        carouselRef={isCarousel}
        dotStyle={{
          width: 8,
          height: 8,
          borderRadius: 5,
          marginHorizontal: -10,
          backgroundColor: 'white'
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
        tappableDots={true}
        
       
       
      />
      </View>
    </View>
  )
}


export default HomeBanner
