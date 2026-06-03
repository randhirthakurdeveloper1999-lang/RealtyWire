import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import React, { useState } from 'react'
import COLORS from '../../utils/Colors'
import Icon from 'react-native-vector-icons/Ionicons'

const data = [
  { id: '1', text: 'Hello', me: false },
  { id: '2', text: 'Haan bol', me: true },
]

export default function ChatScreen({ navigation, route }: any) {
  const { user } = route.params || { user: 'Chat' }

  const [msg, setMsg] = useState('')
  const [messages, setMessages] = useState(data)

  const send = () => {
    if (!msg.trim()) return
    setMessages([...messages, { id: Date.now().toString(), text: msg, me: true }])
    setMsg('')
  }

  return (
    <View style={styles.container}>

      {/* 🔥 CUSTOM HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{user}</Text>

        {/* right side empty (for center alignment) */}
        <View style={{ width: 24 }} />
      </View>

      {/* MESSAGES */}
      <FlatList
        data={messages}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 10 }}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.me ? styles.myBubble : styles.otherBubble,
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
      />

      {/* INPUT */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <TextInput
            value={msg}
            onChangeText={setMsg}
            placeholder="Type a message"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>

        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Text style={styles.sendText}>➤</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    backgroundColor: COLORS.surface,
  },

  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },

  bubble: {
    padding: 8,
    borderRadius: 6,
    marginVertical: 4,
    maxWidth: '70%',
  },
  myBubble: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherBubble: {
    backgroundColor: '#eee',
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 14,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: COLORS.surface,
  },

  inputWrapper: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 22,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },

  input: {
    fontSize: 14,
    paddingVertical: 8,
    color: '#000',
  },

  sendBtn: {
    marginLeft: 8,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
  },

  sendText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },

})
