import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, SafeAreaView } from 'react-native';
import axiosLinkMain from '../utils/axiosMain';
import { useAuthDefault } from '../components/DefaultUser';
import { colors } from '../res/colors';
import { ActivityIndicator } from 'react-native-paper';
import { MainStyles } from '../res/style';
import FastImage from 'react-native-fast-image';
import { Back, Left } from '../res/images';

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
  const fetchCaris = useCallback(async () => {
    try {
      setLoading(true);
      const personelKodu = defaults[0]?.IQ_MikroPersKod || '';
      const response = await axiosLinkMain.get(`/Api/Cari/CariListesi?temsilci=${personelKodu}`);
  
      // Tüm veriyi sakla
      setAllData(response.data || []);
      setFilteredCaris(response.data || []);
    } catch (error) {
      console.error('Error fetching caris:', error);
      Alert.alert('Error', 'Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [defaults]);
  

  useEffect(() => {
    if (isVisible) {
      fetchCaris(); // Modal görünürse verileri yükle
    }
  }, [isVisible, fetchCaris]);

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

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalBorder}>
            <Text style={styles.modalTitle}>Cari Listesi</Text>
          </View>
          <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={onClose}>
          <Left width={17} height={17}/>
          </TouchableOpacity>
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
                <Text style={styles.headerText}>Cari Kodu</Text>
                <Text style={styles.headerText2}>Cari Ünvan</Text>
                <Text style={styles.headerText3}>Bakiye</Text>
                <Text style={styles.headerText4}>Adres</Text>
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
                      cari_odemeplan_no: item.cari_odemeplan_no,
                      cari_VarsayilanCikisDepo: item.cari_VarsayilanCikisDepo
                    })}
                  >
                    <View style={styles.itemRow}>
                      <Text style={styles.itemColumn}>{item.Cari_Kod}</Text>
                      <Text style={styles.itemColumn2}>{item.Ünvan}</Text>
                      <Text style={styles.itemColumn3}>{formatPrice(item.Bakiye)}</Text>
                      <Text style={styles.itemColumn4}>{item.Adres}</Text>
                    </View>
                  </TouchableOpacity>
                )}
              />
            </>
          )}
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
    position: 'relative',
    marginTop: 10,
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
    marginHorizontal: 15,
    marginTop: 20,
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
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    backgroundColor: colors.red,
    padding: 10,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: 10,
    borderRadius: 5,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    height: 65,
    marginHorizontal: 15,
    borderLeftWidth: 3.5,
    borderColor: colors.red,
  },
  itemColumn: {
    flex: 1,
    fontSize: 9,
    textAlign: 'left',
    opacity: 0.6

  },
  itemColumn2: {
    flex: 2,
    marginHorizontal: 3,
    fontSize: 9,
    textAlign: 'left',
  },
  itemColumn3: {
    flex: 1,
    marginHorizontal: 3,
    fontSize: 9,
    textAlign: 'left',
  },
  itemColumn4: {
    flex: 2,
    fontSize: 9,
    textAlign: 'left',
    opacity: 0.6
  },
});

export default CariListModal;
