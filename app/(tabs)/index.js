import { View, Text, StyleSheet, Pressable, ScrollView, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Button } from 'react-native-paper';
import LibraryItem from '../../components/LibraryItem';
import useLibrary from '../../hooks/useLibrary';
import { AppContext } from '../../context/AppContext';
 
const USER_ID = '68d227d6-6190-4801-8d37-fe2ea6efdc52';
 
const SECTIONS = [
    { key: 'record', label: 'Albums'  },
    { key: 'track',  label: 'Songs'   },
    { key: 'artist', label: 'Artists' },
];
 
export default function Index() {
    const router = useRouter();
 
    const [viewFilters, setViewFilters] = useState({
        artist: 'list',
        record: 'list',
        track:  'list',
    });
 
    const { recentItems } = useContext(AppContext);
 
    const { data: allData } = useLibrary(USER_ID, '', 'Recently Added', 'Down');
 
    const toggleView = (key) =>
        setViewFilters(prev => ({
            ...prev,
            [key]: prev[key] === 'list' ? 'grid' : 'list',
        }));
 
    const getDataForType = (type) =>
        (allData ?? []).filter(item => item.type === type);
 
    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Home</Text>
                <View style={styles.icons}>
                    <Pressable onPress={() => router.push('/settings')}>
                        <Ionicons name="settings-outline" size={24} color="white" />
                    </Pressable>
                    <Pressable>
                        <AntDesign name="plus" size={24} color="white" />
                    </Pressable>
                </View>
            </View>
 
            {/* Filter buttons */}
            <View style={{ flexDirection: 'row', gap: 8, marginLeft: 15, marginBottom: 10 }}>
                <Button
                    buttonColor="#474747"
                    textColor="#ffffffde"
                    mode="contained"
                    labelStyle={{ fontSize: 14, lineHeight: 10 }}
                    style={{ width: 80, borderRadius: 20, height: 30 }}
                    onPress={() => console.log('Pressed')}
                >
                    All
                </Button>
                <Button
                    buttonColor="#474747"
                    textColor="#ffffffde"
                    mode="contained"
                    labelStyle={{ fontSize: 14, lineHeight: 10 }}
                    style={{ width: 95, borderRadius: 20, height: 30 }}
                    onPress={() => console.log('Pressed')}
                >
                    Music
                </Button>
            </View>
 
            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
 
                {/* Recent section — solo aparece si ya se reprodujo algo */}
                {recentItems.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Recent</Text>
                        </View>
                        <FlatList
                            horizontal
                            key="recent-list"
                            data={recentItems}
                            keyExtractor={(item) => `recent-${item.type}-${item.id}`}
                            contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item, index }) => (
                                <LibraryItem
                                    item={item}
                                    index={index}
                                    rowItems={[item]}
                                    viewFilter="grid"
                                    category={item.type}
                                    router={router}
                                    showPlay={false}
                                    containerStyle={{ marginLeft: 0 }}
                                    />
                            )}
                        />
                    </View>
                )}
 
                {/* Secciones principales */}
                {SECTIONS.map(({ key, label }) => {
                    const data = getDataForType(key);
                    if (!data.length) return null;
 
                    const viewFilter = viewFilters[key];
                    const isGrid = viewFilter === 'grid';
 
                    return (
                        <View key={key} style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Text style={styles.sectionTitle}>{label}</Text>
                                <Pressable
                                    style={styles.toggleButton}
                                    onPress={() => toggleView(key)}
                                >
                                    <Ionicons
                                        name={isGrid ? 'list-outline' : 'grid-outline'}
                                        size={20}
                                        color="white"
                                    />
                                </Pressable>
                            </View>
 
                            {isGrid ? (
                                <FlatList
                                    scrollEnabled={false}
                                    numColumns={3}
                                    key={`${key}-grid`}
                                    data={data}
                                    keyExtractor={(item) => `${item.type}-${item.id}`}
                                    contentContainerStyle={{ paddingHorizontal: 12 }}
                                    renderItem={({ item, index }) => {
                                        const start = Math.floor(index / 3) * 3;
                                        const rowItems = data.slice(start, start + 3);
                                        return (
                                            <LibraryItem
                                                item={item}
                                                index={index}
                                                rowItems={rowItems}
                                                viewFilter="grid"
                                                category={key}
                                                router={router}
                                                showPlay={false}
                                                containerStyle={{ marginLeft: 0 }}
                                            />
                                        );
                                    }}
                                />
                            ) : (
                                <FlatList
                                    horizontal
                                    key={`${key}-list`}
                                    data={data}
                                    keyExtractor={(item) => `${item.type}-${item.id}`}
                                    contentContainerStyle={{ paddingHorizontal: 12, gap: 12 }}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item, index }) => (
                                        <LibraryItem
                                            item={item}
                                            index={index}
                                            rowItems={[item]}
                                            viewFilter="grid"
                                            category={key}
                                            router={router}
                                            showPlay={false}
                                            containerStyle={{ marginLeft: 0 }}
                                        />
                                    )}
                                />
                            )}
                        </View>
                    );
                })}
            </ScrollView>
        </SafeAreaView>
    );
}
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#080808',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    icons: {
        flexDirection: 'row',
        marginTop: 2,
        gap: 18,
    },
    section: {
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'white',
    },
    toggleButton: {
        padding: 6,
    },
});