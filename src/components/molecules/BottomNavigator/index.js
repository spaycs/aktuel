import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import {AlisverisListesi, Back, Favorite, FavoritePasif, Home, HomePasif} from "../../../res/images";
import { colors } from "../../../res/colors";

const Icon = ({label, isFocused}) => {
    switch (label) { 
      case 'Home':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <HomePasif /> : <Home />}
            <Text style={styles.iconLabel}>Anasayfa</Text>
          </View>
        );
      case 'Favorites':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <FavoritePasif /> : <Favorite />}
            <Text style={styles.iconLabel}>Favorilerim</Text>
          </View>
        );
      case 'AlisverisListesi':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <AlisverisListesi /> : <AlisverisListesi />}
            <Text style={styles.iconLabel}>Alışveriş Listesi</Text>
          </View>
        );
    
        default:
            return <Back/>;
    }
};

const BottomNavigator = ({state, descriptors, navigation}) => {
    return(
        <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
          >
            <Icon label={label} isFocused={isFocused}/>
          </TouchableOpacity>
        );
      })}
    </View>
    );
    
    };
    export default BottomNavigator;

    const styles= StyleSheet.create({
        container:{
          flexDirection: 'row',
          paddingTop: 10,
          paddingBottom: 15,
          paddingHorizontal: 30,
          justifyContent:'space-between',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#dfdfdf',
        },
        iconContainer: {
          alignItems: 'center',
        },
        iconContainer1: {
          alignItems: 'center',
          backgroundColor: colors.yellow,
          borderRadius: 10,
          padding:5,
        },
        iconLabel:{
          fontSize: 10,
          textAlign: 'center',
          color: 'black'
        },
        
    });