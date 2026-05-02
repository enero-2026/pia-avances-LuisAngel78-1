import { useState } from "react";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { supabase } from '../lib/supabase.js';

export default function useLibrary(userId, category, order, direction) {
    // ? ------------------------------------ Data from Supabase ------------------------------------
    const [likedTracks, setLikedTracks] = useState([]);
    const [likedRecords, setLikedRecords] = useState([]);
    const [likedArtists, setLikedArtists] = useState([]);
    const [ownedPlaylists, setOwnedPlaylists] = useState([]);
    const [likedPlaylists, setLikedPlaylists] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchTracks = async () => {
                const { data } = await supabase
                    .from('users_tracks')
                    .select('track_id, tracks(name, audio_url, records(name, cover_url, year, artists(name)), qualitys(name)), date_added')
                    .eq('user_id', userId);
                setLikedTracks(data);
            };
            const fetchRecords = async () => {
                const { data } = await supabase
                    .from('users_records')
                    .select('record_id, records(name, artists(name), cover_url, record_types(name), qualitys(name), year), date_added')
                    .eq('user_id', userId);
                setLikedRecords(data);
            };
            const fetchArists = async () => {
                const { data } = await supabase
                    .from('users_artists')
                    .select('artist_id, artists(name, photo_url), date_added')
                    .eq('user_id', userId);
                setLikedArtists(data);
            };
            const fetchOwnedPlaylists = async () => {
                const { data } = await supabase
                    .from('playlists')
                    .select('playlist_id, name, cover_url, date_added, playlists_tracks(tracks(records(cover_url)))')
                    .eq('owner_id', userId);
                setOwnedPlaylists(data);
            };
            const fetchLikedPlaylists = async () => {
                const { data } = await supabase
                    .from('users_playlists')
                    .select('playlist_id, date_added, playlists(name, cover_url, playlists_tracks(tracks(records(cover_url))))')
                    .eq('user_id', userId);
                setLikedPlaylists(data);
            };
            
            fetchTracks();
            fetchRecords();
            fetchArists();
            fetchOwnedPlaylists();
            fetchLikedPlaylists();
        }, [])
    );

    // ? ------------------------------------ Structure Data ------------------------------------
    const itemStructure = {
        track: (item) => ({
            id: item.track_id,
            cover_url: item.tracks.records.cover_url,
            audio_url: item.tracks.audio_url,
            name: item.tracks.name,
            record_name: item.tracks.records.name,
            artist: item.tracks.records.artists.name,
            quality: item.tracks.qualitys.name,
            date_added: item.date_added,
            type: 'track'
        }),
        record: (item) => ({
            id: item.record_id,
            cover_url: item.records.cover_url,
            name: item.records.name,
            artist: item.records.artists.name,
            year: item.records.year,
            record_type: item.records.record_types.name,
            quality: item.records.qualitys.name,
            date_added: item.date_added,
            type: 'record'
        }),
        artist: (item) => ({
            id: item.artist_id,
            photo_url: item.artists.photo_url,
            name: item.artists.name,
            date_added: item.date_added,
            type: 'artist'
        })
    };
    const normalizeOwnedPlaylist = (item) => ({
        id: item.playlist_id,
        name: item.name,
        cover_url: item.cover_url,
        covers: item.playlists_tracks.map(pt => pt.tracks.records.cover_url),
        date_added: item.date_added,
        type: 'playlist'
    });
    const normalizeLikedPlaylist = (item) => ({
        id: item.playlist_id,
        name: item.playlists.name,
        cover_url: item.playlists.cover_url,
        covers: item.playlists.playlists_tracks.map(pt => pt.tracks.records.cover_url),
        date_added: item.date_added,
        type: 'playlist'
    });
    const normalize = (item, type) => itemStructure[type](item);
    const normalizedTracks = likedTracks.map(item => normalize(item, 'track'));
    const normalizedRecords = likedRecords.map(item => normalize(item, 'record'));
    const normalizeArtists = likedArtists.map(item => normalize(item, 'artist'));
    const normalizedPlaylists = [
        ...ownedPlaylists.map(normalizeOwnedPlaylist),
        ...likedPlaylists.map(normalizeLikedPlaylist)
    ];

    // ? ------------------------------------ Order Data ------------------------------------
    const allData = [...normalizedTracks, ...normalizedRecords, ...normalizeArtists, ...normalizedPlaylists]
    const orderData = (data) => {
        return [...data].sort((a, b) => {
            let result;

            if (order === 'Recently Added') result = new Date(b.date_added) - new Date(a.date_added)
            else if (order === 'Alphabetical') result = a.name.localeCompare(b.name)

            return direction === 'Up' ? result * -1 : result;
        });
    };
    const getData = () => {
        if (category === '') return orderData(allData)
        else if (category === 'Tracks') return orderData(normalizedTracks)
        else if (category === 'Records') return orderData(normalizedRecords)
        else if (category === 'Artists') return orderData(normalizeArtists)
        else if (category === 'Playlists') return orderData(normalizedPlaylists)
    };

    const data = getData()

    // # -------------------------------------------------------------------------------------------------
    return { data }
}