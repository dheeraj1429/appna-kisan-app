import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Image
} from "react-native";
import { config } from "../../config";
import statelist from "../../Constants/statelist";
import { Checkbox, Portal, Provider, Modal } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from "expo-status-bar";
import { Entypo } from "@expo/vector-icons";
import { FontAwesome } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import navigationString from "../../Constants/navigationString";
import axios from "axios";
import { clearLocalStorage } from "../../Utils/localstorage";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { UseContextState } from "../../global/GlobalContext";
import imageImport from "../../Constants/imageImport";
import emailjs from '@emailjs/browser';
import { FlatList } from "react-native-gesture-handler";



function Checkout({ route, navigation }) {
  const { checkoutProducts } = route.params;
  const [loading, setLoading] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [errorModalVisible, setErrorModalVisible] = useState(false);
  const [formError, setFormError] = useState([])
  const { authState, cartState } = UseContextState();
  console.log("formError", formError)
  const [checkoutDetail, setCheckoutDetail] = useState({
    customer_id: authState?.user?.user_id,
    customer_name: '',
    customer_phone_number: `${authState?.user?.phone_number}`,
    customer_email: '',
    customer_business: '',
    customer_gst: '',
    products: checkoutProducts || [],
    shipping_address: '',
    state: '',
    pincode: '',
    transport_detail: ''
  })

  useFocusEffect(
    useCallback(() => {
      axios.get(`${config.BACKEND_URI}/api/app/get/user/by/userid/${authState?.user?.user_id}`, { withCredentials: true })
        .then(res => {
          // console.log("RESPONSE=>",res?.data?.user);
          setCheckoutDetail((prev) => ({
            ...prev,
            customer_name: res?.data?.user?.username,
            customer_email: res?.data?.user?.email,
            customer_gst: res?.data?.user?.gst_number,
            shipping_address: res?.data?.user?.address,
            customer_business: res?.data?.user?.user_business,
            state: res?.data?.user?.state,
            pincode: `${res?.data?.user?.pincode}`,
            transport_detail: `${res?.data?.user?.transport_detail}`
          }))
        })
        .catch(err => {
          console.log(err);
        })
    }, [])
  )

  // console.log("checkoutProducts",checkoutProducts)

  const goBack = () => {
    navigation.goBack();
  };
  // console.log("checkout-> ",checkoutDetail)

  const handleChange = (form, name) => {
    setFormError([])
    // setCheckoutDetail(value => ({
    //     ...value,
    //     [name]: form
    //   }))
    if (name == 'customer_name') {
      setCheckoutDetail(value => ({
        ...value,
        customer_name: form.replace(/[^a-zA-Z ]/g, '')
      }))
    }
    if (name == 'customer_phone_number') {
      setCheckoutDetail(value => ({
        ...value,
        customer_phone_number: form.replace(/[^0-9]/g, '')
      }))
    }
    if (name == 'pincode') {
      setCheckoutDetail(value => ({
        ...value,
        pincode: form.replace(/[^0-9]/g, '')
      }))
    }
    if (name == 'customer_business') {
      setCheckoutDetail(value => ({
        ...value,
        customer_business: form
      }))
    }
    if (name == 'customer_email') {
      setCheckoutDetail(value => ({
        ...value,
        customer_email: form
      }))
    }
    if (name == 'customer_gst') {
      setCheckoutDetail(value => ({
        ...value,
        customer_gst: form
      }))
    }
    if (name == 'shipping_address') {
      setCheckoutDetail(value => ({
        ...value,
        shipping_address: form
      }))
    }
    if (name == 'state') {
      setCheckoutDetail(value => ({
        ...value,
        state: form
      }))
    }
  }

  const sendEmailAfterOrder = (emailOrderDetail) => {
    console.log("emailOrderDetail", emailOrderDetail)

    emailjs.send(config.EMAILJS_SERVICE_ID, config.EMAILJS_TEMPLATE_ID, { ...emailOrderDetail, name: emailOrderDetail.customer_name, email: emailOrderDetail.customer_email }, config.EMAILJS_PUBLIC_KEY)
      .then((result) => {
        console.log(result.text);
        console.log("EMAIL SENT++++++ ")
      }, (error) => {
        console.log(error.text);
        console.log("EMAIL SENT++++++ ERROR ")
      });
  };
  const handleFormDetail = () => {
    if (checkoutDetail?.customer_name == '') {
      setFormError(prev => [...prev, 'Please Enter Your Name'])
    }
    if (checkoutDetail?.customer_phone_number == '') {
      setFormError(prev => [...prev, 'Please Enter Your Phone Number*'])
    }
    if (checkoutDetail?.customer_business == '') {
      setFormError(prev => [...prev, 'Please Enter Your Business*'])
    }
    // if(checkoutDetail?.customer_email == ''){
    //   setFormError(prev=>[...prev,'Please Enter Your Email*'])
    // }

    if (checkoutDetail?.shipping_address == '') {
      setFormError(prev => [...prev, 'Please Enter Your Shipping Address*'])
    }
    if (checkoutDetail?.pincode == '') {
      setFormError(prev => [...prev, 'Please Enter Your Pincode*'])
    }
    if (checkoutDetail?.state == '') {
      setFormError(prev => [...prev, 'Please Select Your State*'])
    }
  }

  //   handle check out 
  const handleCheckOut = async () => {
    await handleFormDetail()
    if (checkoutDetail?.customer_id != '' && checkoutDetail?.customer_name != ''
      && checkoutDetail?.customer_business != '' && checkoutDetail?.customer_phone_number != ''
      && checkoutDetail?.shipping_address != '' && checkoutDetail?.pincode && checkoutDetail?.state != ''
      && checkoutDetail?.products?.length > 0) {
      setLoading(true)
      await axios.post(`${config.BACKEND_URI}/api/app/cart/checkout/for/products`, checkoutDetail, { withCredentials: true })
        .then(res => {
          // console.log(res?.data);
          if (res?.data?.status === true) {
            // onOrderComplete();
            clearLocalStorage();
            cartState();
            sendEmailAfterOrder(checkoutDetail)
            navigation.navigate(navigationString.ORDER_COMPLETED)
            // navigation.navigate(navigationString.ORDER)
            setLoading(false)
            setCheckoutDetail({
              customer_name: '',
              customer_phone_number: '',
              customer_email: '',
              customer_business: '',
              customer_gst: '',
              shipping_address: '',
              state: '',
              pincode: ''
            })

          }
        })
        .catch(err => {
          console.log(err)
          setLoading(false)
        })

    }
    else {
      // alert(formError?.map(error=>{
      //   console.log("ALERT",error)
      //  return(`${error}`)
      // }))
      //  await alert(...formError)
      setErrorModalVisible(true)
    }

  }

  const onClickState = (selectedState) => {
    setModalVisible(false)
    console.log(selectedState)
    setCheckoutDetail((prev => ({ ...prev, state: selectedState })))
    // setSelectedFilter(selectedState)
  }


  const renderSelectedState = useCallback(({ item, index }) => {
    // console.log("item",item)
    return (
      <TouchableOpacity
        onPress={() => onClickState(item)}
        activeOpacity={0.4}
        style={{
          borderWidth: 0.6,
          borderColor: '#f2f2f2',
          paddingVertical: 7,
          paddingHorizontal: 13,
          borderRadius: 6,
          marginVertical: 3,
          marginHorizontal: 5,
          textTransform: 'capitalize',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Text style={{
          fontSize: 14,
          fontWeight: '500',
          color: '#999',
          letterSpacing: 1.2,
          textTransform: 'capitalize',
        }}>

          {item}
        </Text>
        <MaterialIcons name="radio-button-on" size={16} color={checkoutDetail?.state == item ? config.primaryColor : '#999'} />

      </TouchableOpacity>
    )
  }, [checkoutDetail?.state])

  const renderError = useCallback(({ item, index }) => {
    // console.log("item",item)
    return (
      <View
        style={{
          paddingVertical: 3,
          paddingHorizontal: 13,
          marginVertical: 3,
          marginHorizontal: 5,
          textTransform: 'capitalize',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Text style={{
          fontSize: 14,
          fontWeight: '400',
          color: '#999',
          letterSpacing: 1.2,
          textTransform: 'capitalize',
        }}>

          {item}
        </Text>
        {/* <MaterialIcons name="radio-button-on" size={16} color={checkoutDetail?.state == item ? config.primaryColor : '#999' } /> */}

      </View>
    )
  }, [checkoutDetail?.state])



  return (
    <Provider>
      <Portal>
        <View style={styles.screenContainer}>
          {loading && <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }} >
            <ActivityIndicator color={config.primaryColor} size='large' />
          </View>
          }
          <StatusBar backgroundColor="#fff" />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 10, paddingTop: 50, paddingBottom: 10 }} >
            <MaterialIcons onPress={goBack} name="keyboard-arrow-left" size={27} color={config.primaryColor} />
            <Text style={styles.headingText} >Checkout</Text>
            <MaterialIcons name="keyboard-arrow-left" size={27} color='white' />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}
          >

            <View style={styles.commonFieldMainBox} >
              <View style={{ ...styles.commonFieldContainer, marginTop: -10 }} >
                <TextInput onChangeText={value => handleChange(value, 'customer_name')} value={checkoutDetail?.customer_name} keyboardType={'default'} style={styles.commonField} placeholder='Full Name*' />
                <MaterialCommunityIcons style={styles.commonIcon} name="account" size={20} />
              </View>
              <View style={styles.phoneFieldContainer} >
                <TextInput onChangeText={value => handleChange(value, 'customer_phone_number')} value={checkoutDetail?.customer_phone_number} maxLength={10} keyboardType='numeric' style={styles.phoneField} placeholder='Phone Number*' />
                <View style={styles.indiaIcon} >
                  <Text style={styles.nineOneText}  >🇮🇳  + 9 1</Text>
                </View>
              </View>
              <View style={styles.commonFieldContainer} >
                <TextInput onChangeText={value => handleChange(value, 'customer_business')} value={checkoutDetail?.customer_business} style={styles.commonField} placeholder='Business Name*' />
                <MaterialIcons style={styles.commonIcon} name="business-center" size={20} />
              </View>
              <View style={styles.commonFieldContainer} >
                <TextInput onChangeText={value => handleChange(value, 'customer_email')} value={checkoutDetail?.customer_email} textContentType='emailAddress' style={{ ...styles.commonField, paddingRight: 16, textTransform: 'lowercase' }} placeholder='Email Address*' />
                <MaterialIcons style={styles.commonIcon} name="email" size={20} />
              </View>
              <View style={styles.commonFieldContainer} >
                <TextInput onChangeText={value => handleChange(value, 'customer_gst')} value={checkoutDetail?.customer_gst} style={{ ...styles.commonField }} placeholder='Gst In (Optional)' />
                <FontAwesome5 style={{ ...styles.commonIcon, bottom: 15 }} name="money-check" size={15} />
              </View>

              {/* address ,state, pincode */}
              <View style={styles.commonFieldContainer} >
                <TextInput onChangeText={value => handleChange(value, 'shipping_address')} value={checkoutDetail?.shipping_address} keyboardType='default' style={styles.commonField} placeholder='Address*' />
                <FontAwesome name="address-card" size={21} style={styles.commonIcon} />
              </View>
              <TouchableOpacity onPress={() => setModalVisible(true)} activeOpacity={0.6} style={styles.commonFieldContainer} >
                {/* <TextInput onChangeText={value=>handleChange(value,'state')} value={checkoutDetail?.state} keyboardType='default'  style={styles.commonField} placeholder='State*' /> */}
                <Text style={styles.commonFieldForState} >{checkoutDetail?.state ? checkoutDetail?.state : 'Choose State'} </Text>
                <FontAwesome5 name="globe" size={20} style={styles.commonIcon} />
              </TouchableOpacity>

              <View style={styles.commonFieldContainer} >
                <TextInput onChangeText={value => handleChange(value, 'pincode')} value={checkoutDetail?.pincode} keyboardType='numeric' maxLength={6} style={styles.commonField} placeholder='Pincode*' />
                <Entypo name="location-pin" size={26} style={styles.commonIcon} />
              </View>
              {/* address ,state, pincode */}
              <TouchableOpacity onPress={handleCheckOut} activeOpacity={0.8} style={styles.checkoutBtn}>
                <Text style={styles.checkouttext}>Confirm Order </Text>
              </TouchableOpacity>
            </View>
            {/* for extra spacing */}
            <View style={{ paddingBottom: 20 }} ></View>
            {/* for extra spacing */}
          </ScrollView>
        </View>
        <Modal visible={errorModalVisible} onDismiss={() => setErrorModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
            <View style={{ borderBottomWidth: 1, borderColor: '#f2f2f2', paddingTop: 6, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, letterSpacing: 1.4, fontWeight: '500', color: config.primaryColor, paddingLeft: 13 }}>Something went wrong</Text>
              <MaterialIcons style={{ paddingRight: 9 }} onPress={() => setErrorModalVisible(false)} name="close" size={22} color={config.primaryColor} />
            </View>
            <View style={{ borderWidth: 1, borderColor: '#f2f2f2', marginTop: 12, marginHorizontal: 10, borderRadius: 10 }} >
              <FlatList
                style={{ height: 300 }}
                data={formError}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderError}
                keyExtractor={(item) => item}
              //   ItemSeparatorComponent={() => {
              //     return (
              //         <View
              //             style={{
              //                 height: "100%",

              //             }} />
              //     );
              // }}
              />
            </View>
          </View>
        </Modal>
        <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)} contentContainerStyle={styles.containerStyle}>
          <View>
            <View style={{ borderBottomWidth: 1, borderColor: '#f2f2f2', paddingTop: 6, paddingBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 16, letterSpacing: 1.4, fontWeight: '500', color: config.primaryColor, paddingLeft: 13 }}>Select State</Text>
              <MaterialIcons style={{ paddingRight: 9 }} onPress={() => setModalVisible(false)} name="close" size={22} color={config.primaryColor} />
            </View>
            <View style={{ borderWidth: 1, borderColor: '#f2f2f2', marginTop: 12, marginHorizontal: 10, borderRadius: 10 }} >
              <FlatList
                style={{ height: 300 }}
                data={statelist?.STATE}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                renderItem={renderSelectedState}
                keyExtractor={(item) => item}
              //   ItemSeparatorComponent={() => {
              //     return (
              //         <View
              //             style={{
              //                 height: "100%",

              //             }} />
              //     );
              // }}
              />
            </View>
          </View>
        </Modal>

      </Portal>
    </Provider>

  );
}

