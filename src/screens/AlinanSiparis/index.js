import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, Dimensions, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import AlinanSiparisFaturaBilgisi from '../AlinanSiparisFaturaBilgisi';
import AlinanSiparisUrunList from '../AlinanSiparisUrunList';
import AlinanSiparisOnizleme from '../AlinanSiparisOnizleme';
import { useFocusEffect } from '@react-navigation/native';
import { ProductContext } from '../../context/ProductContext';
import { colors } from '../../res/colors';
import { useNavigation } from '@react-navigation/native';
import {  Bilgi, Liste, Onizleme } from '../../res/images';

const initialLayout = { width: Dimensions.get('window').width };

const AlinanSiparis = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const { addedAlinanSiparisProducts, setAddedAlinanSiparisProducts, alinanSiparis, setAlinanSiparis } = useContext(ProductContext);
  const [routes, setRoutes] = useState([
    { key: 'faturaBilgisi', title: 'Bilgi', icon: Bilgi   },
    { key: 'urunList', title: 'Ürün Listesi', icon: Liste  },
    { key: 'onizleme',title: `Önizleme (0)`, icon: Onizleme  },
  ]);

  useEffect(() => {
    // addedProducts güncellendiğinde routes dizisini de güncelle
    setRoutes((prevRoutes) =>
      prevRoutes.map((route) =>
        route.key === 'onizleme'
          ? { ...route, title: `Önizleme (${addedAlinanSiparisProducts.length})` }
          : route
      )
    );
  }, [addedAlinanSiparisProducts]);

  const renderScene = SceneMap({
    faturaBilgisi: AlinanSiparisFaturaBilgisi,
    urunList: AlinanSiparisUrunList,
    onizleme: AlinanSiparisOnizleme,
  });

  /* 
   useFocusEffect(
    useCallback(() => {
      const onBeforeRemove = (e) => {
        setFaturaBilgileri({});
        setAddedProducts([]);
        navigation.dispatch(e.data.action); 
      };
      const unsubscribe = navigation.addListener('beforeRemove', onBeforeRemove);
      return () => {
        unsubscribe();
      };
    }, [navigation, setFaturaBilgileri])
  );
  */
  const validateFields = () => {
    if (!alinanSiparis.sip_musteri_kod|| !alinanSiparis.sip_cari_unvan1) {
      Alert.alert(
        "Uyarı",
        "Cari kodu ve cari ünvanı doldurmalısınız.",
        [{ text: "Tamam" }]
      );
      return false;
    } else if (!alinanSiparis.sip_adresno) {
      Alert.alert(
        "Uyarı",
        "Adres seçimi yapmalısınız.",
        [{ text: "Tamam" }]
      );
      return false;
    } else if (!alinanSiparis.sip_opno) {
      Alert.alert(
        "Uyarı",
        "Vade seçimi yapmalısınız.",
        [{ text: "Tamam" }]
      );
      return false;
    } else if (!alinanSiparis.sip_stok_sormerk) {
      Alert.alert(
        "Uyarı",
        "Sorumluluk merkezi seçimi yapmalısınız.",
        [{ text: "Tamam" }]
      );
      return false;
    }
    return true;
  };

  const handleTabChange = (tabIndex) => {
    if (index === 10 ) {
      // Hata mesajları validateFields içinde gösteriliyor
    } else {
      setIndex(tabIndex);
    }
  };

  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {routes.map((route, i) => (
        <TouchableOpacity
          key={route.key}
          style={[
            styles.tabButton,
            index === i ? styles.activeTab : styles.inactiveTab,
          ]}
          onPress={() => handleTabChange(i)}
        >
          <View style={styles.tabContent}>
            {/* İlgili ikonları render ediyoruz */}
            <route.icon
              name="icon-name"
              width={24}
              height={24}
              color={index === i ? colors.blue : '#4a4a4a'}
            />
            {/* İkonun altına başlık */}
            <Text style={[styles.tabText, index === i && styles.activeTabText]}>
              {route.title}
            </Text>
          </View>
          {/* Seçili sekme için kenar çizgisi */}
          {index === i && <View style={styles.activeTabIndicator} />}
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor : colors.white }}>
      {renderTabBar()}
      <View style={{ flex: 1 }}>
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={() => null} // TabBar'ı kaldır
          swipeEnabled={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 10,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, // Tüm sekmeleri eşit genişlikte yapmak için
    marginTop: 10,
    padding: 5,
  },
  tabContent: {
    alignItems: 'center',
  },
  tabText: {
    fontSize: 12, // İkon altına küçük metin
    color: '#4a4a4a',
    marginTop: 4,
  },
  activeTabText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  activeTab: {
    flex: 1, 
    marginTop: 10,
    padding: 5,
  },
  inactiveTab: {
    borderRadius: 10,
    paddingBottom: 5,
  },
  activeTabIndicator: {
    width: '50%',
    height: 3,
    backgroundColor: colors.red, // Seçili sekme için alt çizgi
    marginTop: 5,
    borderRadius: 10,
  },
});


export default AlinanSiparis;
