import { View } from 'react-native';
import { TransitionPresets } from '@react-navigation/stack';
import { AppStackNavigation } from '../../../components/AppStack';

export default function SettingsLayout() {
    return (
        <View style={{ flex: 1, backgroundColor: '#000' }}>
            <AppStackNavigation screenOptions={{ 
                headerShown: false,
                ...TransitionPresets.SlideFromRightIOS
            }}>
                <AppStackNavigation.Screen name="index"/>
                <AppStackNavigation.Screen name="records/[recordId]"/>
            </AppStackNavigation>
        </View>
    );
}