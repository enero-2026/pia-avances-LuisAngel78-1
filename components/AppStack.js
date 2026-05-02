import { createStackNavigator } from '@react-navigation/stack';
import { withLayoutContext } from 'expo-router';

const { Navigator } = createStackNavigator();

export const AppStackNavigation = withLayoutContext(Navigator);