import { Pressable, View, Image, Text, StyleSheet, Dimensions } from 'react-native';
import { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import PlaylistCover from './PlaylistCover';
import { supabase } from '../lib/supabase';
import { colors } from '../constants/Colors';
import { globalStyles } from '../constants/globalStyles';
import { qualityColors } from '../constants/globalStyles';
import Entypo from '@expo/vector-icons/Entypo';

const { width } = Dimensions.get('window');
const ITEM_MARGIN = 11;
const DEFAULT_SIZE = (width - ITEM_MARGIN * 3.9) / 3;

export default function LibraryItem({ item, index, rowItems, viewFilter, category, router, showPlay = true, containerStyle = {} }) {
    // ? ------------------------------------ Variables ------------------------------------
    const itemType = item.type === 'track' ? 'Track' : item.record_type;

    const allArtists = rowItems.every(i => i.type === 'artist');

    const { playTrack, currentTrack } = useContext(AppContext);

    const handlePlay = async () => {
        const { data } = await supabase
            .from('records')
            .select('tracks(track_id, name, audio_url, qualitys(name), track_num)')
            .eq('record_id', item.id)
            .single();

        const queue = [...data.tracks]
            .sort((a, b) => a.track_num - b.track_num)
            .map(t => ({
                ...t,
                artist: item.artist,
                cover: item.cover_url,
                record_id: item.id
            }));

        playTrack(queue[0], queue);
    };

    const getImage = (type) => {
        if (type === 'artist') return {uri: item.photo_url}
        else return {uri: item.cover_url}
    }

    // ? ------------------------------------ Concatenated Styles  ------------------------------------
    const itemContainerStyle = (viewFilter) => {
        const styles = {
            list: {
                marginTop: 10,
                width: '75%'
            },
            grid: {
                marginTop: 18,
                width: DEFAULT_SIZE,
                ...((!allArtists && item.type === 'artist') && {paddingTop: 12})
            }
        };

        return [styles[viewFilter], {marginLeft: 11}, containerStyle];
    };
    
    // # -------------------------------------------------------------------------------------------------
    return (
        <Pressable 
            style={itemContainerStyle(viewFilter)} 
            onPress={() => {
                if (item.type === 'record') router.push(`library/records/${item.id}`)
                else if (item.type === 'track') playTrack({...item, track_id: item.id, cover: item.cover_url}, [])
                else if (item.type === 'artist') router.push(`library/artists/${item.id}`)
            }}>
            <View style={viewFilter === 'list' && {flexDirection: 'row', alignItems: 'center'}}>
                <View>
                    {item.type === 'playlist' 
                        ? <PlaylistCover covers={item.covers} style={styles.itemCoverGrid}/> 
                        : <Image style={[
                              viewFilter === 'grid' ? styles.itemCoverGrid : styles.itemCoverList,
                              {borderRadius: 5},
                              item.type === 'artist' && {borderRadius: 60}
                          ]}
                        source={getImage(item.type)}
                    />}
                    {item.type === 'record' && showPlay &&
                        <Pressable 
                            style={{
                                backgroundColor: '#444444', 
                                position: 'absolute', 
                                bottom: -4.5, right: -2.5,
                                borderRadius: 6
                            }}
                            onPress={handlePlay}
                        >
                            <Entypo name="controller-play" size={27} color="white" style={{paddingLeft: 2.5}}/>
                        </Pressable>}
                </View>
                <View style={viewFilter === 'list' && {flexDirection: 'column', marginLeft: 10}}>
                    <Text numberOfLines={1}
                        style={[
                            globalStyles.itemTitle, 
                            viewFilter === 'grid' ? {marginTop: 7} : {fontSize: 15},
                            item.type === 'artist' && {alignSelf: 'center'},
                            currentTrack?.name === item.name && {color: qualityColors(item.quality).color},
                            currentTrack?.record_id === item.id && {color: qualityColors(item.quality).color},
                        ]}
                    >
                        {item.name}
                    </Text>
                    {item.type !== 'artist' && <Text numberOfLines={1} 
                        style={[
                            globalStyles.itemSubtitle, 
                            viewFilter === 'grid' 
                                ? {fontSize: 12.5, marginTop: 1.4} 
                                : {fontSize: 13.8, marginTop: 2}
                        ]}
                    >
                        {item.artist}
                    </Text>}
                    {(category === 'Records' || category === '' && item.type !== 'artist') &&
                        <Text style={[
                            globalStyles.itemDescription, 
                            viewFilter === 'grid' 
                                ? {fontSize: 11, marginTop: 1.6} 
                                : {fontSize: 12, marginTop: 2.2}
                            ]}
                        >
                            {item.year ? `${itemType} • ${item.year}` : itemType}
                        </Text>}
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    itemCoverGrid: {
        width: DEFAULT_SIZE,
        height: DEFAULT_SIZE,
    },
    itemCoverList: {
        width: 70,
        height: 70,
    },
})