import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Home, GetStarted, MarketDetail, KatalogSlider, AlisverisListesi } from "../screens"
import { Aktuel, Iptal, Kartlas, KartlasLogin, Kaydet, MikroIQ, MikroIQM, SohbetIQ, Takvim, Yazdir,} from "../res/images";
import { Text, TouchableOpacity, View } from "react-native";
import { handleLogout } from '../utils/logout';
import { BottomNavigator } from "../components";
import CustomDrawerContent from '../components/CustomDrawerContent';
import { colors } from "../res/colors";
import { useNavigation } from '@react-navigation/native';
import axiosLinkMain from "../utils/axiosMain";
import { useAuthDefault } from '../components/DefaultUser';
import Favorites from "../screens/Favorites";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

    function MainApp() {
    return (
        <Tab.Navigator tabBar={props => <BottomNavigator {...props} />}>
        <Tab.Screen 
            name="Home" 
            component={Home} 
            options={{headerShown: false,}}
        />
          <Tab.Screen 
            name="Favorites" 
            component={Favorites} 
            options={{headerShown: false,}}
        />
          <Tab.Screen 
            name="AlisverisListesi" 
            component={AlisverisListesi} 
            options={{headerShown: false,}}
        />
        
        
        </Tab.Navigator>
    );
    }

const Router = () => {
    return(
        <Stack.Navigator >
            <Stack.Screen
                name="MainApp"
                component={MainApp}
                options={({ navigation, route }) => ({
                    headerBackVisible:false,
                    headerBackTitleVisible: false,
                    headerTitle: () => <Aktuel width={180} height={40}/>,
                    headerTitleAlign: 'center',
                    
                    })}
                
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={({ navigation, route }) => ({
                    headerBackVisible:false,
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerTitle: () => <Aktuel width={180} height={40}/>,
                    })}
            />
           
            <Stack.Screen
                name="MarketDetail"
                component={MarketDetail}
                options={({ route }) => ({
                    headerBackTitleVisible: false,
                    title: route.params?.name || 'Detay',
                })}
                />
            <Stack.Screen
                name="KatalogSlider"
                component={KatalogSlider}
                options={({ route }) => ({
                    title: route.params?.title || 'Katalog',
                })}
                />
            <Stack.Screen
                name="Favorites"
                component={Favorites}
                options={({ navigation, route }) => ({
                    headerBackVisible:false,
                    headerTitleAlign: 'center',
                    
                    headerTitle: () => <Aktuel width={180} height={40}/>,
                    })}
            />
            <Stack.Screen
                name="AlisverisListesi"
                component={AlisverisListesi}
                options={({ navigation, route }) => ({
                    headerBackVisible:false,
                    headerTitleAlign: 'center',
                    headerBackTitleVisible: false,
                    headerTitle: () => <Aktuel width={180} height={40}/>,
                    })}
            />
             
          
        </Stack.Navigator>
    )
}

export default Router;