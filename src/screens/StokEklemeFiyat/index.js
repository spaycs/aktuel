import React, { useState, useContext, useEffect } from 'react';
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

const StokEklemeFiyat = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [sfiyat_listesirano, setSfiyat_listesirano] = useState('');
  const [sfiyat_deposirano, setSfiyat_deposirano] = useState('');   // 0 atılacak
  const [sfiyat_odemeplan, setSfiyat_odemeplan] = useState('');    //  0 atılacak
  const [sfiyat_birim_pntr, setSfiyat_birim_pntr] = useState('');  // 1 atılacak
  const [sfiyat_fiyati, setSfiyat_fiyati] = useState('');
  const [sfiyat_doviz, setSfiyat_doviz] = useState('');
// Tüm Değişken Değerleri
  const [fiyatListeSiraNoList, setFiyatListeSiraNoList] = useState([]);
  const [selectedFiyatListe, setSelectedFiyatListe] = useState('');
  const [dovizList, setDovizList] = useState([]);
  const [selectedDoviz, setSelectedDoviz] = useState('');
  const [isFiyatListeModalVisible, setIsFiyatListeModalVisible] = useState(false);
  const [isDovizModalVisible, setIsDovizModalVisible] = useState(false);

  // Sayfa Açıldığında Gönderilen Varsayılan Değerler
    useEffect(() => {
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sfiyat_deposirano: 0,
        sfiyat_odemeplan: 0,
        sfiyat_birim_pntr: 1,
      }));
    }, [sfiyat_deposirano,sfiyat_odemeplan,sfiyat_birim_pntr] );
  // Sayfa Açıldığında Gönderilen Varsayılan Değerler

  {/* Fiyat Liste Sıra No Seçim */}
    useEffect(() => {
      const fetchFiyatListeSiraNoList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Stok/StokSatisListeleri');
          const data = response.data;
          setFiyatListeSiraNoList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchFiyatListeSiraNoList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleFiyatListeSiraNoChange = (value) => {
      setSelectedFiyatListe(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('sfiyat_listesirano', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Fiyat Liste Sıra No Seçim */}

  {/* Döviz Seçim */}
    useEffect(() => {
      const fetchDovizList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Kur/Kurlar');
          const data = response.data;
          setDovizList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchDovizList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleDovizChange = (value) => {
      setSelectedDoviz(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('sfiyat_doviz', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Döviz Seçim */}


const handleInputChange = (field, value) => {
  setFaturaBilgileri((prev) => ({
    ...prev,
    [field]: value,
  }));
};

  useFocusEffect(
    React.useCallback(() => {
      return () => {
        setFaturaBilgileri({});
      };
    }, [])
  );

  return (
    <ScrollView>
      <View style={MainStyles.faturaContainer}>
         {/* Stok Kodu */}
         <Text style={MainStyles.formTitle}>Fiyat Liste</Text>
          {/* Fiyat Liste Sıra No */}
          <View style={MainStyles.inputStyleAlinanSiparis}>
           {/* Platforma göre Picker */}
      {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsFiyatListeModalVisible(true)} style={MainStyles.inputStyle}>
            <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedFiyatListe ? fiyatListeSiraNoList.find(item => item.Sira_No.toString() === selectedFiyatListe)?.Aciklama : 'Fiyat Liste'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal Picker */}
          <Modal visible={isFiyatListeModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedFiyatListe}
                  onValueChange={handleFiyatListeSiraNoChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Fiyat Liste" value="" style={MainStyles.textStyle} />
                  {fiyatListeSiraNoList.map((item) => (
                    <Picker.Item key={item.Sira_No} label={item.Aciklama} value={item.Sira_No.toString()} style={MainStyles.textStyle} />
                  ))}
                </Picker>
                <Button title="Kapat" onPress={() => setIsFiyatListeModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için klasik Picker
        <View style={MainStyles.inputStyle}>
          <Picker
            selectedValue={selectedFiyatListe}
            onValueChange={handleFiyatListeSiraNoChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Fiyat Liste" value="" style={MainStyles.textStyle} />
            {fiyatListeSiraNoList.map((item) => (
              <Picker.Item key={item.Sira_No} label={item.Aciklama} value={item.Sira_No} style={MainStyles.textStyle} />
            ))}
          </Picker>
        </View>
      )}
          </View>

            {/* Satış Fiyatı */}
            <Text style={MainStyles.formTitle}>Satış Fiyatı</Text>
            <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputStokKodu}
              placeholder="Satış Fiyatı"
              value={sfiyat_fiyati}
              keyboardType="numeric"
              onChangeText={(value) => {
                setSfiyat_fiyati(value);
                handleInputChange('sfiyat_fiyati', value);
              }}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>

          {/* Döviz*/}
          <Text style={MainStyles.formTitle}>Döviz</Text>
          <View style={MainStyles.inputStyle}>
          {/* Platforma göre Picker */}
            {Platform.OS === 'ios' ? (
              <>
                <TouchableOpacity onPress={() => setIsDovizModalVisible(true)} style={MainStyles.inputStyle}>
                  <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                    {selectedDoviz ? dovizList.find(item => item.No.toString() === selectedDoviz)?.İsim : 'Döviz Seçim'}
                  </Text>
                </TouchableOpacity>

                {/* iOS Modal Picker */}
                <Modal visible={isDovizModalVisible} animationType="slide" transparent>
                  <View style={MainStyles.modalContainerPicker}>
                    <View style={MainStyles.modalContentPicker}>
                      <Picker
                        selectedValue={selectedDoviz}
                        onValueChange={handleDovizChange}
                        style={MainStyles.picker}
                      >
                        <Picker.Item label="Döviz Seçim" value="" style={MainStyles.textStyle} />
                        {dovizList.map((item) => (
                          <Picker.Item key={item.No} label={item.İsim} value={item.No.toString()} style={MainStyles.textStyle} />
                        ))}
                      </Picker>
                      <Button title="Kapat" onPress={() => setIsDovizModalVisible(false)} />
                    </View>
                  </View>
                </Modal>
              </>
            ) : (
              // Android için klasik Picker
              <View style={MainStyles.inputStyle}>
                <Picker
                  selectedValue={selectedDoviz}
                  onValueChange={handleDovizChange}
                  itemStyle={{ height: 40, fontSize: 12 }}
                  style={{ marginHorizontal: -10 }}
                >
                  <Picker.Item label="Döviz Seçim" value="" style={MainStyles.textStyle} />
                  {dovizList.map((item) => (
                    <Picker.Item key={item.No} label={item.İsim} value={item.No.toString()} style={MainStyles.textStyle} />
                  ))}
                </Picker>
              </View>
            )}
            </View>


       
        {/* Stok Adı 
          <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputStokKodu}
              placeholder="Fiyat Depo Sıra No"
              value={sfiyat_deposirano}
              onChangeText={(value) => {
                setSfiyat_deposirano(value);
                handleInputChange('sfiyat_deposirano', value);
              }}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
        */}

        {/* Kısa İsim 
          <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputStokKodu}
              placeholder="Fiyat Ödeme Planı"
              value={sfiyat_odemeplan}
              onChangeText={(value) => {
                setSfiyat_odemeplan(value);
                handleInputChange('sfiyat_odemeplan', value);
              }}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
        */}

        {/* Cins 
          <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputStokKodu}
              placeholder="Fiyat Birim Pntr"
              value={sfiyat_birim_pntr}
              onChangeText={(value) => {
                setSfiyat_birim_pntr(value);
                handleInputChange('sfiyat_birim_pntr', value);
              }}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
        */}

      

       
    </View>
    </ScrollView>
  );
};

export default StokEklemeFiyat;

