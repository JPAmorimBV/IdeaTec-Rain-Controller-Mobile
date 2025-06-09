import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import { colors } from './src/styles/colors';

export default function App() {
  return (
    <>
      <StatusBar style="dark" backgroundColor={colors.primary} />
      <NavigationContainer>
        <TabNavigator />
      </NavigationContainer>
    </>
  );
}
