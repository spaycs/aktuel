import React, { useState, useContext, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, FlatList, Alert, ActivityIndicator, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Takvim } from '../../res/images';
import { ProductContext } from '../../context/ProductContext';
import { useAuthDefault } from '../../components/DefaultUser';
import ProductModal from '../../context/ProductModal';
import CariListModal from '../../context/CariListModal';
import { useFocusEffect } from '@react-navigation/native';
import axiosLinkMain from '../../utils/axiosMain';
import { colors } from '../../res/colors';
import { useAuth } from '../../components/userDetail/Id';
import { DataTable } from 'react-native-paper';
import Button from '../../components/Button';
import { useScrollToTop } from '@react-navigation/native';
import StokListModal from '../../context/StokListModal';

const StokEklemeBilgisi = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);
  const scrollViewRef = useRef(null);
 

  useEffect(() => {
    // Sayfa yüklendiğinde kısa bir gecikme ile kaydırmayı tetikleyin
    const timer = setTimeout(() => {
      scrollTop();
    }, 100); // 100 ms gecikme
  
    return () => clearTimeout(timer); // Temizleme işlemi
  }, []);

  const scrollTop = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true })
    }
  }

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [sto_kod, setSto_kod] = useState('');
  const [sto_isim, setSto_isim] = useState('');
  const [sto_kisa_ismi, setSto_kisa_isim] = useState('');
  const [sto_cins, setSto_cins] = useState('');
  const [sto_doviz_cinsi, setSto_doviz_cinsi] = useState('');
  const [sto_birim1_ad, setSto_birim1_ad] = useState('');
  const [sto_perakende_vergi, setSto_perakende_vergi] = useState('');
  const [sto_toptan_vergi, setSto_toptan_vergi] = useState('');
// Tüm Değişken Değerleri
  const [cinsList, setCinsList] = useState([]);
  const [selectedCins, setSelectedCins] = useState('');
  const [dovizCinsList, setDovizCinsList] = useState([]);
  const [selectedDovizCins, setSelectedDovizCins] = useState('');
  const [birimList, setBirimList] = useState([]);
  const [selectedBirimList, setSelectedBirimList] = useState('');
  const [perakendeVergiList, setPerakendeVergiList] = useState([]);
  const [selectedPerakendeVergiList, setSelectedPerakendeVergiList] = useState('');
  const [toptanVergiList, setToptanVergiList] = useState([]);
  const [selectedToptanVergiList, setSelectedToptanVergiList] = useState('');
  const [sth_stok_kodu, setSth_stok_kodu] = useState('');
