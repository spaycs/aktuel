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

const CariEklemeAdres = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  // Adres bilgileri için state değişkenleri
  const [adr_cadde, setAdr_cadde] = useState('');
  const [adr_mahalle, setAdr_mahalle] = useState('');
  const [adr_sokak, setAdr_sokak] = useState('');
  const [adr_Semt, setAdr_Semt] = useState('');
  const [adr_Apt_No, setAdr_Apt_No] = useState('');
  const [adr_Daire_No, setAdr_Daire_No] = useState('');
  const [adr_posta_kodu, setAdr_posta_kodu] = useState('');
  const [adr_ilce, setAdr_ilce] = useState('');
  const [adr_il, setAdr_il] = useState('');
  const [adr_ulke, setAdr_ulke] = useState('');
  const [adr_tel_ulke_kodu, setAdr_tel_ulke_kodu] = useState('');
  const [adr_tel_bolge_kodu, setAdr_tel_bolge_kodu] = useState('');
  const [adr_tel_no1, setAdr_tel_no1] = useState('');
  const [adr_tel_no2, setAdr_tel_no2] = useState('');
  const [adr_tel_faxno, setAdr_tel_faxno] = useState('');
  const [ülkeList, setUlkeList] = useState([]);
  const [selectedUlke, setSelectedUlke] = useState('');
  const [ilList, setIlList] = useState([]);
  const [selectedIl, setSelectedIl] = useState('');
  const [ilceList, setIlceList] = useState([]);
  const [selectedIlce, setSelectedIlce] = useState('');
  const [isUlkeModalVisible, setIsUlkeModalVisible] = useState('');
// Tüm Değişken Değerleri

// Ulke Seçim
  useEffect(() => {
    const fetchUlkeList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Adres/Ulkeler');
        const data = response.data;
        setUlkeList(data); // API'den gelen verileri state'e set ediyoruz
      } catch (error) {
        console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
      }
    };

    fetchUlkeList(); // Component yüklendiğinde API çağrısını yap
  }, []);

  const handleUlkeChange = (value) => {
    setSelectedUlke(value); // Seçilen değeri local state'de tutuyoruz
    handleInputChange('adr_ulke', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
  };
// Ulke Seçim

// İl Seçim
  useEffect(() => {
    const fetchIlList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Adres/Iller');
        const data = response.data;
        setIlList(data); // API'den gelen verileri state'e set ediyoruz
      } catch (error) {
        console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
      }
    };

    fetchIlList(); // Component yüklendiğinde API çağrısını yap
  }, []);

  const handleIlChange = (value) => {
    setSelectedIl(value); // Store the selected province code
    setSelectedIlce(''); // Reset selected district when the province changes
    handleInputChange('adr_il', value); // Send selected province to fatura bilgileri
    fetchIlceList(value); // Fetch districts for the selected province
  };
// İl Seçim

// İlçe Seçim
  const fetchIlceList = async (Il_Adi) => {
    try {
      const response = await axiosLinkMain.get(`/Api/Adres/Ilceler?iladi=${Il_Adi}`);
      const data = response.data;
      setIlceList(data); // Set district data in state
    } catch (error) {
      console.error('Error fetching district list:', error);
    }
  };

  const handleIlceChange = (value) => {
    setSelectedIlce(value); // Store the selected district code
    handleInputChange('adr_ilce', value); // Send selected district to fatura bilgileri
  };
