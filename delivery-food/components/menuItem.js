import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { ImageBackground } from "react-native";
import { View } from "react-native";

const { PureComponent } = require("react");

const MenuItem = ({ item }) => {
    const router = useRouter();

    return (
        <View>
            <TouchableOpacity
                style={styles.item}
                onPress={() => router.push({ pathname: 'screens/foodDetails', params: { item: JSON.stringify(item) } })}
            >
                <ImageBackground source={{ uri: item.image }} style={{ width: 100, height: 100 }} />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: "LeagueSpartan-Regular", fontSize: 18 }}>
                        {item.name}
                    </Text>
                    <Text style={{ fontFamily: "LeagueSpartan-Regular", fontSize: 18, color: "#E95322" }}>
                        {item.price} VND
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    item: {
        overflow: "hidden",
        padding: 20,
        flexDirection: "row",
        gap: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#FFD8C7",
    }
})

export default MenuItem;