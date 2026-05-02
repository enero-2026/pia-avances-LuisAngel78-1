import { Pressable, Text, Modal, View, StyleSheet } from "react-native";
import { useState } from "react";
import { colors } from "../constants/Colors";
import { globalStyles } from "../constants/globalStyles";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function LibrarySort({ order, direction, setDirection, setOrder, viewOptions }) {
    // ? ------------------------------------ Modal Variables ------------------------------------
    const [visible, setVisible] = useState(false);
    const showModal = () => setVisible(true);
    const hideModal = () => setVisible(false);

    // ? ------------------------------------ Set Sort ------------------------------------
    const handleSortPress = (newOrder) => {
        if (order === newOrder) setDirection(direction === 'Down' ? 'Up' : 'Down');
        else setOrder(newOrder);
        hideModal();
    };

    // # -------------------------------------------------------------------------------------------------
    return (
        <>
            <Pressable style={[viewOptions, styles.sortContainer]} onPress={showModal}>
                <Text style={globalStyles.itemTitle}>{order}</Text>
                <FontAwesome5 
                    name={direction === 'Down' ? "sort-down" : 'sort-up'} 
                    size={18} 
                    color="white" 
                    style={{marginTop: direction === 'Down' ? -6 : 8.2}}
                />
            </Pressable>
            <Modal visible={visible} transparent={true} onRequestClose={hideModal}>
                <Pressable style={styles.modalOverlay} onPress={hideModal}>
                    <Pressable style={styles.modalSheet}>
                        <Text style={[globalStyles.itemTitle, {fontSize: 18}]}>Sort By</Text>
                        <SortOption 
                            label="Recently Added"
                            icon={<FontAwesome6 name="calendar-check" size={20} color="white"/>}
                            isSelected={order === 'Recently Added'}
                            subtitle={direction === 'Down' ? 'Most Recent' : 'Least Recent'}
                            onPress={() => handleSortPress('Recently Added')}
                        />
                        <SortOption 
                            label="Recently Played"
                            icon={<Ionicons name="play" size={20} color="white"/>}
                            isSelected={order === 'Recently Played'}
                            subtitle={direction === 'Down' ? 'Most Recent' : 'Least Recent'}
                            onPress={() => handleSortPress('Recently Played')}
                        />
                        <SortOption 
                            label="Alphabetical"
                            icon={<MaterialCommunityIcons name="sort-alphabetical-variant" size={20} color="white"/>}
                            isSelected={order === 'Alphabetical'}
                            subtitle={direction === 'Down' ? 'A to Z' : 'Z to A'}
                            onPress={() => handleSortPress('Alphabetical')}
                        />
                    </Pressable>
                </Pressable>
            </Modal>
        </>
    );
}

// ? ------------------------------------ Sort Options ------------------------------------
const SortOption = ({ label, icon, isSelected, subtitle, onPress }) => (
    <Pressable style={styles.sortButton} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {icon}
            <Text style={[globalStyles.itemTitle, { fontSize: 16 }]}>{label}</Text>
            {isSelected && <Text style={globalStyles.itemSubtitle}>{subtitle}</Text>}
        </View>
        {isSelected && <Entypo name="check" size={18} color="#a3c5ea" />}
    </Pressable>
);

// ? ------------------------------------ Styles ------------------------------------
const styles = StyleSheet.create({
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: 'transparent',
        marginLeft: 15,
        paddingLeft: 15,
        borderLeftColor: colors.separations,
        borderLeftWidth: 1
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.modalOverlay,
        justifyContent: 'flex-end',
    },
    modalSheet: {
        backgroundColor: colors.orderOptions,
        height: '28%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    sortButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: 20,
    }
})