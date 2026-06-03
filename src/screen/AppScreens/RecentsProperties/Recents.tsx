import { StyleSheet, View, FlatList, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import COLORS from '../../../utils/Colors'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import PropertyCard from '../../../component/PropertyCard'
import { historyListApi, removeHistoryApi } from '../../../api/authApi'
import { useFocusEffect } from '@react-navigation/native'

interface HistoryProperty {
  id: number
  title: string
  city: string
  category: string
  sub_category: string
  primary_image: string
  status: string
}

export default function Recents({ navigation }: any) {
  const [recents, setRecents] = useState<HistoryProperty[]>([])
  const [refreshing, setRefreshing] = useState(false)

  const onRefresh = async () => {
    if (refreshing) return   // duplicate swipe avoid
    setRefreshing(true)
    await getHistory()
    setRefreshing(false)
  }

  const getHistory = React.useCallback(async () => {
    try {
      const res = await historyListApi(10)

      if (res.status) {
        setRecents(res.data)
      }
    } catch (error) {
      console.log("History error", error)
    }
  }, [])

  const removeHistory = async (id: number) => {
    try {
      const res = await removeHistoryApi(id)

      if (res.status) {
        // direct UI update
        setRecents(prev => prev.filter(item => item.id !== id))
      }

    } catch (error) {
      console.log("Remove history error", error)
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      getHistory()
    }, [getHistory])
  )

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10, textAlign: 'center' }}>
          Recent Properties
        </Text>
        {recents.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <View style={styles.emptyCard}>

              <Text style={styles.emoji}>🏡</Text>

              <Text style={styles.emptyTitle}>
                No Recent Properties
              </Text>

              <Text style={styles.emptyText}>
                Properties you view will appear here
              </Text>

            </View>
          </View>
        ) : (
          <FlatList
            data={recents}
            keyExtractor={(item) => item.id.toString()}
            refreshing={refreshing}
            onRefresh={onRefresh}
            renderItem={({ item }) => (
              <PropertyCard
                item={{
                  id: item.id,
                  title: item.title,
                  city: item.city,
                  category: item.category,
                  subcategory: item.sub_category,
                  image: item.primary_image,
                  status: item.status
                }}
                onPress={() =>
                  navigation.navigate('PropertyDetail', { item })
                }
                showActions={true}

                onDelete={() => removeHistory(item.id)}
              />
            )}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingTop: 8
  },
  emptyWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 40,
    paddingHorizontal: 35,
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  emoji: {
    fontSize: 40,
    marginBottom: 10,
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },

  emptyText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
  }
})