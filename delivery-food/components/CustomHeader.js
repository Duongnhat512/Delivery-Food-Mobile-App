import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";

const CustomHeader = ({ title }) => {
    return (
        <View style={styles.wrapper}>
            <TouchableOpacity style={styles.button} onPress={() => router.back()}>
                <Image
                    source={require('../assets/next-icon.png')}
                    style={{ transform: [{ rotate: '180deg' }] }}
                />
            </TouchableOpacity>
            <Text style={styles.title}>{title}</Text>
            <View></View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5CB58',
        justifyContent: 'space-around',
        width: '100%',
        paddingBottom: "10%",
        paddingTop: "10%",
    },
    title: {
        fontSize: 24,
        color: '#fff',
        fontFamily: 'LeagueSpartan-Bold',
        height: 40,
    },
    button:{
        
    },
});

export default CustomHeader;