import AsyncStorage from '@react-native-async-storage/async-storage'
import React from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { logoutApi } from '../api/authApi'
import { GoogleSignin } from '@react-native-google-signin/google-signin'

export default function LogoutModal({ navigation, onClose }: any) {
    const [visible, setVisible] = React.useState(false)

    const handleLogout = async () => {
        console.log('Logout started')

        try {
            await logoutApi()

            console.log('Signing out from Google...')
            await GoogleSignin.signOut()
        } catch (e) {
            console.log('Logout API error:', e)
        } finally {
            console.log('Removing token from storage...')
            await AsyncStorage.removeItem('token')
            console.log('Token removed')

            setVisible(false)
            onClose()

            console.log('Resetting navigation → AuthLogin')
            navigation.reset({
                index: 0,
                routes: [{ name: 'AuthLogin' }],
            })

            console.log('Logout flow complete')
        }
    }


    return (
        <>
            {/* LOGOUT BUTTON */}
            <TouchableOpacity
                style={styles.footerBtn}
                onPress={() => setVisible(true)}
            >
                <FontAwesome5 name="sign-out-alt" size={18} color="#DC2626" />
                <Text style={[styles.footerText, { color: '#DC2626' }]}>
                    Logout
                </Text>
            </TouchableOpacity>

            {/* MODAL */}
            <Modal visible={visible} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Logout</Text>
                        <Text style={styles.modalMsg}>
                            Are you sure you want to logout?
                        </Text>

                        <View style={styles.modalActions}>
                            <TouchableOpacity onPress={() => setVisible(false)} style={styles.cancelBtn}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleLogout} style={styles.confirmBtn}>
                                <Text style={styles.confirmText}>Logout</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
    footerBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },

    footerText: {
        marginLeft: 12,
        fontWeight: '700',
        fontSize: 14,
    },

    modalOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },

    modalBox: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },

    modalTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6,
    },

    modalMsg: {
        fontSize: 13,
        color: '#555',
        marginBottom: 20,
    },

    modalActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    cancelBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        marginRight: 10,
    },

    cancelText: {
        color: '#475569',
        fontWeight: '600',
    },

    confirmBtn: {
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: '#DC2626',
        borderRadius: 8,
    },

    confirmText: {
        color: '#fff',
        fontWeight: '700',
    },
})
