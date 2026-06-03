import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { googleLoginApi } from '../../api/authApi'

GoogleSignin.configure({
    webClientId: '634853230052-tap4arr3utltt6olheuj5tipc8f20qah.apps.googleusercontent.com',
    offlineAccess: true,
    forceCodeForRefreshToken: true,
})

export default function AuthLoginScreen({ navigation }: any) {
    const [loading, setLoading] = useState(false)

    const handleGoogleLogin = async () => {
        try {
            setLoading(true);

            console.log("Google login started...");

            await GoogleSignin.hasPlayServices();

            // 👇 THIS LINE FIXES ACCOUNT PICKER
            await GoogleSignin.signOut();

            const userInfo = await GoogleSignin.signIn();
            const idToken = userInfo.data?.idToken;

            console.log("Google userInfo:", userInfo);

            if (!idToken) {
                throw new Error("Google idToken not received");
            }

            console.log("Calling googleLoginApi...");

            const result = await googleLoginApi(idToken);

            console.log("googleLoginApi result:", result);

            if (!result.status) {
                throw new Error(result.message);
            }

            const appToken = result.data.token;

            console.log("App token received:", appToken);

            await AsyncStorage.setItem("token", appToken);

            console.log("Token saved to AsyncStorage");

            console.log("Calling profile/status API...");

            const profileRes = await fetch(
                "https://realtywire.in/api/profile/status",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${appToken}`,
                        Accept: "application/json",
                    },
                }
            );

            const profileJson = await profileRes.json();
            const profile = profileJson.data;

            console.log("Profile API response:", profileJson);

            const googleUser = userInfo.data?.user;

            const firstName = googleUser?.givenName || "";
            const lastName = googleUser?.familyName || "";
            const email = googleUser?.email || "";

            if (profile.onboarding === "no") {
                console.log("Navigating → Onboarding");

                navigation.replace("Onboarding", {
                    googleData: {
                        first_name: firstName,
                        last_name: lastName,
                        email: email,
                    },
                });
            } else if (profile.onboarding === "pending") {
                console.log("Navigating → Verification");

                navigation.replace("Verification");
            } else {
                console.log("Navigating → BottomTabs");

                navigation.replace("BottomTabs");
            }
        } catch (error: any) {
            console.log("LOGIN ERROR:", error);

            Alert.alert(
                "Login Failed",
                error?.message || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.screen}>

            <View style={styles.card}>
                <Text style={styles.title}>Realty Wire</Text>
                <Text style={styles.subtitle}>
                    Sign in to continue
                </Text>
                <TouchableOpacity
                    style={styles.googleButton}
                    onPress={handleGoogleLogin}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator />
                    ) : (
                        <>
                            <Image
                                source={require('../../../assets/icons/Google.png')}
                                style={styles.googleIcon}
                                resizeMode="contain"
                            />
                            <Text style={styles.googleText}>Continue with Google</Text>
                        </>
                    )}
                </TouchableOpacity>


                <Text style={styles.footerText}>
                    By continuing, you agree to our Terms & Privacy Policy
                </Text>

            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#F5F6FA',
        justifyContent: 'center',
        padding: 20,
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 18,
        padding: 28,

        // shadow
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#111',
        textAlign: 'center',
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 12,
    },

    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderColor: '#DDD',
        borderRadius: 12,
        paddingVertical: 10,
    },

    googleIcon: {
        width: 22,
        height: 22,
        marginRight: 10,
    },

    googleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111',
    },

    footerText: {
        marginTop: 24,
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
        lineHeight: 16,
    },
})
