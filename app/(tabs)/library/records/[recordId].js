import { ScrollView, Image, Text, View, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useContext } from "react";
import { AppContext } from "../../../../context/AppContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { supabase } from "../../../../lib/supabase";
import { colors } from "../../../../constants/Colors";
import { globalStyles } from "../../../../constants/globalStyles";
import { qualityColors } from "../../../../constants/globalStyles";
import useRecord from "../../../../hooks/useRecord";
import useLikes from "../../../../hooks/useLikes";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Entypo from '@expo/vector-icons/Entypo';

export default function Records() {
    // ? ------------------------------------ Variables ------------------------------------
    const router = useRouter();

    const { recordId } = useLocalSearchParams();
    
    const [userId, setUserId] = useState('68d227d6-6190-4801-8d37-fe2ea6efdc52');

    const { isLiked: isRecordLiked, toggleLike: toggleRecord } = useLikes(userId, 'record', recordId);

    const { playTrack, currentTrack } = useContext(AppContext);

    const { data: recordInfo, likedTracks, setLikedTracks, loading } = useRecord(recordId, userId);
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

    // ? ------------------------------------ Concatenated Styles  ------------------------------------
    const infoQualityContainerStyles = (quality) => {
        return [
            styles.infoQualityContainer,
            {backgroundColor: qualityColors(quality).bg}
        ];
    }
    const infoQualityTextStyles = (quality) => {
        return [
            styles.infoDescription,
            {color: qualityColors(quality).color}
        ];
    };

    // # -------------------------------------------------------------------------------------------------
    return (
        <SafeAreaView style={globalStyles.container}>
            <ScrollView contentContainerStyle={{ paddingBottom: 180 }}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', margin: 18}}>
                    <Pressable onPress={() => router.back()}>
                        <Feather name="arrow-left" size={24} color="white"/>
                    </Pressable>
                    <Pressable>
                        <Feather name="more-vertical" size={24} color="white"/>
                    </Pressable>
                </View>
                {/* ? ------------------------------------ Record ------------------------------------ */}
                <View style={styles.infoContainer}>
                    <Image style={styles.infoImage} source={{uri: recordInfo.cover_url}}/>
                    <Text style={[styles.infoTitle, {fontSize: 17}]}>{recordInfo.name}</Text>
                    <Pressable 
                        style={{flexDirection: 'row', gap: 2}} 
                        onPress={() => router.push(`/library/artists/${recordInfo.artists.artist_id}`)}
                    >
                        <Text style={globalStyles.itemSubtitle}>
                            {recordInfo.record_types.name} by {recordInfo.artists.name}
                        </Text>
                        <Entypo name="chevron-right" size={19} color={colors.secondaryText}/>
                    </Pressable>
                    <View style={styles.infoDescriptionContainer}>
                        <Text style={styles.infoDescription}>{recordInfo.year}</Text>
                        <View style={infoQualityContainerStyles(recordInfo.qualitys.name)}>
                            <Text style={infoQualityTextStyles(recordInfo.qualitys.name)}>
                                {recordInfo.qualitys.name}
                            </Text>
                        </View>
                    </View>
                </View>
                {/* ? ------------------------------------ Play Options ------------------------------------ */}
                <View style={styles.playOptionsContainer}>
                    <Pressable 
                        onPress={() => {
                            playTrack({
                                ...recordInfo.tracks[0], artist: recordInfo.artists.name, cover: recordInfo.cover_url},
                                recordInfo.tracks.map(t => ({
                                    ...t, 
                                    artist: recordInfo.artists.name,
                                    cover: recordInfo.cover_url
                            })))
                        }}
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
                {/* ? ------------------------------------ Album Options ------------------------------------ */}
                <View style={[styles.infoContainer, {marginTop: 15}]}>
                    <View style={[styles.infoDescriptionContainer, {gap: 14}]}>
                        <Pressable style={{alignItems: 'center'}} onPress={toggleRecord}>
                            {isRecordLiked
                                ? <Ionicons 
                                      name="heart-sharp" 
                                      size={24} 
                                      color={qualityColors(recordInfo.qualitys.name).color}
                                  />
                                : <Ionicons name="heart-outline" size={24} color={colors.secondaryText}/>}
                            <Text 
                                style={[
                                    styles.infoTitle, 
                                    {fontSize: 13, color: isRecordLiked ? qualityColors(recordInfo.qualitys.name).color : colors.secondaryText}
                                ]}
                            >
                                {isRecordLiked ? 'Added' : 'Add'}
                            </Text>
                        </Pressable>
                        <Pressable style={{alignItems: 'center'}}>
                            {!isRecordLiked
                                ? <Ionicons 
                                      name="arrow-down-circle" 
                                      size={24} 
                                      color={qualityColors(recordInfo.qualitys.name).color}
                                  />
                                : <Ionicons name="arrow-down-circle-outline" size={24} color='#bcbcbc'/>}
                            <Text 
                                style={[
                                    styles.infoTitle, 
                                    {fontSize: 13, color: !isRecordLiked ? qualityColors(recordInfo.qualitys.name).color : '#bcbcbc'}
                                ]}
                            >
                                {!isRecordLiked ? 'Downloaded' : 'Download'}
                            </Text>
                        </Pressable>
                    </View>
                </View>
                {/* ? ------------------------------------ Tracks ------------------------------------ */}
                {recordInfo.tracks.map(track => {
                    return (
                        <Pressable 
                            key={track.track_id} 
                            onPress={() => {
                                playTrack({
                                    ...track, artist: recordInfo.artists.name, cover: recordInfo.cover_url},
                                    recordInfo.tracks.map(t => ({
                                        ...t, 
                                        artist: recordInfo.artists.name,
                                        cover: recordInfo.cover_url
                                })))
                            }}
                        >
                            <View style={styles.trackContainer}>
                                <Text style={[globalStyles.itemSubtitle, {fontSize: 15}]}>{track.track_num}</Text>
                                <View style={styles.trackInfoContainer}>
                                    <Text style={[
                                        styles.infoTitle, 
                                        currentTrack?.name === track.name && {color: qualityColors(track.qualitys.name).color},
                                        {fontSize: 15}
                                    ]} numberOfLines={1}>
                                        {track.name}
                                    </Text>
                                    <Text style={[globalStyles.itemSubtitle, {fontSize: 15}]} numberOfLines={1}>
                                        {recordInfo.artists.name}
                                    </Text>
                                </View>
                                <View style={styles.trackOptions}>
                                    <Pressable onPress={() => toggleTrackLike(track.track_id)}>
                                        {likedIds.includes(track.track_id)
                                            ? <Ionicons name="heart-sharp" size={22.5} color="white"/>
                                            : <Ionicons name="heart-outline" size={22.5} color="white"/>}
                                    </Pressable>
                                    <Pressable>
                                        <Ionicons name="arrow-down-circle-outline" size={22.5} color="white"/>
                                        {/* <Ionicons name="arrow-down-circle" size={20} color="white"/> */}
                                    </Pressable>
                                    <Pressable>
                                        <Feather name="more-vertical" size={22.5} color="white"/>
                                    </Pressable>
                                </View>
                            </View>
                        </Pressable>
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    );
}

// ? ------------------------------------ Styles ------------------------------------
const styles = StyleSheet.create({
    infoContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 4,
        gap: 10
    },
    infoImage: {
        width: 200,
        height: 200
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
        fontSize: 12
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
        marginTop: 15
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
    trackContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        marginTop: 14,
        marginHorizontal: 18
    },
    trackInfoContainer: {
        flex: 1,
        gap: 4,
    },
    trackOptions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 8
    }
})