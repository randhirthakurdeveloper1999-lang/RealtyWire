import React, { useEffect, useRef, useState } from 'react'
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Alert,
} from 'react-native'
import PropertyCard from '../../../component/PropertyCard'
import { Property } from '../../../data/properties'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import { useFavourite } from '../../../context/FavouriteContext'
import COLORS from '../../../utils/Colors'
import { addFavouriteApi, categoryListApi, homePropertyListApi, removeFavouriteApi } from '../../../api/authApi'
import Loader from '../../../component/Loader'
import CustomDropdown from '../../../component/CustomDropdown'
import AsyncStorage from '@react-native-async-storage/async-storage'

const { height } = Dimensions.get('window')

const BASE_URL = 'https://realtywire.in/api'

export default function HomeScreen({ navigation }: any) {
  const [search, setSearch] = useState('')
  const [filterVisible, setFilterVisible] = useState(false)
  const { toggleFavourite, isFavourite } = useFavourite()
  const [appliedFilters, setAppliedFilters] = useState<any>({})
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [page, setPage] = useState(1)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)

  // Filter
  const [categories, setCategories] = useState<any[]>([])
  const [subcategories, setSubcategories] = useState<any[]>([])
  const [fields, setFields] = useState<any[]>([])
  const [fieldOptions, setFieldOptions] = useState<Record<number, any[]>>({})
  const [fieldValues, setFieldValues] = useState<any>({})
  const [categoryId, setCategoryId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [cityId, setCityId] = useState('')
  const [areaId, setAreaId] = useState('')
  const [cities, setCities] = useState<any[]>([])
  const [areas, setAreas] = useState<any[]>([])
  const [errors, setErrors] = useState({
    category: false,
    subcategory: false,
    city: false,
    area: false,
    sqyd: false,
  });

  const authHeader = async () => {
    const token = await AsyncStorage.getItem('token')

    return {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
  }

  const loadCategories = async () => {
    try {
      const res = await categoryListApi()

      if (res.status) {
        setCategories(res.data)
      } else {
        Alert.alert("Error", "Failed to load categories")
      }

    } catch (e) {
      console.log(e)
      Alert.alert("Network Error")
    }
  }
  useEffect(() => {
    loadCategories()
  }, [])

  const loadSubcategories = async (id: string) => {
    try {

      const res = await fetch(`${BASE_URL}/dealer/subcategory-list`, {
        method: 'POST',
        headers: await authHeader(),
        body: JSON.stringify({ category_id: id })
      })

      const json = await res.json()

      if (json.status) {
        setSubcategories(json.data)
      } else {
        Alert.alert("Error", "Failed to load subcategories")
      }

    } catch (e) {
      console.log(e)
      Alert.alert("Network Error")
    }
  }

  const loadFields = async (id: string) => {

    const res = await fetch(`${BASE_URL}/dealer/field-list`, {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify({
        sub_category_id: id
      })
    })

    const json = await res.json()

    console.log("FIELDS =>", json)

    if (json.status) {

      setFields(json.data)

      json.data.forEach((field: any) => {
        if (field.field_type === 'select') {
          loadFieldOptions(field.id)
        }
      })

    }

  }

  const loadFieldOptions = async (fieldId: number) => {

    const res = await fetch(`${BASE_URL}/dealer/field-options`, {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify({
        field_id: fieldId
      })
    })

    const json = await res.json()

    console.log("FIELD OPTIONS =>", json)

    if (json.status) {

      setFieldOptions(prev => ({
        ...prev,
        [fieldId]: json.data
      }))

    }

  }

  const loadCities = async () => {

    const res = await fetch(`${BASE_URL}/dealer/city-list`, {
      method: 'POST',
      headers: await authHeader(),
    })

    const json = await res.json()

    console.log("CITIES =>", json)

    if (json.status) {
      setCities(json.data)
    }
  }

  const loadAreas = async (cityId: string) => {

    const res = await fetch(`${BASE_URL}/dealer/area-list`, {
      method: 'POST',
      headers: await authHeader(),
      body: JSON.stringify({
        city_id: cityId
      })
    })

    const json = await res.json()

    console.log("AREAS =>", json)

    if (json.status) {
      setAreas(json.data)
    }

  }

  // useFocusEffect(
  //   useCallback(() => {
  //     setPage(1)
  //     setHasMore(true)
  //     loadProperties(1)
  //   }, [])
  // )

  useEffect(() => {
    loadProperties(1, {})
  }, [])

  const loadProperties = async (pageNumber = 1, filters = appliedFilters) => {
    try {

      if (!refreshing && pageNumber === 1) {
        setLoading(true)
      }
      if (pageNumber > 1) {
        setLoadingMore(true)
      }

      const json = await homePropertyListApi(pageNumber, 10, filters || {})

      if (!json || !json.status) {
        Alert.alert("Error", "Failed to load properties")
        return
      }

      const apiProperties = json.data.map((p: any) => {

        if (p.is_favourite && !isFavourite(String(p.id))) {
          toggleFavourite(String(p.id))
        }

        return {
          id: p.id.toString(),
          title: p.title,
          city: p.city,
          category: p.category,
          subcategory: p.sub_category,
          image: p.image || p.primary_image,
          status: p.status,
        }
      })

      if (pageNumber === 1) {
        setProperties(apiProperties)
      } else {
        setProperties(prev => [...prev, ...apiProperties])
      }

      if (json.data.length < 10) {
        setHasMore(false)
      }

    } catch (e) {
      console.log("🔥 LOAD PROPERTIES ERROR:", e)

      Alert.alert(
        "Network Error",
        "Please check your internet connection"
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
      setLoadingMore(false)
    }
  }

  const handleFavourite = async (id: number) => {
    if (isFavourite(String(id))) {
      await removeFavouriteApi(id)
    } else {
      await addFavouriteApi(id)
    }

    toggleFavourite(String(id))
  }

  const applyFiltersAndSearch = (extraFilters = {}) => {

    const sqydField = fields.find(
      (f: any) => f.field_label === "SqYd"
    );

    const newErrors = {
      category: !categoryId,
      subcategory: !subcategoryId,
      city: !cityId,
      area: !areaId,
      sqyd: sqydField ? !fieldValues[sqydField.id] : false,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) {
      return false;
    }

    const filters = {
      search: search || "",
      category_id: categoryId || "",
      sub_category_id: subcategoryId || "",
      city_id: cityId || "",
      area_id: areaId || "",
      fields: fieldValues,
      ...extraFilters
    }

    setAppliedFilters(filters)

    setPage(1)
    setHasMore(true)

    loadProperties(1, filters)
    return true;
  }

  const resetFilters = () => {

    setCategoryId('')
    setSubcategoryId('')
    setCityId('')
    setAreaId('')
    setFields([])
    setFieldValues({})
    setSubcategories([])
    setAreas([])

    setSearch('')

    const emptyFilters = {}

    setAppliedFilters(emptyFilters)

    setPage(1)
    setHasMore(true)

    loadProperties(1, emptyFilters)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setPage(1)
    setHasMore(true)
    loadProperties(1, appliedFilters)
  }

  return (
    <>
      <View style={styles.container}>

        {/* SEARCH + FILTER */}
        <View style={styles.searchRow}>

          <TouchableOpacity
            style={styles.searchBox}
            activeOpacity={0.7}
            onPress={() => {
              loadCategories()
              loadCities()
              setAreaId('')
              setErrors({
                category: false,
                subcategory: false,
                city: false,
                area: false,
                sqyd: false,
              })
              setFilterVisible(true)
            }}
          >
            <FontAwesome5 name="search" size={14} color="#999" />

            <Text style={{ marginLeft: 8, color: '#999', flex: 1 }}>
              Search & Filter Properties
            </Text>

            {/* 🔥 right side filter icon */}
            <FontAwesome5 name="sliders-h" size={14} color="#999" />
          </TouchableOpacity>

        </View>


        {/* LIST */}
        {loading ? (
          <Loader text="Fetching properties..." />
        ) : properties.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 80 }}>
            <FontAwesome5 name="home" size={40} color="#ccc" />
            <Text style={{ marginTop: 10, color: '#777' }}>
              No properties found
            </Text>
          </View>
        ) : (
          <FlatList
            data={properties}
            initialNumToRender={8}
            maxToRenderPerBatch={10}
            windowSize={10}
            removeClippedSubviews
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing}
            onRefresh={handleRefresh}
            keyboardShouldPersistTaps="handled"
            onEndReached={() => {
              if (!loadingMore && hasMore) {
                const nextPage = page + 1
                setPage(nextPage)
                loadProperties(nextPage, appliedFilters)
              }
            }}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? <Loader text="Loading more..." /> : null
            }
            renderItem={({ item }: { item: Property }) => (
              <PropertyCard
                item={item}
                isFav={isFavourite(String(item.id))}
                onFav={() => handleFavourite(Number(item.id))}
                onPress={() =>
                  navigation.navigate('PropertyDetail', {
                    item,
                    from: 'home',
                  })
                }
              />
            )}
          />
        )}
      </View>

      <Modal visible={filterVisible} transparent animationType="slide">
        <View style={styles.modalWrapper}>

          {/* BACKDROP */}
          <Pressable
            style={styles.backdrop}
            onPress={() => {
              setErrors({
                category: false,
                subcategory: false,
                city: false,
                area: false,
                sqyd: false,
              })

              setFilterVisible(false)
            }}
          />

          <View style={styles.modalContainer}>

            <View style={styles.dragIndicator} />

            <Text style={styles.modalTitle}>Inventory Filters</Text>

            <ScrollView showsVerticalScrollIndicator={false}>

              {/* CATEGORY */}
              <CustomDropdown
                label="Category *"
                data={categories.map(i => ({
                  label: i.title,
                  value: i.id.toString(),
                }))}
                value={categoryId}
                onSelect={(val: string) => {
                  setCategoryId(val)

                  setErrors(prev => ({
                    ...prev,
                    category: false,
                  }))

                  loadSubcategories(val)
                }}
                error={errors.category}
                errorText="Category is required"
              />

              {/* SUBCATEGORY */}
              <CustomDropdown
                label="Subcategory *"
                data={subcategories.map(i => ({
                  label: i.title,
                  value: i.id.toString(),
                }))}
                value={subcategoryId}
                isDisabled={!categoryId}
                onSelect={(val: string) => {
                  setSubcategoryId(val)

                  setErrors(prev => ({
                    ...prev,
                    subcategory: false,
                  }))

                  loadFields(val)
                }}
                error={errors.subcategory}
                errorText="Subcategory is required"
              />

              {/* DYNAMIC FIELDS */}
              {fields.map((field: any) => {

                if (field.field_type === "select") {

                  return (
                    <CustomDropdown
                      key={field.id}
                      label={
                        field.field_label === "SqYd"
                          ? "SqYd *"
                          : field.field_label
                      }
                      error={
                        field.field_label === "SqYd"
                          ? errors.sqyd
                          : false
                      }
                      errorText="SqYd is required"
                      data={(fieldOptions[field.id] || []).map((o: any) => ({
                        label: o.option_value,
                        value: o.option_value,
                      }))}
                      value={fieldValues[field.id]}
                      onSelect={(val: string) => {
                        setFieldValues((prev: any) => ({
                          ...prev,
                          [field.id]: val,
                        }));

                        if (field.field_label === "SqYd") {
                          setErrors(prev => ({
                            ...prev,
                            sqyd: false,
                          }));
                        }
                      }}
                    />
                  )

                }

                return null

              })}

              <Text style={styles.sectionTitle}>Location</Text>

              <View style={styles.priceRow}>

                <View style={styles.priceBox}>
                  <CustomDropdown
                    label="City *"
                    data={cities.map(i => ({
                      label: i.title || i.name,
                      value: i.id.toString(),
                    }))}
                    value={cityId}
                    onSelect={(val: string) => {
                      setCityId(val)

                      setErrors(prev => ({
                        ...prev,
                        city: false,
                      }))

                      setAreaId('')
                      loadAreas(val)
                    }}
                    error={errors.city}
                    errorText="City is required"
                  />
                </View>

                <View style={styles.priceBox}>
                  <CustomDropdown
                    label="Area *"
                    data={areas.map(i => ({
                      label: i.title || i.name,
                      value: i.id.toString(),
                    }))}
                    value={areaId}
                    isDisabled={!cityId}
                    onSelect={(val: string) => {
                      setAreaId(val)

                      setErrors(prev => ({
                        ...prev,
                        area: false,
                      }))
                    }}
                    error={errors.area}
                    errorText="Area is required"
                  />

                </View>

              </View>

            </ScrollView>

            {/* APPLY BUTTON */}
            <View style={{ flexDirection: 'row', gap: 10 }}>

              <TouchableOpacity
                style={styles.resetBtn}
                onPress={() => {
                  resetFilters()
                  setFilterVisible(false)
                  setErrors({
                    category: false,
                    subcategory: false,
                    city: false,
                    area: false,
                    sqyd: false,
                  })
                }}
              >
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.applyBtn}
                onPress={() => {
                  const result = applyFiltersAndSearch();

                  if (result) {
                    setFilterVisible(false);
                  }
                }}
              >
                <Text style={styles.applyText}>Apply Filters</Text>
              </TouchableOpacity>
            </View>
          </View>

        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 8,
    paddingTop: 8
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  searchBox: {
    flex: 1, // 🔥 IMPORTANT
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    height: 46,
  },

  filterBtn: {
    marginLeft: 8,
    height: 46,
    width: 46,
    borderRadius: 12,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2, // android shadow
  },

  modalWrapper: { flex: 1, justifyContent: 'flex-end', },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },

  modalContainer: {
    height: height * 0.75,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  dragIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#ccc',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 10,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },

  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  priceBox: {
    width: '48%',
  },

  priceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  priceInput: {
    height: 44,
    borderRadius: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    fontSize: 14,
  },

  subLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
  },

  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F2F6',
    marginRight: 8,
    marginBottom: 8,
  },

  chipActive: {
    backgroundColor: COLORS.primary,
  },
  resetBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center'
  },

  resetText: {
    color: '#333',
    fontWeight: '600'
  },
  applyBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  applyText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    flex: 1,
    marginLeft: 8,
  },
})
