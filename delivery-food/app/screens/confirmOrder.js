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
    const [footerDetails, setFooterDetails] = useState({
        subtotal: 0,
        tax: 0,
        deliveryFee: 0,
        total: 0,
    });
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
    const [isChoose, setIsChoose] = useState(false);
    const fetchUserData = async () => {
        setLoading(true);
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
            if (data && data.cart) {
                setOrders(data.cart);  // Cập nhật dữ liệu giỏ hàng
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }finally {
            setLoading(false);
        }

    };

    useEffect(() => {
        if (orders.length > 0) {
            loadFoodDetails();
        }
    }, [orders]);
    
    useEffect(() => {
        fetchUserData();
    }, [isChoose]);

    useEffect(() => {
        fetchUserData();
    }, []);
    
    useFocusEffect(
        useCallback(() => {
            fetchUserData();

        }, [])
    );

    
    useEffect(() => {
        const fetchFooterDetails = async () => {
            const details = await calculateFooterDetails();
            setFooterDetails(details);
        };
    
        fetchFooterDetails();
    }, [orders]);
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

    
    const handleDeleteOrder = async (item_id) => {
        try {
            const response = await axios.delete(
                `${link}/users/delete_cart_item/${item_id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
    
            if (response.status === 200) {
                alert('Xóa sản phẩm khỏi giỏ hàng thành công');
                fetchUserData(); // Refresh user data to update the cart
            } else {
                alert('Failed to remove item from cart');
            }
        } catch (error) {
            console.error('Error deleting order:', error);
            alert('Error deleting order');
        }
    };
    
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
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
    const handleDecreaseQuantity = async (item) => {
        if (item.quantity === 1) {
            return;
        }
       
        const cartItem = {
            item_id: item.item_id,
            quantity: -1,
        };
        console.log('item:', item.quantity);
        
        

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
                        Authorization: `Bearer ${token}`, // Token xác thực
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
    const handleConfirmOrder =  () => {
        if (!selectedAddress) {
            alert('Vui lòng chọn địa chỉ giao hàng');
            return;
        }
        
        router.push(`./paynow?address=${selectedAddress}`);
    };
    const renderOrderItem = ({ item }) => {
        //thoi gian hien tai new now
        const { date, time } = formatDate( new Date().toISOString());

        return (
            <View style={styles.containerOrder}>

                <TouchableOpacity style={styles.trashIcon} onPress={() => handleDeleteOrder(item.item_id)}>
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
                            <Text style={styles.productPrice}>{formatCurrency(foodPrice[item.item_id]*1000)}</Text>
                            <Text style={styles.productQuantityText}>{item.quantity} sản phẩm</Text>
                            <View style={styles.quantityContainer}>
                                <TouchableOpacity onPress={() => handleDecreaseQuantity(item)}>
                                    <Image source={require('../../assets/LessIconRed.png')} style={styles.quantityButton} />
                                </TouchableOpacity>
                                <Text style={styles.productQuantity}>{item.quantity}</Text>
                                <TouchableOpacity onPress={() => handleIncreaseQuantity(item.item_id)}>
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