export default Checkout;

const styles = StyleSheet.create({
  screenContainer: {
    backgroundColor: "white",
    flex: 1,
  },
  headingText: {
    color: config.primaryColor,
    fontSize: 17,
    letterSpacing: 1,
    fontWeight: '600',
  },
  commonFieldMainBox: {
    marginTop: 12,
    width: '100%',
    paddingHorizontal: 20,
  },
  phoneFieldContainer: {
    position: 'relative',
    width: '100%'
  },
  indiaIcon: {
    position: 'absolute',
    bottom: 14,
    left: 15
  },
  nineOneText: {
    fontSize: 14,

  },
  phoneField: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 79,
    paddingVertical: 9,
    fontSize: 14,
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray'

  },
  commonFieldContainer: {
    position: 'relative',
    width: '100%'
  },
  commonField: {
    width: '100%',
    marginTop: 15,
    paddingHorizontal: 45,
    paddingVertical: 9,
    fontSize: 14,
    textTransform: 'capitalize',
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray'
  },
  commonFieldForState: {
    width: '100%',
    marginTop: 15,
    paddingLeft: 45,
    paddingRight: 14,
    paddingVertical: 13,
    fontSize: 14,
    textTransform: 'capitalize',
    backgroundColor: '#f5f5f6',
    letterSpacing: 1.5,
    borderRadius: 16,
    borderWidth: 0.5,
    borderColor: 'lightgray'
  },
  commonIcon: {
    position: 'absolute',
    bottom: 12,
    left: 15,
    color: '#555'
  },

  checkouttext: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 1.5,
    color: 'white'
  },
  checkoutBtn: {
    width: "100%",
    marginTop: 20,
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 10,
    backgroundColor: config.primaryColor,
    borderRadius: 16,
    shadowColor: config.primaryColor,
    shadowOffset: { width: 10, height: 0 },
    shadowOpacity: 0.49,
    shadowRadius: 10,
    elevation: 5,

  }, containerStyle: {
    backgroundColor: 'white',
    paddingTop: 9,
    paddingBottom: 12,
    marginHorizontal: 60,
    borderRadius: 10,
    zIndex: 2
  }
});
