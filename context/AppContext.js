import { createContext } from "react";

export const AppContext = createContext({
    design: 'union',
    setDesign: () => {},
    isPlaying: false,
    setIsPlaying: () => {},
    currentTrack: null,
    setCurrentTrack: () => {},
    queue: [],
    setQueue: () => {},
    player: null,
    playTrack: () => {},
    pauseTrack: () => {},
    prevTrack: () => {},
    nextTrack: () => {},
    recentItems: [],
});