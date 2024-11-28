import { router } from 'expo-router';
import React, { useEffect, useState, useContext,useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

const ConfirmOrder = () => {
    const [deleteOrder, setDeleteOrder] = useState(false);
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [foodImage, setFoodImage] = useState({});
    const [foodName, setFoodName] = useState({});
    const [foodPrice, setFoodPrice] = useState({});
    const { user } = useContext(UserContext);
    const [selectedAddress, setSelectedAddress] = useState();
    const [addresses, setAddresses] = useState([]);
    const token = user ? user.accessToken : null;
    const link = process.env.REACT_APP_BACKEND_URL;

    const fetchUserData = async () => {
        try {
            const response = await fetch(`${link}/users/get_user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Thêm token vào header
                }
            });

            const data = await response.json();
            if (data && data.addresses) {
                setAddresses(data.addresses);  // Cập nhật dữ liệu địa chỉ
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        fetchUserData();

    }, []);
    
    useFocusEffect(
        useCallback(() => {
            fetchUserData();
          
           
        }, [])
    );

    // Fetch orders from backend
    const fetchOrders = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `${link}/order_details/get_by_user_and_status?status=On cart`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setOrders(response.data.flatMap(order => order.order_details || []));
            setOrder(response.data[0] || {});
        } catch (error) {
            console.error('Error fetching orders:', error.response || error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch food details by food_id
    const fetchFood = async (food_id) => {
       
        try {
            const response = await axios.get(`${link}/menu_items/?id=${food_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching food details:', error);
        }
    };
    useEffect(() => {
        if (orders.length > 0) {
            loadFoodDetails();
           
        }
    }, [orders]);
    // Load food images for each item
    const loadFoodDetails = async () => {
        const imageDetails = {};
        const nameDetails = {};
        const priceDetails = {};
        for (const item of orders) {
            const foodData = await fetchFood(item.item_id);
            imageDetails[item.item_id] = foodData?.image || null;
            nameDetails[item.item_id] = foodData?.name || null;
            priceDetails[item.item_id] = foodData?.price || null;
        }
        setFoodImage(imageDetails);
        setFoodName(nameDetails);
        setFoodPrice(priceDetails);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    

    const calculateTotal = () => {
        let subtotal = 0;
        let deliveryFee = 0;

        orders.forEach(item => {
            subtotal += item.total;
            deliveryFee += item.delivery_fee || 0;
        });

        const tax = subtotal * 0.1;
        const total = subtotal + tax + deliveryFee;

        return { subtotal, tax, deliveryFee, total };
    };
    const { subtotal, tax, deliveryFee, total } = calculateTotal();

    const updateQuantity = async (item_id, quantity) => {
        const item = orders.find(order => order.item_id === item_id);
        if (item) {
            const updatedTotal = foodPrice[item_id] * quantity;
            try {
                await axios.put(
                    `${link}/orders/update_quantity_and_total/${order.id}/${item.item_id}`,
                    { quantity, total: updatedTotal },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const updatedOrders = orders.map((order) => {
                    if (order.item_id === item_id) {
                        return { ...order, quantity, total: updatedTotal };
                    }
                    return order;
                });
                setOrders(updatedOrders);
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        }
    };

    const increaseQuantity = (item_id) => {
        const item = orders.find(order => order.item_id === item_id);
        if (item) {
            updateQuantity(item_id, item.quantity + 1);
        }
    };

    const decreaseQuantity = (item_id) => {
        const item = orders.find(order => order.item_id === item_id);
        if (item && item.quantity > 1) {
            updateQuantity(item_id, item.quantity - 1);
        }
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const formattedDate = new Intl.DateTimeFormat('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        }).format(date);
        const formattedTime = new Intl.DateTimeFormat('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);

        return { date: formattedDate, time: formattedTime };
    };
    const handleDelete = async (order_id, item_id) => {

        try {
            await axios.delete(`${link}/orders/delete_order_detail/${order_id}/${item_id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedOrders = orders.filter((order) => order.item_id !== item_id);
            setOrders(updatedOrders);
            setDeleteOrder(!deleteOrder);
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleConfirmOrder =  () => {
        if (!selectedAddress) {
            alert('Vui lòng chọn địa chỉ giao hàng');
            return;
        }
        
        router.push(`./paynow?address=${selectedAddress}`);
    };
    const renderOrderItem = ({ item }) => {
        const { date, time } = formatDate(item.estimated_delivery_time);

        return (
            <View style={styles.containerOrder}>

                <TouchableOpacity style={styles.trashIcon} onPress={() => handleDelete(order.id, item.item_id)}>
                    <Image source={require('../../assets/TrashIcon.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
                </TouchableOpacity>

                <View style={styles.orderItem}>
                    <Image
                        source={{ uri: foodImage[item.item_id] }}
                        style={styles.productImage}
                    />
                    <View style={styles.orderInfo}>
                        <View style={styles.productInfo}>
                            <Text style={styles.productName}>{foodName[item.item_id]}</Text>
                            <Text style={styles.estimated_delivery_date_time}>{date},{time}</Text>

                        </View>
                        <View style={styles.deliveryInfo}>
                            <Text style={styles.productPrice}>{item.total} VND</Text>
                            <Text style={styles.productQuantityText}>{item.quantity} sản phẩm</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => decreaseQuantity(item.item_id)}>
                                    <Image source={require('../../assets/LessIconRed.png')} style={styles.quantityButton} />
                                </TouchableOpacity>
                                <Text style={styles.productQuantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => increaseQuantity(item.item_id)}>
                                    <Image source={require('../../assets/AddIconRed.png')} style={styles.quantityButton} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Xác nhận đơn hàng" />
            <View style={styles.bodyContent}>
                {loading && <Text style={styles.loadingText}>Đang tải...</Text>}
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems:"center" }}>
                        <Text style={styles.addressContainer}> Địa chỉ giao hàng:</Text>
                        <TouchableOpacity onPress={() => router.push('../screens/addAddress')}>
                            <Image source={require('../../assets/addAddress.png')} style={{ width: 20, height: 20 }} />
                        </TouchableOpacity>
                    </View>
                    

                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedAddress}
                            onValueChange={(itemValue) => setSelectedAddress(itemValue)}
                           
                        >
                            <Picker.Item label="Chọn địa chỉ" value={null} />
                            {addresses.map((address, index) => (
                                <Picker.Item
                                    key={index}
                                    label={`${address.name} - ${address.address}`}
                                    value={address.address}
                                />
                            ))}
                        </Picker>
                    </View>
                    {selectedAddress && (
                        <Text style={styles.selectedText}> {selectedAddress}</Text>
                    )}
                </View>

                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.item_id}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.ordersList}
                />


                <View style={styles.footerItem}>
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Tạm tính:</Text>
                        <Text style={styles.footerText}>{subtotal} VND</Text>
                    </View>
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Thuế và Phí:</Text>
                        <Text style={styles.footerText}>{tax} VND</Text>
                    </View>
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Phí giao hàng:</Text>
                        <Text style={styles.footerText}>{deliveryFee} VND</Text>
                    </View>
                    <View style={styles.footerRow}>
                        <Text style={styles.footerText}>Tổng cộng:</Text>
                        <Text style={styles.footerText}>{total} VND</Text>
                    </View>
                    <TouchableOpacity onPress={handleConfirmOrder}>
                        <Text style={styles.footerBtn}>Đặt hàng ngay</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5CB58',
    },
    bodyContent: {
        flex: 4,
        backgroundColor: '#fff',
        width: '100%',
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        padding: 30,
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 18,
        color: '#E95322',
    },
    ordersList: {
        paddingBottom: 20,
    },
    orderItem: {
        flexDirection: 'row',

        marginBottom: 10,
    },
    productImage: {
        width: 90,
        height: 90,
        borderRadius: 12,
        marginRight: 15,
    },
    orderInfo: {
        paddingVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
    },
    productInfo: {
        justifyContent: 'space-between',
        width: '60%',
    },
    productName: {
        fontWeight: 'bold',
        fontSize: 15,
        color: '#2D2D2D',
    },
    productPrice: {
        fontSize: 12,
        color: '#FF6C44',
    },
    productQuantityText: {
        fontSize: 12,
        color: '#2D2D2D',
    },
    productQuantity: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2D2D2D',
    },
    deliveryInfo: {
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        width: '40%',
    },
    estimated_delivery_date_time: {
        fontSize: 12,
        color: '#2D2D2D',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    quantityButton: {
        width: 25,
        height: 25,
        margin: 5,
    },

    contentIfEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#2D2D2D',
        fontWeight: 'bold',
    },
    emptyIcon: {
        width: 50,
        height: 50,
    },
    footerItem: {
        borderTopColor: '#FFD8C7',
        borderTopWidth: 2,
        marginTop: 30,
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5,
    },
    footerText: {
        fontSize: 16,
        color: '#2D2D2D',
    },
    footerBtn: {
        backgroundColor: '#E95322',
        color: '#fff',
        padding: 10,
        borderRadius: 25,
        fontSize: 18,
        textAlign: 'center',
        marginTop: 20,
    },
    trashIcon: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    containerOrder: {
        borderTopColor: '#FFD8C7',
        borderTopWidth: 2,
        paddingTop: 10,
        borderBottomColor: '#FFD8C7',
    },
    addressContainer: {
        fontSize: 20,
        color: '#2D2D2D',
        fontWeight: 'bold',
        marginTop: 10,
    },
    selectedText: {
        fontSize: 16,
        color: '#2D2D2D',
        backgroundColor: '#F3E9B5',
        padding: 5,
        borderRadius: 10,
        marginTop: 5,
        marginBottom : 5
    },
});
export default ConfirmOrder;