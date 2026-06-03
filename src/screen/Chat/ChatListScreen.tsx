import React from 'react'
import { FlatList, Text, TouchableOpacity, View, StyleSheet, Image } from 'react-native'
import COLORS from '../../utils/Colors'

const chats = [
    {
        id: '1',
        name: 'Amit',
        msg: 'Hello',
        time: '10:30 AM',
        image: 'https://i.pravatar.cc/150?img=1',
    },
    {
        id: '2',
        name: 'Rohit',
        msg: 'Ok bhai',
        time: 'Yesterday',
        image: 'https://i.pravatar.cc/150?img=2',
    },
]


export default function ChatListScreen({ navigation }: any) {
    
    return (
        <View style={styles.container}>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.row}
                        onPress={() =>
                            navigation.navigate('ChatScreen', { user: item.name })
                        }
                    >
                        {/* LEFT IMAGE */}
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: item.image }} style={styles.avatar} />
                        </View>

                        {/* RIGHT CONTENT */}
                        <View style={styles.content}>
                            <View style={styles.topRow}>
                                <Text style={styles.name}>{item.name}</Text>
                                <Text style={styles.time}>{item.time}</Text>
                            </View>

                            <Text style={styles.msg}>{item.msg}</Text>

                            <View style={styles.divider} />
                        </View>
                    </TouchableOpacity>
                )}
            />

        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },

    row: {
        flexDirection: 'row',
        paddingHorizontal: 14,
        paddingVertical: 10,
    },

    avatarWrapper: {
        marginRight: 12,
    },

    avatar: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#ccc',
    },

    content: {
        flex: 1,
    },

    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    name: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111',
    },

    time: {
        fontSize: 12,
        color: '#888',
    },

    msg: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },

    divider: {
        height: 0.5,
        backgroundColor: '#ddd',
        marginTop: 10,
    },
})

