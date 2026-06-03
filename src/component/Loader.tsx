import React from 'react'
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native'
import COLORS from '../utils/Colors'

export default function Loader({ text = 'Loading...' }: any) {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.text}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 10,
    fontSize: 13,
    color: '#666',
  },
})
