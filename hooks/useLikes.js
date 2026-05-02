import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

export default function useLikes(userId, type, itemId) {
    const [likes, setLikes] = useState([]);
    const [errorLikes, setErrorLikes] = useState([]);

    const table = (type) => {
        if (type === 'record') return 'users_records'
        else if (type === 'track') return 'users_tracks'
        else return 'users_artists'
    };
    const column = (type) => {
        if (type === 'record') return 'record_id'
        else if (type === 'track') return 'track_id'
        else return 'artist_id'
    };

    useEffect(() => {
        const fetchLikes = async () => {
            const { data, error } = await supabase
                .from(table(type))
                .select(column(type))
                .eq(column(type), itemId)
                .eq('user_id', userId);
            setLikes(data);
            setErrorLikes(error);
        }

        fetchLikes();
    }, []);    

    const isLiked = likes && likes.length > 0;

    const toggleLike = async () => {
        if (isLiked) {
            await supabase
                .from(table(type))
                .delete()
                .eq(column(type), itemId)
                .eq('user_id', userId);
            setLikes([]);
        } else {
            await supabase
                .from(table(type))
                .insert({ user_id: userId, [column(type)]: itemId });
            setLikes([{ [column(type)]: itemId }]);
        }
    }

    return { isLiked, toggleLike };
}