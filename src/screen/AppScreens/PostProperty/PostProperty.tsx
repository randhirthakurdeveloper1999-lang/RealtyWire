import React, { useCallback, useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Image,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  PermissionsAndroid,
  Linking,
} from 'react-native'
import COLORS from '../../../utils/Colors'
import CustomDropdown from '../../../component/CustomDropdown'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs'
import Loader from '../../../component/Loader'
import { deletePropertyImageApi } from '../../../api/authApi'
import { useFocusEffect } from '@react-navigation/native'

const BASE_URL = 'https://realtywire.in/api'

export default function PostProperty({ route, navigation }: any) {
  const tabHeight = useBottomTabBarHeight()
  const editItem = route?.params?.item
  const isEdit = route?.params?.isEdit || false
  const [title, setTitle] = useState('')
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])

  const [categoryId, setCategoryId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [cities, setCities] = useState<any[]>([])
  const [cityId, setCityId] = useState('')
  const [areas, setAreas] = useState<any[]>([])
  const [areaId, setAreaId] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState('active')
  const [fields, setFields] = useState<any[]>([])
  const [fieldValues, setFieldValues] = useState<any>({})
  const [categoryError, setCategoryError] = useState('')
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [images, setImages] = useState<any[]>([])
  const [fieldOptions, setFieldOptions] = useState<Record<number, any[]>>({})
  const [loading, setLoading] = useState(false)
  const [subscription, setSubscription] = useState<any>(null)
  const [loadingSub, setLoadingSub] = useState(true)

  const loadProfileStatus = async () => {
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
    } finally {
      setLoadingSub(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadProfileStatus()
    }, [])
  )

  const hasActiveSubscription =
    subscription?.subscription_status === 'active'

  const resetForm = () => {
    setTitle('')
    setCategoryId('')
    setSubcategoryId('')
    setCityId('')
    setAreaId('')
    setDescription('')
    setStatus('active')
    setFields([])
    setFieldValues({})
    setImages([])
  }

  const pickImages = () => {
    try {
      launchImageLibrary(
        {
          mediaType: 'photo',
          selectionLimit: 0,
        },
        (res) => {
          if (res.didCancel) return

          if (res.errorCode) {
            Alert.alert("Error", res.errorMessage || "Image picker error")
            return
          }

          if (res.assets && res.assets.length > 0) {
            setImages(prev => [...prev, ...(res.assets ?? [])])
          }
        }
      )
    } catch (e) {
      console.log(e)
      Alert.alert("Error opening gallery")
    }
  }
  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: "Camera Permission",
            message: "App needs camera access to take property photos",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        )

        return granted === PermissionsAndroid.RESULTS.GRANTED

      } catch (err) {
        console.warn(err)
        return false
      }
    }
    return true
  }
  const openCamera = async () => {
    try {
      const hasPermission = await requestCameraPermission()

      if (!hasPermission) {
        Alert.alert(
          "Permission Required",
          "Please allow camera permission from settings",
          [
            { text: "Cancel" },
            { text: "Open Settings", onPress: () => Linking.openSettings() }
          ]
        )
        return
      }

      launchCamera(
        {
          mediaType: 'photo',
          cameraType: 'back',
        },
        (res) => {
          if (res.didCancel) return

          if (res.errorCode) {
            Alert.alert("Error", res.errorMessage || "Camera error")
            return
          }

          if (res.assets && res.assets.length > 0) {
            setImages(prev => [...prev, ...(res.assets ?? [])])
          }
        }
      )

    } catch (e) {
      console.log(e)
      Alert.alert("Error opening camera")
    }
  }
  const removeImage = async (index: number) => {

    const img = images[index]

    // agar backend wali image hai
    if (img.id) {

      try {

        const res = await deletePropertyImageApi(img.id)

        console.log("DELETE IMAGE RESPONSE =>", res)

        if (!res.status) {
          Alert.alert("Image delete failed")
          return
        }

      } catch (e) {
        console.log("DELETE IMAGE ERROR =>", e)
        return
      }

    }

    const newArr = [...images]
    newArr.splice(index, 1)
    setImages(newArr)

  }
  const openPicker = () => {
    Alert.alert(
      "Upload Image",
      "Choose option",
      [
        { text: "Camera", onPress: openCamera },
        { text: "Gallery", onPress: pickImages },
        { text: "Cancel", style: "cancel" }
      ]
    )
  }
  useEffect(() => {
    if (isEdit && editItem) {

      setTitle(editItem.title || '')
      setDescription(editItem.description || '')
      setStatus(editItem.status || 'active')

      setCategoryId(editItem.category_id?.toString() || '')
      setSubcategoryId(editItem.sub_category_id?.toString() || '')
      setCityId(editItem.city_id?.toString() || '')


      // 🔥 Dynamic fields autofill
      if (editItem.fields) {

        const formatted: Record<number, string> = {}

        Object.keys(editItem.fields).forEach(key => {
          formatted[Number(key)] = editItem.fields[key]
        })

        setFieldValues(formatted)
      }

      // images
      if (editItem.images && editItem.images.length > 0) {

        const formattedImages = editItem.images.map((img: any) => ({
          id: img.id, // 👈 important
          uri: img.url,
          type: "image/jpeg",
          fileName: `old_${img.id}.jpg`
        }))
        setImages(formattedImages)
      }

    }
  }, [editItem])

  useEffect(() => {
    if (isEdit && editItem && subcategoryId) {
      loadFields(subcategoryId, false)
    }
  }, [subcategoryId])

  useEffect(() => {
    if (categoryId) loadSubcategories(categoryId, false)
  }, [categoryId])

  useEffect(() => {
    if (cityId) loadAreas(cityId)
  }, [cityId])

  useEffect(() => {
    loadCategories()
    loadCities()
  }, [])

  useEffect(() => {
    if (isEdit && editItem && areas.length > 0) {
      setAreaId(String(editItem.area_id))
    }
  }, [areas])

  const authHeader = async () => {
    const token = await AsyncStorage.getItem('token')
    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    }
  }

  const loadCategories = async () => {
    const res = await fetch(`${BASE_URL}/dealer/category-list`, {
      method: 'POST',
      headers: await authHeader(),
    })


    const json = await res.json()

    console.log("CATEGORY API =>", json)
    console.log("CATEGORY DATA ARRAY =>", json.data)

    setCategories(json.data || [])
  }

  const loadSubcategories = async (id: string, reset: boolean = true) => {
    setCategoryError('')

    if (reset) {
      setSubcategoryId('')
      setFields([])
    }

    const res = await fetch(`${BASE_URL}/dealer/subcategory-list`, {
      method: 'POST',
      headers: {
        ...(await authHeader()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ category_id: id }),
    })

    const json = await res.json()
    setSubcategories(json.data || [])
  }


  const loadFields = async (id: string, reset = false) => {
    if (reset) setFieldValues({})

    const res = await fetch(`${BASE_URL}/dealer/field-list`, {
      method: 'POST',
      headers: {
        ...(await authHeader()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sub_category_id: id }),
    })

    const json = await res.json()
    console.log("FIELDS API RESPONSE =>", json)
    const fieldsData = json.data || []

    setFields(fieldsData)

    // select fields ke options load karo
    fieldsData.forEach((field: any) => {
      if (field.field_type === "select") {
        loadFieldOptions(field.id)
      }
    })
  }

  const loadFieldOptions = async (fieldId: number) => {
    try {
      const res = await fetch(`${BASE_URL}/dealer/field-options`, {
        method: 'POST',
        headers: {
          ...(await authHeader()),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ field_id: fieldId }),
      })

      const json = await res.json()

      console.log("FIELD OPTIONS =>", fieldId, json)

      setFieldOptions(prev => ({
        ...prev,
        [fieldId]: json.data || [],
      }))
    } catch (e) {
      console.log("FIELD OPTIONS ERROR =>", e)
    }
  }

  const loadCities = async () => {
    const res = await fetch(`${BASE_URL}/dealer/city-list`, {
      method: 'POST',
      headers: await authHeader(),
    })
    const json = await res.json()
    setCities(json.data || [])
  }

  const loadAreas = async (id: string) => {
    if (!isEdit) {
      setAreaId('')
    }
    const res = await fetch(`${BASE_URL}/dealer/area-list`, {
      method: 'POST',
      headers: {
        ...(await authHeader()),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ city_id: id }),
    })

    const json = await res.json()
    setAreas(json.data || [])
  }

  const handleSubcategoryAttempt = () => {
    if (!categoryId) {
      setCategoryError('Please select category first')
      return
    }

    setCategoryError('')
  }

  const handleSubmit = async () => {

    try {
      if (!areaId) {
        console.log("❌ AREA ID MISSING")
        Alert.alert("Please select area")
        return
      }

      // 🚫 prevent contact number in description
      const phoneRegex = /(\+91[\-\s]?)?[6-9]\d{9}/g

      if (phoneRegex.test(description)) {
        Alert.alert(
          "Contact number not allowed",
          "Please don't share phone number in description"
        )
        return
      }

      setLoading(true)

      const formData = new FormData()

      if (isEdit && editItem?.id) {
        formData.append('id', editItem.id.toString())
      }

      if (title && title.trim() !== '') {
        formData.append('title', title)
      }
      if (description && description.trim() !== '') {
        formData.append('description', description)
      } else {
        formData.append('description', '')
      }
      formData.append('status', status)

      formData.append('category_id', categoryId)
      formData.append('sub_category_id', String(subcategoryId))
      formData.append('city_id', cityId)
      formData.append('area_id', areaId)

      Object.keys(fieldValues).forEach(key => {
        formData.append(`fields[${key}]`, fieldValues[key])
      })

      images.forEach((img, index) => {

        // old images skip karo
        if (img.uri.startsWith('http')) {
          return
        }

        console.log("NEW IMAGE APPEND =>", img.uri)

        formData.append('images[]', {
          uri: img.uri,
          type: img.type || 'image/jpeg',
          name: img.fileName || `image_${index}.jpg`,
        } as any)

      })

      console.log("FORM DATA READY")

      const url = isEdit
        ? `${BASE_URL}/dealer/property-update`
        : `${BASE_URL}/dealer/property-add`

      console.log("API URL =>", url)

      const token = await AsyncStorage.getItem('token')

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
        body: formData,
      })

      const json = await res.json()

      console.log("FULL RESPONSE =>", json)
      console.log("ERRORS =>", json.errors)

      console.log("PROPERTY SAVE RESPONSE =>", json)

      if (!json.status) {
        Alert.alert("Error", json.message || "Something went wrong")
        return
      }

      if (json.status) {
        console.log("✅ PROPERTY SAVED SUCCESSFULLY")

        resetForm()   // 👈 YAHI ADD KARNA HAI

        try {
          navigation.navigate("BottomTabs", {
            screen: "My Property",
          })

          console.log("➡ Switched to My Property Tab")

        } catch (err) {
          console.log("❌ NAVIGATION ERROR =>", err)
        }
      }

    } catch (e) {
      console.log("PROPERTY ERROR =>", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      console.log("POST PROPERTY SCREEN BLUR → RESET FORM")
      resetForm()
    })

    return unsubscribe
  }, [navigation])

  if (loadingSub) {
    return <Loader />
  }

  if (!hasActiveSubscription) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <View style={{
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 16,
          width: '85%',
          alignItems: 'center',
          elevation: 4
        }}>

          <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 10 }}>
            No Active Subscription
          </Text>

          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
            You need a subscription to post property
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 10,
            }}
            onPress={() => navigation.navigate('Subscription')}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>
              Buy Subscription
            </Text>
          </TouchableOpacity>

        </View>

      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView edges={['left', 'right']} style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: tabHeight }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <Text style={styles.heading}>Post Property</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            placeholder="Property title"
            placeholderTextColor="#999"
            style={styles.input}
            value={title}
            onChangeText={setTitle}
          />

          {/* CATEGORY */}
          <CustomDropdown
            label="Category"
            data={categories.map(i => ({
              label: i.title,
              value: i.id.toString(),
            }))}
            value={categoryId}
            onSelect={(val: string) => {

              setCategoryId(val)

              // 🔥 clear old dynamic data
              setSubcategoryId('')
              setFields([])
              setFieldValues({})

              loadSubcategories(val)
            }}

          />

          {categoryError ? (
            <Text style={{ color: 'red', marginBottom: 10 }}>
              Please select category first
            </Text>
          ) : null}


          {/* SUBCATEGORY */}
          <CustomDropdown
            label="Subcategory"
            data={subcategories.map(i => ({
              label: i.title,
              value: i.id.toString(),
            }))}

            value={subcategoryId}
            isDisabled={!categoryId}  // 👈 important
            onSelect={(val: string) => {
              console.log("SUBCATEGORY SELECTED =>", val)

              setSubcategoryId(val)

              // 🔥 old fields clear
              loadFields(val, true)
            }}
            onPress={handleSubcategoryAttempt}
          />

          {/* DYNAMIC FIELDS */}
          {fields.map((field: any) => {
            if (field.field_type === "text" || field.field_type === "number") {
              return (
                <TextInput
                  key={field.id}
                  placeholder={field.field_label}
                  placeholderTextColor="#999"
                  style={styles.input}
                  value={fieldValues[field.id] || ''}
                  onChangeText={(val: string) =>
                    setFieldValues((prev: any) => ({
                      ...prev,
                      [field.id]: val,
                    }))
                  }
                />
              )
            }

            if (field.field_type === "select") {
              return (
                <CustomDropdown
                  key={field.id}
                  label={field.field_label}
                  data={(fieldOptions[field.id] || []).map((o: any) => ({
                    label: o.option_value,
                    value: o.option_value,
                  }))}
                  value={fieldValues[field.id]}
                  onSelect={(val: string) =>
                    setFieldValues((prev: any) => ({
                      ...prev,
                      [field.id]: val,
                    }))
                  }
                />
              )
            }


            return null
          })}

          <View style={styles.row}>
            <View style={styles.half}>
              <CustomDropdown
                label="City"
                data={cities.map(i => ({
                  label: i.title,
                  value: i.id.toString(),
                }))}

                value={cityId}
                onSelect={(val: string) => {
                  console.log("CITY SELECTED =>", val)
                  setCityId(val)
                  loadAreas(val)
                }}

              />
            </View>

            <View style={styles.half}>
              <CustomDropdown
                label="Area"
                data={areas.map(i => ({
                  label: i.title,
                  value: i.id.toString(),
                }))}

                value={areaId}
                isDisabled={!cityId}
                onSelect={setAreaId}
              />
            </View>
          </View>

          <Text style={styles.label}>Property Images</Text>

          <View style={styles.card}>

            {/* GRID */}
            <View style={styles.grid}>

              {/* ADD CARD (always first) */}
              <TouchableOpacity style={styles.addCard} onPress={openPicker}>
                <Ionicons name="add" size={28} color={COLORS.primary} />
                <Text style={{ color: COLORS.primary, fontSize: 12 }}>Add</Text>
              </TouchableOpacity>

              {/* EMPTY TEXT */}
              {images.length === 0 && (
                <View style={styles.emptyTextWrap}>
                  <Text style={styles.emptyText}>Add property images</Text>
                </View>
              )}

              {/* IMAGE CARDS */}
              {images.map((img, index) => (
                <View key={index} style={styles.imageCard}>

                  <Pressable
                    onPress={() => {
                      setPreviewImage(img.uri)
                      setPreviewVisible(true)
                    }}
                  >
                    <Image source={{ uri: img.uri }} style={styles.image} />
                  </Pressable>

                  <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => removeImage(index)}
                  >
                    <Ionicons name="close" size={14} color="#fff" />
                  </TouchableOpacity>

                </View>
              ))}

            </View>

          </View>

          <View style={{ marginBottom: 12 }}>
            {/* STATUS */}
            <View style={styles.half}>
              <CustomDropdown
                label="Status"
                noMargin
                data={[
                  { label: 'Active', value: 'active' },
                  { label: 'Sold', value: 'sold' },
                ]}
                value={status}
                onSelect={setStatus}
              />
            </View>

          </View>

          <Text style={styles.label}>Description (Optional)</Text>
          <TextInput
            placeholder="Description"
            placeholderTextColor="#999"
            style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            multiline
            scrollEnabled
          />

          <TouchableOpacity
            style={[styles.btn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>

              {loading && (
                <ActivityIndicator size="small" color="#fff" />
              )}

              <Text style={styles.btnText}>
                {loading
                  ? isEdit
                    ? "Updating..."
                    : "Saving..."
                  : isEdit
                    ? "Update Property"
                    : "Save Property"}
              </Text>

            </View>
          </TouchableOpacity>

          <Modal visible={previewVisible} transparent animationType="fade">
            <View style={styles.modalContainer}>

              <Image source={{ uri: previewImage }} style={styles.fullImage} />

              <TouchableOpacity
                style={styles.modalClose}
                onPress={() => setPreviewVisible(false)}
              >
                <Ionicons name="close" size={22} color="#fff" />
              </TouchableOpacity>

            </View>
          </Modal>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 15,
    paddingVertical: 6,   // 🔥 optional tweak
  },
  heading: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 45,
    marginBottom: 12,
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },

  half: {
    flex: 1,
  },

  label: {
    fontSize: 13,
    marginBottom: 4,
    color: '#333',
  },


  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    marginBottom: 12,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,   // 🔥 spacing equal ho jayegi
  },

  addCard: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',

  },
  emptyTextWrap: {
    justifyContent: 'center',
    marginLeft: 6,
  },

  emptyText: {
    color: '#666',
    fontSize: 14,
  },

  imageCard: {
    width: 80,
    height: 80,
    borderRadius: 12,
    overflow: 'hidden',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  removeBtn: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  fullImage: {
    width: '90%',
    height: '70%',
    resizeMode: 'contain',
  },

  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 8,
    borderRadius: 20,
  },

  btn: {
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
  },
})
