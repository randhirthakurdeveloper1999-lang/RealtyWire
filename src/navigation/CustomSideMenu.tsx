import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  Image,
  ScrollView,
  Linking,
} from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import LogoutModal from '../component/LogoutModal'

export default function CustomSideMenu({
  navigation,
  onClose,
  navigateToTab,
  openFavourite,
  activeRoute,
}: any) {

  const MenuItem = ({ label, icon, route }: any) => {
    const isActive = activeRoute === route

    return (
      <TouchableOpacity
        style={[styles.item, isActive && styles.activeItem]}
        onPress={() => navigateToTab(route)}
        activeOpacity={0.8}
      >
        <FontAwesome5
          name={icon}
          size={18}
          color={isActive ? '#fff' : '#0F172A'}
        />
        <Text style={[styles.text, isActive && styles.activeText]}>
          {label}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <View style={styles.wrapper}>
      {/* SIDE MENU */}
      <View style={styles.menu} pointerEvents="auto">
        {/* LOGO */}
        <View style={styles.brand}>
          <Image
            source={require('../../assets/icons/Logo.png')}
            style={styles.logo}
          />
        </View>

        {/* 🔼 TOP SECTION */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        >

          {/* MENU */}
          <MenuItem label="Home" icon="home" route="Home" />
          <MenuItem label="My Property" icon="building" route="My Property" />
          <MenuItem label="Post Property" icon="plus-circle" route="Post Property" />
          {/* <MenuItem label="Chat" icon="comments" route="Chat" /> */}
          <MenuItem label="Recents" icon="history" route="Recents" />
          {/* <MenuItem label="Subscription" icon="crown" route="Subscription" /> */}
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose()
              navigation.navigate('Subscription')
            }}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="crown" size={18} color="#0F172A" />
            <Text style={styles.text}>Subscription</Text>
          </TouchableOpacity>

          {/* FAVOURITE */}
          <TouchableOpacity style={styles.item} onPress={openFavourite}>
            <FontAwesome5 name="heart" size={18} color="#E11D48" />
            <Text style={styles.text}>Favourites</Text>
          </TouchableOpacity>

          {/* 🔹 ABOUT US */}
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose()

              const url = 'https://realtywire.in/about-us'

              Linking.openURL(url).catch(err =>
                console.log("Error opening URL", err)
              )
            }}
          >
            <FontAwesome5 name="info-circle" size={18} color="#0F172A" />
            <Text style={styles.text}>About Us</Text>
          </TouchableOpacity>

          {/* 🔹 PRIVACY POLICY */}
          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose()
              navigation.navigate('PrivacyPolicy')
            }}
          >
            <FontAwesome5 name="shield-alt" size={18} color="#0F172A" />
            <Text style={styles.text}>Privacy Policy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose()

              const url = 'https://realtywire.in/terms-conditions'

              Linking.openURL(url).catch(err =>
                console.log("Error opening URL", err)
              )
            }}
          >
            <FontAwesome5 name="file-contract" size={18} color="#0F172A" />
            <Text style={styles.text}>Terms & Conditions</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.item}
            onPress={() => {
              onClose()

              const url = 'https://realtywire.in/contact-us'

              Linking.openURL(url).catch(err =>
                console.log("Error opening URL", err)
              )
            }}
          >
            <FontAwesome5 name="question-circle" size={18} color="#0F172A" />
            <Text style={styles.text}>Help & Support</Text>
          </TouchableOpacity>
        </ScrollView>

        {/* 🔽 FOOTER (FIXED AT BOTTOM) */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerBtn}
            onPress={() => {
              onClose()
              navigation.navigate('Profile')
            }}
            activeOpacity={0.8}
          >
            <FontAwesome5 name="user" size={18} color="#0F172A" />
            <Text style={styles.footerText}>Profile</Text>
          </TouchableOpacity>

          <LogoutModal navigation={navigation} onClose={onClose} />

        </View>
      </View>

      {/* OVERLAY */}
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        pointerEvents="auto"
      />

    </View >
  )
}

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    zIndex: 999,
  },

  menu: {
    width: '70%',
    backgroundColor: '#fff',
    paddingTop: 40,
    elevation: 12,
    zIndex: 2,

    justifyContent: 'space-between', // ⭐ MAIN MAGIC
  },

  topSection: {
    flexGrow: 1,

  },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 1,              // 🔥 BEHIND MENU
  },

  /* BRAND */
  brand: {
    alignItems: 'center',
    height: 90,        // 🔒 fixed space
    justifyContent: 'center',
  },

  logo: {
    width: 230,
    height: 90,
    resizeMode: 'cover',
    // backgroundColor:'red'
  },

  /* ITEMS */
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 30,
    marginBottom: 6,
    width: '100%',            // ✅ full width
  },

  activeItem: {
    backgroundColor: '#0272bc',
    paddingVertical: 14,
    paddingHorizontal: 30,   // content center
  },

  text: {
    marginLeft: 14,
    fontSize: 15,
    fontWeight: '600',
    color: '#0F172A',
  },

  activeText: {
    color: '#fff',
  },

  footer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // 👈 halka grey
  },

  footerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },

  footerText: {
    marginLeft: 12,
    fontWeight: '700',
    fontSize: 14,
    color: '#0F172A',
  },

  // modal

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },

  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
  },

  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },

  modalMsg: {
    fontSize: 13,
    color: '#555',
    marginBottom: 20,
  },

  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginRight: 10,
  },

  cancelText: {
    color: '#475569',
    fontWeight: '600',
  },

  confirmBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#DC2626',
    borderRadius: 8,
  },

  confirmText: {
    color: '#fff',
    fontWeight: '700',
  },

})
