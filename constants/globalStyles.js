import { StyleSheet } from 'react-native';
import { colors } from './Colors';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background
    },
    itemTitle: {
        color: 'white',
        fontFamily: 'MirandaSans_500Medium',
    },
    itemSubtitle: {
        color: colors.secondaryText,
        fontFamily: 'MirandaSans_500Medium'
    },
    itemDescription: {
        color: colors.descriptionText,
        fontFamily: 'MirandaSans_500Medium'
    },
});

export const qualityColors = (quality) => {
    if (quality === 'Hi-Res') return { bg: colors.HiResBackground, color: colors.HiResColor };
    else if (quality === 'CD') return { bg: colors.CDBackground, color: colors.CDColor };
    return { bg: colors.OtherBackground, color: colors.OtherColor };
};