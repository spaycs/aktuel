import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, SafeAreaView, BackHandler } from 'react-native';
import axiosLinkMain from '../utils/axiosMain';
import { useAuthDefault } from '../components/DefaultUser';
import { colors } from '../res/colors';
import { ActivityIndicator } from 'react-native-paper';
import { MainStyles } from '../res/style';
import FastImage from 'react-native-fast-image';
import { Back, Left } from '../res/images';
import CustomHeader from '../components/CustomHeader';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const CariListModal = ({ isVisible, onSelectCari, onClose, initialSearchTerm }) => {
  const [caris, setCaris] = useState([]);
  const [filteredCaris, setFilteredCaris] = useState([]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || '');
  const { defaults } = useAuthDefault();
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  // Cari verilerini yükleme fonksiyonu
  const fetchCaris = useCallback(async (searchTerm = '') => {
    try {
      setLoading(true);
      const personelKodu = defaults[0]?.IQ_MikroPersKod || '';
      const response = await axiosLinkMain.get(`/Api/Cari/CariListesiV2?temsilci=${personelKodu}&value=${searchTerm}`);
      setCaris(response.data || []);
      setFilteredCaris(response.data || []);
    } catch (error) {
      console.error('Error fetching caris:', error);
      Alert.alert('Error', 'Tekrar Deneyin');
    } finally {
      setLoading(false);
    }
  }, [defaults]);

  // Arama işlemini 500ms gecikmeli yapma
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchCaris(searchTerm);
    }, 2000); // 500ms gecikme

    return () => clearTimeout(timeoutId); // Component unmount veya searchTerm değiştiğinde temizleme
  }, [searchTerm, fetchCaris]);

  useEffect(() => {
    // Arama terimi değiştiğinde filtreleme yap
    const filtered = allData.filter(cari =>
      normalizeText(cari.Cari_Kod).toLowerCase().includes(normalizeText(searchTerm).toLowerCase()) ||
      normalizeText(cari.Ünvan).toLowerCase().includes(normalizeText(searchTerm).toLowerCase())
    );
    setFilteredCaris(filtered); // Filtrelenmiş verileri güncelle
  }, [searchTerm, allData]);

  useEffect(() => {
    // İlk yükleme sırasında arama terimini ayarla
    if (initialSearchTerm) {
      setSearchTerm(initialSearchTerm);
    }
  }, [initialSearchTerm]);

  // Cari seçme fonksiyonu
  const handleCariSelect = (cari) => {
    onSelectCari(cari);
    onClose();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'decimal',
      minimumFractionDigits: 3,
      maximumFractionDigits: 3,
    }).format(price);
    };

    useEffect(() => {
      // Geri tuşu işlemi
      const handleBackPress = () => {
        if (isVisible) {
          onClose(); // Modal kapatma işlemi
          return true; // Geri tuşu işlemini engelle
        }
        return false; // Diğer işlemleri engelleme
      };
  
      // BackHandler event listener ekle
      const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
  
      // Component unmount olduğunda event listener'ı kaldır
      return () => backHandler.remove();
    }, [isVisible, onClose]);

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
      <CustomHeader
        title="Cari Listesi"
        onClose={onClose}
      />
        <View style={styles.modalContent}>
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Cari kodu veya ünvan ile ara"
              placeholderTextColor={colors.placeholderTextColor}
              value={searchTerm}
              onChangeText={setSearchTerm}
              editable={!loading}
            />
          </View>

          {loading ? (
            <FastImage
              style={MainStyles.loadingGif}
              source={require('../res/images/image/pageloading.gif')}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <>
              <View style={styles.headerContainer}>
                
              </View>

              <FlatList
                data={filteredCaris}
                keyExtractor={(item) => item.Cari_Kod.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.itemContainer}
                    onPress={() => handleCariSelect({
                      Cari_Kod: item.Cari_Kod,
                      Ünvan: item.Ünvan,
                      Bakiye: item.Bakiye,
                      Adres: item.Adres,
                      Temsilci: item.Temsilci,
                      cari_odemeplan_no: item.cari_odemeplan_no,
                      cari_VarsayilanCikisDepo: item.cari_VarsayilanCikisDepo,
                      cari_satis_fk: item.cari_satis_fk
                    })}
                  >
                    <View style={styles.itemRow}>
                      <Text style={styles.itemColumn}>Kod: {item.Cari_Kod}</Text>
                      <Text style={styles.itemColumn}>Ünvan: {item.Ünvan}</Text>
                      <Text style={styles.itemColumn}>Bakiye: {formatPrice(item.Bakiye)}</Text>
                      <Text style={styles.itemColumn}>Adres: {item.Adres}</Text>
                      <Text style={styles.itemColumn}>Temsilci: {item.Temsilci}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
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
    fontSize: 12,
    height: 40,
  },
  headerContainer: {
    marginBottom: 10,
  },
  headerText: {
    flex: 2,
    left: 20,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    color:colors.white,
  },
  headerText2: {
    flex: 2,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    color:colors.white
  },
  headerText3: {
    flex: 2,
    left: 5,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    color:colors.white
  },
  headerText4: {
    flex: 2,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
    color:colors.white
  },
  itemContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    
  },
  itemRow: {
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    borderLeftWidth: 3.5,
    borderColor: colors.red,
  },
  itemColumn: {
    fontSize: 10,
    textAlign: 'left',
  },
});

export default CariListModal;
