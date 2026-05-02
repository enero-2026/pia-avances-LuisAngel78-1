import { ScrollView, Image, Text, View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { colors } from "../../../../constants/Colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { qualityColors } from "../../../../constants/globalStyles";
import useArtist from "../../../../hooks/useArtist"
import useLikes from "../../../../hooks/useLikes";
import Entypo from '@expo/vector-icons/Entypo';
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export default function Records() {
    // ? ------------------------------------ Variables ------------------------------------
    const router = useRouter();

    const { artistId } = useLocalSearchParams();
    
    const [userId, setUserId] = useState('68d227d6-6190-4801-8d37-fe2ea6efdc52');

    const { isLiked: isArtistLiked, toggleLike: toggleArtist } = useLikes(userId, 'artist', artistId);

    const { data: artistInfo, likedTracks, likedRecords, loading } = useArtist(artistId, userId);
    if (loading) return (
        <View style={{flex: 1, justifyContent: 'center', backgroundColor: '#080808'}}>
            <ActivityIndicator size="large" color="white"/>
        </View>
    );

    const likedIds = likedTracks.map(t => t.track_id);

    const toggleTrackLike = async (trackId) => {
        if (likedIds.includes(trackId)) {
            await supabase.from('users_tracks').delete()
                .eq('track_id', trackId)
                .eq('user_id', userId);
            setLikedTracks(prev => prev.filter(t => t.track_id !== trackId));
        } else {
            await supabase.from('users_tracks')
                .insert({ user_id: userId, track_id: trackId });
            setLikedTracks(prev => [...prev, { track_id: trackId }]);
        }
    };

    const handlePlay = async () => {
        const { data } = await supabase
            .from('records')
            .select('tracks(track_id, name, audio_url, qualitys(name), track_num)')
            .eq('record_id', record.id)
            .single();

        const queue = [...data.tracks]
            .sort((a, b) => a.track_num - b.track_num)
            .map(t => ({
                ...t,
                artist: record.artist,
                cover: record.cover_url,
                record_id: record.id
            }));

        playTrack(queue[0], queue);
    };

    // # -------------------------------------------------------------------------------------------------
    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
                <Pressable style={{margin: 18}} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={24} color="white"/>
                </Pressable>
                {/* ? ------------------------------------ Artist ------------------------------------ */}
                <View style={styles.infoContainer}>
                    <Image style={styles.infoImage} source={{uri: artistInfo.photo_url}}/>
                    <Text style={[styles.infoTitle, {fontSize: 17}]}>{artistInfo.name}</Text>
                    {artistInfo.description && 
                        <Pressable>
                            <Text style={[styles.infoDescription, {marginHorizontal: 20, textAlign: 'center'}]} numberOfLines={2}>
                                {artistInfo.description}
                            </Text>
                        </Pressable>}
                </View>
                {/* ? ------------------------------------ Play Options ------------------------------------ */}
                <View style={styles.playOptionsContainer}>
                    <Pressable 
                        /* onPress={() => {
                            playTrack({
                                ...artistInfo.tracks[0], artist: artistInfo.name, cover: artistInfo.cover_url},
                                artistInfo.tracks.map(t => ({
                                    ...t, 
                                    artist: artistInfo.artists.name,
                                    cover: artistInfo.cover_url
                            })))
                        }} */
                        style={styles.playButtonContainer}
                    >
                        <Ionicons name="play" size={24} color="black"/>
                        <Text style={[styles.infoTitle, {color: 'black'}]}>Play</Text>
                    </Pressable>
                    <Pressable style={[styles.playButtonContainer, {backgroundColor: colors.surface, gap: 10}]}>
                        <FontAwesome6 name="shuffle" size={24} color="white"/>
                        <Text style={styles.infoTitle}>Shuffle</Text>
                    </Pressable>
                </View>
                {/* ? ------------------------------------ record Options ------------------------------------ */}
                <View style={[styles.infoContainer, {marginTop: 15}]}>
                    <View style={[styles.infoDescriptionContainer, {gap: 14}]}>
                        <Pressable style={{alignItems: 'center'}} onPress={toggleArtist}>
                            {isArtistLiked
                                ? <Feather name="check" size={24} color='#c8c8c8'/>
                                : <FontAwesome6 name="add" size={24} color='#c8c8c8'/>}
                            <Text 
                                style={[
                                    styles.infoTitle, 
                                    {fontSize: 13, color: '#a5a5a5'}
                                ]}
                            >
                                {isArtistLiked ? 'Added' : 'Add'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
                {/* ? ------------------------------------ Popular Tracks ------------------------------------ */}
                
                {/* ? ------------------------------------ Discography ------------------------------------ */}
                <View style={styles.discographyContainer}>
                    <Pressable style={{flexDirection: 'row', justifyContent: 'space-between', width: '100%'}}>
                        <Text style={styles.infoTitle}>Discography</Text>
                        <Entypo name="chevron-right" size={19} color="white"/>
                    </Pressable>
                    <ScrollView horizontal nestedScrollEnabled>
                        {artistInfo.records.map(record => (
                            <Pressable 
                                key={record.record_id} 
                                onPress={() => router.push(`/library/records/${record.record_id}`)}
                            >
                                <View style={styles.recordContainer}>
                                    <View>
                                        <Image 
                                            style={{width: 110, height: 110, borderRadius: 6}} 
                                            source={{ uri: record.cover_url }}/>
                                        <Pressable
                                            style={{
                                                backgroundColor: '#444444', 
                                                position: 'absolute', 
                                                bottom: -4.5, right: -2.5,
                                                borderRadius: 6
                                            }}
                                            // onPress={handlePlay}
                                        >
                                            <Entypo name="controller-play" size={27} color="white" style={{paddingLeft: 2.5}}/>
                                        </Pressable>
                                    </View>
                                    <Text 
                                        numberOfLines={1}
                                        style={[
                                            globalStyles.itemTitle, 
                                            // currentTrack?.record_id === record.id && {color: qualityColors(record.quality).color},
                                            {marginTop: 9}
                                        ]}
                                    >
                                        {record.name}
                                    </Text>
                                    <Text style={[globalStyles.itemDescription, {fontSize: 12.5, marginTop: 4}]}>
                                        {`${record.record_types.name} • ${record.year}`}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ? ------------------------------------ Styles ------------------------------------
const styles = StyleSheet.create({
    infoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: -6,
        gap: 10
    },
    infoImage: {
        width: 180,
        height: 180,
        borderRadius: 100
    },
    infoTitle: {
        color: 'white',
        fontFamily: 'MirandaSans_600SemiBold',
        fontSize: 16
    },
    infoDescriptionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
    infoDescription: {
        color: colors.descriptionText,
        fontFamily: 'MirandaSans_600SemiBold',
        fontSize: 14.5
    },
    infoQualityContainer: {
        paddingVertical: 5, 
        paddingHorizontal: 10,
        borderRadius: 8
    },
    playOptionsContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
        gap: 10,
        marginTop: 20
    },
    playButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.activeView,
        paddingVertical: 10,
        width: '43%',
        gap: 4,
        borderRadius: 15
    },
    recordContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 14,
        width: '110'
    },
    trackInfoContainer: {
        flex: 1,
        gap: 4,
    },
    trackOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 5
    },
    discographyContainer: {
        alignItems: 'flex-start',
        margin: 15
    }
})