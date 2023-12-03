import React,{useState,useEffect} from 'react';
import { StatusBar, } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import {MD3LightTheme as DefaultTheme,Provider as PaperProvider} from "react-native-paper"
import { WithSplashScreen } from './components/SplashScreen';
import GlobalContext from './global/GlobalContext';
import Route from './Navigations/Route';
import Toast from 'react-native-toast-message';


const theme={
  colors: {
    ...DefaultTheme.colors,
    primary:'#fff',
    secondary: 'black',
    tertiary: 'black'
  },
}

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  useEffect(() => {

      setIsAppReady(true);
    
  }, []);

  //=========== PLEASE REMOVE THIS AT THE TIME OF DEVELOPMENT ===============
   //console.log=()=>{}
  //=========== PLEASE REMOVE THIS AT THE TIME OF DEVELOPMENT ===============

  return (<WithSplashScreen isAppReady={isAppReady} >
    <PaperProvider theme={theme} >  
      <StatusBar  backgroundColor='#fff' style="auto" />
      <GlobalContext>
      <Route />
      <Toast />
      </GlobalContext>
    </PaperProvider>
    </WithSplashScreen>

  );
}

