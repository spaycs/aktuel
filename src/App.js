import React from "react";
import { NavigationContainer } from '@react-navigation/native'
import  Router  from './router';
import { AuthProvider } from "./components/userDetail/Id";
import { AuthDefaultProvider } from "./components/DefaultUser";
import { ProductProvider } from './context/ProductContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function App () {
    return(
        <GestureHandlerRootView style={{ flex: 1 }}>
        <ProductProvider>
        <NavigationContainer>
            <AuthProvider> 
                <AuthDefaultProvider>
                <Router/>
                </AuthDefaultProvider>
            </AuthProvider>
        </NavigationContainer>
        </ProductProvider>
        </GestureHandlerRootView>
    );
}
export default App;