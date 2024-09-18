import { Suspense, useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';


SplashScreen.preventAutoHideAsync();


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  const [loaded, error] = Font.useFonts({
    "Inter-Bold": require("./assets/fonts/static/Inter_18pt-Bold.ttf"),
    "Inter-Medium": require("./assets/fonts/static/Inter_18pt-Medium.ttf"),
    "Inter-Regular": require("./assets/fonts/static/Inter_18pt-Regular.ttf"),
    "Inter-SemiBold": require("./assets/fonts/static/Inter_18pt-SemiBold.ttf"),
    "Inter-Thin": require("./assets/fonts/static/Inter_18pt-Thin.ttf"),
    "Inter-Light": require("./assets/fonts/static/Inter_18pt-Light.ttf"),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync(Entypo.font);
        await new Promise(resolve => setTimeout(resolve, 2000));
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

  if (!appIsReady) {
    return null;
  }
  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <View
        style={styles.container}
        onLayout={onLayoutRootView}>
        <View>
          <Image
            source={require('./assets/logo.png')}
          />
        </View>
        <Text
          style={{
            color: '#fff',
            fontSize: 14,
            margin: 40,
          }}
        >
          Nhanh hơn bạn nghĩ, ngon hơn bạn mong đợi!</Text>
        <TouchableOpacity
          style={[styles.button, { marginBottom: 5, backgroundColor: "#F5CB58" }]}
        >
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#F3E9B5" }]}
        >
          <Text style={styles.buttonText}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E95322',
    alignItems: 'center',
    justifyContent: 'center',
  },

  button: {
    padding: 10,
    borderRadius: 30,
    alignItems: 'center',
    width: "60%",
  },
  buttonText: {
    color: '#E95322',
    fontSize: 24,
  },
});
