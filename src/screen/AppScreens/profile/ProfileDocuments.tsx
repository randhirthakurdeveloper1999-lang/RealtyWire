import React, { useEffect, useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    Image,
    Modal,
    TextInput,
    ActivityIndicator,
} from 'react-native'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import COLORS from '../../../utils/Colors'
import { useNavigation } from '@react-navigation/native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function ProfileDocuments() {
    const navigation = useNavigation()
    const [selected, setSelected] = useState<'rera' | 'gst' | 'visiting'>('rera')
    const [files, setFiles] = useState<{ visiting?: any }>({})
    const [previewVisible, setPreviewVisible] = useState(false)
    const [loading, setLoading] = useState(true)
    const [editMode, setEditMode] = useState(false)
    const [rera, setRera] = useState('')
    const [gst, setGst] = useState('')
    const [visitingUrl, setVisitingUrl] = useState<string | null>(null)
    const [originalRera, setOriginalRera] = useState('')
    const [originalGst, setOriginalGst] = useState('')
    const [originalVisitingUrl, setOriginalVisitingUrl] = useState<string | null>(null)

    useEffect(() => {
        fetchDocuments()
    }, [])

    const fetchDocuments = async () => {
        try {
            console.log('API CALL STARTED')

            const token = await AsyncStorage.getItem('token')
            console.log('TOKEN =>', token)

            const res = await fetch(
                'https://realtywire.in/api/dealer-document-details',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                }
            )

            console.log('STATUS =>', res.status)

            const text = await res.text()
            console.log('RAW RESPONSE =>', text)

            const json = JSON.parse(text)

            console.log('JSON =>', json)

            const data = json.data

            const reraValue =
                data?.rera_number && data.rera_number !== 'null'
                    ? data.rera_number
                    : ''

            const gstValue =
                data?.gst_number && data.gst_number !== 'null'
                    ? data.gst_number
                    : ''

            setRera(reraValue)
            setGst(gstValue)


            setOriginalRera(reraValue)
            setOriginalGst(gstValue)
            const visiting =
                data?.visiting_card && data.visiting_card !== 'null'
                    ? data.visiting_card.replace(/\\/g, '')
                    : null

            setVisitingUrl(visiting)
            setOriginalVisitingUrl(visiting)

            console.log('VISITING URL CLEAN =>', visiting)

            // auto-select correct tab
            if (gstValue) {
                setSelected('gst')
            } else if (reraValue) {
                setSelected('rera')
            } else if (visiting) {
                setSelected('visiting')
            }


        } catch (e) {
            console.log('API ERROR =>', e)
        } finally {
            setLoading(false)
        }
    }

    const updateDocuments = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            const formData = new FormData()

            if (selected === 'gst') {
                formData.append('gst_number', gst)
                formData.append('rera_number', 'null')
            }

            if (selected === 'rera') {
                formData.append('rera_number', rera)
                formData.append('gst_number', 'null')
            }

            if (selected === 'visiting' && files?.visiting) {
                formData.append('visiting_card', {
                    uri: files.visiting.uri,
                    name: files.visiting.fileName || 'visiting.jpg',
                    type: files.visiting.type || 'image/jpeg',
                } as any)

                formData.append('rera_number', 'null')
                formData.append('gst_number', 'null')
            }

            const res = await fetch(
                'https://realtywire.in/api/dealer-document-update',
                {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: 'application/json',
                    },
                    body: formData,
                }
            )

            const json = await res.json()
            console.log('UPDATE RESPONSE =>', json)

            if (json.status) {
                setFiles({})
                setEditMode(false)
                fetchDocuments()
            }

        } catch (e) {
            console.log(e)
        }
    }

    const saveFile = (file: any) => {
        setFiles((prev: any) => ({
            ...prev,
            visiting: file,
        }))
    }

    const openCamera = async () => {
        const result = await launchCamera({ mediaType: 'photo' })
        if (!result.didCancel && result.assets?.length) {
            saveFile(result.assets[0])
        }
    }

    const openGallery = async () => {
        const result = await launchImageLibrary({ mediaType: 'photo' })
        if (!result.didCancel && result.assets?.length) {
            saveFile(result.assets[0])
        }
    }

    const openPicker = () => {
        Alert.alert('Upload Visiting Card', 'Choose option', [
            { text: 'Camera', onPress: openCamera },
            { text: 'Gallery', onPress: openGallery },
            { text: 'Cancel', style: 'cancel' },
        ])
    }

    const removeFile = () => {
        setFiles((prev: any) => ({
            ...prev,
            visiting: null,
        }))
    }

    const ToggleBtn = ({ label, value }: any) => (
        <TouchableOpacity
            style={[styles.toggle, selected === value && styles.toggleActive]}
            onPress={() => {
                setSelected(value)
                // clear all fields
                setRera('')
                setGst('')
                setFiles({})
                setVisitingUrl(null)
            }}
        >
            <Text
                style={[
                    styles.toggleText,
                    selected === value && styles.toggleTextActive,
                ]}
            >
                {label}
            </Text>
        </TouchableOpacity>
    )


    const visitingFile = files['visiting']

    if (loading) {
        return <ActivityIndicator style={{ marginTop: 50 }} />
    }

    // ---------- VIEW MODE ----------
    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.headerTop}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>Documents</Text>

                <View style={{ width: 22 }} />
            </View>

            {loading ? (
                <ActivityIndicator style={{ marginTop: 50 }} />
            ) : !editMode ? (
                /* ---------- VIEW MODE ---------- */
                <View style={{ flex: 1, width: '100%', padding: 16 }}>

                    <View style={styles.mainCard}>
                        {!!rera && (
                            <Text style={styles.label}>RERA Number</Text>
                        )}
                        {!!rera && <Text style={styles.value}>{rera}</Text>}

                        {!!gst && (
                            <>
                                <Text style={[styles.label, { marginTop: 16 }]}>
                                    GST Number
                                </Text>
                                <Text style={styles.value}>{gst}</Text>
                            </>
                        )}

                        {visitingUrl && visitingUrl !== 'null' && (
                            <>
                                <Text style={[styles.label, { marginTop: 16 }]}>
                                    Visiting Card
                                </Text>

                                <TouchableOpacity onPress={() => setPreviewVisible(true)}>
                                    <Image
                                        source={{ uri: visitingUrl }}
                                        style={styles.visitingImage}
                                        resizeMode="contain"
                                    />
                                </TouchableOpacity>
                            </>
                        )}


                    </View>

                    {/* bottom edit button */}
                    <TouchableOpacity
                        style={styles.editBtn}
                        onPress={() => {
                            setEditMode(true)
                            setRera(originalRera)
                            setGst(originalGst)
                            setVisitingUrl(originalVisitingUrl)
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: '600' }}>
                            Edit Documents
                        </Text>
                    </TouchableOpacity>

                </View>

            ) : (
                /* ---------- EDIT MODE ---------- */
                <View style={styles.mainCard}>
                    <View style={styles.toggleRow}>
                        <ToggleBtn label="RERA" value="rera" />
                        <ToggleBtn label="GST" value="gst" />
                        <ToggleBtn label="Visiting" value="visiting" />
                    </View>

                    {selected === 'rera' && (
                        <TextInput
                            placeholder="Enter RERA number"
                            value={rera}
                            onChangeText={(text) => setRera(text.toUpperCase())}
                            style={styles.input}
                        />
                    )}

                    {selected === 'gst' && (
                        <TextInput
                            placeholder="Enter GST number"
                            value={gst}
                            onChangeText={(text) => setGst(text.toUpperCase())}
                            style={styles.input}
                        />
                    )}
                    {selected === 'visiting' && (
                        <>
                            {(visitingFile || visitingUrl) ? (
                                <View style={styles.card}>
                                    <TouchableOpacity onPress={() => setPreviewVisible(true)}>
                                        <Image
                                            source={{ uri: visitingFile?.uri || visitingUrl }}
                                            style={{ height: 150, borderRadius: 10 }}
                                            resizeMode="contain"
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={{ marginTop: 10 }}
                                        onPress={openPicker}
                                    >
                                        <Text style={{ color: COLORS.primary, fontWeight: '600' }}>
                                            Change Visiting Card
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.uploadBox} onPress={openPicker}>
                                    <Text style={{ color: '#0272bc', fontWeight: '600' }}>
                                        Upload Visiting Card
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </>
                    )}
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>

                        <TouchableOpacity
                            style={[styles.previewBtn, { flex: 1, backgroundColor: '#CBD5E1' }]}
                            onPress={() => {
                                setRera(originalRera)
                                setGst(originalGst)
                                setVisitingUrl(originalVisitingUrl)
                                setFiles({})
                                setEditMode(false)
                            }}
                        >
                            <Text style={{ fontWeight: '600' }}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.previewBtn, { flex: 1 }]}
                            onPress={updateDocuments}
                        >
                            <Text style={{ color: '#fff', fontWeight: '600' }}>
                                Update
                            </Text>
                        </TouchableOpacity>


                    </View>

                </View>
            )}
            <Modal visible={previewVisible} transparent>
                <View style={styles.modalOverlay}>
                    <Image
                        source={{ uri: visitingUrl || visitingFile?.uri }}
                        style={styles.fullImage}
                        resizeMode="contain"
                    />
                    <TouchableOpacity
                        style={styles.closeBtn}
                        onPress={() => setPreviewVisible(false)}
                    >
                        <Text style={{ color: '#fff', fontSize: 22 }}>✕</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, },
    headerTop: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },

    headerTitle: {
        color: '#000',
        fontSize: 16,
        fontWeight: '700',
    },

    profileRow: {
        flexDirection: 'row',
        marginVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
    },

    label: {
        fontSize: 12,
        color: '#64748B',
        marginBottom: 4,
    },

    value: {
        fontSize: 15,
        fontWeight: '600',
        color: '#0F172A',
    },

    visitingImage: {
        width: '100%',
        height: 160,
        borderRadius: 12,
        marginTop: 8,
        backgroundColor: '#eee',
    },

    editBtn: {
        backgroundColor: COLORS.primary,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 'auto',
    },


    mainCard: {
        width: '100%',
        maxWidth: 420,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        elevation: 3,
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 14,
    },

    toggleRow: {
        flexDirection: 'row',
        marginBottom: 20,
        justifyContent: 'center',
        gap: 6,
    },

    toggle: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        minWidth: 100,
        alignItems: 'center',
    },

    toggleActive: { backgroundColor: COLORS.primary },
    toggleText: { fontWeight: '600' },
    toggleTextActive: { color: '#fff' },

    input: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        padding: 14,
    },

    uploadBox: {
        height: 120,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },

    previewBtn: {
        backgroundColor: COLORS.primary,
        padding: 12,
        borderRadius: 10,
        alignItems: 'center',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.85)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    fullImage: { width: '95%', height: '70%' },
    closeBtn: { position: 'absolute', top: 60, right: 24 },
})