import {
  StyleSheet,
  View,
  StatusBar,
  ActivityIndicator,
  Animated,
} from 'react-native'
import React, { useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function SplashScreen({ navigation }: any) {
  const scaleAnim = useRef(new Animated.Value(0.7)).current

  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start()

    // 🔥 3 sec splash delay
    setTimeout(() => {
      checkAuth()
    }, 3000)
  }, [])

  const checkAuth = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        navigation.replace("AuthLogin");
        return;
      }

      const response = await fetch(
        "https://realtywire.in/api/profile/status",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const result = await response.json();
      const profile = result.data;

      console.log("Splash profile:", profile);

      if (profile.onboarding === "yes") {
        navigation.replace("BottomTabs");
      } else {
        navigation.replace("AuthLogin");
      }

    } catch (error) {
      console.log("Splash error:", error);
      navigation.replace("AuthLogin");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden  />

      <Animated.Image
        source={require('../../../assets/icons/FinalSplashLogo.png')}
        style={[
          styles.logo,
          { transform: [{ scale: scaleAnim }] },
        ]}
      />

      <ActivityIndicator
        size="large"
        style={[styles.loader, { transform: [{ scale: 0.7 }] }]}
      />

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 260,
    height: 260,
    resizeMode: 'contain',
  },
  loader: {
    marginTop: 20,
  },
})
