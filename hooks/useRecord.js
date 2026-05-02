import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useRecord(recordId, userId) {
    const [recordInfo, setRecordInfo] = useState(null);
    const [errorRecord, setErrorRecord] = useState([]);
    const [likedTracks, setLikedTracks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const fetchRecord = async () => {
            const { data, error } = await supabase
                .from('records')
                .select(`record_id, name, artists(artist_id, name), cover_url, record_types(name), qualitys(name), year,
                    tracks(track_id, name, audio_url, qualitys(name), track_num)`)
                .eq('record_id', recordId)
                .single();

            const trackIds = data.tracks.map(t => t.track_id);
            const { data: userTracks } = await supabase
                .from('users_tracks')
                .select('track_id')
                .in('track_id', trackIds)
                .eq('user_id', userId);

            setRecordInfo(data);
            setLikedTracks(userTracks ?? []);
            setLoading(false);
        };

        fetchRecord();
    }, [recordId]);

    const orderData = (data) => (
        [...data].sort((a, b) => (a.track_num - b.track_num))
    );

    // # -------------------------------------------------------------------------------------------------
    return { data: recordInfo 
                ? {...recordInfo, tracks: orderData(recordInfo.tracks)} 
                : null,
            likedTracks,
            setLikedTracks,
            loading 
        };
}