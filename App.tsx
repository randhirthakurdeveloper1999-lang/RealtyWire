import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import Navigations from './src/navigation/Navigations';
import { FavouriteProvider } from './src/context/FavouriteContext';
import COLORS from './src/utils/Colors';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#F5F6FA', // 👈 GLOBAL BACKGROUND
  },
}
export default function App() {
  return (
    <FavouriteProvider>
      <View style={styles.app}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="dark-content"
        />
        <NavigationContainer>
          <Navigations />
        </NavigationContainer>
      </View>
    </FavouriteProvider>
  )
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
})