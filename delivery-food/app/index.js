import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Intro from "./screens/intro";
import Welcome from "./screens/welcome";

export default function Page() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    async function prepare() {
      try {
        const hasSeenIntro = await AsyncStorage.getItem("hasSeenIntro");
        if (hasSeenIntro) {
          setShowIntro(false);
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      {/* {showIntro ? <Intro /> : <Welcome />} */}
      <Intro/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
