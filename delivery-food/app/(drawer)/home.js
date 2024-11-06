import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity, ScrollView } from 'react-native'
import React, { Component } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import HomeHeader from '../../components/homeheader'
import { useNavigation } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'

const Home = () => {

  const navigation = useNavigation()

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
      name: "Đồ nước",
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

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <View style={styles.bodyContent}>
        <ScrollView>
          <View style={{ borderBottomWidth: 1, borderBottomColor: "#FFD8C7", paddingBottom: 15 }}>
            <FlatList
              data={item}
              keyExtractor={item => item.id}
              renderItem={renderItem}
              horizontal={true}
              contentContainerStyle={{ gap: 20 }}
            />
          </View>
          {/* Hiển thị các món best seller */}
          <View style={styles.bestSeller}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Text style={{ fontSize: 25, fontFamily: "LeagueSpartan-SemiBold" }}>
                Best Seller
              </Text>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
                <Text style={{ fontFamily: "LeagueSpartan-SemiBold", color: "#E95322", height: 25 }}>
                  Xem tất cả
                </Text>
                <Image
                  source={require('../../assets/arrow.png')}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    padding: 30,
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