import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

export default function PropertyCard({
  item,
  onPress,
  isFav,
  onFav,
  showActions = false,
  onEdit,
  onDelete,
}: any) {
  const imageUri = item?.image || 'https://via.placeholder.com/150'
  const status = item?.status || 'active'

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {/* STATUS BADGE */}
      <View
        style={[
          styles.badge,
          status === 'sold'
            ? styles.soldBadge
            : styles.activeBadge,
        ]}
      >
        <Text style={styles.badgeText}>
          {status === 'sold' ? 'SOLD' : 'ACTIVE'}
        </Text>
      </View>

      {/* IMAGE + FAV ICON */}
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} />

        {/* FAV (HomeScreen only) */}
        {onFav && (
          <TouchableOpacity
            style={styles.favIcon}
            onPress={onFav}
            activeOpacity={0.7}
          >
            <FontAwesome5
              name="heart"
              solid={isFav}
              size={16}
              color={isFav ? '#E11D48' : '#fff'}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* DETAILS */}
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>

        {/* CITY */}
        <Text style={styles.city}>{item.city}</Text>

        {/* CATEGORY */}
        <Text style={styles.category}>
          {item.category} ({item.subcategory})
        </Text>

        <View style={styles.bottomRow}>
          {showActions && (
            <View style={styles.actionRow}>
              {/* EDIT BUTTON */}
              {onEdit && (
                <TouchableOpacity
                  style={styles.editBtn}
                  onPress={() => onEdit(item)}
                >
                  <FontAwesome5 name="edit" size={14} color="#fff" />
                  <Text style={styles.btnText}>Edit</Text>
                </TouchableOpacity>
              )}

              {/* DELETE BUTTON */}
              {onDelete && (
                <TouchableOpacity
                  style={styles.deleteBtn}
                  onPress={() => onDelete(item)}
                >
                  <FontAwesome5 name="trash" size={14} color="#fff" />
                  <Text style={styles.btnText}>Delete</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    marginVertical: 3,
    position: 'relative', // 👈 MUST
  },
  imageWrapper: {
    position: 'relative',
  },

  image: {
    width: 110,
    height: 110,
    borderRadius: 12,
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    zIndex: 10,
  },
  activeBadge: { backgroundColor: '#2ecc71' },
  soldBadge: { backgroundColor: '#e74c3c' },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  favIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 6,
    borderRadius: 20,
  },

  details: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },

  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#111',
    paddingRight: 60, // 🔥 IMPORTANT
  },
  city: {
    fontSize: 13,
    color: '#555',
  },

  category: {
    fontSize: 12,
    color: '#888',
  },
  location: {
    fontSize: 12,
    color: '#777',
  },

  row: {
    flexDirection: 'row',
  },

  meta: {
    fontSize: 12,
    marginRight: 12,
    color: '#555',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },

  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DC2626',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '600',
  },

  actionRow: {
    flexDirection: 'row',
  },

})
