import React, { useState, useEffect, useContext, useCallback } from 'react';

import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = () => {
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [loading, setLoading] = useState(true);
    const [foodImage, setFoodImage] = useState({});
    const [foodName, setFoodName] = useState({});
    const [foodPrice, setFoodPrice] = useState({});
    const { user } = useContext(UserContext);
    const router = useRouter();
    const token = user ? user.accessToken : null;
    const link = process.env.REACT_APP_BACKEND_URL;

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

    useFocusEffect(
        useCallback(() => {
          fetchOrders();
        }, [])
      );

    useEffect(() => {
        if (orders.length > 0) {
            loadFoodDetails();
           
        }
    }, [orders]);

    // Calculate total number of items in the cart
    const getTotalItemsInCart = () => {
        return orders.reduce((total, item) => total + item.quantity, 0);
    };
    const calculateTotal = () => {
        let subtotal = 0;
        let deliveryFee = 0;

        // Tính subtotal và tổng phí giao hàng
        orders.forEach(item => {
            subtotal += item.total; // Tính tổng số tiền cho các món
            deliveryFee += item.delivery_fee || 0;
        });

        const tax = subtotal * 0.1;
        const total = subtotal + tax + deliveryFee;

        return { subtotal, tax, deliveryFee, total };
    };
    const { subtotal, tax, deliveryFee, total } = calculateTotal();
    // Update item quantity
    const updateQuantity = async (item_id, quantity) => {
        const item = orders.find(order => order.item_id === item_id);
        if (item) {
            const updatedTotal = foodPrice[item_id] * quantity;  // Tính lại tổng giá trị
            try {
                // Gửi PUT request tới server
                await axios.put(
                    `${link}/orders/update_quantity_and_total/${order.id}/${item.item_id}`,
                    { quantity, total: updatedTotal },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                // Cập nhật danh sách đơn hàng sau khi thành công
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
    // Increase quantity
    const increaseQuantity = (item_id) => {
        const item = orders.find(order => order.item_id === item_id);
        if (item) {
            updateQuantity(item_id, item.quantity + 1);


        }
    };
    const handleCheckout = () => {
        if(orders.length === 0) {
            alert('Giỏ hàng của bạn đang trống');
            return;
        }
        router.push('./confirmOrder');
    };
    // Decrease quantity
    const decreaseQuantity = (item_id) => {
        const item = orders.find(order => order.item_id === item_id);
        if (item && item.quantity > 1) {
            updateQuantity(item_id, item.quantity - 1);

        }
    };
    const formatDate = (isoString) => {
        const date = new Date(isoString);

        // Định dạng ngày và giờ
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

    // Render order item
    const renderOrderItem = ({ item }) => {
        const { date, time } = formatDate(item.estimated_delivery_time);

        return (

            <View style={styles.orderItem}>
                <Image
                    source={{ uri: foodImage[item.item_id] }}
                    style={styles.productImage}
                />
                <View style={styles.orderInfo}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: "flex-start", flex: 2 }}>
                        <Text style={styles.productName}>{foodName[item.item_id]}</Text>
                        <Text style={styles.productPrice}>{item.total} VND</Text>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: "flex-end", flex: 1 }}>
                        <Text style={styles.estimated_delivery_date_time}>{date}</Text>
                        <Text style={styles.estimated_delivery_date_time}>{time}</Text>
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => decreaseQuantity(item.item_id)} >
                                <Image source={require('../../assets/LessIcon.png')} style={styles.quantityButton} />
                            </TouchableOpacity>
                            <Text style={styles.productQuantity}>{item.quantity}</Text>
                            <TouchableOpacity onPress={() => increaseQuantity(item.item_id)} >
                                <Image source={require('../../assets/AddIcon.png')} style={styles.quantityButton} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    source={require('../../assets/cartIcon.png')}
                    style={styles.icon}
                />
                <Text style={styles.headerText}>Giỏ hàng</Text>
            </View>

            {/* Display total number of items or empty cart message */}
            <Text style={styles.textNumber}>
                {getTotalItemsInCart() === 0
                    ? 'Giỏ hàng của bạn đang trống'
                    : `Bạn có ${getTotalItemsInCart()} sản phẩm trong giỏ hàng`}
            </Text>

            {/* Content */}
            {loading ? (
                <Text style={styles.loadingText}>Đang tải...</Text>
            ) : orders.length > 0 ? (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item.item_id.toString()}
                    renderItem={renderOrderItem}
                    contentContainerStyle={styles.ordersList}
                />
            ) : (
                <View style={styles.contentIfEmpty}>
                    <TouchableOpacity onPress={() => router.push('/(drawer)/home')}>
                        <Image
                            source={require('../../assets/Addtocar_Icon.png')}
                            style={styles.emptyIcon}
                        />
                    </TouchableOpacity>
                    <Text style={styles.emptyText}>
                        Bạn có muốn thêm sản phẩm vào giỏ hàng?
                    </Text>
                </View>
            )}
            {/* Footer */}
            {orders.length > 0 && (
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
                <TouchableOpacity onPress={handleCheckout}>
                    <Text style={styles.footerBtn}>Đặt hàng</Text>
                </TouchableOpacity>
           </View>
           
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E95322',
        paddingHorizontal: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 50,
        borderBottomColor: '#F5CB58',
        borderBottomWidth: 2,
    },
    icon: {
        width: 40,
        height: 40,
        marginRight: 8,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    loadingText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginTop: 20,
    },
    contentIfEmpty: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textNumber: {
        padding: 20,
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    emptyIcon: {
        width: 250,
        height: 250,
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    ordersList: {
        paddingVertical: 20,
    },
    orderItem: {

        flexDirection: 'row',
        borderRadius: 8,
        padding: 10,
        marginVertical: 10,
    },
    productImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 10,
    },
    orderInfo: {

        flex: 1,
        justifyContent: 'center',
        flexDirection: 'row',
    },
    productName: {
        width: "80%",
        flexWrap: 'wrap',
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
    },
    productPrice: {
        fontSize: 14,
        color: 'white',
        marginVertical: 5,
    },
    productQuantity: {
        fontSize: 18,
        color: 'white',
    },
    quantityContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    quantityButton: {
        width: 20,
        height: 20
    },
    footerItem: {
        padding: 15,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        marginTop: 20,
    },
    footerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'white',
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Để căn label và giá trị ở hai bên
        marginBottom: 10,
    },
    footerBtn: {
        backgroundColor: '#F5CB58',
        color: '#E95322',
        padding: 10,
        textAlign: 'center',
        borderRadius: 8,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    estimated_delivery_date_time: {
        fontSize: 14,
        color: 'white',
    },

});

export default CartScreen;
