import { router } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react'
import { Text, View, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator, FlatList, } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import CustomHeader from '../../components/customheader';
import axios from 'axios';
import { UserContext } from '../contexts/userContext';

const Orders = () => {
  const [select, setSelect] = useState("Đã đặt")
  const { user } = useContext(UserContext)
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [deliveringOrders, setDeliveringOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [canceledOrders, setCanceledOrders] = useState([]);

  const token = user.accessToken;
  const link = process.env.REACT_APP_BACKEND_URL;

  const fetchOrders = async () => {
    if (loading || !hasMore) return;

    setLoading(true)
    console.log(link);


    try {
      const response = await axios.get(`${link}/order_details/get_by_user_not_delivered`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 10,
          startAfter: lastDocId
        }
      })

      const newOrders = response.data;
      setOrders(prevOrders => [...prevOrders, ...newOrders]);

      if (newOrders.length > 0) {
        setLastDocId(newOrders[newOrders.length - 1].id);

      } else {
        setHasMore(false);
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFood = async (food_id) => {
    try {
      const response = await axios.get(`${link}/menu_items/?id=${food_id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      return response.data;
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    fetchOrders();
  }, [])

  const handleSelect = (status) => {
    setSelect(status);
  };

  const renderOrders = ({ item }) => {
    return (
      <View>
        {item.order_details && item.order_details.map((detail, index) => (
          <View key={index}>
            <FoodDetail food_id={detail.item_id} quantity={detail.quantity} created_at={item.created_at} />
          </View>
        ))}
      </View>
    );
  }

  const FoodDetail = ({ food_id, quantity, created_at }) => {
    const [food, setFood] = useState(null);

    useEffect(() => {
      const fetchData = async () => {
        const foodData = await fetchFood(food_id);
        setFood(foodData);
      };

      fetchData();
    }, [food_id]);

    if (!food) {
      return <ActivityIndicator size="large" color="#E95322" style={{ backgroundColor: "#fff" }} />
    }

    return (
      <View style={{ flexDirection: "row", gap: 10, marginHorizontal: 30, paddingVertical: 15, borderBottomWidth: 1, borderColor: "#FFD8C7" }}>
        <TouchableOpacity>
          <Image
            source={{ uri: food.image }}
            resizeMode='cover'
            style={{ width: 70, height: 100, borderRadius: 20 }}
          />
        </TouchableOpacity>
        <View style={{ width: "40%", padding: 5, gap: 5 }}>
          <Text style={{ fontSize: 18, fontFamily: "LeagueSpartan-SemiBold" }} numberOfLines={2}>{food.name}</Text>
          <Text style={{ fontSize: 14, fontFamily: "LeagueSpartan-Regular", }}>{created_at}</Text>
          <TouchableOpacity
            style={{ backgroundColor: "#E95322", borderRadius: 20, marginTop: 5, paddingHorizontal: 10, width: 70, alignItems: "center", }}
          >
            <Text style={{ fontSize: 14, fontFamily: "LeagueSpartan-Regular", color: "#fff", }}>Hủy đơn</Text>
          </TouchableOpacity>
        </View>
        <View style={{ alignItems: "flex-end", padding: 5 }}>
          <Text style={{ fontSize: 18, fontFamily: "LeagueSpartan-SemiBold", color: "#E95322" }}>{food.price}đ</Text>
          <Text style={{ fontSize: 14, fontFamily: "LeagueSpartan-Regular", }}>Số lượng: {quantity}</Text>
        </View>
      </View>
    );
  }

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#E95322" style={{ backgroundColor: "#fff" }} />
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Đơn hàng" />
      <View style={styles.bodyContent}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 30, marginHorizontal: 30, borderBottomWidth: 1, paddingBottom: 20, borderColor: "#FFD8C7" }}>
          <TouchableOpacity onPress={() => handleSelect("Đã đặt")}>
            <Text style={[styles.filterBtn, select === "Đã đặt" && styles.selectedBtn, { fontFamily: 'LeagueSpartan-Regular' }]}>Đã đặt</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đang giao")}>
            <Text style={[styles.filterBtn, select === "Đang giao" && styles.selectedBtn, { fontFamily: 'LeagueSpartan-Regular' }]}>Đang giao</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đã giao")}>
            <Text style={[styles.filterBtn, select === "Đã giao" && styles.selectedBtn, { fontFamily: 'LeagueSpartan-Regular' }]}>Đã giao</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSelect("Đã hủy")}>
            <Text style={[styles.filterBtn, select === "Đã hủy" && styles.selectedBtn, { fontFamily: 'LeagueSpartan-Regular' }]}>Đã hủy</Text>
          </TouchableOpacity>
        </View>
        {orders.length > 0 ? (
          <>
            <FlatList
              data={orders}
              keyExtractor={(item) => item.id}
              renderItem={renderOrders}
              onEndReached={fetchOrders}
              onEndReachedThreshold={0.1}
              ListFooterComponent={renderFooter}
            />
          </>
        ) : (
          <View style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image source={require('../../assets/TransferDocument.png')} />
              <Text style={{ fontFamily: 'LeagueSpartan-Regular', fontSize: 30, textAlign: 'center', width: '70%', color: '#E95322' }}>Bạn không có đơn hàng nào</Text>
            </ScrollView>
          </View>
        )}
      </View>

    </SafeAreaView>
  )
}
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
  },
  menuItem: {
    backgroundColor: "#F3E9B5",
    height: 62,
    width: 49,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
  filterBtn: {
    fontSize: 14,
    color: "#E95322",
    backgroundColor: "#FFEFE8",
    borderRadius: 20,
    width: 75,
    textAlign: "center",
    paddingVertical: 4,
  },
  selectedBtn: {
    backgroundColor: "#E95322",
    color: "#FFEFE8",
  },
  footer: {
    backgroundColor: '#E95322',
    width: '100%',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 20,
  }
})


export default Orders;



