import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import BasicInfo from './steps/BasicInfo'
import Documents from './steps/Documents'
import COLORS from '../../utils/Colors'
import { updateDocumentApi, updateProfileApi } from '../../api/authApi'

export default function OnboardingScreen({ navigation, route }: any) {
  const [step, setStep] = useState(1)
  const [docValid, setDocValid] = useState(false)
  const [loading, setLoading] = useState(false)
  const googleData = route?.params?.googleData;

  const [form, setForm] = useState({
    first_name: googleData?.first_name || '',
    last_name: googleData?.last_name || '',
    email: googleData?.email || '',
    mobile: '',
  })

  const [docData, setDocData] = useState({})

  const next = async () => {
    if (step === 1) {
      console.log('Submitting profile:', form)

      setLoading(true)

      try {
        const res = await updateProfileApi(form)

        console.log('Profile API response:', res)

        setLoading(false)

        if (res?.status) {
          setStep(2)
        } else {
          console.log('Profile update failed')
          Alert.alert('Profile update failed')
        }
      } catch (error) {
        console.log('Profile API error:', error)
        setLoading(false)
      }

      return
    }

    if (step === 2) {
      setLoading(true)

      console.log('Submitting documents:', docData)

      const res = await updateDocumentApi(docData)

      setLoading(false)

      if (res?.status) {
        navigation.replace('Verification')
      } else {
        Alert.alert('Document upload failed')
      }
    }

  }

  const back = () => setStep(step - 1)

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <Text style={styles.title}>
        {step === 1 && 'Enter your details'}
        {step === 2 && 'Documents'}
      </Text>

      <Text style={styles.subtitle}>
        Step {step} of 2
      </Text>

      {/* STEP CONTENT */}
      <View style={{ flex: 1 }}>
        {step === 1 && <BasicInfo form={form} setForm={setForm} />}
        {step === 2 && <Documents setDocValid={setDocValid} setDocData={setDocData} />}
      </View>


      {/* FOOTER */}
      <View>
        {step > 1 && (
          <TouchableOpacity onPress={back}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[
            styles.button,
            step === 2 && !docValid && { opacity: 0.5 },
          ]}
          onPress={next}
          disabled={step === 2 && (!docValid || loading)}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {step === 2 ? 'Submit' : 'Continue'}
            </Text>
          )}
        </TouchableOpacity>

      </View>


    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 20,
    textAlign: 'center',
  },

  subtitle: {
    color: '#2e3238',
    marginBottom: 20,
    textAlign: 'center',
  },

  back: {
    textAlign: 'center',
    marginBottom: 10,
    color: '#64748B',
  },

  button: {
    backgroundColor: COLORS.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
})
