import React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { config } from "../../config";

export const SLIDER_WIDTH = Dimensions.get("window").width + 80;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

const CarouselCardItem = ({ item, index }) => {
  return (
    <View style={styles.container} key={index}>
      <Image
        source={{ uri: item.image_url }}
        style={{ width: 220, height: 240, backgroundColor: "#f5f5f6" }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'white',
    // borderRadius: 8,
    alignItems: "center",
    width: "100%",
    paddingBottom: 0,
    shadowColor: "#000",
    paddingVertical: 0,
    marginTop: -15,
  },
  image: {
    width: "100%",
    height: 160,
    borderRadius: 12,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
});

const ProductImageCarousel = ({ productImages }) => {
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Carousel
        layout="default"
        layoutCardOffset={9}
        ref={isCarousel}
        data={productImages}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={1}
        useScrollView={true}
        loop={true}
        // autoplay={true}
        // autoplayDelay={1}
        onSnapToItem={(index) => setIndex(index)}
      />
      <View style={{ marginTop: -15 }}>
        <Pagination
          dotsLength={productImages?.length}
          activeDotIndex={index}
          carouselRef={isCarousel}
          dotStyle={{
            width: 8,
            height: 8,
            borderRadius: 5,
            marginHorizontal: -6,
            backgroundColor: config.primaryColor,
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
          tappableDots={true}
        />
      </View>
    </View>
  );
};

export default ProductImageCarousel;
