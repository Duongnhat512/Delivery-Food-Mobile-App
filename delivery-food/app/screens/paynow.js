import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState, useContext, useCallback } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomHeader from '../../components/customheader';
import { UserContext } from '../contexts/userContext';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';


const PayNow = () => {
    const [orders, setOrders] = useState([]);
  
    const [orderId, setOrderId] = useState(null);
    const [loading, setLoading] = useState(true);
   
    const [foodName, setFoodName] = useState({});
    
    const { user } = useContext(UserContext);
    const { address } = useLocalSearchParams();

    const [payments, setPayments] = useState([]);
    const [selectedPayment, setSelectedPayment] = useState(null);
    const router = useRouter();
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
            if (data && data.payments) {
                setPayments(data.payments);
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
            setOrderId(response.data[0]?.id);
            setOrders(response.data.flatMap(order => order.order_details || []));
         
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
       
        const nameDetails = {};
        const priceDetails = {};
        for (const item of orders) {
            const foodData = await fetchFood(item.item_id);
            nameDetails[item.item_id] = foodData?.name || null;
            priceDetails[item.item_id] = foodData?.price || null;
        }
        
        setFoodName(nameDetails);
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
    const {  total } = calculateTotal();

    
    const updateOrderStatus = async (itemId) => {
        try {
            const response = await axios.put(`${link}/orders/update_only_status/${orderId}/${itemId}`, {
                status: "Chưa giao",
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
    
            if (response.status === 200) {
                return true;
            } else {
                alert('Thanh toán thất bại');
                return false;
            }
        } catch (error) {
            console.error('Error cancelling order:', error);
            return false;
        }
    };

   

    const handleConfirmOrder = async () => {
        if (!selectedPayment) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }
    
        const updatePromises = orders.map(order => updateOrderStatus( order.item_id));
        const results = await Promise.all(updatePromises);
    
        if (results.every(result => result)) {
            router.push('/orders');
        } else {
            alert('Some orders failed to update');
        }
    };
    const renderOrderItem = ({ item }) => {
        

        return (
            <View style={styles.containerOrder}>

                <View style={styles.orderItem}>
                    <View style={styles.orderInfo}>
                        <Text style={styles.productName}>{foodName[item.item_id]}</Text>
                        <Text style={styles.productQuantityText}>{item.quantity} sản phẩm</Text>
                    </View>
                    <View style={styles.subtotal}>
                        <Text  style={{fontWeight: 'bold', fontSize: 16}}>{total} VND</Text>
                    </View>
                </View>
            </View>
        );
    };

    const renderPaymentItem = ({ item }) => {
        const formattedCardNumber = `**** **** **** ${item.cardNumber.slice(-4)}`;
        const isSelected = selectedPayment === item;
    
        return (
            <TouchableOpacity onPress={() => setSelectedPayment(item)}>
                <View style={[styles.containerPayment, isSelected && styles.selectedContainer]}>
                    <View style={styles.paymentItem}>
                        <Image source={require('../../assets/payment-method.png')} style={styles.paymentImage} />
                        <Text>Credit Card</Text>
                    </View>
                    <Text style={styles.paymentText}>{formattedCardNumber}</Text>
                </View>
            </TouchableOpacity>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <CustomHeader title="Thanh toán" />
            <View style={styles.bodyContent}>
                {loading && <Text style={styles.loadingText}>Đang tải...</Text>}
                <View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                        <Text style={styles.addressContainer}> Địa chỉ giao hàng:</Text>
                    </View>

                    <Text style={styles.selectedText}>{address}</Text>
                </View>
                <View style={styles.ordersListContainer}>
                    <Text style={styles.textTitle}>Đơn hàng:</Text>
                    <FlatList
                        data={orders}
                        keyExtractor={(item) => item.item_id.toString()}
                        renderItem={renderOrderItem}
                        contentContainerStyle={styles.ordersList}
                    />
                </View>
                <View style={styles.ordersListPayment}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                        <Text style={styles.textTitle}>Phương thức thanh toán:</Text>
                        <TouchableOpacity onPress={() => router.push('./addPayment')}>
                            <Image source={require('../../assets/addAddress.png')} style={styles.paymentImage} />
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        data={payments}
                        keyExtractor={(item) => item.cardNumber.toString()}
                        renderItem={renderPaymentItem}
                        contentContainerStyle={styles.ordersList}
                    />
                </View>
                <View style={styles.timeDelivery}>

                    <Text style={styles.textTitle}>Thời gian giao hàng:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: "center" }}>
                        <Text >Dự kiến giao hàng:</Text>
                        <Text  style={{fontWeight: 'bold', fontSize: 16}}
                        >25 phút</Text>
        

                    </View>
                </View>
                
                <View style={styles.footerItem}>
                    
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
    ordersListContainer: {
        flex: 1,
        borderColor: '#FFD8C7',
        borderBottomWidth: 2,
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
        alignItems: 'center',
        paddingRight: 10,
        flex: 3,
    },
    ordersListPayment: {
        flex: 1,
    },
    productInfo: {
        justifyContent: 'space-between',
        width: '60%',
    },
    productName: {
        flex:3,
        fontWeight: 'bold',
        fontSize: 15,
        color: '#2D2D2D',
    },
    productPrice: {
        fontSize: 12,
        color: '#FF6C44',
    },
    productQuantityText: {
        textAlign: 'right',
        flex:2,
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
    textTitle: {
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
        marginBottom: 5
    },
    subtotal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerPayment: {
        padding: 10,
        marginVertical: 5,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        
    
    },
    paymentItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    selectedContainer: {
        borderWidth: 2,
        borderColor: '#007BFF',
        borderRadius: 10,
    },
    paymentText: {
        backgroundColor: '#F3E9B5',
        borderRadius: 10,
        padding: 5,
        fontSize: 12,
        fontWeight: 'bold',
        color: '#333',
        
    },
});
export default PayNow;