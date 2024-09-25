import React, { useEffect } from 'react'
import { View, StyleSheet, Text, Image } from 'react-native'
import Swiper from 'react-native-swiper'
import SafeAreaView from 'react-native-safe-area-context'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'

const SwiperIntro = React.forwardRef(({ onIndexChanged }, ref) => {

    return (
        <Swiper
            dot={<View style={styles.dot} />}
            activeDot={<View style={styles.activeDot} />}
            ref={ref}
            loop={false}
            style={styles.wrapper}
            onIndexChanged={onIndexChanged}
        >
            <View style={styles.slide}>
                <Image
                    source={require('../assets/document-icon.png')}
                    width={31}
                    height={36}
                    style={styles.image}
                />
                <Text style={styles.text}>Đặt Đồ Ăn Của Bạn</Text>
                <Text style={{fontFamily: "LeagueSpartan-Regular", }}>Tinh hoa ẩm thực, tận hưởng tại nhà.</Text>
            </View>
            <View style={styles.slide}>
                <Image
                    source={require('../assets/card-icon.png')}
                    width={40}
                    height={27}
                    style={styles.image}
                />
                <Text style={styles.text}>Dễ Dàng Thanh Toán</Text>
                <Text style={{fontFamily: "LeagueSpartan-Regular"}}>Thanh toán nhanh chóng, đơn giản chỉ với vài thao tác.</Text>
            </View>
            <View style={styles.slide}>
                <Image
                    source={require('../assets/delivery-boy-icon.png')}
                    width={40}
                    height={38}
                    style={styles.image}
                />
                <Text style={styles.text}>Vận Chuyển Nhanh</Text>
                <Text style={{fontFamily: "LeagueSpartan-Regular"}}>Uy tín, chất lượng, giao hàng đúng hẹn.</Text>
            </View>
        </Swiper>
    )
})
const styles = StyleSheet.create({
    wrapper: {
    },
    slide: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        color: "#E95322",
        marginBottom: 15,
        fontFamily: "LeagueSpartan-SemiBold"
    },
    image: {
        resizeMode: "contain",
        margin: 20,
    },
    dot: {
        backgroundColor: '#F3E9B5',
        width: 20,
        height: 4,
        borderRadius: 2,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
    activeDot: {
        backgroundColor: '#E95322',
        width: 20,
        height: 4,
        borderRadius: 2,
        marginLeft: 3,
        marginRight: 3,
        marginTop: 3,
        marginBottom: 3,
    },
})

export default SwiperIntro