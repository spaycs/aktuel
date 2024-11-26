import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { colors } from '../../res/colors'; // Projenizdeki renk dosyasını kullanabilirsiniz.
import { Left } from '../../res/images'; // Geri tuşu ikonunuz.

const CustomHeader = ({ title, onClose}) => {
  return (
    <View style={[styles.headerContainer, Platform.OS === 'android' && styles.androidHeader]}>
    {onClose && (
      <TouchableOpacity onPress={onClose}  style={styles.backButton} >
        <Left width={17} height={17} />
      </TouchableOpacity>
    )}
    <Text style={styles.title}>{title}</Text>
  </View>
  
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: colors.primary, // Arka plan rengi
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.border,
      },
      androidHeader: {
        height: 30 + StatusBar.currentHeight,
      },
      backButton: {
        padding: 5,
      },
      title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.black, // Beyaz renk görünürlük için uygun olmalı
        textAlign: 'center',
        flex: 1,
      },
      rightComponent: {
        position: 'absolute',
        right: 10,
      },
    });

export default CustomHeader;
