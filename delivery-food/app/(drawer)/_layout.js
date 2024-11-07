import { Drawer } from 'expo-router/drawer';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { router } from 'expo-router';


const CustomDrawerContent = ({ navigation }) => {
    const handleLogout = async () => {
        try {
            await FIREBASE_AUTH.signOut();
            router.navigate('../screens/login');
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('orders')}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/orders.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={styles.drawerLabel}>Đơn hàng của tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('profile')}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/profile.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={styles.drawerLabel}>Hồ sơ của tôi</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('address')}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/address.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={styles.drawerLabel}>Địa chỉ giao hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('payment')}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/payment-method.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={styles.drawerLabel}>Cài đặt thanh toán</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('contact')}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/call.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={styles.drawerLabel}>Liên hệ</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('help')}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/help.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={styles.drawerLabel}>Trợ giúp</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.drawerItem}
                    onPress={() => navigation.navigate('setting')}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/setting.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={styles.drawerLabel}>Cài đặt</Text>
                </TouchableOpacity>
            </View>
            <View>
                <TouchableOpacity
                    style={[styles.drawerItem, { borderBottomWidth: 0 }]}
                    onPress={handleLogout}
                >
                    <View style={styles.drawerIcon}>
                        <Image source={require('../../assets/logout.png')} style={{ width: 30, height: 30 }} resizeMode='contain' />
                    </View>
                    <Text style={{ color: '#fff', fontFamily: 'LeagueSpartan-Regular', fontSize: 16 }}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
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
                <Drawer.Screen name="address" />
                <Drawer.Screen name="payment" />


            </Drawer>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    drawer: {
        backgroundColor: '#E95322',
        padding: 20,
    },
    drawerItem: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        gap: 20,
        paddingVertical: 15,
    },
    drawerIcon: {
        marginRight: 16,
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        padding: 5,
    },
    drawerLabel: {
        fontFamily: 'LeagueSpartan-Regular',
        fontSize: 16,
        color: '#fff',
    },
});

export default DrawerLayout;