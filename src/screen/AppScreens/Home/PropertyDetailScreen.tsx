import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking, Alert,
  Dimensions,
  FlatList,
  Share
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useFavourite } from '../../../context/FavouriteContext'
import { addHistoryApi, propertyDetailsApi, propertyEditApi } from '../../../api/authApi'
import { SafeAreaView } from 'react-native-safe-area-context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Loader from '../../../component/Loader'

const { width } = Dimensions.get('window')

export default function PropertyDetailScreen({ route, navigation }: any) {
  const { item, from } = route.params
  const [property, setProperty] = useState<any>(item)
  const [loading, setLoading] = useState(true)
  const isMyProperty = from === 'myProperty'
  const [showMore, setShowMore] = useState(false)
  const { isFavourite, toggleFavourite } = useFavourite()
  const fav = isFavourite(property.id)
  const imageRef = React.useRef<FlatList>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    loadSubscription()
  }, [])

  const loadSubscription = async () => {
    try {
      const token = await AsyncStorage.getItem('token')

      const res = await fetch('https://realtywire.in/api/profile/status', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      })

      const json = await res.json()
      console.log('🟣 API Response:', json)
      if (json.status) {
        setSubscription(json.data)
      }

    } catch (e) {
      console.log(e)
    }
  }

  const hasActiveSubscription =
    subscription?.subscription_status === 'active'

  useEffect(() => {
    loadDetails()
  }, [])

  const loadDetails = async () => {
    try {
      setLoading(true)

      const json = await propertyDetailsApi(Number(item.id))

      if (!json || !json.status) {
        Alert.alert("Error", "Failed to load property details")
        return
      }

      setProperty(json.data)

    } catch (e) {
      console.log("❌ PROPERTY DETAILS ERROR:", e)

      Alert.alert(
        "Network Error",
        "Please check your internet connection"
      )
    } finally {
      setLoading(false)
    }
  }

  const callDealer = async (phone: string) => {
    try {
      if (!phone) {
        Alert.alert('Error', 'Phone number not available')
        return
      }

      const url = `tel:${phone}`

      const supported = await Linking.canOpenURL(url)

      if (!supported) {
        Alert.alert("Error", "Calling not supported on this device")
        return
      }

      Alert.alert(
        "Contact Dealer",
        `You are about to call the dealer for:\n\n${property.title}`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Call Now",
            onPress: async () => {
              await Linking.openURL(url)
              await addHistoryApi(property.id)
            }
          }
        ]
      )

    } catch (e) {
      console.log(e)
      Alert.alert("Error making call")
    }
  }
  const whatsappDealer = async (phone: string, title: string) => {
    try {
      if (!phone) {
        Alert.alert('Error', 'WhatsApp number not available')
        return
      }

      const message = `Hello 👋,
I found your property listing "${title}" on RealtyWire and would like to know more about it. Please share the details. Thanks!`

      const url = `whatsapp://send?phone=91${phone}&text=${encodeURIComponent(message)}`

      const supported = await Linking.canOpenURL(url)

      if (!supported) {
        Alert.alert('WhatsApp not installed')
        return
      }

      await Linking.openURL(url)
      await addHistoryApi(property.id)

    } catch (e) {
      console.log(e)
      Alert.alert("Error opening WhatsApp")
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Loader text="Loading property..." />
      </View>
    )
  }

  if (!property) return null

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.wrapper}>

        {/* 🔥 HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome5 name="arrow-left" size={16} />
          </TouchableOpacity>

          {/* CENTER */}
          <Text style={styles.headerTitle}>
            {property.category} Detail
          </Text>

          {/* RIGHT */}
          {!isMyProperty ? (
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => toggleFavourite(property.id)}
            >
              <FontAwesome5
                name="heart"
                size={16}
                solid={fav}
                color={fav ? '#E11D48' : '#000'}
              />
            </TouchableOpacity>
          ) : (
            // 👻 Invisible spacer (same width)
            <View style={styles.iconBtn} />
          )}
        </View>


        <ScrollView showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 0 }}>

          {/* 🔥 IMAGE CARD */}
          <View style={styles.imageWrapper}>
            <FlatList
              ref={imageRef}
              data={property.images || []}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, index) => index.toString()}
              onMomentumScrollEnd={e => {
                const ITEM_WIDTH = width - 16

                const index = Math.round(
                  e.nativeEvent.contentOffset.x / ITEM_WIDTH
                )
                setCurrentIndex(index)
              }}
          renderItem={({ item: img }) => {
  console.log('IMAGE URL =>', img.url);

  return (
    <Image
      source={{ uri: img.url }}
      style={styles.image}
    />
  );
}}
            />
            <View style={styles.dots}>
              {property.images?.map((_: any, i: number) => (
                <View
                  key={i}
                  style={[
                    styles.dot,
                    currentIndex === i && styles.activeDot
                  ]}
                />
              ))}
            </View>
            {/* LEFT ARROW */}
            {currentIndex > 0 && (
              <TouchableOpacity
                style={[styles.arrowBtn, styles.leftArrow]}
                onPress={() => {
                  const prev = currentIndex - 1
                  imageRef.current?.scrollToIndex({ index: prev })
                  setCurrentIndex(prev)
                }}
              >
                <FontAwesome5 name="chevron-left" size={16} color="#fff" />
              </TouchableOpacity>
            )}

            {/* RIGHT ARROW */}
            {currentIndex < (property.images?.length || 1) - 1 && (
              <TouchableOpacity
                style={[styles.arrowBtn, styles.rightArrow]}
                onPress={() => {
                  const next = currentIndex + 1
                  imageRef.current?.scrollToIndex({ index: next })
                  setCurrentIndex(next)
                }}
              >
                <FontAwesome5 name="chevron-right" size={16} color="#fff" />
              </TouchableOpacity>
            )}
          </View>

          {/* 🔥 CONTENT CARD */}
          <View style={styles.content}>

            {/* TAGS */}
            <View style={styles.tagRow}>
              <Text style={styles.tag}>
                {property.category}
              </Text>

              {property.status === 'active' && (
                <Text style={styles.verified}>ACTIVE</Text>
              )}
            </View>

            {/* TITLE + RATING */}
            <View style={styles.titleRow}>
              <Text style={styles.title}>{property.title}</Text>
              {/* <TouchableOpacity style={styles.shareBtn} >
              <FontAwesome5 name="share-alt" size={14} color="#2563EB" />
              <Text style={styles.shareText}>Share</Text>
            </TouchableOpacity> */}
            </View>

            {/* LOCATION (fallback) */}
            <Text style={styles.location}>
              📍 {property.city}, {property.area}
            </Text>

            {/* PROPERTY META (dynamic fields) */}
            <View style={styles.metaContainer}>
              {property.fields?.map((item: any, index: number) => {

                const iconName =
                  item.icon ||
                  (item.label?.toLowerCase().includes('bed')
                    ? 'bed'
                    : item.label?.toLowerCase().includes('bath')
                      ? 'bath'
                      : item.label?.toLowerCase().includes('area')
                        ? 'vector-square'
                        : item.label?.toLowerCase().includes('floor')
                          ? 'building'
                          : 'circle')

                return (
                  <View key={index} style={styles.metaCard}>
                    <FontAwesome5
                      name={iconName}
                      size={18}
                      color="#2563EB"
                    />

                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.metaValue}>{item.label}</Text>

                      <Text style={styles.metaLabel}>{item.value}</Text>
                    </View>
                  </View>
                )
              })}
            </View>


            {/* DESCRIPTION */}
            <Text style={styles.section}>Description</Text>

            <Text style={styles.desc}>
              {showMore
                ? property.description
                : property.description?.length > 80
                  ? property.description.substring(0, 80) + "..."
                  : property.description}
            </Text>

            {property.description?.length > 80 && (
              <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                <Text style={styles.readMore}>
                  {showMore ? "Show less" : "Show more"}
                </Text>
              </TouchableOpacity>
            )}

            {/* DEALER CARD (fallback) */}
            {/* <View style={styles.dealerCardDark}>
            <View>
              <Text style={styles.dealerLabel}>LISTED BY DEALER</Text>
              <Text style={styles.dealerName}>
                Dealer #{property.dealer_id}
              </Text>
              <Text style={styles.dealerCompany}>
                Dealer info not available
              </Text>
            </View>

            <View style={styles.dealerAvatar}>
              <FontAwesome5 name="user" size={18} color="#fff" />
            </View>
          </View> */}
          </View>
        </ScrollView>

        {/* 🔥 BOTTOM BAR */}
        {!isMyProperty && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[
                styles.callBtn,
                !hasActiveSubscription && { opacity: 0.6 }
              ]}
              onPress={() => {
                if (!hasActiveSubscription) {
                  Alert.alert(
                    "🔒 Subscription Required",
                    "You need a subscription to contact dealer",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Buy Now",
                        onPress: () => navigation.navigate('Subscription')
                      }
                    ]
                  )
                  return
                }

                callDealer(property.mobile || '')
              }}
            >
              <FontAwesome5 name="phone-alt" size={16} color="#fff" />
              <Text style={styles.actionText}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.msgBtn,
                !hasActiveSubscription && { opacity: 0.6 }
              ]}
              onPress={() => {
                if (!hasActiveSubscription) {
                  Alert.alert(
                    "🔒 Subscription Required",
                    "You need a subscription to contact dealer",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Buy Now",
                        onPress: () => navigation.navigate('Subscription')
                      }
                    ]
                  )
                  return
                }

                whatsappDealer(property.mobile || '', property.title)
              }}
            >
              <FontAwesome5 name="whatsapp" size={18} color="#fff" />
              <Text style={styles.actionText}>Whatsapp</Text>
            </TouchableOpacity>
          </View>
        )}
        {isMyProperty && (
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.editBtn}
              onPress={async () => {
                const res = await propertyEditApi(Number(item.id))

                if (res.status) {
                  navigation.navigate('BottomTabs', {
                    screen: 'Post Property',
                    params: {
                      item: res.data,
                      isEdit: true,
                    },
                  })
                } else {
                  Alert.alert('Error', res.message || 'Unable to load property for edit')
                }
              }}
            >
              <FontAwesome5 name="edit" size={16} color="#fff" />
              <Text style={styles.actionText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() => {
                Alert.alert(
                  'Delete Property',
                  'Are you sure you want to delete this property?',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    {
                      text: 'Delete',
                      style: 'destructive',
                      onPress: () => {
                        console.log('Delete API', item.id)
                        navigation.goBack()
                      }
                    },
                  ],
                )
              }}
            >
              <FontAwesome5 name="trash" size={16} color="#fff" />
              <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  iconBtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 20,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  /* IMAGE CARD */
  imageWrapper: {
    height: 230,
    marginHorizontal: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },

 image: {
  width: width - 16,
  height: 230,
  resizeMode: 'contain',
},

  arrowBtn: {
    position: 'absolute',
    top: '45%',
    transform: [{ translateY: -16 }],
    backgroundColor: 'rgba(0,0,0,0.45)',
    padding: 8,
    borderRadius: 20,
  },

  leftArrow: {
    left: 10,
  },

  rightArrow: {
    right: 10,
  },
  dots: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignSelf: 'center',
  },

  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#ccc',
    marginHorizontal: 3,
  },

  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8
  },

  /* CONTENT */
  content: {
    backgroundColor: '#fff',
    marginTop: 12,
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 20,   // 🔥 important
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: {
    fontSize: 20,
    fontWeight: '800',
    flex: 1,
    color: '#111',
    marginRight: 10,
  },

  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  shareText: {
    marginLeft: 6,
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '600',
  },
  tagRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  tag: {
    backgroundColor: '#EEF2FF',
    color: '#2563EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: '700',
    marginRight: 6,
  },
  verified: {
    backgroundColor: '#ECFDF5',
    color: '#059669',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 11,
    fontWeight: '700',
  },

  location: {
    marginTop: 4,
    color: '#6B7280',
    fontSize: 13,
  },

  priceBox: {
    backgroundColor: '#F1F5F9',
    padding: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  market: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },

  metaContainer: {
    marginTop: 14,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  metaCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 10,
    width: '49%',
    marginBottom: 8,
  },

  metaValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111',
  },

  metaLabel: {
    fontSize: 11,
    color: '#666',
  },

  dealerCardDark: {
    marginTop: 18,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dealerLabel: {
    color: '#94A3B8',
    fontSize: 11,
  },
  dealerName: {
    color: '#fff',
    fontWeight: '700',
    marginTop: 2,
  },
  dealerCompany: {
    color: '#CBD5F5',
    fontSize: 12,
    marginTop: 2,
  },
  dealerAvatar: {
    backgroundColor: '#1E293B',
    padding: 10,
    borderRadius: 30,
  },
  price: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 14,
  },

  section: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
  },

  desc: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    width: '100%',
  },

  readMore: {
    marginTop: 6,
    color: '#2563EB',
    fontWeight: '600',
  },

  /* BOTTOM BAR */
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#eee',
  },

  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
  },

  msgBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#16A34A',
    paddingVertical: 10,
    borderRadius: 12,
  },

  actionText: {
    color: '#fff',
    fontWeight: '700',
    marginLeft: 8,
    fontSize: 15,
  },
  editBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 12,
    marginRight: 10,
  },

  deleteBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 10,
    borderRadius: 12,
  },
})
