import { View, Image, StyleSheet } from "react-native";

const placeholder = require('../assets/placeholder.jpg')

export default function PlaylistCover({ covers, style }) {
    if (covers.length === 0) return <Image source={placeholder} style={style}/>;
    if (covers.length === 1) return <Image source={{uri: covers[0]}} style={style}/>;
    
    return (
        <View style={[style, styles.grid]}>
            {covers.slice(0, 4).map((cover, i) => (
                <Image key={i} source={{uri: cover}} style={styles.gridItem}/>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        overflow: 'hidden',
    },
    gridItem: {
        width: '50%',
        height: '50%',
    }
})