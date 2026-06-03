import React, { useCallback, useEffect, useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
} from 'react-native'
import COLORS from '../../../utils/Colors'
import PropertyCard from '../../../component/PropertyCard'
import Loader from '../../../component/Loader'
import { deletePropertyApi, propertyEditApi, propertyListApi } from '../../../api/authApi'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useFocusEffect } from '@react-navigation/native'

type PropertyItem = {
  id: string
  title: string
  image: string
  status: string
  city?: string
  category?: string
  subcategory?: string
  description?: string
}

export default function MyProperty({ navigation }: any) {
  const [properties, setProperties] = useState<PropertyItem[]>([])
  const [statusFilter, setStatusFilter] = useState<'active' | 'sold'>('active')
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [refreshing, setRefreshing] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // useFocusEffect(
  //   React.useCallback(() => {
  //     setPage(1)
  //     setHasMore(true)
  //     fetchProperties(1)
  //   }, [])
  // )

useFocusEffect(
  useCallback(() => {
    console.log("🔄 Screen Focus → Reload Properties")

    setPage(1)
    setHasMore(true)
    fetchProperties(1)

  }, [])
)

  const fetchProperties = async (pageNumber = 1) => {

    if (!refreshing && pageNumber === 1) {
      setLoading(true)
    }

    if (pageNumber > 1) {
      setLoadingMore(true)
    }

    try {

      const json = await propertyListApi(pageNumber, 5)

      if (json.status) {

        const apiProperties = json.data.map((p: any) => ({
          id: p.id.toString(),
          title: p.title,
          city: p.city,
          category: p.category,
          subcategory: p.sub_category,
          image: p.image,
          status: p.status,
          description: p.description,
          category_id: p.category_id,
          sub_category_id: p.sub_category_id,
          city_id: p.city_id,
          area_id: p.area_id,
        }))

        if (pageNumber === 1) {
          setProperties(apiProperties)
        } else {
          setProperties(prev => [...prev, ...apiProperties])
        }

        setPage(json.current_page)
        setLastPage(json.last_page)

        // 🔥 last page check
        if (json.current_page >= json.last_page) {
          setHasMore(false)
        }

      }

    } catch (e) {
      console.log(e)
    }

    // 🔥 loaders reset
    setLoading(false)
    setRefreshing(false)
    setLoadingMore(false)
  }

  const filteredProperties = properties.filter(
    item => item.status.toLowerCase() === statusFilter
  )

  const deleteProperty = async (id: string) => {
    const res = await deletePropertyApi(Number(id))

    if (res.status) {
      setProperties(prev => prev.filter(p => p.id !== id))
    }
  }

  return (
    <View style={styles.container}>
      {/* 🔝 HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Property</Text>
      </View>

      <View style={styles.toggleContainer}>

        <Text
          style={[
            styles.toggleBtn,
            statusFilter === 'active' && styles.activeToggle,
          ]}
          onPress={() => setStatusFilter('active')}
        >
          Active
        </Text>

        <Text
          style={[
            styles.toggleBtn,
            statusFilter === 'sold' && styles.activeToggle,
          ]}
          onPress={() => setStatusFilter('sold')}
        >
          Sold
        </Text>

      </View>

      {loading && page === 1 ? (
        <Loader text="Fetching your properties..." />
      ) : filteredProperties.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 80 }}>
          <FontAwesome5 name="home" size={40} color="#ccc" />

          <Text style={{ marginTop: 10, color: '#777' }}>
            {statusFilter === 'active'
              ? 'No active properties'
              : 'No sold properties'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredProperties}
          keyExtractor={(item) => item.id.toString()}
          initialNumToRender={6}
          maxToRenderPerBatch={6}
          windowSize={10}
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true)
            setPage(1)
            setHasMore(true)
            fetchProperties(1)
          }}
          renderItem={({ item }) => (
            <PropertyCard
              item={item}
              showActions
              onPress={() =>
                navigation.navigate('PropertyDetail', {
                  item,
                  from: 'myProperty',
                })
              }
              onEdit={async () => {
                const res = await propertyEditApi(Number(item.id))

                if (res.status) {
                  navigation.navigate('BottomTabs', {
                    screen: 'Post Property',
                    params: {
                      item: res.data, // 🔥 full data
                      isEdit: true,
                    },
                  })
                }
              }}

              onDelete={(property: PropertyItem) => {
                Alert.alert('Delete Property', 'Are you sure?', [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    onPress: () => deleteProperty(property.id),
                  },
                ])
              }}
            />
          )}
          onEndReached={() => {
            if (loadingMore || !hasMore) return

            const nextPage = page + 1
            setPage(nextPage)
            fetchProperties(nextPage)
          }}
          onEndReachedThreshold={0.5}

          ListFooterComponent={
            loadingMore ? (
              <View style={{ paddingVertical: 10 }}>
                <Loader text="Loading more..." />
              </View>
            ) : null
          }
        />

      )}

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,

  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },

  toggleBtn: {
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    marginHorizontal: 5,
    color: '#333',
  },

  activeToggle: {
    backgroundColor: '#0272bc',
    color: '#fff',
    borderColor: '#05548a',
  },
})
