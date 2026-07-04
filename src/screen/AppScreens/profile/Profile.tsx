import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
  Modal,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import COLORS from '../../../utils/Colors'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { RootStackParamList } from '../../../types/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { deleteAccountApi } from '../../../api/authApi'

type NavType = NativeStackNavigationProp<RootStackParamList>

export default function Profile() {
  const navigation = useNavigation<NavType>()
  const [name, setName] = useState('')
  const [company, setCompany] = useState('')
  const [image, setImage] = useState('')
  const [confirmVisible, setConfirmVisible] = useState(false)
  const [successVisible, setSuccessVisible] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('token')

      const res = await fetch(
        'https://realtywire.in/api/dealer-profile',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        }
      )

      console.log('🟢 Response status:', res.status)

      const json = await res.json()
      console.log('🟣 API Response:', json)


      if (json.status) {
        const d = json.data
        setName(`${d.first_name || ''} ${d.last_name || ''}`.trim())
        setCompany(d.company_name)
        setImage(d.image)
      }
    } catch (e) {
      console.log('PROFILE ERROR', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [])

  const deleteAccount = async () => {
    try {
      console.log("🟡 Delete account started")

      const json = await deleteAccountApi()

      console.log("🟢 API response:", json)

      if (!json.status) {
        console.log("🔴 API failed:", json.message)
        Alert.alert("Error", json.message || "Failed to delete account")
        return
      }

      console.log("✅ Account deleted successfully")

      setConfirmVisible(false)
      setSuccessVisible(true)

    } catch (e) {
      console.log("❌ Delete error:", e)
      Alert.alert("Something went wrong")
    }
  }

  const handleSuccessClose = async () => {
    setSuccessVisible(false)

    await AsyncStorage.removeItem('token')

    navigation.reset({
      index: 0,
      routes: [{ name: 'AuthLogin' }],
    })
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    )
  }


  /* 🔹 Menu Item */
  const MenuItem = ({ title, subtitle, onPress }: any) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View>
        <Text style={styles.menuTitle}>{title}</Text>
        {subtitle && <Text style={styles.menuSub}>{subtitle}</Text>}
      </View>
      <Ionicons name="chevron-forward" size={18} color="#999" />
    </TouchableOpacity>
  )


  return (
    <SafeAreaView style={styles.container}>

      {/* 🔝 HEADER + PROFILE */}
      <View style={styles.headerContainer}>

        {/* top row */}
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Business Profile</Text>

          <View style={{ width: 22 }} />
        </View>

        {/* profile info */}
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            {image?.startsWith('http') ? (
              <Image
                source={{ uri: image }}
                style={{ width: '100%', height: '100%', borderRadius: 16 }}
              />
            ) : (
              <Ionicons name="person" size={26} color="#0F172A" />
            )}
          </View>

          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.company}>{company || 'No company added'}</Text>

            <View style={styles.badge}>
              <Text style={styles.badgeText}>PREMIUM PARTNER</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 📦 BODY */}
      {/* BODY */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={styles.sectionTitle}>ACCOUNT</Text>

        <MenuItem
          title="Personal Details"
          onPress={() => navigation.navigate('PersonalDetails')}
        />

        <MenuItem
          title="Documents"
          onPress={() => navigation.navigate('Documents')}
        />

        <Text style={styles.sectionTitle}>MANAGEMENT</Text>

        <MenuItem
          title="Subscription & Billing"
          subtitle="Pro plan active until Oct 2024"
          onPress={() => navigation.navigate('Subscription')}
        />

      </ScrollView>

      {/* FIXED LOGOUT */}
      <View style={styles.bottomArea}>
        {/* 🔥 DELETE ACCOUNT */}
        <TouchableOpacity
          style={[styles.logoutBtn, { marginTop: 10 }]}
          onPress={() => setConfirmVisible(true)}
        >
          <Ionicons name="trash-outline" size={20} color="red" />
          <Text style={styles.logoutText}>Delete Account</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={confirmVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>

            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setConfirmVisible(false)}
              >
                <Text>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: 'red' }]}
                onPress={deleteAccount}
              >
                <Text style={{ color: '#fff' }}>Delete</Text>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
      <Modal
        visible={successVisible}
        transparent
        animationType="fade"
        onRequestClose={handleSuccessClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="checkmark-circle" size={50} color="green" />
            <Text style={styles.modalTitle}>Success</Text>
            <Text style={styles.modalText}>
              Your account has been deleted successfully
            </Text>

            <TouchableOpacity
              style={[styles.modalBtn, { backgroundColor: COLORS.primary, marginTop: 10 }]}
              onPress={handleSuccessClose}
            >
              <Text style={{ color: '#fff' }}>OK</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  headerContainer: {
    backgroundColor: COLORS.primary,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerTop: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },

  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  profileRow: {
    flexDirection: 'row',
    marginVertical: 25,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 14,
  },


  avatar: {
    height: 90,
    width: 90,
    borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  company: {
    color: '#CBD5E1',
    fontSize: 12,
    marginTop: 2,
  },

  badge: {
    backgroundColor: '#1E40AF',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    marginTop: 6,
  },

  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  statsRow: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },

  statItem: {
    alignItems: 'center',
  },

  statNumber: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  statLabel: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 4,
  },

  divider: {
    width: 1,
    backgroundColor: '#334155',
  },

  sectionTitle: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 8,
  },

  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  menuTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },

  menuSub: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  bottomArea: {
    padding: 16,
    backgroundColor: COLORS.background,
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 14,
    backgroundColor: '#fff',
    borderRadius: 14,
  },

  logoutText: {
    color: 'red',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 10, // 👈 add this
  },

  modalText: {
    fontSize: 13,
    color: '#555',
    textAlign: 'center',
  },

  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },

  modalBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
})