const [sth_stok_adi, setSth_stok_adi] = useState('');
const [isStokListModalVisible, setIsStokListModalVisible] = useState(false);
const [isModalVisible, setIsModalVisible] = useState(false); 
const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);
const [isBirimModalVisible, setIsBirimModalVisible] = useState(false);
const [isPerakendeVergiModalVisible, setIsPerakendeVergiModalVisible] = useState(false);
const [isToptanVergiModalVisible, setIsToptanVergiModalVisible] = useState(false);

  {/* Cins Seçim */}
    useEffect(() => {
      const fetchCinsList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Stok/StokCinsleri');
          const data = response.data;
          setCinsList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi l ist:', error);
        }
      };

      fetchCinsList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleCinsChange = (value) => {
      setSelectedCins(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('sto_cins', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Cins Seçim */}

  {/* Döviz Cins Seçim */}
    useEffect(() => {
      const fetchDovizCinsList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Kur/Kurlar');
          const data = response.data;
          setDovizCinsList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchDovizCinsList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleDovizCinsChange = (value) => {
      setSelectedDovizCins(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('sto_doviz_cinsi', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Döviz Cins Seçim */}

  {/* Birim Seçim */}
    useEffect(() => {
      const fetchBirimList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Stok/StokBirimleri');
          const data = response.data;
          setBirimList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchBirimList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleBirimChange = (value) => {
      setSelectedBirimList(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('sto_birim1_ad', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };

  {/* Birim Seçim */}

  {/* Perakende Vergi */}
    useEffect(() => {
      const fetchPerakendeVergiList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Stok/StokVergileri');
          const data = response.data;
          setPerakendeVergiList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchPerakendeVergiList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handlePerakendeVergiChange = (value) => {
      setSelectedPerakendeVergiList(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('sto_perakende_vergi', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };

  {/* Perakende Vergi */}

  {/* Toptan Vergi */}
    useEffect(() => {
      const fetchToptanVergiList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Stok/StokVergileri');
          const data = response.data;
          setToptanVergiList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchToptanVergiList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleToptanVergiChange = (value) => {
      setSelectedToptanVergiList(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('sto_toptan_vergi', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };

  {/* Toptan Vergi */}
  // Stok Seçim
  const handleStokKoduClick = () => {
    setIsStokListModalVisible(true);
  };
  
  const handleCloseModal = (selectedStok) => {
    if (selectedStok) {
      setSto_kod(selectedStok.Stok_Kod);
      setSto_isim(selectedStok.Stok_Ad);
  
      // 📌 **faturaBilgileri içinde de güncelle**
      setFaturaBilgileri((prev) => ({
        ...prev,
        sto_kod: selectedStok.Stok_Kod,
        sto_isim: selectedStok.Stok_Ad,
      }));
    }
    setIsStokListModalVisible(false); // Modalı kapat
  };
  
  

// Cari Seçim

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setFaturaBilgileri({});
      };
    }, [])
  );

  const handleInputChange = (field, value) => {
    setFaturaBilgileri((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  
  
  return (
    <ScrollView ref={scrollViewRef} style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
         {/* Stok Kodu */}
         <Text style={MainStyles.formTitle}>Stok Kodu </Text> 
         <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputCariKodu}
            placeholder="Stok Kodu"
            value={sto_kod}
            onChangeText={(value) => {
              setSto_kod(value);
              handleInputChange('sto_kod', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
          <TouchableOpacity
            onPress={() => {
              handleStokKoduClick();
              setIsStokListModalVisible(true); // Modalı aç
            }}
            style={MainStyles.buttonCariKodu}
          >
            <Ara />
          </TouchableOpacity>
        </View>

        {/* Stok Adı */}
        <Text style={MainStyles.formTitle}>Stok Adı</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Stok Adı"
            value={sto_isim}
            onChangeText={(value) => {
              setSto_isim(value);
              handleInputChange('sto_isim', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Kısa İsim */}
        <Text style={MainStyles.formTitle}>Kısa İsim</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput 
            style={MainStyles.inputStokKodu}
            placeholder="Kısa İsim"
            value={sto_kisa_ismi}
            onChangeText={(value) => {
              setSto_kisa_isim(value);
              handleInputChange('sto_kisa_ismi', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Cins */}
        <Text style={MainStyles.formTitle}>Cins</Text> 
        <View style={MainStyles.inputStyleAlinanSiparis}>
        {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsModalVisible(true)} >
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedCins ? cinsList.find(item => item.CinsKodu.toString() === selectedCins)?.CinsAdi : 'Cins Seçin'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal */}
          <Modal visible={isModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedCins}
                  onValueChange={handleCinsChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Cins Seçin" value="" style={MainStyles.textStyle} />
                  {cinsList.map((item) => (
                    <Picker.Item
                      key={item.CinsKodu}
                      label={item.CinsAdi}
                      value={item.CinsKodu.toString()}
                      style={MainStyles.textStyle}
                    />
                  ))}
                </Picker>
                <Button title="Kapat" onPress={() => setIsModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        <View >
          <Picker
            selectedValue={selectedCins}
            onValueChange={handleCinsChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Cins Seçin" value="" style={MainStyles.textStyle} />
            {cinsList.map((item) => (
              <Picker.Item
                key={item.CinsKodu}
                label={item.CinsAdi}
                value={item.CinsKodu.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        </View>
      )}
        </View>

        {/* Döviz Cinsi */}
        <Text style={MainStyles.formTitle}>Döviz Cinsi</Text> 
        <View style={MainStyles.inputStyleAlinanSiparis}>
        {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsDovizModalVisible(true)} >
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedDovizCins ? dovizCinsList.find(item => item.No.toString() === selectedDovizCins)?.İsim : 'Döviz Cinsi'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal Picker */}
          <Modal visible={isDovizModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedDovizCins}
                  onValueChange={handleDovizCinsChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Döviz Cinsi" value="" style={MainStyles.textStyle} />
                  {dovizCinsList.map((item) => (
                    <Picker.Item
                      key={item.No}
                      label={item.İsim}
                      value={item.No.toString()}
                      style={MainStyles.textStyle}
                    />
                  ))}
                </Picker>
                <Button title="Kapat" onPress={() => setIsDovizModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için klasik Picker
        <View >
          <Picker
            selectedValue={selectedDovizCins}
            onValueChange={handleDovizCinsChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Döviz Cinsi" value="" style={MainStyles.textStyle} />
            {dovizCinsList.map((item) => (
              <Picker.Item
                key={item.No}
                label={item.İsim}
                value={item.No.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        </View>
      )}
        </View>

        {/* Birim 1 Ad */}
        <Text style={MainStyles.formTitle}>Birim</Text> 
        <View style={MainStyles.inputStyleAlinanSiparis}>
        {/* Platforma göre picker */}
        {Platform.OS === 'ios' ? (
          <>
          <TouchableOpacity onPress={() => setIsBirimModalVisible(true)} >
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedBirimList ? birimList.find(item => item.Birim_Adi === selectedBirimList)?.Birim_Adi : 'Birim Seç'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal Picker */}
          <Modal visible={isBirimModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedBirimList}
                  onValueChange={handleBirimChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Birim Seç" value="" style={MainStyles.textStyle} />
                  {birimList.map((item) => (
                    <Picker.Item
                      key={item.Kod}
                      label={item.Birim_Adi}
                      value={item.Birim_Adi}
                      style={MainStyles.textStyle}
                    />
                  ))}
                </Picker>
                <Button title="Kapat" onPress={() => setIsBirimModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için klasik Picker
        <View>
          <Picker
            selectedValue={selectedBirimList}
            onValueChange={handleBirimChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Birim Seç" value="" style={MainStyles.textStyle} />
            {birimList.map((item) => (
              <Picker.Item
                key={item.Kod}
                label={item.Birim_Adi}
                value={item.Birim_Adi}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        </View>
      )}
        </View>
        
        {/* Perakende Vergi */}
        <Text style={MainStyles.formTitle}>Perakende Vergi</Text> 
        <View style={MainStyles.inputStyleAlinanSiparis}>
         {/* Platforma göre picker */}
      {Platform.OS === 'ios' ? (
        <>

          <TouchableOpacity onPress={() => setIsPerakendeVergiModalVisible(true)} >
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedPerakendeVergiList ? perakendeVergiList.find(item => item.PVergiNo.toString() === selectedPerakendeVergiList)?.PVergiAdi : 'Perakende Vergi'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal Picker */}
          <Modal visible={isPerakendeVergiModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedPerakendeVergiList}
                  onValueChange={handlePerakendeVergiChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Perakende Vergi" value="" style={MainStyles.textStyle} />
                  {perakendeVergiList.map((item) => (
                    <Picker.Item
                      key={item.PVergiNo}
                      label={item.PVergiAdi}
                      value={item.PVergiNo.toString()}
                      style={MainStyles.textStyle}
                    />
                  ))}
                </Picker>
                <Button title="Kapat" onPress={() => setIsPerakendeVergiModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için klasik Picker
        <View>
          <Picker
            selectedValue={selectedPerakendeVergiList}
            onValueChange={handlePerakendeVergiChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Perakende Vergi" value="" style={MainStyles.textStyle} />
            {perakendeVergiList.map((item) => (
              <Picker.Item
                key={item.PVergiNo}
                label={item.PVergiAdi}
                value={item.PVergiNo.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        </View>
      )}
        </View>

        {/* Toptan Vergi */}
        <Text style={MainStyles.formTitle}>Toptan Vergi</Text> 
        <View style={MainStyles.inputStyleAlinanSiparis}>
       {/* Platforma göre picker */}
      {Platform.OS === 'ios' ? (
        <>

          <TouchableOpacity onPress={() => setIsToptanVergiModalVisible(true)} >
          <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedToptanVergiList ? toptanVergiList.find(item => item.TVergiNo.toString() === selectedToptanVergiList)?.TVergiAdi : 'Toptan Vergi'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal Picker */}
          <Modal visible={isToptanVergiModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedToptanVergiList}
                  onValueChange={handleToptanVergiChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Toptan Vergi" value="" style={MainStyles.textStyle} />
                  {toptanVergiList.map((item) => (
                    <Picker.Item
                      key={item.TVergiNo}
                      label={item.TVergiAdi}
                      value={item.TVergiNo.toString()}
                      style={MainStyles.textStyle}
                    />
                  ))}
                </Picker>
                <Button title="Kapat" onPress={() => setIsToptanVergiModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için klasik Picker
        <View>
          <Picker
            selectedValue={selectedToptanVergiList}
            onValueChange={handleToptanVergiChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Toptan Vergi" value="" style={MainStyles.textStyle} />
            {toptanVergiList.map((item) => (
              <Picker.Item
                key={item.TVergiNo}
                label={item.TVergiAdi}
                value={item.TVergiNo.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        </View>
      )}
        </View>

        <StokListModal
        isVisible={isStokListModalVisible}
        onClose={handleCloseModal}
        initialStokKod={sto_kod}
      />

    </View>
    </ScrollView>
  );
};

export default StokEklemeBilgisi;