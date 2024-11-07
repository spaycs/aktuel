import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { HomeActive, HomePassive, ProfileActive, ProfilePassive, RestaruantAddPassive, RestaruantAddActive, FavoriteActive, FavoritePassive, SearchActive, SearchPassive, DiscoverActive, DiscoverPassive, QrCodeRightIcon, QrActive, QrPassive, CardActive, CardPassive} from "../../../res/images";

const Icon = ({label, isFocused}) => {
    switch (label) { 
      case 'Home':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <HomeActive /> : <HomePassive />}
            <Text style={styles.iconLabel}>Anasayfa</Text>
          </View>
        );
      case 'CardDetail':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <CardActive /> : <CardPassive />}
            <Text style={styles.iconLabel}>Kartvizitim</Text>
          </View>
        );
      case 'QrCodeScan':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <QrActive /> : <QrPassive />}
            <Text style={styles.iconLabel}>Qr Code</Text>
          </View>
        );
      case 'MyCardList':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <DiscoverActive /> : <DiscoverPassive />}
            <Text style={styles.iconLabel}>Kartlaştıklarım</Text>
          </View>
        );
      case 'Profile':
        return (
          <View style={styles.iconContainer}>
            {isFocused ? <ProfileActive /> : <ProfilePassive />}
            <Text style={styles.iconLabel}>Profil</Text>
          </View>
        );
    
        default:
            return <HomePassive/>;
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
          paddingBottom: 5,
          paddingHorizontal: 30,
          justifyContent:'space-between',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0.5,
          borderTopColor: '#000000',
        },
        iconContainer: {
          alignItems: 'center',
        },
        iconLabel:{
          fontSize: 10,
          textAlign: 'center',
          color: 'black'
        },
        
    });