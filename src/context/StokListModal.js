import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, SafeAreaView } from 'react-native';
import axiosLinkMain from '../utils/axiosMain';
import { colors } from '../res/colors';
import FastImage from 'react-native-fast-image';
import { MainStyles } from '../res/style';
import { Left } from '../res/images';
import CustomHeader from '../components/CustomHeader';
import { useAuthDefault } from '../components/DefaultUser';

const StokListModal = ({ isVisible, onClose, initialStokKod }) => {
  const { defaults } = useAuthDefault();
  const [stoklar, setStoklar] = useState([]); // API'den gelen stoklar
  const [filteredStoklar, setFilteredStoklar] = useState([]); // Filtrelenmiş stoklar
  const [searchTerm, setSearchTerm] = useState(initialStokKod || ''); // İlk değer initialStokKod olacak
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  useEffect(() => {
    if (isVisible && initialStokKod) {
      setSearchTerm(initialStokKod);
      fetchStoklar(initialStokKod);
    }
  }, [isVisible, initialStokKod]);

  const fetchStoklar = async (term) => {
    try {
      setLoading(true);
      const response = await axiosLinkMain.get(`/Api/Stok/StokListesiV2?deger=${term}&tip=1&depo=${defaults[0].IQ_CikisDepoNo}`);
      
      setStoklar(response.data); // Tüm stokları kaydediyoruz
      setFilteredStoklar(response.data); // Filtrelenen listeyi güncelliyoruz
    } catch (error) {
      console.error('Error fetching stoklar:', error);
      Alert.alert('Error', 'Veri yüklenirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible) {
      fetchStoklar(searchTerm); // **Modal açıldığında ilk veri çekilir**
    }
  }, [isVisible]);

  // 📌 **Kullanıcı yazdıkça gecikmeli API çağrısı yap**
  const handleSearchTermChange = (text) => {
    setSearchTerm(text);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchStoklar(text);
    }, 500); // **500ms bekleyip API'ye istek yapar**
  };

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

  const handleClose = () => {
    setSearchTerm(''); // **TextInput içeriğini temizle**
    setFilteredStoklar([]); // **Listeyi temizle**
    onClose(); // **Ana fonksiyonu çağır**
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
     <View style={styles.modalContainer}>
      <CustomHeader
        title="Stok Listesi"
        onClose={handleClose}
      />
       <View style={styles.modalContent}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Stok kodu veya adı ile ara"
              placeholderTextColor={colors.placeholderTextColor}
              value={searchTerm} // searchTerm state'ine bağladık
              onChangeText={handleSearchTermChange} // Kullanıcı yazdığında searchTerm güncellenir
              editable={!loading} // loading sırasında TextInput'u kilitliyoruz
            />
             
          {/* X Butonu */}
          {searchTerm.length > 0 && (
            <TouchableOpacity onPress={() => setSearchTerm('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
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
    marginTop: 15,
    marginHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    fontSize: 11,
    height: 40,
  },
  clearButton: {
    position: 'absolute',
    right: 5,
    top: 3,
    padding: 5,
  },
  clearButtonText: {
    fontSize: 16,
    color: 'gray',
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
    paddingHorizontal: 10,
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