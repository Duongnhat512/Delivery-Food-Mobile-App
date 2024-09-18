import { Suspense, useCallback, useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import SwiperIntro from './components/SwiperIntro';
import { SafeAreaView } from 'react-native-safe-area-context';

SplashScreen.preventAutoHideAsync();


export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [bgImage, setBgImage] = useState(require('./assets/intro.png'));
  const [buttonText, setButtonText] = useState('Tiếp tục');

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

  const handleIndexChanged = (index) => {
    const images = [
      require('./assets/intro.png'),
      require('./assets/intro-1.png'),
      require('./assets/intro-2.png'),
    ];
    setBgImage(images[index]);
    changeButtonText(index);
  }

  const changeButtonText = (index) => {
    if (index === 2) {
      setButtonText('Bắt đầu nào!');
    }
    else {
      setButtonText('Tiếp tục');
    }
  }

  // const changeSlide = () => {
  //   if (swiperRef.current && swiperRef.current < 2) {
  //     swiperRef.current.scrollBy(1);
  //   }
  // };

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ImageBackground
        source={bgImage}
        style={styles.container}
        onLayout={onLayoutRootView}
      >
        <SafeAreaView style={styles.swiper}>
          <SwiperIntro
            onIndexChanged={handleIndexChanged}
            // ref={swiperRef}
          ></SwiperIntro>
          <TouchableOpacity
            style={styles.button}
            // onPress={changeSlide}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E95322',
    alignItems: 'center',
    justifyContent: 'flex-end',

  },
  swiper: {
    width: '100%',
    height: '45%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
    backgroundColor: 'white',
  },
  buttonText: {
    color: 'white',
    fontSize: 17,
  },
  button: {
    width: '40%',
    padding: 10,
    backgroundColor: '#E95322',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
    marginBottom: 70,
    marginTop: 30,
  }
});

