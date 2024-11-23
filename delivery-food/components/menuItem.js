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
                </View>
            </TouchableOpacity>
            <View style={{ backgroundColor: "#E2E1E1", flex: 1, height: 10 }} />
        </View>
    );
};
const styles = StyleSheet.create({
    item: {
        overflow: "hidden",
        marginVertical: 20,
        paddingHorizontal: 20,
        flexDirection: "row",
        gap: 20
    }
})

export default MenuItem;