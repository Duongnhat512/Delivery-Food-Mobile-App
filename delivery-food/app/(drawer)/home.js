import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView, BackHandler, ToastAndroid, ActivityIndicator, SectionList, ImageBackground } from 'react-native'
import React, { Component, useEffect, useState, useCallback, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeHeader from '../../components/homeheader'
import { DrawerActions, useFocusEffect } from '@react-navigation/native'
import axios from 'axios'
import { UserContext } from '../contexts/userContext'
import MenuItem from '../../components/menuItem'

const Home = () => {
  const [backPressCount, setBackPressCount] = useState(0);
  const [menuItems, setMenuItems] = useState([]);
  const [lastDocId, setLastDocId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const { user } = useContext(UserContext);

  const token = user.accessToken;

  const fetchMenuItems = async () => {
    if (loading || !hasMore) return;

    console.log(token)
    setLoading(true)

    try {
      const response = await axios.get('http://192.168.2.59:5000/v1/menu_items', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 10,
          startAfter: lastDocId
        }
      });

      const newMenuItems = response.data;
      setMenuItems(prevMenuItems => [...prevMenuItems, ...newMenuItems]);

      if (newMenuItems.length > 0) {
        setLastDocId(newMenuItems[newMenuItems.length - 1].id);
      } else {
        setHasMore(false);
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMenuItems();
  }, [])

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#E95322" style={{backgroundColor: "#E2E1E1"}}/>
  }

  const item = [
    {
      id: 1,
      name: "Ăn vặt",
      img: require('../../assets/snacks.png')
    },
    {
      id: 2,
      name: "Ăn chính",
      img: require('../../assets/meals.png')
    },
    {
      id: 3,
      name: "Đồ uống",
      img: require('../../assets/drinks.png')
    },
    {
      id: 4,
      name: "Tráng miệng",
      img: require('../../assets/desserts.png')
    },
    {
      id: 5,
      name: "Ăn chay",
      img: require('../../assets/vegan.png')
    }
  ]

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ gap: 5, alignItems: "center", width: 50 }}>
        <View style={styles.menuItem}>
          <Image source={item.img} />
        </View>
        <Text style={{ fontSize: 12, fontFamily: "LeagueSpartan-Regular", width: 70, textAlign: 'center' }}
          numberOfLines={1}
          ellipsizeMode='tail'
        >{item.name}</Text>
      </TouchableOpacity>
    )
  }

  const renderFood = ({ item }) => {
    return (
      <MenuItem item={item} />
    )
  }

  const handleBackButton = useCallback(() => {
    if (backPressCount === 0) {
      setBackPressCount(prevCount => prevCount + 1);
      setTimeout(() => setBackPressCount(0), 2000);
      ToastAndroid.show('Nhấn quay lại 1 lần nữa để thoát', ToastAndroid.SHORT);
    } else if (backPressCount === 1) {
      BackHandler.exitApp();
    }
    return true;
  }, [backPressCount]);


  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        handleBackButton();
        return true;
      };

      BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => {
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
      };
    })
  );


  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <View style={styles.bodyContent}>
        <View style={{ borderBottomWidth: 1, borderBottomColor: "#FFD8C7", marginHorizontal: 20, paddingBottom: 15, position: "static", alignItems: "center" }}>
          <FlatList
            data={item}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            horizontal={true}
            contentContainerStyle={{ gap: 20 }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            data={menuItems}
            keyExtractor={item => item.id}
            renderItem={renderFood}
            onEndReached={fetchMenuItems}
            onEndReachedThreshold={1}
            ListFooterComponent={renderFooter}
            ListHeaderComponent={
              <>
                {/* Hiển thị các món best seller */}
                <View style={styles.bestSeller}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }}>
                    <Text style={{ fontSize: 25, fontFamily: "LeagueSpartan-SemiBold" }}>
                      Best Seller
                    </Text>
                    <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                      <Text style={{ fontFamily: "LeagueSpartan-SemiBold", color: "#E95322", height: 25, textAlign: "center" }}>
                        Xem tất cả
                      </Text>
                      <Image
                        source={require('../../assets/arrow.png')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={{ fontSize: 25, fontFamily: "LeagueSpartan-SemiBold", marginTop: 20, borderBottomWidth: 1, borderBottomColor: "#FFD8C7", marginHorizontal: 20}}>
                  Đề xuất
                </Text>
              </>
            }
          />

        </View>
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
    paddingTop: 30,
  },
  menuItem: {
    backgroundColor: "#F3E9B5",
    height: 62,
    width: 49,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
  },
})

export default Home