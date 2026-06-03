import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native'
import React from 'react'
import COLORS from '../../../utils/Colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/Ionicons'

export default function PrivacyPolicyScreen() {
    const navigation = useNavigation<any>()

    // Function to open the official privacy policy website
    const openWebsite = async () => {
        const url = 'https://realtywire.in/privacy-policy';

        const supported = await Linking.canOpenURL(url);

        if (supported) {
            await Linking.openURL(url);
        } else {
            console.log("Can't open URL");
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* 🔹 HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-back" size={24} color="#111" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Privacy Policy</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                {/* 🔒 ICON & INTRO */}
                <View style={styles.topSection}>
                    <View style={styles.iconCircle}>
                        <Icon name="shield-checkmark" size={40} color="#0272bc" />
                    </View>
                    <Text style={styles.lastUpdated}>Last Updated: March 2026</Text>
                </View>

                {/* 📝 POLICY SUMMARY */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>1. Information Collection</Text>
                    <Text style={styles.text}>
                        We collect personal details such as your name, email, and phone number to provide a personalized real estate experience.
                    </Text>

                    <Text style={styles.sectionTitle}>2. Data Usage</Text>
                    <Text style={styles.text}>
                        Your data is used solely to improve app functionality and user experience. We do not sell your personal information to third parties.
                    </Text>

                    <Text style={styles.sectionTitle}>3. Security</Text>
                    <Text style={styles.text}>
                        We implement industry-standard security measures to ensure your data remains safe and protected within our systems.
                    </Text>

                    <Text style={styles.sectionTitle}>4. Account Deletion</Text>
                    <Text style={styles.text}>
                        You have full control over your data. You can request account deletion at any time directly through your profile settings.
                    </Text>
                </View>

                {/* 🌐 WEBSITE LINK BOX */}
                <View style={styles.linkBox}>
                    <Text style={styles.linkTitle}>View Full Policy Online</Text>
                    <Text style={styles.linkSubtitle}>For detailed legal terms, please visit our official website.</Text>

                    <TouchableOpacity style={styles.webBtn} onPress={openWebsite}>
                        <Text style={styles.webBtnText}>Visit Privacy Website</Text>
                        <Icon name="open-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    </TouchableOpacity>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    backBtn: { width: 40 },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
    },
    scrollContent: {
        padding: 20,
    },
    topSection: {
        alignItems: 'center',
        marginBottom: 25,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E6F1F8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    lastUpdated: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#FFF',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1A1A1A',
        marginTop: 15,
        marginBottom: 6,
    },
    text: {
        fontSize: 14,
        color: '#475569',
        lineHeight: 22,
    },
    linkBox: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#0272bc',
    },
    linkTitle: {
        fontSize: 15,
        color: '#1A1A1A',
        fontWeight: '700',
        marginBottom: 5,
    },
    linkSubtitle: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 15,
        textAlign: 'center',
    },
    webBtn: {
        backgroundColor: '#0272bc',
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 10,
    },
    webBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    }
})