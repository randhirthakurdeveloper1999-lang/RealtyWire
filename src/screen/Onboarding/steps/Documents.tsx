import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import COLORS from '../../../utils/Colors';

export default function Documents({ setDocValid, setDocData }: any) {
  const [selected, setSelected] = useState<'rera' | 'gst' | 'visiting'>('rera');
  const [files, setFiles] = useState<{ visiting?: any }>({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [rera, setRera] = useState('');
  const [gst, setGst] = useState('');

  const saveFile = (file: any) => {
    setFiles((prev: any) => ({
      ...prev,
      visiting: file,
    }));
  };

  const openCamera = async () => {
    const result = await launchCamera({ mediaType: 'photo' });
    if (!result.didCancel && result.assets?.length) {
      saveFile(result.assets[0]);
    }
  };

  const openGallery = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets?.length) {
      saveFile(result.assets[0]);
    }
  };

  const openPicker = () => {
    Alert.alert('Upload Visiting Card', 'Choose option', [
      { text: 'Camera', onPress: openCamera },
      { text: 'Gallery', onPress: openGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeFile = () => {
    setFiles((prev: any) => ({
      ...prev,
      visiting: null,
    }));
  };

  const ToggleBtn = ({ label, value }: any) => (
  <TouchableOpacity
    style={[
      styles.toggle,
      selected === value && styles.toggleActive,
    ]}
    onPress={() => {
      if (selected !== value) {
        setSelected(value);
        setRera('');
        setGst('');
        setFiles({});
      }
    }}
  >
    <Text
      numberOfLines={1}
      adjustsFontSizeToFit
      minimumFontScale={0.75}
      allowFontScaling={false}
      style={[
        styles.toggleText,
        selected === value && styles.toggleTextActive,
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

  const visitingFile = files['visiting'];

  const isValid =
    (selected === 'visiting' && !!visitingFile) ||
    (selected === 'gst' && gst.length > 0) ||
    (selected === 'rera' && rera.length > 0);

  React.useEffect(() => {
    setDocData({
      gst,
      rera,
      visitingFile,
      selected,
    });
  }, [gst, rera, files, selected]);

  React.useEffect(() => {
    setDocValid(isValid);
  }, [isValid]);

  return (
    <View style={styles.container}>
      <View style={styles.mainCard}>
        <Text style={styles.infoText}>
          Please provide any ONE document: RERA Number / GST Number / Visiting
          Card
        </Text>
        <View style={styles.toggleRow}>
          <ToggleBtn label="RERA" value="rera" />
          <ToggleBtn label="GST" value="gst" />
          <ToggleBtn label="Business card" value="visiting" />
        </View>

        {selected === 'rera' && (
          <TextInput
            placeholder="Enter RERA number"
            value={rera}
            onChangeText={text => setRera(text.toUpperCase())}
            style={styles.input}
          />
        )}

        {selected === 'gst' && (
          <TextInput
            placeholder="Enter GST number"
            value={gst}
            onChangeText={text => setGst(text.toUpperCase())}
            style={styles.input}
          />
        )}

        {selected === 'visiting' && (
          <>
            {!visitingFile ? (
              <TouchableOpacity style={styles.uploadBox} onPress={openPicker}>
                <Text style={{ color: '#0272bc', fontWeight: '600' }}>
                  Upload Document
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.card}>
                <View style={styles.row}>
                  <View style={styles.status}>
                    <View>
                      <Text style={styles.uploadedText}>
                        VISITING CARD UPLOADED
                      </Text>
                      <Text style={styles.readyText}>Ready to preview</Text>
                    </View>
                  </View>

                  <TouchableOpacity onPress={removeFile}>
                    <Text style={{ fontSize: 18 }}>✕</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={styles.previewBtn}
                  onPress={() => setPreviewVisible(true)}
                >
                  <Text style={{ color: '#fff', fontWeight: '600' }}>
                    Preview Document
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        )}

        {visitingFile && (
          <Modal visible={previewVisible} transparent>
            <View style={styles.modalOverlay}>
              <Image
                source={{ uri: visitingFile.uri }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={() => setPreviewVisible(false)}
              >
                <Text style={{ color: '#fff', fontSize: 22 }}>✕</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },

mainCard: {
  width: '92%',
  maxWidth: 420,
  alignSelf: 'center',
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

  infoText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },

toggleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 20,
},

toggle: {
  flex: 1,
  height: 56,
  marginHorizontal: 4,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#E2E8F0',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#fff',
},

toggleText: {
  fontSize: 15,
  fontWeight: '600',
  textAlign: 'center',
  color: '#0F172A',
  paddingHorizontal: 6,
  flexShrink: 1,
},
  toggleActive: {
    backgroundColor: COLORS.primary,
  },

  toggleTextActive: { color: '#fff' },

  input: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
  },

  uploadBox: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullImage: {
    width: '95%',
    height: '70%',
  },

  closeBtn: {
    position: 'absolute',
    top: 60,
    right: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  status: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  uploadedText: {
    fontWeight: '700',
    fontSize: 12,
  },

  readyText: {
    fontSize: 12,
    color: '#64748B',
  },

  previewBtn: {
    backgroundColor: COLORS.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});
