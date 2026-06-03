import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../screen/Splash/SplashScreen';
import { RootStackParamList } from '../types/types';
import AuthLoginScreen from '../screen/Auth/AuthLoginScreen';
import Tabs from './Tabs';
import PropertyDetailScreen from '../screen/AppScreens/Home/PropertyDetailScreen';
import FavouriteScreen from '../screen/AppScreens/Favourite/FavouriteScreen';
import OnboardingScreen from '../screen/Onboarding/OnboardingScreen';
import COLORS from '../utils/Colors';
import ChatScreen from '../screen/Chat/ChatScreen';
import Profile from '../screen/AppScreens/profile/Profile';
import SubscriptionScreen from '../screen/AppScreens/Subscription/SubscriptionScreen';
import SubscriptionHistoryScreen from '../screen/AppScreens/Subscription/SubscriptionHistoryScreen';
import VerificationScreen from '../screen/Onboarding/steps/VerificationScreen';
import PersonalDetails from '../screen/AppScreens/profile/PersonalDetails';
import Documents from '../screen/AppScreens/profile/ProfileDocuments';
import PrivacyPolicyScreen from '../screen/AppScreens/AboutUsAndPrivacy/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigations() {
  return (
    <Stack.Navigator screenOptions={{
      headerShown: false,
      contentStyle: {
        backgroundColor: COLORS.background, // 👈 SAME COLOR
      },
    }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="AuthLogin" component={AuthLoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="BottomTabs" component={Tabs} />
      <Stack.Screen name="FavouriteScreen" component={FavouriteScreen} options={{ title: 'Favourites' }} />
      <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="Subscription" component={SubscriptionScreen} />
      <Stack.Screen name="SubscriptionHistory" component={SubscriptionHistoryScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />

      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />

      <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetails} />
      <Stack.Screen name="Documents" component={Documents} />
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({})