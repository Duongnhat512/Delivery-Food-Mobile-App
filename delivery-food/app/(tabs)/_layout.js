import { Tabs } from 'expo-router'
import TabBar from '../../components/tabbar';

const TabLayout = () => {
    return (
        <Tabs
            screenOptions={{ headerShown: false }}
            // tabBar={props => <TabBar {...props} />}
        >
            <Tabs.Screen name="home" />
        </Tabs>
    )
}

export default TabLayout;