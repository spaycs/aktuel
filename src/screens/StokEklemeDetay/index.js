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

const StokEklemeDetay = () => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const { faturaBilgileri, setAddedProducts, setFaturaBilgileri } = useContext(ProductContext);

// Tüm Değişken Değerleri
  // Bilgi Sayfası
  const [bar_kodu, setBar_kodu] = useState('');
  const [bar_barkodtipi, setBar_barkodtipi] = useState('');
  const [bar_birimpntr, setBar_birimpntr] = useState('');
  const [bar_master, setBar_master] = useState('');
// Tüm Değişken Değerleri
  const [barkodTipiList, setBarkodTipiList] = useState([]);
  const [selectedBarkod, setSelectedBarkod] = useState('');
  const [barkodBirimPntrList, setBarkodBirimPntrList] = useState([]);
  const [selectedBarkodBirimPntr, setSelectedBarkodBirimPntr] = useState('');
  const [isBarkodTipiModalVisible, setIsBarkodTipiModalVisible] = useState(false);

  {/* Barkod Tipi Seçim */}
    const handleBarkodTipiChange = (value) => {
      setSelectedBarkod(value);
      
      let barkodTipiValue = '';
      if (value === 'Ean13') {
        barkodTipiValue = 0;
      } else if (value === 'Ean8') {
        barkodTipiValue = 1;
      } else if (value === 'Ascii') {
        barkodTipiValue = 2;
      }
  
      handleInputChange('bar_barkodtipi', barkodTipiValue); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Barkod Tipi Seçim */}

  {/* Barkod Birim Pntr Seçim */}
    useEffect(() => {
      const fetchBarkodBirimPntrList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/Stok/StokBirimleri');
          const data = response.data;
          setBarkodBirimPntrList(data); // API'den gelen verileri state'e set ediyoruz
        } catch (error) {
          console.error('Bağlantı Hatası Sorumluluk Merkezi list:', error);
        }
      };

      fetchBarkodBirimPntrList(); // Component yüklendiğinde API çağrısını yap
    }, []);

    const handleBarkodBirimPntrChange = (value) => {
      setSelectedBarkodBirimPntr(value); // Seçilen değeri local state'de tutuyoruz
      handleInputChange('bar_birimpntr', value); // Seçilen değeri fatura bilgilerine gönderiyoruz
    };
  {/* Barkod Birim Pntr Seçim */}



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
         <Text style={MainStyles.formTitle}>Barkod</Text>
         <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputStokKodu}
            placeholder="Barkod"
            value={bar_kodu}
            keyboardType="numeric"
            onChangeText={(value) => {
              setBar_kodu(value);
              handleInputChange('bar_kodu', value);
            }}
            placeholderTextColor={colors.placeholderTextColor}
          />
        </View>

        {/* Barkod Tipi */}
        <Text style={MainStyles.formTitle}>Barkod Tipi</Text>
          <View style={MainStyles.inputStyle}>
          {/* Platforma göre Picker */}
      {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity onPress={() => setIsBarkodTipiModalVisible(true)} style={MainStyles.inputStyle}>
            <Text style={[MainStyles.textColorBlack, MainStyles.fontSize12, MainStyles.paddingLeft10]}>
              {selectedBarkod || 'Barkod Tipi'}
            </Text>
          </TouchableOpacity>

          {/* iOS Modal Picker */}
          <Modal visible={isBarkodTipiModalVisible} animationType="slide" transparent>
            <View style={MainStyles.modalContainerPicker}>
              <View style={MainStyles.modalContentPicker}>
                <Picker
                  selectedValue={selectedBarkod}
                  onValueChange={handleBarkodTipiChange}
                  style={MainStyles.picker}
                >
                  <Picker.Item label="Barkod Tipi" value="" style={MainStyles.textStyle} />
                  <Picker.Item label="Ean13" value="Ean13" style={MainStyles.textStyle} />
                  <Picker.Item label="Ean8" value="Ean8" style={MainStyles.textStyle} />
                  <Picker.Item label="Ascii" value="Ascii" style={MainStyles.textStyle} />
                </Picker>
                <Button title="Kapat" onPress={() => setIsBarkodTipiModalVisible(false)} />
              </View>
            </View>
          </Modal>
        </>
      ) : (
        // Android için klasik Picker
        <View style={MainStyles.inputStyle}>
          <Picker
            selectedValue={selectedBarkod}
            onValueChange={handleBarkodTipiChange}
            itemStyle={{ height: 40, fontSize: 12 }}
            style={{ marginHorizontal: -10 }}
          >
            <Picker.Item label="Barkod Tipi" value="" style={MainStyles.textStyle} />
            <Picker.Item label="Ean13" value="Ean13" style={MainStyles.textStyle} />
            <Picker.Item label="Ean8" value="Ean8" style={MainStyles.textStyle} />
            <Picker.Item label="Ascii" value="Ascii" style={MainStyles.textStyle} />
          </Picker>
        </View>
      )}
          </View>

        {/* Barkod Birim Pntr
          <View style={MainStyles.inputStyle}>
            <Picker
              selectedValue={selectedBarkodBirimPntr}
              onValueChange={(value) => handleBarkodBirimPntrChange(value)} // Seçim yapıldığında çağrılan fonksiyon
            >
              <Picker.Item style={MainStyles.textStyle} label="Barkod Birim Pntr" value="" />
              {barkodBirimPntrList.map((item) => (
                <Picker.Item style={MainStyles.textStyle} key={item.Kod} label={item.Birim_Adi} value={item.Birim_Adi} />
              ))}
            </Picker>
          </View>
 */}

        {/* Cins 
          <View style={MainStyles.inputContainer}>
            <TextInput 
              style={MainStyles.inputStokKodu}
              placeholder="Barkod Master"
              value={bar_master}
              onChangeText={(value) => {
                setBar_master(value);
                handleInputChange('bar_master', value);
              }}
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>
        */}

       
    </View>
    </ScrollView>
  );
};

export default StokEklemeDetay;


