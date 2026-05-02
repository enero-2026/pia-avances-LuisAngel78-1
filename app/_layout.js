import { Stack } from "expo-router";
import { AppProvider } from "../context/AppProvider";
import MiniPlayer from "../components/MiniPlayer"
import { useFonts, MirandaSans_500Medium, MirandaSans_600SemiBold } from '@expo-google-fonts/miranda-sans';
import { Quicksand_500Medium, Quicksand_600SemiBold, Quicksand_700Bold } from '@expo-google-fonts/quicksand'

function AppContent() {
    return (
        <>
            <Stack screenOptions={{headerShown: false, animation: 'none'}}/>
            <MiniPlayer/>
        </>
    );
}

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        MirandaSans_500Medium,
        MirandaSans_600SemiBold,
        Quicksand_500Medium,
        Quicksand_600SemiBold,
        Quicksand_700Bold
    });

    if (!fontsLoaded) {
        return null;
    };

    return (
        <AppProvider>
            <AppContent/>
        </AppProvider>
    )
}