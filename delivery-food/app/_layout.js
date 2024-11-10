import { Stack } from "expo-router";
import { useContext, useEffect, useState } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from 'expo-splash-screen';
import { UserContext, UserProvider, useUser } from "./contexts/userContext";

const RootLayout = () => {
    const user = useUser();

    const [fontsLoaded] = useFonts({
        'LeagueSpartan-Regular': require('../assets/fonts/LeagueSpartan-Regular.ttf'),
        'Inter': require('../assets/fonts/static/Inter_18pt-Regular.ttf'),
        'Inter-Bold': require('../assets/fonts/static/Inter_18pt-Bold.ttf'),
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
        <UserProvider>
            {user ? (
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name="(drawer)"
                    />
                </Stack>
            ) : (
                <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen
                        name="index"
                    />
                    <Stack.Screen
                        name="screens/welcome"
                    />
                    <Stack.Screen
                        name="screens/intro"
                    />
                    <Stack.Screen
                        name="screens/login"
                    />
                    <Stack.Screen
                        name="screens/registration"
                    />
                </Stack>
            )}

        </UserProvider>
    )
}

export default RootLayout;