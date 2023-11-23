import React,{useRef,useEffect,useState} from 'react'
import { View,Text,ActivityIndicator,SafeAreaView,FlatList,TextInput,TouchableOpacity,StyleSheet } from 'react-native'
import { Octicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { config } from '../../config';
import { StatusBar } from 'expo-status-bar';
import navigationString from '../../Constants/navigationString';
import axios from 'axios';

function SearchScreen({route,navigation}) {
  const [ brandSugguestion , setBrandSuggestion ] = useState([]);
  const [ loading , setLoading ] = useState(false)
  const [searchQuery, setSearchQuery] = React.useState(route.params?.searchHistory ? route.params?.searchHistory : "" );
  console.log("search value=>",route.params)
    const goBack = () => {
        navigation.goBack();
      };

    useEffect(()=>{
      setLoading(true)
      axios.get(`${config.BACKEND_URI}/api/get/all/brands/suggestion/for/search`,{withCredentials:true})
      .then(res=>{
        console.log(res?.data);
        setBrandSuggestion(res?.data);
        setLoading(false)
      })
      .catch(err=>{
        console.log(err)
      })
    },[])

    const onChangeSearch = (searchValue) => {
      setSearchQuery(searchValue);
      
    };

    const onSubmitSearch = async()=>{
      if(!searchQuery.trim()){
        return;
      }
      navigation.navigate(navigationString.SEARCH_RESULT,{searchValue:searchQuery})
    }

  
      const renderbrandSuggestion = ({item,index})=>{
        return(
          <TouchableOpacity onPress={()=>navigation.navigate(navigationString.SEARCH_RESULT,{searchThroughCategory:item._id})} activeOpacity={0.6} >
           <Text  style={styles.brandSuggestion} >{item._id}</Text>
           </TouchableOpacity >
        )
      }

  return (
  <View style={styles.screenContainer} >
      <StatusBar backgroundColor="white" />
   
      
    <View style={{flexDirection:'row',alignItems:'center',}} >
    <View style={styles.searchBox}>
    <TextInput
      autoFocus
      keyboardType='web-search'
      style={styles.searchBar}
      placeholder="Search with product name or code..."
      onChangeText={onChangeSearch}
      value={searchQuery}
      onSubmitEditing={onSubmitSearch}
    />
    <Octicons  style={styles.serachIcon} name="search" size={20}  />
 <TouchableOpacity onPress={goBack} activeOpacity={0.6} style={styles.clearBtn} >
 <AntDesign name="close" style={{paddingBottom:8}} size={18} color='#555' />
 </TouchableOpacity>
  </View>
    </View>
    {/* <View style={{alignItems:'center'}} >
      {loading ? 
          <View style={{marginVertical:25,flex:1,justifyContent:'center',alignItems:'center'}} >
            <ActivityIndicator size='large' color={config.primaryColor} /> 
          </View>
        :
        <FlatList
        data={brandSugguestion}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={renderbrandSuggestion}
        keyExtractor={(item)=>item._id}
        ItemSeparatorComponent={() => {
          return (
              <View
                  style={{
                      height: "100%",
                    
                  }} />
          );
      }}
      />
    }
   

  </View> */}
  </View>
  )
}

export default SearchScreen

const styles = StyleSheet.create({
    screenContainer:{
        paddingTop:40,
       
        flex:1,
        backgroundColor:'white'
    },
    searchBox: {
        width:'100%',
        paddingHorizontal:10,
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        marginTop:10,
      },
       
      searchBar: {
        width:'100%',
        paddingVertical:10,
        backgroundColor: "#f5f5f6",
        borderRadius: 12,
        fontSize: 16,
        paddingHorizontal: 38,
        marginBottom: 10,
        borderColor:'lightgray',
        borderWidth:0.5,
        color:'#222',
        fontWeight:'400'
      },
      serachIcon: {
        position: "absolute",
        left: 22,
        bottom:15,
        color: config.primaryColor,
        paddingBottom: 8,
      },
      clearBtn:{
        position:'absolute',
        right:22
      },
      brandSuggestion:{
        backgroundColor:'#f5f5f6',
        paddingHorizontal:16,
        paddingVertical:6,
        marginVertical:3,
        marginHorizontal:5,
        color:'gray',
        borderRadius:30,
        borderWidth:0.5,
        borderColor:'lightgray',
        textTransform:'capitalize'
      },
})

