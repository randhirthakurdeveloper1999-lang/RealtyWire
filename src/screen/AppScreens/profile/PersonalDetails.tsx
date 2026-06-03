import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    ScrollView,
    TouchableOpacity,
    Alert,
    Image,
    ActivityIndicator,
    Platform,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import COLORS from '../../../utils/Colors'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Asset, launchImageLibrary } from 'react-native-image-picker'

export default function PersonalDetails() {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(true)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [mobile, setMobile] = useState('')
    const [email, setEmail] = useState('')
    const [company, setCompany] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [state, setState] = useState('')
    const [pincode, setPincode] = useState('')
    const [profileImage, setProfileImage] = useState<string>('')
    const [selectedImage, setSelectedImage] = useState<Asset | null>(null)
    const [updating, setUpdating] = useState(false)


    const pickImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, (response) => {
            if (response.assets && response.assets.length > 0) {
                setSelectedImage(response.assets[0])
            }
        })
    }

    const fetchProfile = async () => {
        try {
            setLoading(true)
            const token = await AsyncStorage.getItem('token')
            console.log("TOKEN =>", token)

            const response = await fetch(
                'https://realtywire.in/api/dealer-profile',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            )

            const json = await response.json()
            console.log("PROFILE RESPONSE =>", json)

            if (json.status) {
                const d = json.data

                setProfileImage(d.image || '')
                setFirstName(d.first_name || '')
                setLastName(d.last_name || '')
                setMobile(d.mobile || '')
                setEmail(d.email || '')
                setCompany(d.company_name || '')
                setAddress(d.complete_address || '')
                setCity(d.city || '')
                setState(d.state || '')
                setPincode(d.pincode || '')
            } else {
                Alert.alert("Profile fetch failed", json.message)
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

    const updateProfile = async () => {
        try {
            setUpdating(true)

            const token = await AsyncStorage.getItem('token')

            console.log("UPDATING PROFILE WITH:")
            console.log({
                firstName,
                lastName,
                company,
                mobile,
                address,
                city,
                state,
                pincode,
            })

            const formData = new FormData()

            formData.append('first_name', firstName)
            formData.append('last_name', lastName)
            formData.append('company_name', company)
            formData.append('mobile', mobile)
            formData.append('complete_address', address)
            formData.append('city', city)
            formData.append('state', state)
            formData.append('pincode', pincode)
            formData.append('country', 'India')

            if (selectedImage?.uri) {
                const uri = selectedImage.uri

                const imageFile = {
                    uri,
                    type: selectedImage.type ?? 'image/jpeg',
                    name: selectedImage.fileName ?? `profile_${Date.now()}.jpg`,
                }

                formData.append('image', imageFile as any)
            }

            const response = await fetch(
                'https://realtywire.in/api/dealer-profile-update',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    body: formData,
                }
            )

            const json = await response.json()
            console.log("UPDATE RESPONSE =>", json)

            if (json.status) {
                Alert.alert('Profile updated')
                fetchProfile()
            } else {
                Alert.alert(json.message)
            }
        } catch (e) {
            console.log('UPDATE ERROR', e)
        } finally {
            setUpdating(false)
        }
    }


    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={{ marginTop: 10 }}>Loading profile...</Text>
            </View>
        )
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#000" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Personal Details</Text>

                <View style={{ width: 22 }} />
            </View>

            {/* PROFILE IMAGE */}
            <View style={styles.profileImageContainer}>
                <View style={styles.avatar}>
                    {selectedImage?.uri ? (
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={{ width: '100%', height: '100%', borderRadius: 20 }}
                        />
                    ) : profileImage ? (
                        <Image
                            source={{ uri: profileImage }}
                            style={{ width: '100%', height: '100%', borderRadius: 20 }}
                        />
                    ) : (
                        <Ionicons name="person" size={40} color="#64748B" />
                    )}
                </View>

                <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
                    <Ionicons name="camera" size={16} color="#fff" />
                </TouchableOpacity>
            </View>


            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Input
                        label="First Name"
                        placeholder="First Name"
                        value={firstName}
                        onChangeText={setFirstName}
                    />
                </View>

                <View style={{ width: 10 }} />

                <View style={{ flex: 1 }}>
                    <Input
                        label="Last Name"
                        placeholder="Last Name"
                        value={lastName}
                        onChangeText={setLastName}
                    />
                </View>
            </View>

            <Input label="Mobile Number" placeholder="Mobile Number" value={mobile} onChangeText={setMobile} />
            <Input
                label="Email"
                value={email}
                editable={false}
            />

            <Text style={styles.section}>COMPANY DETAILS</Text>

            <Input
                label="Company Name"
                placeholder="Company Name"
                value={company}
                onChangeText={setCompany}
            />

            <Input
                label="Address"
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />

            {/* City + State */}
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Input
                        label="City"
                        placeholder="City"
                        value={city}
                        onChangeText={setCity}
                    />
                </View>

                <View style={{ width: 10 }} />

                <View style={{ flex: 1 }}>
                    <Input
                        label="State"
                        placeholder="State"
                        value={state}
                        onChangeText={setState}
                    />
                </View>
            </View>

            {/* Pincode + Country */}
            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <Input
                        label="Pincode"
                        placeholder="Pincode"
                        value={pincode}
                        onChangeText={setPincode}
                    />
                </View>

                <View style={{ width: 10 }} />

                <View style={{ flex: 1 }}>
                    <Input
                        label="Country"
                        value="India"
                        editable={false}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.saveBtn, updating && { opacity: 0.7 }]}
                onPress={updateProfile}
                disabled={updating}
            >
                {updating ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={{ color: '#fff', fontWeight: '600' }}>Save</Text>
                )}
            </TouchableOpacity>

        </ScrollView>
    )
}

const Input = ({ label, ...props }: any) => (
    <View style={{ marginBottom: 8 }}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
            style={styles.input}
            placeholderTextColor="#999"
            {...props}
        />
    </View>
)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingHorizontal: 16,
    },

    headerTop: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 5,
    },

    headerTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },
    profileImageContainer: {
        alignItems: 'center',
        marginBottom: 20,

    },

    avatar: {
        height: 90,
        width: 90,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 120,
        backgroundColor: COLORS.primary,
        padding: 6,
        borderRadius: 20,
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    profileRow: {
        flexDirection: 'row',
        marginVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
    },
    section: {
        fontWeight: '700',
        marginBottom: 3,
        marginTop: 5,
        fontSize: 12,
        color: '#333',
        textAlign: 'center'
    },

    label: {
        fontSize: 12,
        marginBottom: 5,
        color: '#6B7280',
    },

    input: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 14,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },

    saveBtn: {
        marginTop: 5,
        marginBottom: 20,
        backgroundColor: COLORS.primary,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },

})
