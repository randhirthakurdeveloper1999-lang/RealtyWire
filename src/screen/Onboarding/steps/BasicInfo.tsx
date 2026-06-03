import React from 'react'
import { View, TextInput, StyleSheet, Text } from 'react-native'

export default function BasicInfo({ form, setForm }: any) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.row}>
          <TextInput
            placeholder="First Name"
            value={form.first_name}
            onChangeText={(t) => setForm({ ...form, first_name: t })}
            style={[styles.input, styles.halfInput]}
          />
          <TextInput
            placeholder="Last Name"
            value={form.last_name}
            onChangeText={(t) => setForm({ ...form, last_name: t })}
            style={[styles.input, styles.halfInput]}
          />
        </View>

        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.codeText}>+91</Text>
          </View>

          <TextInput
            placeholder="9876543210"
            keyboardType="phone-pad"
            value={form.mobile}
            onChangeText={(t) => setForm({ ...form, mobile: t })}
            style={styles.phoneInput}
          />
        </View>

        <TextInput
          placeholder="Email Address"
          keyboardType="email-address"
          value={form.email}
          editable={false}
          style={[styles.input, { backgroundColor: '#EEF2F7' }]}
        />
      </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 10,
  },

  card: {
    width: '100%',        // ← add
    maxWidth: 420,        // ← optional (premium layout feel)
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
    color: '#0F172A',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  input: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,        // ← add
    borderColor: '#E2E8F0' // ← add
  },


  halfInput: {
    width: '48%',
  },

  phoneContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  countryCode: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 14,
    justifyContent: 'center',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },


  codeText: {
    fontWeight: '600',
  },

  phoneInput: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 0,
  },

})
