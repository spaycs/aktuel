import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, SafeAreaView } from 'react-native';
import axiosLinkMain from '../utils/axiosMain';
import { colors } from '../res/colors';
import FastImage from 'react-native-fast-image';
import { MainStyles } from '../res/style';
import { Left } from '../res/images';

const StokListModal = ({ isVisible, onClose, initialStokKod }) => {
  const [stoklar, setStoklar] = useState([]); // API'den gelen stoklar
  const [filteredStoklar, setFilteredStoklar] = useState([]); // Filtrelenmiş stoklar
  const [searchTerm, setSearchTerm] = useState(initialStokKod || ''); // İlk değer initialStokKod olacak
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // initialStokKod değiştiğinde searchTerm'i güncelle
    if (initialStokKod) {
      setSearchTerm(initialStokKod);
    }
  }, [initialStokKod]);

  const fetchStoklar = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axiosLinkMain.get(`/Api/Stok/StokListesi?deger=${searchTerm}&tip=1&depo=1`);
      
      setStoklar(response.data); // Tüm stokları set ediyoruz
      setFilteredStoklar(response.data); // İlk başta tüm stokları gösteriyoruz
    } catch (error) {
      console.error('Error fetching stoklar:', error);
      Alert.alert('Error', 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVisible) {
      fetchStoklar(); // Modal ilk açıldığında stokları getiriyoruz
    }
  }, [isVisible, fetchStoklar]);

  useEffect(() => {
    // Arama terimi değiştiğinde stokları filtrele
    if (searchTerm) {
      const filtered = stoklar.filter(stok =>
        stok.Stok_Kod.includes(searchTerm) || stok.Stok_Ad.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStoklar(filtered);
    } else {
      setFilteredStoklar(stoklar); // Arama terimi boşsa tüm stokları göster
    }
  }, [searchTerm, stoklar]);

  const handleStokSelect = (stok) => {
    onClose(stok); // Stok seçildiğinde modal kapanır
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
       <SafeAreaView style={styles.modalContainer}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.modalTitle}>Stok Listesi</Text>
          </View>
          <TouchableOpacity style={{position :'absolute', marginTop: 12, marginLeft: 10}}  onPress={onClose}>
              <Left width={17} height={17}/>
            </TouchableOpacity>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Stok kodu veya adı ile ara"
              placeholderTextColor={colors.placeholderTextColor}
              value={searchTerm} // searchTerm state'ine bağladık
              onChangeText={setSearchTerm} // Kullanıcı yazdığında searchTerm güncellenir
              editable={!loading} // loading sırasında TextInput'u kilitliyoruz
            />
          </View>

          {loading ? (
            <FastImage
              style={MainStyles.loadingGif}
              source={require('../res/images/image/pageloading.gif')}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <FlatList
              data={filteredStoklar}
              keyExtractor={(item) => item.Stok_Kod}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleStokSelect(item)}
                >
                  <View style={styles.itemRow}>
                    <Text style={styles.itemColumn}>{item.Stok_Kod}</Text>
                    <Text style={styles.itemColumn2}>{item.Stok_Ad}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: colors.white,
  },
  modalContent: {
    width: '100%',
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 15,
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    right: 10,
    padding: 10,
    borderRadius: 5,
  },
  closeButtonText: {
    color: colors.black,
    textAlign: 'center',
    fontSize: 20,
  },
  modalTitle: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
    marginTop: 15,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 14,
    height: 40,
  },
  itemContainer: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.textInputBg,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemColumn: {
    flex: 1,
    fontSize: 9,
    textAlign: 'left',
  },
  itemColumn2: {
    flex: 3,
    marginHorizontal: 3,
    fontSize: 9,
    textAlign: 'left',
  },
});

export default StokListModal;