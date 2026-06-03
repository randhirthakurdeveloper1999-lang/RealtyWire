import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native'
import { launchImageLibrary } from 'react-native-image-picker'
import ImageViewer from 'react-native-image-zoom-viewer'

export default function BusinessInfo() {
  const [file, setFile] = useState<any>(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [uploading, setUploading] = useState(false)

  const pickDocument = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      quality: 0.8,
    })

    const asset = result.assets?.[0]

    if (!asset) return

    setUploading(true)

    setTimeout(() => {
      setFile(asset)
      setUploading(false)
    }, 800)
  }

  const removeFile = () => setFile(null)
 
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.label}>Dealer Proof</Text>

        <TouchableOpacity
          style={[styles.box, uploading && { opacity: 0.5 }]}
          onPress={pickDocument}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator color="#0272bc" />
          ) : (
            <Text style={styles.uploadText}>
              {file ? file.name : 'Tap to upload RERA Certificate'}
            </Text>
          )}
        </TouchableOpacity>

        {file && (
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.viewBtn}
              onPress={() => setPreviewVisible(true)}
            >
              <Text style={styles.btnText}>View</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.removeBtn} onPress={removeFile}>
              <Text style={styles.btnText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* IMAGE PREVIEW MODAL */}
      <Modal visible={previewVisible} transparent>
        <View style={styles.modalBg}>
          {file && (
            <ImageViewer
              imageUrls={[{ url: file.uri }]}
              renderHeader={() => (
                <TouchableOpacity
                  style={styles.close}
                  onPress={() => setPreviewVisible(false)}
                >
                  <Text style={{ color: '#fff', fontSize: 22 }}>✕</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </Modal>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },

  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 3,
  },

  label: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
  },

  box: {
    padding: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  uploadText: {
    color: '#0272bc',
    fontWeight: '600',
  },

  actions: {
    flexDirection: 'row',
    marginTop: 12,
  },

  viewBtn: {
    backgroundColor: '#0F172A',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },

  removeBtn: {
    backgroundColor: '#DC2626',
    padding: 10,
    borderRadius: 8,
  },

  btnText: {
    color: '#fff',
  },

  modalBg: {
    flex: 1,
    backgroundColor: '#000',
  },

  close: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 999,
  },

})
