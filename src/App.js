import React, { useEffect, useState } from "react";
import { Alert, Linking, Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Router from './router';
import { AuthProvider } from "./components/userDetail/Id";
import { AuthDefaultProvider } from "./components/DefaultUser";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import VersionCheck from 'react-native-version-check';

function App() {

    // Güncelleme gerekmediğinde uygulamanın asıl içeriği gösterilir
    // ProductProvider Ürün verileri yönetiliyor 
    // NavigationContainer Navigasyon sistemi başlatılıyor 
    // AuthProvider Kullanıcı oturumu yönetiliyor 
    // AuthDefaultProvider Varsayılan kullanıcı ayarları sağlanıyor 
    // Router Sayfa yönlendirmeleri yapılır 
    return (
        <GestureHandlerRootView style={{ flex: 1, }}>
                <NavigationContainer>              
                    <AuthProvider>                  
                        <AuthDefaultProvider>       
                            <Router />              
                        </AuthDefaultProvider>
                    </AuthProvider>
                </NavigationContainer>
        </GestureHandlerRootView> 
    );
}

export default App;
