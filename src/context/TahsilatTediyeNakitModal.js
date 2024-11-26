import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, FlatList, Alert, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axiosLinkMain from '../utils/axiosMain';
import { ProductContext } from '../context/ProductContext';
import { Ara, Left, Takvim } from '../res/images';
import { useAuthDefault } from '../components/DefaultUser';
import { useAuth } from '../components/userDetail/Id';

const TahsilatTediyeNakitModal = ({ isModalVisible, setIsModalVisible }) => {
  const { authData } = useAuth();
  const { defaults } = useAuthDefault();
  const [normalTipi, setNormalTipi] = useState('');
  const { addedProducts, setAddedProducts } = useContext(ProductContext);
  const [date, setDate] = useState(new Date());
  const [cha_aciklama, setCha_aciklama] = useState('');
  const [cha_meblag, setCha_meblag] = useState('1');
  const [cha_kasa_hizkod, setCha_kasa_hizkod] = useState('');
  const [cha_kasa_isim, setCha_kasa_isim] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isCarrierModalVisible, setIsCarrierModalVisible] = useState(false);
  const [nakitKodlariList, setNakitKodlariList] = useState([]);
  const [isEditable, setIsEditable] = useState(false);

   // Nakit Kodları Listesini API'den Fetch Etme
    useEffect(() => {
      const fetchNakitKodlariList = async () => {
        try {
          // IQ_FirmaNo kontrolü yapıyoruz, mevcut olduğundan emin oluyoruz
          if (defaults) {
            const firmaNo = defaults[0].IQ_FirmaNo;
            const response = await axiosLinkMain.get(`/Api/Kasa/Kasalar?firmano=${firmaNo}&tip=Nakit%20kasası`);
            setNakitKodlariList(response.data);
          } else {
            console.error('IQ_FirmaNo değeri bulunamadı');
          }
        } catch (error) {
          console.error('Nakit kodları listesini çekerken hata oluştu:', error);
        }
      };

      fetchNakitKodlariList();
    }, [defaults]); // defaults değiştiğinde yeniden çalışır

  const handleDetaySelect = (carrier) => {
    setCha_kasa_hizkod(carrier.Kod);
    setCha_kasa_isim(carrier.Isim);
    setIsCarrierModalVisible(false);
  };

  const handleAddProduct = () => {
    // Tutar alanı boşsa ekleme işlemini durdur
    if (!cha_meblag || parseFloat(cha_meblag) <= 0) {
      Alert.alert("Uyarı",'Lütfen geçerli bir tutar girin.');
      return;
    }

    const formattedDate = formatDate(date).replace(/\./g, '');
    const newProductId = `${cha_kasa_hizkod}_${formattedDate}_${Date.now()}`;
  
    const newProduct = {
      id: newProductId,
      cha_aciklama,
      cha_meblag,
      cha_kasa_isim,
      date: formattedDate,
      tediyeturu: "Nakit",
      cha_kasa_hizmet: 4,
      sth_cari_cinsi: 0,
      cha_cinsi: 0,
      cha_kasa_hizkod,
      cha_sntck_poz: 0,
      cha_karsidgrupno: 0,
    };
  
    setAddedProducts([
      ...addedProducts,
      newProduct,
    ]);
    setIsModalVisible(false);

    setCha_aciklama('');
  setCha_meblag('');
  setCha_kasa_hizkod('');
  setCha_kasa_isim('');
  };
  
  
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}.${month}.${year}`; 
  };
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    const newDate = selectedDate || date;
    setDate(newDate);
  
    const formattedDate = formatDate(newDate);
    setFaturaBilgileri(prevState => ({
      ...prevState,
      date: formattedDate,
    }));
  };

  return (
    <Modal
      visible={isModalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setIsModalVisible(false)}
    >
      <ScrollView style={{ backgroundColor: 'white' }}>
        <SafeAreaView style={MainStyles.modalContainer}>
          <View style={MainStyles.modalContent}>
            <Text style={MainStyles.modalTahsilatTitle}>Nakit Tahsilat</Text>
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
                  value={date}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                />
              )}
            </View>
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
                onPress={() => setIsCarrierModalVisible(true)}
              >
                <Text><Ara/></Text>
              </TouchableOpacity>
            </View>
            <Text style={MainStyles.formTitle}>Kasa Banka İsmi</Text>
            <TextInput
              style={MainStyles.inputCariKodu}
              placeholder="Kasa Banka İsmi"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_kasa_isim}
              onChangeText={setCha_kasa_isim}
            />
            <Text style={MainStyles.formTitle}>Açıklama</Text>
            <TextInput
              style={MainStyles.inputCariKodu}
              placeholder="Açıklama"
              placeholderTextColor={colors.placeholderTextColor}
              value={cha_aciklama}
              onChangeText={setCha_aciklama}
            />
            <Text style={MainStyles.formTitle}>Tutar</Text>
            <TextInput
              style={MainStyles.inputCariKodu}
              placeholder="Tutar"
              placeholderTextColor={colors.placeholderTextColor}
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
            <TouchableOpacity
              style={MainStyles.addButton}
              onPress={handleAddProduct}
            >
              <Text style={MainStyles.addButtonText}>Ekle</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{position :'absolute', marginTop: 12, marginLeft: 10}}  onPress={() => setIsModalVisible(false)}>
            <Left width={17} height={17}/>
            </TouchableOpacity>

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
                        onPress={() => handleDetaySelect(item)}
                      >
                        <Text style={MainStyles.modalItemText}>{item.Kod} - {item.Isim}</Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity style={{position :'absolute', marginTop: 12, marginLeft: 10}}  onPress={() => setIsCarrierModalVisible(false)}>
                  <Left width={17} height={17}/>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </View>
        </SafeAreaView>
      </ScrollView>
    </Modal>
  );
};

export default TahsilatTediyeNakitModal;
