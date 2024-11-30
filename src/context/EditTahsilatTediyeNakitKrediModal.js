import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, FlatList, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axiosLinkMain from '../utils/axiosMain';
import axios from 'axios';
import { ProductContext } from '../context/ProductContext';
import { Ara, Takvim } from '../res/images';
import CheckBox from '@react-native-community/checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import CustomHeader from '../components/CustomHeader';
import { useAuthDefault } from '../components/DefaultUser';

const EditTahsilatTediyeNakitKrediModal = ({ selectedProduct, modalVisible, setModalVisible, tediyeturu }) => {
  const [cha_kasa_hizkod, setCha_kasa_hizkod] = useState('');
  const { defaults } = useAuthDefault();
  const { addedProducts, setAddedProducts } = useContext(ProductContext);
  const [cha_kasa_isim, setCha_kasa_isim] = useState('');
  const [cha_aciklama, setCha_aciklama] = useState('');
  const [cha_meblag, setCha_meblag] = useState('');
  const [isCarrierModalVisible, setIsCarrierModalVisible] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showAdatDatePicker, setShowAdatDatePicker] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [updatedProduct, setUpdatedProduct] = useState(selectedProduct || {});
  const [nakitKodlariList, setNakitKodlariList] = useState([]);
  const [krediKodlariList, setKrediKodlariList] = useState([]);
  const [kodlariList, setKodlariList] = useState([]);

  const fetchKodlariList = async () => {
    try {
      if (defaults) {
        const firmaNo = defaults[0].IQ_FirmaNo;
  
        if (selectedProduct.tediyeturu === 'Nakit') {
          const response = await axiosLinkMain.get(`/Api/Kasa/Kasalar?firmano=${firmaNo}&tip=Nakit%20kasası`);
          setNakitKodlariList(response.data);
        } else if (selectedProduct.tediyeturu === 'Kredi Karti') {
          const response = await axiosLinkMain.get('/Api/Banka/YerelBankaKodlari');
          setKrediKodlariList(response.data);
        }
      } else {
        console.error('IQ_FirmaNo değeri bulunamadı');
      }
    } catch (error) {
      console.error('Error fetching kod list:', error);
    }
  };
  

  const handleCarrierSelect = (item) => {
    setCha_kasa_hizkod(item.Kod || item.BANKA_KODU);
    setCha_kasa_isim(item.Isim || `${item.BANKA_SUBE_KODU} - ${item.BANKA_ADI} - ${item.BANKA_SUBE_ADI}`);
    setIsCarrierModalVisible(false);
  };

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
      setCha_aciklama(selectedProduct.cha_aciklama || '');
      setDate(selectedProduct.date ? parseCustomDate(selectedProduct.date) : new Date());
      setCha_meblag(selectedProduct.cha_meblag || '');
    }
  }, [selectedProduct]);



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
              date: formatDate(date),
              cha_meblag,
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
         <View style={MainStyles.modalContainerDetail}>
          <CustomHeader
            title="Nakit & Kredi Kartı Güncelleme"
            onClose={() => handleClose()}
          />
  
             {/* Date Picker */}
            <View style={MainStyles.modalContent}>
              <Text style={MainStyles.formTitle}>Tarih</Text>
              <View style={MainStyles.datePickerContainer}>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} >
                <View style={MainStyles.dateContainer}>
                  <Takvim name="calendar-today" style={MainStyles.dateIcon} />
                  <Text style={MainStyles.dateText}>{formatDate(date)}</Text>
                </View>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                style={{position: 'absolute', backgroundColor: colors.textinputgray}}
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
            <Text style={MainStyles.formTitle}>Kasa Banka Kodu</Text>
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
                  onPress={() => {
                    setIsCarrierModalVisible(true);
                    fetchKodlariList(); // Kodları listele
                  }}
                >
                <Text><Ara/></Text>
              </TouchableOpacity>
            </View>

            <Text style={MainStyles.formTitle}>Kasa Banka İsmi</Text>
            <TextInput
              style={MainStyles.inputStokKodu}
              placeholder="Kasa Banka İsmi"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_kasa_isim}
              onChangeText={setCha_kasa_isim}
            />

            <Text style={MainStyles.formTitle}>Açıklama</Text>
              <TextInput style={MainStyles.inputStokKodu} placeholder="Açıklama" placeholderTextColor="#999" value={cha_aciklama} onChangeText={setCha_aciklama} />
              <Text style={MainStyles.formTitle}>Tutar</Text>
              <TextInput
              style={MainStyles.inputStokKodu}
              placeholder="Tutar"
              placeholderTextColor="#999"
              value={cha_meblag}
              keyboardType="numeric"
              onChangeText={(value) => {
                // Virgülü noktaya çevir
                const formattedValue = value.replace(',', '.');

                // Sadece rakamlar ve . (nokta) karakteri kabul edilsin
                const validValue = formattedValue.replace(/[^0-9.]/g, '');

                // Eğer birden fazla . (nokta) varsa, sonrasını kabul etme
                const finalValue = validValue.split('.').length > 2 ? validValue.slice(0, -1) : validValue;

                setCha_meblag(finalValue);
              }}
            />

<Modal
              visible={isCarrierModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsCarrierModalVisible(false)}
            >
               <View style={MainStyles.modalContainerDetail}>
              <CustomHeader
                title="Kasa Kodları"
                onClose={() => setIsCarrierModalVisible(false)}
              />
                <View style={MainStyles.modalContent}>
                  <FlatList
                    data={selectedProduct?.tediyeturu === 'Nakit' ? nakitKodlariList : krediKodlariList}
                    keyExtractor={(item, index) => `${item.Kod || item.BANKA_KODU}_${index}`}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={MainStyles.modalItem}
                        onPress={() => handleCarrierSelect(item)}
                      >
                        <Text style={MainStyles.modalItemText}>
                          {selectedProduct?.tediyeturu === 'Nakit' 
                            ? `${item.Kod} - ${item.Isim}` 
                            : `${item.BANKA_SUBE_KODU} - ${item.BANKA_SUBE_ADI}`
                          }
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
               
                </View>
              </View>
            </Modal>

  
              {/* Ekle Button */}
              <TouchableOpacity style={MainStyles.addButton} onPress={handleUpdate}>
                <Text style={MainStyles.addButtonText}>Güncelle</Text>
              </TouchableOpacity>
          </View>
          </View>
      </Modal>
    );
  };
  
  export default EditTahsilatTediyeNakitKrediModal;