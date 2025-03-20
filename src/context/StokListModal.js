import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert } from 'react-native';
import axiosLinkMain from '../utils/axiosMain';
import { colors } from '../res/colors';
import FastImage from 'react-native-fast-image';
import { MainStyles } from '../res/style';
import CustomHeader from '../components/CustomHeader';
import { useAuthDefault } from '../components/DefaultUser';

const StokListModal = ({ isVisible, onClose, initialStokKod }) => {
  const { defaults } = useAuthDefault();
  const [stoklar, setStoklar] = useState([]);
  const [filteredStoklar, setFilteredStoklar] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialStokKod || '');
  const [loading, setLoading] = useState(false);
  const searchTimeoutRef = useRef(null);

  // 📌 **Modal açıldığında `filteredStoklar` sıfırlansın ve API çağrısı yapılsın**
  useEffect(() => {
    if (isVisible) {
      setSearchTerm(''); // **TextInput'u boşalt**
      setFilteredStoklar([]); // **Listeyi temizle**
      fetchStoklar(''); // **Boş değerle API çağrısı yap**
    }
  }, [isVisible]);

  const fetchStoklar = async (term) => {
    try {
      setLoading(true);
      const response = await axiosLinkMain.get(
        `/Api/Stok/StokListesiV2?deger=${term}&tip=1&depo=${defaults[0].IQ_CikisDepoNo}`
      );
      setStoklar(response.data);
      setFilteredStoklar(response.data);
    } catch (error) {
      console.error('Error fetching stoklar:', error);
      Alert.alert('Error', 'Veri yüklenirken hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  // 📌 **Kullanıcı yazdıkça gecikmeli API çağrısı yap ve `filteredStoklar` güncelle**
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredStoklar([]);
      return;
    }

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      fetchStoklar(searchTerm);
    }, 2200); // **500ms bekleyip API'ye istek yapar**
  }, [searchTerm]);

  handleClearSearch = () =>{
    setSearchTerm('');
    fetchStoklar('');
  };

  const handleStokSelect = (stok) => {
    onClose(stok);
    setFilteredStoklar([]);
  };

  const handleClose = () => {
    setFilteredStoklar([]); // **Listeyi sıfırla**
    onClose();
  };

  return (
    <Modal transparent={true} visible={isVisible} onRequestClose={handleClose}>
      <View style={styles.modalContainer}>
        <CustomHeader title="Stok Listesi" onClose={handleClose} />
        <View style={styles.modalContent}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Stok kodu veya adı ile ara"
              placeholderTextColor={colors.placeholderTextColor}
              value={searchTerm}
              onChangeText={(text) => setSearchTerm(text)}
              editable={!loading}
            />

            {/* X Butonu */}
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={handleClearSearch} style={styles.clearButton}>
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
                <TouchableOpacity style={styles.itemContainer} onPress={() => handleStokSelect(item)}>
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
