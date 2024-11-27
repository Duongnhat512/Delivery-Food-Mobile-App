import { Drawer } from 'expo-router/drawer';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Image, StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { router, useFocusEffect } from 'expo-router';
import { useContext, useEffect, useState } from 'react';
import { set } from 'date-fns';
import { UserContext } from '../contexts/userContext';


const CustomDrawerContent = ({ navigation }) => {
    const { user } = useContext(UserContext);

    const handleLogout = async () => {
        try {
            Alert.alert(
                'Đăng xuất',
                'Bạn có chắc chắn muốn đăng xuất?',
                [
                    {
                        text: 'Hủy',
                        onPress: () => console.log('Cancel Pressed'),
                        style: 'cancel',
                    },
                    {
                        text: 'Đăng xuất',
                        onPress: async () => {
                            await FIREBASE_AUTH.signOut();
                            router.push('../screens/login');
                        },
                    },
                ],
                { cancelable: false }
            );
        } catch (error) {
            console.error('Error logging out: ', error);
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <View>
                <View style={{ alignItems: 'center', flexDirection: "row", gap: 25, height: "20%"}}>
                    {user && (
                        <>
                            <Image source={{ uri: user.photoURL }} style={{ width: 50, height: 50, borderRadius: 50 }} />
                            <View>
                                <Text style={{color: "#fff", fontSize: 20, fontFamily: "LeagueSpartan-Regular"}}>{user.displayName}</Text>
                                <Text style={{color: "#fff", fontFamily: "LeagueSpartan-Regular"}}>{user.email}</Text>
                            </View>
                        </>
                    )}
                </View>
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
                    unmountOnBlur: true,
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