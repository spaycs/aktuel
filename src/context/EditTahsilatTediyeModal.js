import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, FlatList, SafeAreaView } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axiosLinkMain from '../utils/axiosMain';
import axios from 'axios';
import { ProductContext } from '../context/ProductContext';
import { Ara, Takvim, Down } from '../res/images';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuthDefault } from '../components/DefaultUser';

const EditTahsilatTediyeModal = ({ selectedProduct, modalVisible, setModalVisible, }) => {
  const { defaults } = useAuthDefault();
  const [cha_kasa_hizkod, setCha_kasa_hizkod] = useState('');
  const { addedProducts, setAddedProducts } = useContext(ProductContext);
  const [cha_kasa_isim, setCha_kasa_isim] = useState('');
  const [sck_TCMB_Banka_adi, setSck_TCMB_Banka_adi] = useState('');
  const [sck_TCMB_Banka_kodu, setSck_TCMB_Banka_kodu] = useState('');
  const [sck_TCMB_Sube_adi, setSck_TCMB_Sube_adi] = useState('');
  const [sck_TCMB_Sube_kodu, setSck_TCMB_Sube_kodu] = useState('');
  const [sck_TCMB_il_kodu, setSck_TCMB_il_kodu] = useState('');
  const [borcluIsim, setBorcluIsim] = useState('');
  const [cha_aciklama, setCha_aciklama] = useState('');
  const [hesapNo, setHesapNo] = useState('');
  const [cekNo, setCekNo] = useState('');
  const [kesideYeri, setKesideYeri] = useState('');
  const [tasrami, setTasrami] = useState(false);
  const [cha_meblag, setCha_meblag] = useState('');
  const [isCarrierModalVisible, setIsCarrierModalVisible] = useState(false);
  const [isTcmbModalVisible, setIsTcmbModalVisible] = useState(false);
  const [pickerValue, setPickerValue] = useState('Kendisi');
  const [date, setDate] = useState(new Date());
  const [adatVadesi, setAdatVadesi] = useState(new Date());
  const [showAdatDatePicker, setShowAdatDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(selectedProduct || {});
  const [nakitKodlariList, setNakitKodlariList] = useState([]);
  const [tcmbKodlariList, setTcmbKodlariList] = useState([]);

  useEffect(() => {
    const fetchNakitKodlariList = async () => {
      try {
        if (defaults) {
          const firmaNo = defaults[0].IQ_FirmaNo;
        const response = await axiosLinkMain.get(`/Api/Kasa/Kasalar?firmano=${firmaNo}&tip=Çek%20Kasası`);
        setNakitKodlariList(response.data);
      } else {
        console.error('IQ_FirmaNo değeri bulunamadı');
      }
      } catch (error) {
        console.error('Error fetching carrier list:', error);
      }
    };

    fetchNakitKodlariList();
  }, [defaults]);

  useEffect(() => {
    const fetchTcmbKodlariList = async () => {
      try {
        const response = await axiosLinkMain.get('/Api/Banka/YerelBankaKodlari');
        setTcmbKodlariList(response.data);
      } catch (error) {
        console.error('Error fetching carrier list:', error);
      }
    };

    fetchTcmbKodlariList();
  }, []);
  
  useEffect(() => {
    if (selectedProduct) {
      const parseCustomDate = (dateString) => {
        if (!dateString || dateString.length !== 8) {
          console.warn('Invalid date string format:', dateString);
          return new Date(); // Geçersiz tarih için varsayılan tarih döndür
        }

        const day = dateString.substring(0, 2);
        const month = dateString.substring(2, 4);
        const year = dateString.substring(4, 8);

        const formattedDateString = `${year}-${month}-${day}`; // ISO formatına dönüştürüyoruz
        const parsedDate = new Date(formattedDateString);

        if (isNaN(parsedDate.getTime())) {
          console.warn('Failed to parse date:', formattedDateString);
          return new Date(); // Geçersiz tarih için varsayılan tarih döndür
        }

        return parsedDate;
      };

      setCha_kasa_hizkod(selectedProduct.cha_kasa_hizkod || '');
      setCha_kasa_isim(selectedProduct.cha_kasa_isim || '');
      setSck_TCMB_Banka_adi(selectedProduct.sck_TCMB_Banka_adi || '');
      setSck_TCMB_Banka_kodu(selectedProduct.sck_TCMB_Banka_kodu || '');
      setSck_TCMB_Sube_adi(selectedProduct.sck_TCMB_Sube_adi || '');
      setSck_TCMB_Sube_kodu(selectedProduct.sck_TCMB_Sube_kodu || '');
      setSck_TCMB_il_kodu(selectedProduct.sck_TCMB_il_kodu || '');
      setBorcluIsim(selectedProduct.borcluIsim || '');
      setCha_aciklama(selectedProduct.cha_aciklama || '');
      setHesapNo(selectedProduct.hesapNo || '');
      setCekNo(selectedProduct.cekNo || '');
      setKesideYeri(selectedProduct.kesideYeri || '');
      setTasrami(selectedProduct.tasrami || false);
      setDate(selectedProduct.date ? parseCustomDate(selectedProduct.date) : new Date());
      setAdatVadesi(selectedProduct.adatVadesi ? parseCustomDate(selectedProduct.adatVadesi) : new Date());
      setCha_meblag(selectedProduct.cha_meblag || '');
      setPickerValue(selectedProduct.pickerValue);
    }
  }, [selectedProduct]);

  const handleCarrierSelect = (item) => {
    setCha_kasa_hizkod(item.Kod);
    setCha_kasa_isim(item.Isim); 
    setIsCarrierModalVisible(false); 
  };

  const handleTcmbSelect = (item) => {
    setSck_TCMB_Banka_adi(item.BANKA_ADI);  
    setSck_TCMB_Banka_kodu(item.BANKA_KODU);  
    setSck_TCMB_Sube_adi(item.BANKA_SUBE_ADI);
    setSck_TCMB_Sube_kodu(item.BANKA_SUBE_KODU);
    setSck_TCMB_il_kodu(item.BANKA_IL_KODU);
    setIsTcmbModalVisible(false); 
  };

  const formatDate = (date) => {
    if (!date || isNaN(new Date(date))) return ''; 
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); 
    const year = d.getFullYear();
    return `${day}${month}${year}`;
  };
  
  

  const handleUpdate = () => {
    
    setAddedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              cha_aciklama,
              cha_kasa_hizkod,
              cha_kasa_isim,
              sck_TCMB_Banka_adi,
              sck_TCMB_Banka_kodu,
              sck_TCMB_Sube_adi,
              sck_TCMB_Sube_kodu,
              sck_TCMB_il_kodu,
              borcluIsim,
              hesapNo,
              cekNo,
              kesideYeri,
              tasrami,
              adatVadesi: formatDate(adatVadesi),
              date: formatDate(date),
              cha_meblag,
              pickerValue,
            }
          : product
      )
    );
   
    setModalVisible(false);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

    return (
      <Modal visible={modalVisible} transparent={true} animationType="slide" onRequestClose={handleClose}>
        <ScrollView style={{ backgroundColor: 'white' }}>
          <SafeAreaView style={MainStyles.modalContainer}>
            <View style={MainStyles.modalContent}>
              <Text style={MainStyles.modalTahsilatTitle}>Tahsilat Tediye Güncelleme</Text>
  
              {/* Picker */}
              <View style={MainStyles.inputStyle}>
                <Picker
                  selectedValue={pickerValue}
                  onValueChange={(itemValue) => setPickerValue(itemValue)}
                  itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
                >
                  <Picker.Item label="Kendisi" value="Kendisi" />
                  <Picker.Item label="Müşterisi" value="Müşterisi" />
                </Picker>
              </View>
  
             {/* Date Picker */}
            <View style={MainStyles.datePickerContainer}>
              <Text style={MainStyles.dateTitle}>Tarih</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} >
                <View style={MainStyles.dateContainer}>
                  <Takvim name="calendar-today" style={MainStyles.dateIcon} />
                  <Text style={MainStyles.dateText}>{formatDate(date)}</Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);  // Picker'ı kapat
                    setDate(selectedDate || date);
                  }}
                />
              )}
            </View>
  
               {/* Kasa Banka Kodu */}
            <View style={MainStyles.musteriCekiBanka}>
            <Text style={MainStyles.dateTitle}>Kasa Banka Kodu</Text>
            <View style={MainStyles.inputContainer}>
              <TextInput
                style={MainStyles.inputCariKodu}
                placeholder="Kasa Banka Kodu"
                placeholderTextColor={colors.placeholderTextColor}
                value={cha_kasa_hizkod}
                onChangeText={setCha_kasa_hizkod}
              />
              <TouchableOpacity
                style={MainStyles.buttonCariKodu}
                onPress={() => setIsCarrierModalVisible(true)}
              >
                <Text><Ara/></Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={MainStyles.input}
              placeholder="Kasa Banka İsmi"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_kasa_isim}
              onChangeText={setCha_kasa_isim}
            />
            </View>

             {/* Kasa Banka Kodu */}
             <View style={MainStyles.musteriCekiBanka}>
             <Text style={MainStyles.dateTitle}>TCMB Banka Kodu</Text>
            <View style={MainStyles.inputContainer}>
              <TextInput
                style={MainStyles.inputCariKodu}
                placeholder="TCMB Banka Adi"
                placeholderTextColor={colors.placeholderTextColor}
                value={sck_TCMB_Banka_adi}
                onChangeText={setSck_TCMB_Banka_adi}
              />
              <TouchableOpacity
                style={MainStyles.buttonCariKodu}
                onPress={() => setIsTcmbModalVisible(true)}
              >
                <Text><Ara/></Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={MainStyles.input}
              placeholder="Banka Şubesi"
              placeholderTextColor={colors.placeholderTextColor}
              value={sck_TCMB_Sube_adi}
              onChangeText={setSck_TCMB_Sube_adi}
            />
            </View>
  
              {/* Other Inputs */}
              <TextInput style={MainStyles.input} placeholder="Borçlu İsim" placeholderTextColor="#999" value={borcluIsim} onChangeText={setBorcluIsim} />
              <TextInput style={MainStyles.input} placeholder="Açıklama" placeholderTextColor="#999" value={cha_aciklama} onChangeText={setCha_aciklama} />
              {/* 
                <TextInput style={MainStyles.input} placeholder="Hesap No" placeholderTextColor="#999" value={hesapNo} onChangeText={setHesapNo} />
                <TextInput style={MainStyles.input} placeholder="Çek No" placeholderTextColor="#999" value={cekNo} onChangeText={setCekNo} />
                <TextInput style={MainStyles.input} placeholder="Keside Yeri" placeholderTextColor="#999" value={kesideYeri} onChangeText={setKesideYeri} />
              */}
              {/* Checkbox for Taşra Mı */}
              <View style={MainStyles.checkboxContainer}>
                <Text>Taşra mı?</Text>
                <CheckBox
                  value={tasrami === 1} // Check if tasrami is 1 to make the checkbox selected
                  onValueChange={(newValue) => setTasrami(newValue ? 1 : 0)} // Update tasrami based on checkbox state
                />
              </View>

  
          {/* Adat Date Picker */}
            <View style={MainStyles.datePickerContainer}>
              <Text style={MainStyles.dateTitle}>Adat Vadesi</Text>
              <TouchableOpacity onPress={() => setShowAdatDatePicker(true)}>
                <View style={MainStyles.dateContainer}>
                  <Takvim name="calendar-today" style={MainStyles.dateIcon} />
                  <Text style={MainStyles.dateText}>{formatDate(adatVadesi)}</Text>
                </View>
              </TouchableOpacity>
              {showAdatDatePicker && (
              <DateTimePicker
              value={adatVadesi}
              mode="date"
              display="default"
              onChange={(_, selectedDate) => {
                setShowAdatDatePicker(false); // Picker'ı kapat
                if (selectedDate) {
                  setAdatVadesi(selectedDate); // Tarih seçildiyse güncelle
                }
              }}
            />
            
              )}
            </View>

              <TextInput
              style={MainStyles.input}
              placeholder="Tutar"
              placeholderTextColor="#999"
              value={cha_meblag}
              onChangeText={setCha_meblag}
              keyboardType="numeric"
            />


            <Modal
              visible={isCarrierModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsCarrierModalVisible(false)}
             >
              <View style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                  <Text style={MainStyles.modalTitle}>Kasa Kodları</Text>
                  <FlatList
                    data={nakitKodlariList}
                    keyExtractor={(item, index) => `${item.Kod}_${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={MainStyles.modalItem}
                        onPress={() => handleCarrierSelect(item)}
                      >
                        <Text style={MainStyles.modalItemText}>{item.Kod} - {item.Isim}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    style={MainStyles.closeButton}
                    onPress={() => setIsCarrierModalVisible(false)}
                  >
                    <Text style={MainStyles.addButtonText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <Modal
              visible={isTcmbModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsTcmbModalVisible(false)}
             >
              <View style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                  <Text style={MainStyles.modalTitle}>TCMB Banka Kodu</Text>
                  <FlatList
                    data={tcmbKodlariList}
                    keyExtractor={(item, index) => `${item.BankaKod}_${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={MainStyles.modalItem}
                        onPress={() => handleTcmbSelect(item)}
                      >
                        <Text style={MainStyles.modalItemText}>{item.BANKA_KODU} - {item.BANKA_SUBE_KODU} - {item.BANKA_ADI} - {item.BANKA_SUBE_ADI} - {item.BANKA_IL_ADI}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    style={MainStyles.closeButton}
                    onPress={() => setIsTcmbModalVisible(false)}
                  >
                    <Text style={MainStyles.addButtonText}>Kapat</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
  
              {/* Ekle Button */}
              <TouchableOpacity style={MainStyles.addButton} onPress={handleUpdate}>
                <Text style={MainStyles.addButtonText}>Güncelle</Text>
              </TouchableOpacity>
  
              {/* Kapat Button */}
              <TouchableOpacity style={MainStyles.closeButton} onPress={handleClose}>
                <Text style={MainStyles.addButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      </Modal>
    );
  };
  
  export default EditTahsilatTediyeModal;