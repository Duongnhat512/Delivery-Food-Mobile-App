import React, { useState, useEffect, useContext, useCallback } from 'react';

import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const CartScreen = () => {
    const [orders, setOrders] = useState([]);
    const [footerDetails, setFooterDetails] = useState({
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
    });
    const [loading, setLoading] = useState(true);
    const [foodImage, setFoodImage] = useState({});
    const [foodName, setFoodName] = useState({});
    const [foodPrice, setFoodPrice] = useState({});
    const [isChoose, setIsChoose] = useState(false);
    const { user } = useContext(UserContext);
    const router = useRouter();
    const token = user ? user.accessToken : null;
    const link = process.env.REACT_APP_BACKEND_URL;
    const fetchCarts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${link}/users/get_user`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.data && response.data.cart) {
                setOrders(response.data.cart);
            } else {
                console.error('Unexpected response data format:', response.data);
            }
        } catch (error) {
            console.error('Error fetching orders:', error.response || error.message);
        } finally {
            setLoading(false);
        }
    };
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
          fetchCarts();
        }, [])
      );
      useEffect(() => {
        const fetchFooterDetails = async () => {
            const details = await calculateFooterDetails();
            setFooterDetails(details);
        };
    
        fetchFooterDetails();
    }, [orders]);
    useEffect(() => {
        if (orders.length > 0) {
            loadFoodDetails();
           
        }
    }, [orders]);

    useEffect(() => {
        fetchCarts();
    }, [isChoose]);


    const handleIncreaseQuantity = async (item_id) => {
        const cartItem = {
            item_id: item_id,
            quantity: 1,
        };
        try {
            const response = await axios.post(
                `${link}/users/add_Cart`,
                cartItem,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setIsChoose(!isChoose);
            if (response.status === 200) {
                console.log('Increase quantity:', response.data);
            } else {
                console.error('Unexpected response:', response);
                alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error.response || error.message);
            alert('Không thể thêm sản phẩm vào giỏ hàng.');
        }
    };
    const handleDecreaseQuantity = async (item) => {
        if (item.quantity === 1) {
            return;
        }
       
        const cartItem = {
            item_id: item.item_id,
            quantity: -1,
        };
      
        
        

        try {
            const response = await axios.post(
                `${link}/users/add_Cart`, // API endpoint thêm vào giỏ hàng
                cartItem,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, // Token xác thực
                    },
                }
            );
            setIsChoose(!isChoose);
            if (response.status === 200) {
                console.log('Decrease quantity:', response.data);
            } else {
                console.error('Unexpected response:', response);
                alert('Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng.');
            }
        } catch (error) {
            console.error('Error adding to cart:', error.response || error.message);
            alert('Không thể thêm sản phẩm vào giỏ hàng.');
        }
    };

    const getTotalItemsInCart = () => {
        return orders.reduce((total, order) => total + order.quantity, 0);
    };
    const handleCheckout = () => {
        if(orders.length === 0) {
            alert('Giỏ hàng của bạn đang trống');
            return;
        }
        router.push('./confirmOrder');
    };
    const calculateFooterDetails = async () => {
        let subtotal = 0;
        let deliveryFee = 20; 
        const taxRate = 0.1; 
    
        for (const item of orders) {
            const foodData = await fetchFood(item.item_id); // Lấy dữ liệu món ăn từ backend
            const price = foodData?.price || 0; // Giá sản phẩm (nếu không có thì mặc định là 0)
            subtotal += price * item.quantity; // Tính tổng tiền hàng (subtotal)
        }
    
        const tax = subtotal * taxRate; // Tính thuế
        const total = subtotal + tax + deliveryFee; // Tổng cộng
    
        return { subtotal, tax, deliveryFee, total };
    };
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };
    const renderOrderItem = ({ item }) => {
        return (

            <View style={styles.orderItem}>
                <Image
                    source={{ uri: foodImage[item.item_id] }}
                    style={styles.productImage}
                />
                <View style={styles.orderInfo}>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: "flex-start", flex: 2 }}>
                        <Text style={styles.productName}>{foodName[item.item_id]}</Text>
                        <Text style={styles.productPrice}>{formatCurrency(foodPrice[item.item_id]*item.quantity*1000)}</Text>
                    </View>
                    <View style={{ flexDirection: 'column', justifyContent: 'space-between', alignItems: "flex-end", flex: 1 }}>
             
                        <View style={styles.quantityContainer}>
                            <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
                                <Image source={require('../../assets/LessIcon.png')} style={styles.quantityButton} />
                            </TouchableOpacity>
                            <Text style={styles.productQuantity}>{item.quantity}</Text>
                            <TouchableOpacity  onPress={() => handleIncreaseQuantity(item.item_id)}>
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
                   <Text style={styles.footerText}>{formatCurrency(footerDetails.subtotal*1000)}</Text>
               </View>
               <View style={styles.footerRow}>
                   <Text style={styles.footerText}>Thuế và Phí:</Text>
                   <Text style={styles.footerText}>{formatCurrency(footerDetails.tax*1000)}</Text>
               </View>
               <View style={styles.footerRow}>
                   <Text style={styles.footerText}>Phí giao hàng:</Text>
                   <Text style={styles.footerText}>{formatCurrency(footerDetails.deliveryFee*1000)}</Text>
               </View>
               <View style={styles.footerRow}>
                   <Text style={styles.footerText}>Tổng cộng:</Text>
                   <Text style={styles.footerText}>{formatCurrency(footerDetails.total*1000)}</Text>
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
