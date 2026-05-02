import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function Settings() {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()}>
                    <Feather name="chevron-left" size={24} color="white"/>
                </Pressable>
                <Text style={styles.title}>Settings</Text>
            </View>
            <View>
                <Pressable onPress={() => router.push('/settings/design')}>
                    <View style={styles.options}>
                        <MaterialCommunityIcons name="application-edit-outline" size={20} color="white"/>
                        <Text style={styles.namesOp}>Design </Text>
                    </View>
                </Pressable>
                {/* <Pressable onPress={() => router.push('/')}></Pressable>
                <Pressable onPress={() => router.push('/')}></Pressable>
                <Pressable onPress={() => router.push('/')}></Pressable> */}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080808'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        margin: 18
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        marginTop: -1.5
    },
    options:  {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginLeft: 22,
        marginVertical: 8
    },
    namesOp: {
        fontSize: 20,
        color: 'white',
        marginTop: -2.5
    }
})