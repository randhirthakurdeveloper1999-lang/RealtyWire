import React, { useState } from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Dimensions, Image, Platform, StatusBar, TouchableOpacity, View } from 'react-native'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, NavigationProp, } from '@react-navigation/native'
import HomeScreen from '../screen/AppScreens/Home/HomeScreen'
import MyProperty from '../screen/AppScreens/PostProperty/MyProperty'
import CustomSideMenu from './CustomSideMenu'
import COLORS from '../utils/Colors'
import PostProperty from '../screen/AppScreens/PostProperty/PostProperty';
import SubscriptionScreen from '../screen/AppScreens/Subscription/SubscriptionScreen';
import Recents from '../screen/AppScreens/RecentsProperties/Recents';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator()

const { height, width } = Dimensions.get('window')
const logoHeight = width * 0.30   // 🔥 responsive
const HEADER_HEIGHT =
  (width > 380 ? 40 : 30) +
  (Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0);
console.log(width)
export default function Tabs() {
  const [menuOpen, setMenuOpen] = useState(false)
  const rootNavigation = useNavigation<NavigationProp<any>>()
  const insets = useSafeAreaInsets()
  return (

    <>
      <StatusBar
        translucent={false}
        backgroundColor={COLORS.background}
        barStyle="dark-content"
      />
      {/* 🔥 CUSTOM SIDE MENU */}
      {menuOpen && (
        <CustomSideMenu
          navigation={rootNavigation}
          activeRoute={rootNavigation.getState()?.routes[
            rootNavigation.getState().index
          ]?.state?.routes[
            rootNavigation.getState()?.routes[
              rootNavigation.getState().index
            ]?.state?.index ?? 0
          ]?.name ?? 'Home'}
          onClose={() => setMenuOpen(false)}
          navigateToTab={(tabName: string) => {
            setMenuOpen(false)
            rootNavigation.navigate('BottomTabs', {
              screen: tabName, // ✅ TAB SWITCH
            })
          }}
          openFavourite={() => {
            setMenuOpen(false)
            rootNavigation.navigate('FavouriteScreen')
            console.log('Favourite Button pressed')
          }}
        />
      )}

      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerTitleAlign: 'center',

          tabBarHideOnKeyboard: true,

          headerStyle: {
            backgroundColor: COLORS.surface,
            elevation: 0,
            height: HEADER_HEIGHT,
          },

          headerTitle: () => (
            <Image
              source={require('../../assets/icons/Logo.png')}
              style={{
                width: width * 0.45,
                height: logoHeight,
                resizeMode: 'contain',
              }}
            />
          ),

          // ☰ MENU
          headerLeft: () => (
            <TouchableOpacity
              style={{ marginHorizontal: 18 }}
              onPress={() => setMenuOpen(true)}
            >
              <Icon name="menu-outline" size={26} color="#111" />
            </TouchableOpacity>
          ),

          // ❤️ FAVOURITE (STACK SCREEN)
          headerRight: () =>
            menuOpen ? null : (
              <TouchableOpacity
                style={{ marginRight: 18 }}
                onPress={() => {
                  console.log('Favourite Button pressed');
                  rootNavigation.navigate('FavouriteScreen');
                }}
              >
                <FontAwesome5 name="heart" size={20} color="#111" />
              </TouchableOpacity>
            ),
          sceneContainerStyle: {
            backgroundColor: COLORS.background,
          },


          tabBarLabelStyle: {
            fontSize: 10,
            marginTop: 8
          },

          tabBarStyle: {
            height: 60 + insets.bottom,
            paddingBottom: insets.bottom,
            backgroundColor: '#fff',
            borderTopWidth: 0,
            elevation: 10,
          },

          tabBarItemStyle: {
            paddingTop: 3
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: '#777',


          tabBarIcon: ({ focused }) => {

            const getIcon = () => {

              if (route.name === 'Home')
                return <Icon name="home" size={20} color={focused ? "#fff" : "#2563EB"} />

              if (route.name === 'My Property')
                return <Icon name="business" size={20} color={focused ? "#fff" : "#7C3AED"} />

              if (route.name === 'Post Property')
                return <Icon name="add" size={22} color={focused ? "#fff" : "#EC4899"} />

              if (route.name === 'Recents')
                return <FontAwesome5 name="history" size={18} color={focused ? "#fff" : "#F59E0B"} />

            }

            const getBg = () => {

              if (route.name === 'Home')
                return focused ? "#3B82F6" : "#EFF6FF"

              if (route.name === 'My Property')
                return focused ? "#7C3AED" : "#F3E8FF"

              if (route.name === 'Post Property')
                return focused ? "#EC4899" : "#FCE7F3"

              if (route.name === 'Recents')
                return focused ? "#F59E0B" : "#FEF3C7"
            }

            return (
              <View style={{
                width: 38,
                height: 38,
                borderRadius: 12,
                backgroundColor: getBg(),
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                {getIcon()}
              </View>
            )
          }

        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="My Property" component={MyProperty} />
        <Tab.Screen name="Post Property" component={PostProperty} />
        <Tab.Screen name="Recents" component={Recents} />
      </Tab.Navigator>
    </>
  )
}
