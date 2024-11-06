import { Drawer } from 'expo-router/drawer';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomDrawerContent = ({ navigation }) => {
    return (
        <View style={{ flex: 1 }}>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('orders')}
            >
                <Image source={require('../../assets/orders.png')} style={styles.drawerIcon} />
                <Text style={styles.drawerLabel}>Đơn hàng của tôi</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.drawerItem}
                onPress={() => navigation.navigate('profile')}
            >
                <Image source={require('../../assets/user.png')} style={styles.drawerIcon} />
                <Text style={styles.drawerLabel}>Hồ sơ của tôi</Text>
            </TouchableOpacity>
        </View>
    );
};

const DrawerLayout = () => {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                screenOptions={{
                    headerShown: false,
                    drawerPosition: 'right',
                    drawerStyle: styles.drawer,
                }}
                drawerContent={(props) => <CustomDrawerContent {...props} />}
            >
                <Drawer.Screen name="home" />
                <Drawer.Screen name="orders" />
                <Drawer.Screen name="profile" />
            </Drawer>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#E95322',
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        gap: 20,
    },
    drawerIcon: {
        marginRight: 16,
    },
    drawerLabel: {
        fontFamily: 'LeagueSpartan-Regular',
        fontSize: 16,
        color: '#fff',
    },
});

export default DrawerLayout;