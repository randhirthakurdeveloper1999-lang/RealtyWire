import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

export default function CustomDropdown({
  label,
  placeholder = 'Select option',
  data = [],
  value,
  onSelect,
  isDisabled = false,
  onPress,
  noMargin = false,
  error = false,
  errorText = '',
}: any) {
  const [visible, setVisible] = useState(false)

  const getLabel = (item: any) => {
    if (typeof item === 'object') return item.label
    return item
  }

  const getValue = (item: any) => {
    if (typeof item === 'object') return item.value
    return item
  }

  const selectedLabel = () => {
    if (!value) return placeholder
    const found = data.find((d: any) => String(getValue(d)) === String(value))

    return found ? getLabel(found) : placeholder
  }

  const handlePress = () => {
    if (isDisabled) {
      onPress && onPress()
      return
    }
    setVisible(true)
  }

  return (
    <>
      {label && (
        <Text
          style={[
            styles.label,
            error && { color: 'red' }
          ]}
        >
          {label.replace('*', '')}

          {label.includes('*') && (
            <Text style={{ color: 'red' }}>*</Text>
          )}
        </Text>
      )}

      <TouchableOpacity
        style={[
          styles.dropdown,
          noMargin && { marginBottom: 0 },
          isDisabled && { backgroundColor: '#f2f2f2' },
          error && {
            borderWidth: 1,
            borderColor: 'red',
          },
        ]}
        activeOpacity={0.8}
        onPress={handlePress}
      >

        <Text style={[
          styles.text,
          isDisabled && { color: '#999' }
        ]}>{selectedLabel()}</Text>
        <Ionicons name="chevron-down" size={18} />
      </TouchableOpacity>

      {error && (
        <Text style={styles.errorText}>
          {errorText}
        </Text>
      )}

      <Modal visible={visible} transparent animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setVisible(false)}
        />

        <View style={styles.modal}>
          <FlatList
            data={data}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelect(getValue(item))
                  setVisible(false)
                }}
              >
                <Text style={styles.optionText}>
                  {getLabel(item)}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  dropdown: {
    height: 45,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  text: {
    fontSize: 14,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modal: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    maxHeight: '50%',
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 12,
  },
  option: {
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderColor: '#eee',
  },
  optionText: {
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 8,
  },
})
