import { Tabs } from 'expo-router';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Layout() {
    const { design, currentTrack } = useContext(AppContext);

    const tab = {
        union: { borderBottomLeftRadius: 40, borderBottomRightRadius: 40 },
        rounded: { borderRadius: 40 },
        square: { borderRadius: 20 }
    }

    return (
        <Tabs screenOptions = {{
            tabBarShowLabel: false,
            headerShown: false,
            sceneContainerStyle: { backgroundColor: '#000' },
            tabBarStyle: {
                backgroundColor: '#161616',
                borderTopWidth: 0,
                ...(currentTrack ? tab[design] : tab['rounded']),
                position: 'absolute',
                marginBottom: 26,
                marginHorizontal: 20,
                elevation: 0
            },
            tabBarItemStyle: {
                paddingTop: 13
            }
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: () => (
                        <Ionicons name="musical-notes" size={24} color="#727272" />
                    )
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: () => (
                        <FontAwesome name="search" size={24} color="#727272" />
                    )
                }}
            />
            <Tabs.Screen
                name="library"
                options={{
                    tabBarIcon: () => (
                        <FontAwesome6 name="lines-leaning" size={24} color="#727272" />
                    )
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{href: null}}
            />
        </Tabs>
    )
}