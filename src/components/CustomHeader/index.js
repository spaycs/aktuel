import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, StatusBar, SafeAreaView } from 'react-native';
import { colors } from '../../res/colors'; // Projenizdeki renk dosyasını kullanabilirsiniz.
import { Left } from '../../res/images'; // Geri tuşu ikonunuz.

const CustomHeader = ({ title, onClose}) => {
  return (
    <SafeAreaView style={[styles.headerContainer, Platform.OS === 'android' && styles.androidHeader]}>
    <View style={styles.headerContent}>
      {onClose && (
        <TouchableOpacity onPress={onClose} style={styles.backButton}>
          <Left width={17} height={17} />
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  </SafeAreaView>
  
  );
};

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: colors.primary, // Arka plan rengi
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.gray,
      },
      androidHeader: {
        height: 30 + StatusBar.currentHeight,
      },
      headerContent: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 10,
      },
      backButton: {
        position: 'absolute', // Sol üst köşeye sabitle
        left: 10,
        zIndex: 1, // Geri butonunun her zaman görünür olması için
        padding: 5,
      },
      title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.black,
        textAlign: 'center', // Metni ortala
      },
    });

export default CustomHeader;
