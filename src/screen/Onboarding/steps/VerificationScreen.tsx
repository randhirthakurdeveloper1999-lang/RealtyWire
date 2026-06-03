import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native'

export default function VerificationScreen({ navigation }: any) {
  useEffect(() => {
    const interval = setInterval(checkStatus, 3000)
    return () => clearInterval(interval)
  }, [])

  const checkStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token')
      if (!token) return

      const response = await fetch(
        'https://realtywire.in/api/profile/status',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      const result = await response.json()
      const profile = result.data

      console.log("Verification check:", profile)

    if (profile.onboarding === "yes") {
  console.log("Verification complete → BottomTabs");
  navigation.replace("BottomTabs");
}

    } catch (e) {
      console.log("Verification check failed")
    }
  }
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Verification Pending</Text>
        <Text style={styles.subtitle}>
          We are verifying your documents.
          {"\n"}
          This may take a few seconds...
        </Text>
            <ActivityIndicator size="large" color="#0272bc" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 30,
    alignItems: 'center',
    elevation: 4,
  },

  title: {
    marginTop: 20,
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 2,
    textAlign: 'center',
    color: '#555',
    fontSize: 13,
    marginBottom:10
  },
})


