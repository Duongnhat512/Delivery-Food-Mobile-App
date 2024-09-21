import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import SwiperIntro from '../../components/SwiperIntro';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

const Intro = () => {
  const [appIsReady, setAppIsReady] = useState(false);
  const [bgImage, setBgImage] = useState(require('../../assets/intro.png'));
  const [buttonText, setButtonText] = useState('Tiếp tục');
  const [index, setIndex] = useState(0);
  const swiperRef = useRef(null);

  useEffect(() => {
    async function prepare() {
      try {
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
      require('../../assets/intro.png'),
      require('../../assets/intro-1.png'),
      require('../../assets/intro-2.png'),
    ];
    setIndex(index);
    setBgImage(images[index]);
    changeButtonText(index);
  }

  const changeButtonText = (index) => {
    if (index === 2) {
      setButtonText('Bắt đầu nào!');
    }else if (index > 2){
      router.push('/screens/welcome');
    }
    else {
      setButtonText('Tiếp tục');
    }
  }

  const changeSlide = () => {
    if (swiperRef.current) {
      swiperRef.current.scrollBy(1);
    }
  };

  // const handleSkip = async () => {
  //   await AsyncStorage.setItem('hasSeenIntro', 'true');
  //   router.push('/welcome');
  // };

  return (
    <Suspense fallback={<Text>Loading...</Text>}>
      <ImageBackground
        source={bgImage}
        style={styles.container}
        onLayout={onLayoutRootView}
      >
        {index !== 2 && (
          <TouchableOpacity
            style={styles.skipButton}
            onPress={() => {
              router.push('/screens/welcome');
            }}
          >
            <Text style={{ color: "#E95322", fontSize: 15, fontFamily: "Inter" }}>Skip</Text>
            <Image
              source={require('../../assets/next-icon.png')}
            />
          </TouchableOpacity>
        )}
        <SafeAreaView style={styles.swiper}>
          <SwiperIntro
            onIndexChanged={handleIndexChanged}
            ref={swiperRef}
          ></SwiperIntro>
          <TouchableOpacity
            style={styles.button}
            onPress={changeSlide}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </Suspense>
  );
}

export default Intro;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E95322',
    alignItems: 'flex-end',
    position: 'relative',
    flexDirection: 'row',
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
    fontFamily: 'Inter',
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
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 25,
    flexDirection: 'row',
    alignItems: 'center',
    width: 50,
    justifyContent: 'space-between',
  },
});

