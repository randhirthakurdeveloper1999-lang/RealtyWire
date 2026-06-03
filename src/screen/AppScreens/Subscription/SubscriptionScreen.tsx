import { Alert, FlatList, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import COLORS from '../../../utils/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { getPlansApi, subscriptionRequestApi } from '../../../api/authApi'
import RazorpayCheckout from 'react-native-razorpay'
import LottieView from 'lottie-react-native'

type PlanType = {
    id: string
    name: string
    price: number
    features: string[]
    description: string   // ✅ ADD THIS
    duration: string
    isActive: boolean
}

export default function SubscriptionScreen() {
    const navigation = useNavigation<any>()
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
    const [plans, setPlans] = useState<PlanType[]>([])
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(true)
    const [modalVisible, setModalVisible] = useState(false)
    const [modalMessage, setModalMessage] = useState('')
    const [modalType, setModalType] = useState<'success' | 'error'>('success')

    useEffect(() => {
        loadData()
    }, [])

    const extractFeatures = (html: string) => {
        if (!html) return { features: [], description: '' }

        const text = html
            .replace(/<\/p>/g, '\n')
            .replace(/<[^>]+>/g, '')
            .replace(/&amp;/g, '&')

        const parts = text
            .split('\n')
            .map(i => i.trim())
            .filter(i =>
                i &&
                !i.toLowerCase().includes('features') &&
                !i.toLowerCase().includes('description')
            )

        const description = parts.find(i =>
            i.toLowerCase().includes('plan')
        ) || ''

        const features = parts.filter(i => i !== description)

        return { features, description }
    }

    const loadData = async () => {
        try {
            console.log('🚀 Loading plans...')

            setLoading(true)
            setError('')

            const res = await getPlansApi()

            console.log('📥 Raw API Response:', res)

            const mappedPlans = res.map((p: any) => {
                const data = extractFeatures(p.features || '')

                return {
                    id: String(p.id),
                    name: p.name,
                    price: Number(p.final_price),
                    duration: p.duration,

                    features: Array.isArray(data.features) ? data.features : [], // ✅ SAFE
                    description: data.description || '',

                    isActive: p.is_active,
                }
            })

            console.log('📦 Final Plans Array:', mappedPlans)

            setPlans(mappedPlans)

        } catch (e) {
            console.log('🔥 LoadData Error:', e)
            setError('Failed to load data')
        } finally {
            console.log('✅ Loading finished')
            setLoading(false)
        }
    }

    const handlePlan = async (plan: PlanType) => {
        try {
            if (loadingPlan) return   // 🔒 double click block

            setLoadingPlan(plan.id)

            const options = {
                description: plan.name,
                currency: 'INR',
                key: 'rzp_live_Sd0KnIr5IA1uaU', // 🔴 APNI KEY DAAL
                amount: plan.price * 100, // 🔥 VERY IMPORTANT
                name: 'RealtyWire',
                prefill: {
                    email: 'test@gmail.com',
                    contact: '9999999999',
                    name: 'Dealer',
                },
                theme: { color: '#0272bc' },
            }

            console.log('🚀 Opening Razorpay...')

            const data = await RazorpayCheckout.open(options)

            console.log('✅ PAYMENT SUCCESS:', data)

            if (!data?.razorpay_payment_id) {
                throw new Error('Payment failed')
            }

            // 🔥 API CALL (FINAL)
            const response = await subscriptionRequestApi({
                subscription_id: plan.id,
                razorpay_payment_id: data.razorpay_payment_id,
                amount: plan.price,
            })

            console.log('📥 API RESPONSE:', response)

            if (response?.status) {
                showModal('Subscription activated!', 'success')
                loadData()
            } else {
                showModal(response?.message || 'Failed', 'error')
            }

        } catch (err: any) {
            console.log('❌ PAYMENT ERROR:', err)

            showModal(err?.description || 'Payment Cancelled', 'error')
        } finally {
            setLoadingPlan(null)
        }
    }

    const showModal = (msg: string, type: 'success' | 'error') => {
        setModalMessage(msg)
        setModalType(type)
        setModalVisible(true)
    }

    const onRefresh = async () => {
        setRefreshing(true)
        await loadData()
        setRefreshing(false)
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
            <View style={styles.header}>
                <View style={styles.leftSection}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={22} color="#111" />
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>Subscription</Text>
                </View>

                <TouchableOpacity
                    onPress={() => navigation.navigate('SubscriptionHistory')}
                    style={styles.historyBtn}
                >
                    <Icon name="time-outline" size={18} color="#0272bc" />
                    <Text style={styles.historyText}>History</Text>
                </TouchableOpacity>
            </View>

            {/* 🔥 SUBSCRIPTION CARDS */}
            {error ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 16 }}>
                        {error}
                    </Text>
                </View>
            ) : loading ? (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, color: '#555' }}>
                        Loading plans...
                    </Text>
                </View>
            ) : (
                <FlatList
                    data={plans}
                    keyExtractor={(item) => item.id}
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    ListEmptyComponent={
                        !error ? (
                            <View style={{ alignItems: 'center', marginTop: 60 }}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: '700',
                                    color: '#111'
                                }}>
                                    No Packages Available
                                </Text>

                                <Text style={{
                                    fontSize: 13,
                                    color: '#777',
                                    marginTop: 6
                                }}>
                                    Please check back later
                                </Text>
                            </View>
                        ) : null
                    }
                    contentContainerStyle={[
                        styles.cardWrapper,
                        plans.length === 0 && { flex: 1, justifyContent: 'center' }
                    ]}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isActive = item.isActive
                        const isLoading = loadingPlan === item.name

                        return (
                            <View
                                style={[
                                    styles.card,
                                    isActive && styles.activeCard,
                                ]}
                            >
                                {/* 🔥 Plan Header */}
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Text style={styles.plan}>{item.name}</Text>

                                    <View style={{ flexDirection: 'row', gap: 6 }}>
                                        {item.price === 0 && (
                                            <Text style={styles.freeBadge}>FREE</Text>
                                        )}

                                        {isActive && (
                                            <Text style={styles.activeBadge}>ACTIVE</Text>
                                        )}
                                    </View>
                                </View>

                                <Text style={styles.price}>
                                    ₹{item.price} / {item.duration}
                                </Text>

                                <View style={{ marginBottom: 12 }}>
                                    {item.features.map((f, i) => (
                                        <View key={i} style={{ flexDirection: 'row', marginBottom: 6 }}>
                                            <Text style={{ color: '#0272bc', marginRight: 8 }}>•</Text>
                                            <Text style={{ color: '#444', flex: 1, lineHeight: 18 }}>
                                                {f}
                                            </Text>
                                        </View>
                                    ))}
                                </View>
                                {item.description ? (
                                    <Text style={styles.description}>
                                        {item.description}
                                    </Text>
                                ) : null}

                                <TouchableOpacity
                                    style={[
                                        styles.btn,
                                        isActive && styles.activeBtn,
                                        (isActive || isLoading) && styles.disabledBtn
                                    ]}
                                    disabled={isActive || isLoading}
                                    onPress={() => handlePlan(item)}
                                >
                                    <Text style={styles.btnText}>
                                        {isLoading
                                            ? 'Processing...'
                                            : isActive
                                                ? 'Active Plan'
                                                : 'Choose Plan'}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        )
                    }}

                />
            )}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        {modalType === 'success' ? (
                            <View style={styles.successCircle}>
                                <Icon name="checkmark" size={40} color="#fff" />
                            </View>
                        ) : null}
                        <Text style={[
                            styles.modalTitle,
                            { color: modalType === 'success' ? '#16A34A' : '#DC2626' }
                        ]}>
                            {modalType === 'success' ? 'Success' : 'Error'}
                        </Text>

                        <Text style={styles.modalMessage}>
                            {modalMessage}
                        </Text>

                        <TouchableOpacity
                            style={styles.modalBtn}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.modalBtnText}>OK</Text>
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

    /* HEADER */
    header: {
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: '#fff'
    },

    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    headerTitle: {
        marginLeft: 10,
        fontSize: 18,
        fontWeight: '700',
        color: '#111',
    },

    historyBtn: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    historyText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '600',
        color: '#0272bc',
    },
    disabledBtn: {
        backgroundColor: '#9CA3AF',
    },
    /* CARDS */
    cardWrapper: {
        padding: 10,
        paddingBottom: 20, // 👈 add this
    },

    card: {
        backgroundColor: '#fff',
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,

        borderWidth: 1,
        borderColor: '#f1f5f9',  // 👈 NEW

        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },

    activeCard: {
        borderWidth: 1.5,
        borderColor: '#0272bc',
        backgroundColor: '#F0F9FF',
    },

    plan: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111',
        marginBottom: 6,
    },
    freeBadge: {
        backgroundColor: '#E0F2FE',
        color: '#0284C7',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        fontSize: 10,
        fontWeight: '700',
    },

    activeBadge: {
        backgroundColor: '#DCFCE7',
        color: '#16A34A',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        fontSize: 10,
        fontWeight: '700',
    },
    price: {
        fontSize: 20,
        fontWeight: '800',
        color: '#0272bc',
        marginBottom: 10,
    },
    description: {
        fontSize: 12,
        color: '#777',
        lineHeight: 18,
        marginTop: 4,
        marginBottom: 10,
    },
    desc: {
        fontSize: 13,
        color: '#555',
        lineHeight: 20,
        marginBottom: 14,
    },

    btn: {
        height: 44,
        borderRadius: 12,
        backgroundColor: '#111827',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 6,
    },

    activeBtn: {
        backgroundColor: '#0272bc',
    },

    btnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 14,
    },
    // Modal
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
        zIndex: 999,   // 👈 ADD THIS
    },
    successCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#0272bc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,

        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 10,
    },

    modalMessage: {
        fontSize: 14,
        color: '#444',
        textAlign: 'center',
        marginBottom: 20,
    },

    modalBtn: {
        backgroundColor: '#0272bc',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8,
    },

    modalBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
})
