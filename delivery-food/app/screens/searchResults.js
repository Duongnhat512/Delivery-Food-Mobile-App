import { Text, View, StyleSheet, FlatList, ActivityIndicator } from 'react-native'
import React, { Component, useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { UserContext } from '../contexts/userContext'
import axios from 'axios'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import HomeHeader from '../../components/homeheader'

const SearchResults = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDocId, setLastDocId] = useState(null);
  const { user } = useContext(UserContext);

  const params = useLocalSearchParams();
  const link = process.env.REACT_APP_BACKEND_URL;
  const token = user ? user.accessToken : null;

  const fetchItems = async () => {
    console.log(link);
    console.log(params.query);

    setItems([])
    if (loading || !hasMore) return;

    setLoading(true)

    try {
      const response = await axios.get(`${link}/menu_items/search`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 10,
          startAfter: lastDocId,
          search: params.query
        }
      });
      const newMenuItems = response.data

      setItems(prevItems => [...prevItems, ...newMenuItems])

      if (newMenuItems.length < 10) {
        setHasMore(false)
      }
      // else {
      //   setLastDocId(newMenuItems[newMenuItems.length - 1].id)
      // }



    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const renderFooter = () => {
    if (!loading) return null;
    return <ActivityIndicator size="large" color="#E95322" />
  }

  const data = [

  ]

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          router.push({ pathname: './foodDetails', params: { item: JSON.stringify(item) } });
        }}
      >
        <Image
          style={styles.image}
          source={{ uri: item.image }}
        />
        <Text style={styles.title} numberOfLines={2}>{item.name}</Text>
        <Text numberOfLines={2}>{item.description}</Text>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.price}>{item.price} VND</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  useEffect(() => {
    // fetchItems();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader/>
      <View style={styles.bodyContent}>
        <Text>Kết quả tìm kiếm cho {params.query}</Text>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          onEndReached={fetchItems}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          numColumns={2}
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5CB58"
  },
  bodyContent: {
    flex: 4,
    backgroundColor: '#fff',
    width: '100%',
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    paddingTop: 30,
  },
  card: {
    backgroundColor: '#fff',
    margin: 10,
    borderRadius: 10,
    padding: 10,
    width: '45%',
  },
  image: {
    width: '100%',
    height: 150,
    borderRadius: 30,
  },
  title: {
    fontFamily: 'LeagueSpartan-SemiBold',
    fontSize: 16,
  },
  price: {
    fontFamily: 'LeagueSpartan-Regular',
    fontSize: 18,
    color: '#E95322',
  },
});


export default SearchResults