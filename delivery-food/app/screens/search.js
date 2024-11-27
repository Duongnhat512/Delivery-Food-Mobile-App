import { Text, View, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const Search = () => {
  const [searchText, setSearchText] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    const loadSearchHistory = async () => {
      try {
        const history = await AsyncStorage.getItem('searchHistory');
        if (history) {
          setSearchHistory(JSON.parse(history));
        }
      } catch (error) {
        console.error('Failed to load search history', error);
      }
    };

    loadSearchHistory();
  }, []);

  const handleSearch = async (text) => {
    setSearchText(text);
    if (text && !searchHistory.includes(text)) {
      const newHistory = [text, ...searchHistory].slice(0, 4);
      setSearchHistory(newHistory);
      try {
        await AsyncStorage.setItem('searchHistory', JSON.stringify(newHistory));
      } catch (error) {
        console.error('Failed to save search history', error);
      }
    }

    router.push({pathname: './searchResults', params: { query: text }});
  };

  return (
    <SafeAreaView>
      <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Tìm kiếm"
        style={styles.searchInput}
        onSubmitEditing={() => handleSearch(searchText)}
      />
      <FlatList
        data={searchHistory.slice(0, 4)}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => {
                handleSearch(item);
            }}
          >
            <Text style={styles.historyItem}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    margin: 10,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Search;