// İlçe Seçim


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
    <ScrollView style={MainStyles.faturaContainerMenu}>
    <View style={MainStyles.faturaContainer}>
      {/* Cadde */}
      <Text style={MainStyles.formTitle}>Cadde</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Cadde"
          value={adr_cadde}
          onChangeText={(value) => {
            setAdr_cadde(value);
            handleInputChange('adr_cadde', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Mahalle */}
      <Text style={MainStyles.formTitle}>Mahalle</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Mahalle"
          value={adr_mahalle}
          onChangeText={(value) => {
            setAdr_mahalle(value);
            handleInputChange('adr_mahalle', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Sokak */}
      <Text style={MainStyles.formTitle}>Sokak</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Sokak"
          value={adr_sokak}
          onChangeText={(value) => {
            setAdr_sokak(value);
            handleInputChange('adr_sokak', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Semt */}
      <Text style={MainStyles.formTitle}>Semt</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Semt"
          value={adr_Semt}
          onChangeText={(value) => {
            setAdr_Semt(value);
            handleInputChange('adr_Semt', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Apartman No */}
      <Text style={MainStyles.formTitle}>Apartman No</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Apartman No"
          value={adr_Apt_No}
          onChangeText={(value) => {
            setAdr_Apt_No(value);
            handleInputChange('adr_Apt_No', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Daire No */}
      <Text style={MainStyles.formTitle}>Daire No</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Daire No"
          value={adr_Daire_No}
          keyboardType="numeric"
          onChangeText={(value) => {
            setAdr_Daire_No(value);
            handleInputChange('adr_Daire_No', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Posta Kodu */}
      <Text style={MainStyles.formTitle}>Posta Kodu</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Posta Kodu"
          value={adr_posta_kodu}
          keyboardType="numeric"
          onChangeText={(value) => {
            setAdr_posta_kodu(value);
            handleInputChange('adr_posta_kodu', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Ülke Seçimi */}
      <Text style={MainStyles.formTitle}>Ülke</Text>
      <View style={MainStyles.inputStyleAlinanSiparis}>
        {Platform.OS === 'ios' ? (
          <>
            <TouchableOpacity onPress={() => setIsUlkeModalVisible(true)}>
              <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
                {selectedUlke || "Ülke"} {/* Seçilen ülke ya da varsayılan metin */}
              </Text>
            </TouchableOpacity>

            {/* Ülke Modal (iOS için) */}
            <Modal visible={isUlkeModalVisible} animationType="slide" transparent>
              <View style={MainStyles.modalContainerPicker}>
                <View style={MainStyles.modalContentPicker}>
                  <Picker
                    selectedValue={selectedUlke}
                    onValueChange={(value) => {
                      handleUlkeChange(value); // Seçim işlemi
                      setIsUlkeModalVisible(false); // Modal kapat
                    }}
                    style={MainStyles.picker}
                  >
                    <Picker.Item label="Ülke" value="" />
                    {ülkeList.map((item) => (
                      <Picker.Item
                        key={item.Ulke_Kodu}
                        label={item.Ulke_Adi}
                        value={item.Ulke_Adi.toString()}
                      />
                    ))}
                  </Picker>
                  <Button title="Kapat" onPress={() => setIsUlkeModalVisible(false)} />
                </View>
              </View>
            </Modal>
          </>
        ) : (
          // Android için doğrudan Picker
          <Picker
            selectedValue={selectedUlke}
            onValueChange={(value) => handleUlkeChange(value)}
            style={{ marginHorizontal: -10 }}
            itemStyle={{ height: 40, fontSize: 12 }}
          >
            <Picker.Item label="Ülke" value="" style={MainStyles.textStyle} />
            {ülkeList.map((item) => (
              <Picker.Item
                key={item.Ulke_Kodu}
                label={item.Ulke_Adi}
                value={item.Ulke_Adi.toString()}
                style={MainStyles.textStyle}
              />
            ))}
          </Picker>
        )}
      </View>


      {/* İl Seçimi */}
<Text style={MainStyles.formTitle}>İl</Text>
<View style={MainStyles.inputStyleAlinanSiparis}>
  {Platform.OS === 'ios' ? (
    <>
      <TouchableOpacity onPress={() => setIsIlModalVisible(true)}>
        <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
          {selectedIl || "İl"} {/* Seçili il yoksa varsayılan metin */}
        </Text>
      </TouchableOpacity>

      {/* İl Modal (iOS için) */}
      <Modal visible={isIlModalVisible} animationType="slide" transparent>
        <View style={MainStyles.modalContainerPicker}>
          <View style={MainStyles.modalContentPicker}>
            <Picker
              selectedValue={selectedIl}
              onValueChange={(value) => {
                handleIlChange(value); // Seçim işlemi
                setIsIlModalVisible(false); // Modal kapat
              }}
              style={MainStyles.picker}
            >
              <Picker.Item label="İl" value="" />
              {ilList.map((item) => (
                <Picker.Item
                  key={item.Il_Kodu}
                  label={item.Il_Adi}
                  value={item.Il_Adi.toString()}
                />
              ))}
            </Picker>
            <Button title="Kapat" onPress={() => setIsIlModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </>
  ) : (
    // Android için doğrudan Picker
    <Picker
      selectedValue={selectedIl}
      onValueChange={handleIlChange}
      style={{ marginHorizontal: -10 }}
      itemStyle={{ height: 40, fontSize: 12 }}
    >
      <Picker.Item label="İl" value="" style={MainStyles.textStyle} />
      {ilList.map((item) => (
        <Picker.Item
          key={item.Il_Kodu}
          label={item.Il_Adi}
          value={item.Il_Adi.toString()}
          style={MainStyles.textStyle}
        />
      ))}
    </Picker>
  )}
</View>


       {/* İlce Seçimi*/}
       <Text style={MainStyles.formTitle}>İlçe</Text> 
       <View style={MainStyles.inputStyleAlinanSiparis}>
          <Picker
          itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
            selectedValue={selectedIlce}
            onValueChange={handleIlceChange} // Seçim yapıldığında çağrılan fonksiyon
            enabled={selectedIl !== ''}
          >
            <Picker.Item style={MainStyles.textStyle} label="İlçe" value="" />
              {ilceList.map((item) => (
                <Picker.Item style={MainStyles.textStyle} key={item.Ilce_Kodu} label={item.Ilce_Adi} value={item.Ilce_Adi.toString()} />
              ))}
            </Picker>
        </View>



      {/* Telefon Ülke Kodu */}
      <Text style={MainStyles.formTitle}>Telefon Ülke Kodu</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Telefon Ülke Kodu"
          value={adr_tel_ulke_kodu}
          keyboardType="numeric"
          onChangeText={(value) => {
            setAdr_tel_ulke_kodu(value);
            handleInputChange('adr_tel_ulke_kodu', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Telefon Bölge Kodu */}
      <Text style={MainStyles.formTitle}>Telefon Bölge Kodu</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Telefon Bölge Kodu"
          value={adr_tel_bolge_kodu}
          keyboardType="numeric"
          onChangeText={(value) => {
            setAdr_tel_bolge_kodu(value);
            handleInputChange('adr_tel_bolge_kodu', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Telefon No 1 */}
      <Text style={MainStyles.formTitle}>Telefon No 1</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Telefon No 1"
          value={adr_tel_no1}
          keyboardType="numeric"
          onChangeText={(value) => {
            setAdr_tel_no1(value);
            handleInputChange('adr_tel_no1', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Telefon No 2 */}
      <Text style={MainStyles.formTitle}>Telefon No 2</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Telefon No 2"
          value={adr_tel_no2}
          keyboardType="numeric"
          onChangeText={(value) => {
            setAdr_tel_no2(value);
            handleInputChange('adr_tel_no2', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>

      {/* Fax No */}
      <Text style={MainStyles.formTitle}>Fax No</Text> 
      <View style={MainStyles.inputContainer}>
        <TextInput
          style={MainStyles.inputStokKodu}
          placeholder="Fax No"
          value={adr_tel_faxno}
          keyboardType="numeric"
          onChangeText={(value) => {
            setAdr_tel_faxno(value);
            handleInputChange('adr_tel_faxno', value);
          }}
          placeholderTextColor={colors.placeholderTextColor}
        />
      </View>
    </View>
  </ScrollView>
  );
};

export default CariEklemeAdres;


