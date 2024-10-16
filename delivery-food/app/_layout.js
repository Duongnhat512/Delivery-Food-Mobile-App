import { Stack } from "expo-router";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';

const RootLayout = () => {
    // Font loading
    const [fontsLoaded] = useFonts({
        'LeagueSpartan-Regular': require('../assets/fonts/LeagueSpartan-Regular.ttf'),
        'Inter' : require('../assets/fonts/static/Inter_18pt-Regular.ttf'),
        'Inter-Bold' : require('../assets/fonts/static/Inter_18pt-Bold.ttf'),
        'LeagueSpartan-SemiBold': require('../assets/fonts/LeagueSpartan-SemiBold.ttf'),
        'LeagueSpartan-Bold': require('../assets/fonts/LeagueSpartan-Bold.ttf'),
    });

    useEffect(() => {
        if (fontsLoaded) {
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <Stack>
            <Stack.Screen
                name="index"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="screens/welcome"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="screens/intro"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="screens/login"
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen
                name="screens/registration"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>
    )
}

export default RootLayout;