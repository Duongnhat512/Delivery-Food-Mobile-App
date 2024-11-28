import { Text, View, StyleSheet } from 'react-native'
import React, { Component, useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router, useLocalSearchParams } from 'expo-router'
import { UserContext } from '../contexts/userContext'
import axios from 'axios'

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
        setLoading(true);
        try {
            const response = await axios.get(`${link}/menu_items/search`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                params: {
                    search: params.query,
                    limit: 10,
                    startAfter: lastDocId
                }
            });
            setItems(prevItems => [...prevItems, ...response.data]);
            if (response.data.length > 0) {
                setLastDocId(response.data[response.data.length - 1].id);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    const renderFooter = () => {
        if (!loading) return null;
        return <ActivityIndicator size="large" color="#E95322" style={{ backgroundColor: "#E2E1E1" }} />
    }

    useEffect(() => {
        fetchItems();
        console.log(items);
    }, []);

    return (
        <SafeAreaView>

        </SafeAreaView>
    )
}

export default SearchResults