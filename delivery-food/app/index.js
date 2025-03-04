import { StyleSheet, Text, View } from "react-native";
import { useState, useEffect, useCallback, useContext } from "react";
import * as SplashScreen from "expo-splash-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Intro from "./screens/intro";
import Welcome from "./screens/welcome";
import { storeData, getItemFor } from "./screens/storage/storageIntro";
import { onAuthStateChanged, User } from "firebase/auth";
import { FIREBASE_AUTH } from "../FirebaseConfig";
import { router } from "expo-router";
import Home from "./(drawer)/home";
import { UserContext } from "./contexts/userContext";

const HAS_LAUNCHED = 'HAS_LAUNCHED'

export default function Page() {
  const [hasLaunched, setHasLaunched] = useState(false);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const getData = async () => {
      const hasLaunched = await getItemFor(HAS_LAUNCHED);
      if (hasLaunched) {
        setHasLaunched(true);
      }
      else {
        await storeData(HAS_LAUNCHED, 'true');
      }
    }

    getData().catch((error) => { console.log(error) })

  }, [])

  useEffect(() => {
    if (hasLaunched && user) {
      router.push("/(drawer)/home");
    }
  }, [hasLaunched, user]);

  return (
    <View style={styles.container}>
      {hasLaunched ? <Welcome /> : <Intro />}
      {/* <Intro/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

});
