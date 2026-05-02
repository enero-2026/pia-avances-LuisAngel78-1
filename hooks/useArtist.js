import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useRecord(artistId, userId) {
    const [artistInfo, setArtistInfo] = useState(null);
    const [likedTracks, setLikedTracks] = useState([]);
    const [likedRecords, setLikedRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchArtist = async () => {
            const { data } = await supabase
                .from('artists')
                .select(`artist_id, name, description, photo_url, 
                    records(record_id, cover_url, name, record_types(name), year, qualitys(name),
                    tracks(track_id, name, audio_url, qualitys(name)))`)
                .eq('artist_id', artistId)
                .single();

            const trackIds = data.records.flatMap(r => r.tracks.map(t => t.track_id));
            const { data: userTracks } = await supabase
                .from('users_tracks')
                .select('track_id')
                .in('track_id', trackIds)
                .eq('user_id', userId);

            const recordIds = data.records.map(t => t.record_id);
            const { data: userRecords } = await supabase
                .from('users_records')
                .select('record_id')
                .in('record_id', recordIds)
                .eq('user_id', userId);

            setArtistInfo(data);
            setLikedTracks(userTracks ?? []);
            setLikedRecords(userRecords ?? []);
            setLoading(false);
        };

        fetchArtist();
    }, [artistId]);

    /* const orderData = (data) => (
        [...data].sort((a, b) => (a.track_num - b.track_num))
    ); */

    // # -------------------------------------------------------------------------------------------------
    return { data: artistInfo,
            likedTracks, likedRecords,
            loading 
        };
}