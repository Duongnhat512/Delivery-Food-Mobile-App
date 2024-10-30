import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

export default function TabBar({ state, descriptors, navigation }) {
    return (
        <View style={styles.container}>
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.name;
    
            const isFocused = state.index === index;
    
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
    
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name, route.params);
              }
            };
    
            const onLongPress = () => {
              navigation.emit({
                type: 'tabLongPress',
                target: route.key,
              });
            };
    
            return (
              <TouchableOpacity
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                onLongPress={onLongPress}
                style={{ flex: 1 }}
              >
                <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: "#E95322",
        height: 50,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30, 
        alignItems: 'center',
    }
})