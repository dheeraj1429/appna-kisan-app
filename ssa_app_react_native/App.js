import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import Toast from "react-native-toast-message";
import Route from "./Navigations/Route";
import { WithSplashScreen } from "./components/SplashScreen";
import GlobalContext from "./global/GlobalContext";

const theme = {
  colors: {
    ...DefaultTheme.colors,
    primary: "#fff",
    secondary: "black",
    tertiary: "black",
  },
};

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  useEffect(() => {
    setIsAppReady(true);
  }, []);

  return (
    <WithSplashScreen isAppReady={isAppReady}>
      <PaperProvider theme={theme}>
        <StatusBar backgroundColor="#fff" style="auto" />
        <GlobalContext>
          <Route />
          <Toast />
        </GlobalContext>
      </PaperProvider>
    </WithSplashScreen>
  );
}
