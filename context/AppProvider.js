import { AppContext } from "./AppContext";
import { useEffect, useState } from "react";
import { useAudioPlayer } from "expo-audio";

export function AppProvider({ children }) {
    const [design, setDesign] = useState('union');

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrack, setCurrentTrack] = useState(null);
    const [queue, setQueue] = useState([]);
    const [recentItems, setRecentItems] = useState([]);

    const player = useAudioPlayer();

    const addToRecent = (track) => {
        const item = {
            id: track.record_id ?? track.track_id,
            type: track.record_id ? 'record' : 'track',
            name: track.name,
            cover_url: track.cover,
            artist: track.artist,
            photo_url: track.cover,
        };
        setRecentItems(prev => {
            const filtered = prev.filter(i => i.id !== item.id);
            return [item, ...filtered].slice(0, 8);
        });
    };

    const playTrack = async (track, newQueue) => {
        if (currentTrack?.track_id === track.track_id) {
            if (!isPlaying) {
                player.play();
            } else {
                player.seekTo(0);
                player.play();
            }
        } else {
            player.replace({ uri: track.audio_url });
            player.play();
        }
        setCurrentTrack(track);
        setIsPlaying(true);
        setQueue(newQueue);
        addToRecent(track);
    }

    const pauseTrack = async (track) => {
        player.pause();
        setIsPlaying(false);
    }

    const prevTrack = () => {
        const currentIndex = queue.findIndex(t => t.track_id === currentTrack.track_id);
        const prev = queue[currentIndex - 1];
        if (prev) playTrack(prev, queue);
    };

    const nextTrack = () => {
        const currentIndex = queue.findIndex(t => t.track_id === currentTrack.track_id);
        const next = queue[currentIndex + 1];
        if (next) playTrack(next, queue);
    };

    useEffect(() => {
        const subscription = player.addListener('playbackStatusUpdate', (status) => {
            if (status.didJustFinish) {
                setIsPlaying(false);
                nextTrack();
            }
        });

        return () => subscription.remove();
    }, [currentTrack]);

    return (
        <AppContext.Provider value={{ 
            design, setDesign, 
            isPlaying, setIsPlaying, 
            currentTrack, setCurrentTrack, 
            queue, setQueue,
            player,
            playTrack, pauseTrack,
            prevTrack, nextTrack,
            recentItems,
        }}>
            {children}
        </AppContext.Provider>
    );
}