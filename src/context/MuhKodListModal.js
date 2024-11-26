import React, { useEffect, useState, useCallback } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, TextInput, Alert, SafeAreaView } from 'react-native';
import axiosLinkMain from '../utils/axiosMain';
import { useAuthDefault } from '../components/DefaultUser';
import { colors } from '../res/colors';
import { Left } from '../res/images';

const normalizeText = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

const MuhKodListModal = ({ isVisible, onSelectCari, onClose }) => {
  const [caris, setCaris] = useState([]);
  const [filteredCaris, setFilteredCaris] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { defaults } = useAuthDefault();
  

  const fetchCaris = useCallback(async (searchTerm = '') => {
    try {
      const personelKodu = defaults[0]?.Personel_Kodu || ''; 
      const response = await axiosLinkMain.get(`/Api/Cari/MuhasebeHesapPlanlari`);
      
      const filteredData = response.data
        .filter(item =>
          normalizeText(item.Adi).toLowerCase().includes(normalizeText(searchTerm).toLowerCase()) ||
          normalizeText(item.Kodu).includes(normalizeText(searchTerm))
        );

      setCaris(filteredData || []);
      setFilteredCaris(filteredData || []);
    } catch (error) {
      console.error('Error fetching caris:', error);
      Alert.alert('Error', 'Failed to load data. Please try again later.');
    }
  }, [defaults]);

  useEffect(() => {
    if (isVisible) {
      fetchCaris();
    }
  }, [isVisible, fetchCaris]);

  const handleSearch = () => {
    if (searchTerm) {
      const filtered = caris.filter(cari =>
        normalizeText(cari.Kodu).toLowerCase().includes(normalizeText(searchTerm).toLowerCase()) ||
        normalizeText(cari.Adi).toLowerCase().includes(normalizeText(searchTerm).toLowerCase())
      );
      setFilteredCaris(filtered);
    } else {
      setFilteredCaris(caris);
    }
  };

  const handleCariSelect = (cari) => {
    onSelectCari(cari);  
    onClose();
  };

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View>
            <Text style={styles.modalTitle}>Muhasebe Hesap Planları</Text>
          </View>
          <TouchableOpacity style={{position :'absolute', marginTop: 25, marginLeft: 10}} onPress={onClose}>
                  <Left width={17} height={17}/>
                  </TouchableOpacity>
          <View style={styles.searchContainer}>
             <TextInput
              style={styles.searchInput}
              placeholder="Muhasebe Kodu Ara"
              placeholderTextColor={colors.placeholderTextColor}
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            </View>
            <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
              <Text style={styles.searchButtonText}>ARA</Text>
            </TouchableOpacity>

            <View style={styles.headerContainer}>
              <Text style={styles.headerText}>Kod</Text>
              <Text style={styles.headerText2}>Adi</Text>
            </View>
          
            <FlatList
              data={filteredCaris}
              keyExtractor={(item) => item.Kodu.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.itemContainer}
                  onPress={() => handleCariSelect({ Kodu: item.Kodu, Adi: item.Adi  })}
                >
                  <View style={styles.itemRow}>
                    <Text style={styles.itemColumn}>{item.Kodu}</Text>
                    <Text style={styles.itemColumn2}>{item.Adi}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />

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
  },
  searchButton: {
    backgroundColor: colors.red,
    padding: 10,
    borderRadius: 10,
  },
  searchButtonText: {
    color: colors.white,
    textAlign: 'center',
    fontSize: 16,
  },
  headerContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerText: {
    flex: 2,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  headerText2: {
    flex: 2,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  headerText3: {
    flex: 2,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  headerText4: {
    flex: 2,
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  itemContainer: {
    paddingVertical: 10,
    paddingHorizontal: 5,
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
  },
});


export default MuhKodListModal;
