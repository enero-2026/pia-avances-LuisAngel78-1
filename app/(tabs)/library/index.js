import { Text, View, StyleSheet, Pressable, ScrollView, FlatList, Dimensions } from "react-native";
import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants/Colors";
import { globalStyles } from "../../../constants/globalStyles";
import useLibrary from "../../../hooks/useLibrary";
import LibrarySort from "../../../components/LibrarySort";
import LibraryItem from "../../../components/LibraryItem";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Library() {
    // ? ------------------------------------ Variables ------------------------------------
    const router = useRouter();
    
    const [category, setCategory] = useState('');
    const [subCategory, setSubCategory] = useState('');
    
    const filters = ['Tracks', 'Records', 'Playlists', 'Artists', 'Downloaded'];
    const secondFilters = ['By You', 'By Others'];
    const getFilters = () => {
        if (category === '') return filters;
        else if (category === 'Playlists') return [category, ...(subCategory ? [subCategory] : []), ...secondFilters.filter(f => f !== subCategory), ...filters.filter(f => f !== category)]
        return [category, ...filters.filter(f => f !== category)]
    }

    const [viewFilter, setViewFilter] = useState('grid');

    const [order, setOrder] = useState('Recently Added');
    const [direction, setDirection] = useState('Down');

    const { data } = useLibrary('68d227d6-6190-4801-8d37-fe2ea6efdc52', category, order, direction);

    // ? ------------------------------------ Concatenated Styles  ------------------------------------
    const filterStyles = (filter) => {
        return [
            styles.filterOptions,
            category === filter && { backgroundColor: colors.activeCategory }, 
            subCategory === filter && {
                backgroundColor: colors.activeCategory, 
                borderTopLeftRadius: 0, 
                borderBottomLeftRadius: 0, 
                marginLeft: -12.8
            },
            (category === filter && subCategory) && {
                borderTopRightRadius: 0, 
                borderBottomRightRadius: 0, 
                paddingRight: 8
            }
        ];
    };
    const viewButton = {
        list: { 
            paddingLeft: 15, 
            paddingRight: 13.8, 
            paddingVertical: 7.1, 
            borderTopLeftRadius: 20, 
            borderBottomLeftRadius: 20 
        },
        grid: { 
            paddingLeft: 12.3, 
            paddingRight: 15, 
            paddingVertical: 3.8, 
            marginTop: 10.4, 
            borderTopRightRadius: 20, 
            borderBottomRightRadius: 20 
        }
    }
    const viewButtonStyle = (type) => [
        styles.viewOptions, 
        viewFilter === type && { backgroundColor: colors.activeView },
        viewButton[type]
    ]

    // # -------------------------------------------------------------------------------------------------
    return (
        <SafeAreaView style={globalStyles.container}>
            <FlatList
                data={data}
                key={viewFilter}
                numColumns={viewFilter === 'grid' ? 3 : 1}
                keyExtractor={(item) => item.type === 'track' ? `track-${item.id}` : `record-${item.id}`}
                contentContainerStyle={{ paddingBottom: 180 }}
                ListHeaderComponent={() => (
                    <>
                        {/* ? ------------------------------------ Header ------------------------------------ */}
                        <View style={styles.headerContainer}>
                            <Text style={styles.headerTitle}>Library</Text>
                            <View style={styles.headerIcons}>
                                <Pressable onPress={() => router.push('')}>
                                    <FontAwesome6 name="add" size={24} color="white" />
                                </Pressable>
                                <Pressable onPress={() => router.push('')}>
                                    <Feather name="search" size={24} color="white"/>
                                </Pressable>
                            </View>
                        </View>
                        {/* ? ---------------------------------- Category Filters ---------------------------------- */}
                        <ScrollView horizontal nestedScrollEnabled>
                            <View style={styles.filtersContainer}>
                                {getFilters().map(filter => (
                                    <Pressable 
                                        key={filter}
                                        style={filterStyles(filter)}
                                        onPress={() => {
                                            if (secondFilters.includes(filter)) {
                                                setSubCategory(subCategory === filter ? '' : filter);
                                            } else {
                                                setCategory(category === filter ? '' : filter);
                                                setSubCategory('')
                                            }
                                        }}
                                    >
                                        <Text style={{color: 'white'}}>{filter}</Text>
                                    </Pressable>
                                ))}
                            </View>
                        </ScrollView>
                        {/* ? ---------------------------------- View Options ---------------------------------- */}
                        <View style={styles.viewContainer}>
                            <Pressable 
                                style={viewButtonStyle('list')} 
                                onPress={() => setViewFilter(viewFilter === 'list' ? 'grid' : 'list')}
                            >
                                <FontAwesome5 name="th-list" size={16.5} color={viewFilter === 'list' ? "black" : "white"}/>
                            </Pressable>
                            <Pressable 
                                style={viewButtonStyle('grid')} 
                                onPress={() => setViewFilter(viewFilter === 'grid' ? 'list' : 'grid')}
                            >
                                <Entypo name="grid" size={24} color={viewFilter === 'grid' ? "black" : "white"}/>
                            </Pressable>
                            {/* ? ---------------------------------- Sort Options ---------------------------------- */}
                            <LibrarySort 
                                order={order}
                                direction={direction}
                                setDirection={setDirection}
                                setOrder={setOrder}
                                viewOptions={styles.viewOptions}
                            />
                        </View>
                    </>
                )}
                // ? ---------------------------------- Show Data ----------------------------------
                renderItem={({ item, index }) => {
                    const start = Math.floor(index / 3) * 3;
                    const rowItems = data.slice(start, start + 3);

                    return (
                        <LibraryItem
                            item={item}
                            index={index}
                            rowItems={rowItems}
                            viewFilter={viewFilter}
                            category={category}
                            router={router}
                        />
                    )}
                }
            />
        </SafeAreaView>
    )
}

// ? ---------------------------------- Styles ----------------------------------
const styles = StyleSheet.create({
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        margin: 20
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
    },
    headerIcons: {
        flexDirection: 'row',
        gap: 18
    },
    filtersContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-start',
        gap: 11,
        marginHorizontal: 15
    },
    filterOptions: {
        backgroundColor: colors.surface,
        paddingVertical: 6.5,
        paddingHorizontal: 10.5,
        borderRadius: 22,
        borderColor: colors.categoryBorder,
        borderWidth: 1.5,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: colors.separations,
        borderTopWidth: 1.5,
        marginTop: 12,
        marginLeft: 12
    },
    viewOptions: {
        backgroundColor: colors.surface,
        marginTop: 10
    },
});