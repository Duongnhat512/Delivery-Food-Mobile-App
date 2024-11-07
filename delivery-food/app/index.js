import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useCallback } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Intro from "./screens/intro";
import Welcome from "./screens/welcome";
import { SafeAreaView } from "react-native-safe-area-context";
import { storeData, getItemFor } from "./screens/storage/storageIntro";

const HAS_LAUNCHED = 'HAS_LAUNCHED'

export default function Page() {
  const [hasLaunched, setHasLaunched] = useState(false);

  useEffect(() => {
    const getData = async() =>{
      const hasLaunched = await getItemFor(HAS_LAUNCHED);
      if(hasLaunched){
        setHasLaunched(true);
      }
      else{
        await storeData(HAS_LAUNCHED, 'true');
      }
    }

    getData().catch((error) => {console.log(error)})
  }, [])

  return (
    <View style={styles.container}>
      {hasLaunched ? <Welcome/> : <Intro />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
