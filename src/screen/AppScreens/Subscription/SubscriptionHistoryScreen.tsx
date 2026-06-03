import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import COLORS from '../../../utils/Colors'
import Icon from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { subscriptionHistoryApi } from '../../../api/authApi'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function SubscriptionHistoryScreen() {
  const navigation = useNavigation<any>()
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)

      const res = await subscriptionHistoryApi()

      console.log('📥 History Data:', res)

      setHistory(res)

    } catch (e) {
      console.log('🔥 History Error:', e)
    } finally {
      setLoading(false)
    }
  }

  const renderItem = ({ item }: any) => {
    const isActive = item.is_active === "yes"

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.plan}>{item.plan_name}</Text>

          <Text
            style={[
              styles.status,
              { color: isActive ? '#16A34A' : '#DC2626' },
            ]}
          >
            {isActive ? 'Active' : 'Expired'}
          </Text>
        </View>

        <Text style={styles.amount}>₹{item.price}</Text>

        <View style={styles.row}>
          <Text style={styles.date}>
            {item.start_date} - {item.end_date}
          </Text>

          {/* <TouchableOpacity>
            <Text style={styles.invoice}>Invoice</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* 🔥 HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Subscription History</Text>

        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 50 }}>
          Loading history...
        </Text>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => String(index)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No subscription history found</Text>
          }
        />
      )}
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
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: COLORS.surface,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  /* LIST */
  list: {
    padding: 10,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  plan: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
  },

  status: {
    fontSize: 13,
    fontWeight: '700',
  },

  amount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0272bc',
    marginVertical: 6,
  },

  date: {
    fontSize: 12,
    color: '#555',
  },

  invoice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0272bc',
  },

  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
})
