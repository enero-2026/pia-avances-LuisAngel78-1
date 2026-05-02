import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export default function MiniPlayer() {
    const { design, currentTrack, playTrack, nextTrack, pauseTrack, isPlaying, queue } = useContext(AppContext);

    const player = {
        union: {
            bottom: 89,
            padding: 15,
            borderTopLeftRadius: 40, 
            borderTopRightRadius: 40,
        },
        rounded: {
            bottom: 96,
            padding: 16,
            borderRadius: 45
        },
        square: {
            bottom: 96,
            padding: 12,
            borderRadius: 20,
        }
    }

    return (
        <>
            {currentTrack &&
                <View style={[styles.container, player[design]]}>
                    <Image
                        style={[styles.cover, design !== 'union' && {marginBottom: 2}]}
                        source = {{ uri: currentTrack.cover }}
                    />
                    <View style={[styles.info, design !== 'union' && {marginBottom: 1}]}>
                        <Text style={styles.song} numberOfLines={1}>{currentTrack.name}</Text>
                        <Text style={styles.artist} numberOfLines={1}>{currentTrack.artist}</Text>
                    </View>
                    <View style={[styles.buttons, design !== 'union' && {marginBottom: -2}]}>
                        <Pressable 
                            style={[isPlaying ? {marginRight: -3.5} : {marginRight: 0}, ]} 
                            onPress={() => {isPlaying ? pauseTrack(currentTrack) : playTrack(currentTrack, queue)}}
                        >
                            {isPlaying 
                                ? <MaterialIcons name="pause-circle" size={37} color="white"/>
                                : <FontAwesome name="play-circle" size={36} color="white"/>}
                        </Pressable>
                        <Pressable onPress={() => {nextTrack({currentTrack, artist: currentTrack.artist, cover: currentTrack.cover})}}>
                            <MaterialCommunityIcons name="skip-next" size={36} color="white"/>
                        </Pressable>
                    </View>
                </View>}
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#161616",
        left: 20,
        right: 20,
        position: 'absolute',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center'
    },
    cover: {
        marginTop: 2,
        marginBottom: -16,
        marginLeft: 10,
        marginRight: 10,
        height: 48,
        width: 48,
        borderRadius: 5,
    },
    info: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginBottom: -15,
        marginRight: 12,
        paddingLeft: 0,
    },
    song: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
        paddingBottom: 3
    },
    artist: {
        color: "grey",
        fontSize: 14,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8,
        marginBottom: -15
    }
})