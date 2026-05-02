import { Text, View, StyleSheet, Image, Pressable, ScrollView } from "react-native";
import { useContext } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../../../context/AppContext";

export default function Design() {
    const { design, setDesign } = useContext(AppContext);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 170}}>
                <View style={styles.header}>
                    <Text style={styles.title}>Designs</Text>
                </View>
                <Text style={styles.topic}>Player Design</Text>
                <View style={[styles.options, design === 'union' && {borderColor: '#FFF', borderWidth: 1.2}]}>
                    <Pressable onPress={() => setDesign('union')}>
                        <Image
                            style={{width: '100%', height: undefined, aspectRatio: 2}}
                            resizeMode='contain'
                            source={require('../../../assets/Design1.jpg')}
                        />
                    </Pressable>
                </View>
                <View style={[styles.options, design === 'rounded' && {borderColor: '#FFF', borderWidth: 1.2}]}>
                    <Pressable onPress={() => setDesign('rounded')}>
                        <Image
                            style={{width: '100%', height: undefined, aspectRatio: 2}}
                            resizeMode='contain'
                            source={require('../../../assets/Design2.jpg')}
                        />
                    </Pressable>
                </View>
                <View style={[styles.options, design === 'square' && {borderColor: '#FFF', borderWidth: 1.2}]}>
                    <Pressable onPress={() => setDesign('square')}>
                        <Image
                            style={{width: '100%', height: undefined, aspectRatio: 2}}
                            resizeMode='contain'
                            source={require('../../../assets/Design3.jpg')}
                        />
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        margin: 18
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: 'white',
        marginTop: -1.5,
        marginBottom: -2
    },
    topic: {
        fontSize: 18,
        color: 'white',
        marginVertical: 10,
        marginLeft: 19
    },
    options: {
        borderRadius: 20,
        borderColor: "#ffffff5f",
        borderWidth: 0.2,
        margin: 12,
        padding: 2
    }
})