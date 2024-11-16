import React, { useEffect, useState } from "react";
import { Alert, Linking, Platform, View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import Router from './router';
import { AuthProvider } from "./components/userDetail/Id";
import { AuthDefaultProvider } from "./components/DefaultUser";
import { ProductProvider } from './context/ProductContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import VersionCheck from 'react-native-version-check';

function App() {
    const [isUpdateRequired, setIsUpdateRequired] = useState(false);
{/* 
    useEffect(() => {
        const checkAppVersion = async () => {
            try {
                const provider = Platform.OS === 'ios' ? 'appStore' : 'playStore';
                const appID = Platform.OS === 'ios' ? '6737150009' : undefined;  // iOS'ta geçerli
                const packageName = Platform.OS === 'android' ? 'com2.mikroiq' : undefined;  // Android'de geçerli
        
                console.log("Provider:", provider);
                console.log("App ID:", appID);  // iOS için App ID
                console.log("Package Name:", packageName);  // Android için Package Name
        
                const latestVersion = await VersionCheck.getLatestVersion({
                    provider,
                    appID,
                    packageName,
                    ignoreErrors: true,
                });
        
                const currentVersion = VersionCheck.getCurrentVersion();
        
                console.log('Current Version:', currentVersion);
                console.log('Latest Version:', latestVersion);
        
                if (latestVersion && currentVersion && latestVersion > currentVersion) {
                    setIsUpdateRequired(true);  // Güncelleme gerekli
                    Alert.alert(
                        'Zorunlu Güncelleme',
                        'Uygulamanızın güncel bir sürümü mevcut. Devam etmek için güncelleme yapmalısınız.',
                        [
                            {
                                text: 'Güncelle',
                                onPress: () => {
                                    Linking.openURL(
                                        Platform.OS === 'ios'
                                            ? 'https://apps.apple.com/tr/app/mikroiq/id6737150009?l=tr'
                                            : 'https://play.google.com/store/apps/details?id=com2.mikroiq&gl=TR'  // Android linki
                                    );
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                }
            } catch (error) {
                console.error('Güncelleme kontrol hatası:', error);
            }
        };
        
        

        checkAppVersion();
    }, []); // Sadece uygulama ilk açıldığında çalışacak

    if (isUpdateRequired) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Güncelleme yapılmadan uygulamayı kullanamazsınız.</Text>
            </View>
        );
    }
*/}
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ProductProvider>
                <NavigationContainer>
                    <AuthProvider>
                        <AuthDefaultProvider>
                            <Router />
                        </AuthDefaultProvider>
                    </AuthProvider>
                </NavigationContainer>
            </ProductProvider>
        </GestureHandlerRootView>
    );
}

export default App;
