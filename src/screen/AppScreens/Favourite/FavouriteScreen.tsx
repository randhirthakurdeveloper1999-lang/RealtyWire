import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { PROPERTY_LIST } from '../../../data/properties'
import { useFavourite } from '../../../context/FavouriteContext'
import PropertyCard from '../../../component/PropertyCard'
import { SafeAreaView } from 'react-native-safe-area-context'
import { favouriteListApi, removeFavouriteApi, toggleFavouriteApi } from '../../../api/authApi'
import { useFocusEffect } from '@react-navigation/native'

type Property = {
  id: number
  title: string
  image: string
  city?: string
  category?: string
  subcategory?: string
  status?: string
}


export default function FavouriteScreen({ navigation }: any) {
  const { favourites, toggleFavourite, isFavourite } = useFavourite()
  const [favouriteData, setFavouriteData] = useState<Property[]>([])

  useFocusEffect(
    useCallback(() => {
      loadFav()
    }, [])
  )

  const loadFav = async () => {
    const json = await favouriteListApi()

    console.log("FAV API =>", json)

    if (json.status) {
      const mapped = json.data.map((p: any) => ({
        id: p.id,
        title: p.title,
        image: p.primary_image,
        city: p.city,
        category: p.category,
        subcategory: p.sub_category,
        status: p.status,
      }))

      setFavouriteData(mapped)

      // 👇 sync context with API favourites
      mapped.forEach((p: any) => {
        if (!isFavourite(String(p.id))) {
          toggleFavourite(String(p.id))
        }
      })

    }
  }



  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F6FA' }}>
      {/* 🔥 CUSTOM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <FontAwesome5 name="arrow-left" size={18} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Favourite Properties</Text>

        {/* right side empty for center alignment */}
        <View style={{ width: 18 }} />
      </View>

      {/* ❌ EMPTY STATE */}
      {favouriteData.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No favourites yet ❤️</Text>
        </View>
      ) : (
        <FlatList
          data={favouriteData}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PropertyCard
              item={item}
              isFav={isFavourite(String(item.id))}
              onFav={async () => {
                await removeFavouriteApi(item.id)

                toggleFavourite(String(item.id)) // 👈 add this

                setFavouriteData(prev =>
                  prev.filter(p => p.id !== item.id)
                )
              }}
              onPress={() =>
                navigation.navigate('PropertyDetail', { item })
              }
            />
          )}
        />
      )}
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eee',
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    fontSize: 16,
    color: '#777',
    fontWeight: '500',
  },
})
