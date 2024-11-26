import React, { useState, useContext, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, Text, Modal, FlatList, SafeAreaView } from 'react-native';
import { MainStyles } from '../../res/style';
import { ProductContext } from '../../context/ProductContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ara, Left, Takvim, TakvimVade } from '../../res/images';
import { colors } from '../../res/colors';
import axiosLinkMain from '../../utils/axiosMain';

const SatisIrsaliyesiDetay = () => {
  const { faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [isCarrierModalVisible, setIsCarrierModalVisible] = useState(false);
  const [carrierList, setCarrierList] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState(null);

  // Api Bağlantıları
    useEffect(() => {
      const fetchCarrierList = async () => {
        try {
          const response = await axiosLinkMain.get('/Api/TeslimTurleri/TeslimTurleri');
          setCarrierList(response.data);
        } catch (error) {
          console.error('Error fetching carrier list:', error);
        }
      };
    
      fetchCarrierList();
    }, []);
  // Api Bağlantıları

  // Sayfa Açıldığında Otomatik Çalışan Değerler
    useEffect(() => {
      const currentDate = new Date();
      const formattedDate = formatDate(currentDate);

      setDate(currentDate);
      setFaturaBilgileri(prevState => ({
        ...prevState,
        sth_tarih: formattedDate,
        sevkTarihi: formattedDate, 
        asilSevkTarihi: formattedDate
      }));
    }, []);
  // Sayfa Açıldığında Otomatik Çalışan Değerler

  // Tarih Seçimi
    const handleDateChange = (event, selectedDate) => {
      setShowDatePicker(false);
      const newDate = selectedDate || date;
      setDate(newDate);

      const formattedDate = formatDate(newDate);
      if (selectedField) {
        handleInputChange(selectedField, formattedDate);
        setSelectedField(null); 
      }
    };

    const formatDate = (date) => {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${day}.${month}.${year}`;
    };
  // Tarih Seçimi

  // Bilgileri Set Eden Alan
    const handleInputChange = (field, value) => {
      setFaturaBilgileri((prevFaturaBilgileri) => ({
        ...prevFaturaBilgileri,
        [field]: value,
      }));
    };

    const handleCarrierSelect = (carrier) => {
      handleInputChange('eir_tasiyici_firma_kodu', carrier.Kod);
      handleInputChange('tasiyiciFirmaUnvan', carrier.Adi);
      setIsCarrierModalVisible(false);
    };
  // Bilgileri Set Eden Alan

  return (
    <ScrollView style={MainStyles.faturaContainerMenu}>
      <View style={MainStyles.faturaContainer}>
      <View style={MainStyles.inputContainer}>
          <View style={MainStyles.datePickerContainerDetail}>
            <Text style={MainStyles.dateTitle}>Sevk Tarihi</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedField('sevkTarihi');
                setShowDatePicker(true);
              }}
            >
              <View style={MainStyles.dateContainer}>
                <TakvimVade width={20} height={20} name="calendar-today" style={MainStyles.dateIcon} />
                <Text style={MainStyles.dateText}>
                  {faturaBilgileri.sevkTarihi || formatDate(date)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={MainStyles.datePickerContainerDetail2}>
            <Text style={MainStyles.dateTitle}>Asıl Sevk Tarihi</Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedField('asilSevkTarihi'); 
                setShowDatePicker(true);
              }}
            >
              <View style={MainStyles.dateContainer}>
              <TakvimVade width={20} height={20} name="calendar-today" style={MainStyles.dateIcon} />
                <Text style={MainStyles.dateText}>
                  {faturaBilgileri.asilSevkTarihi || formatDate(date)}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
        <Text style={MainStyles.formTitle}>Taşıyıcı Firma Kodu</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputCariKodu}
            placeholder="Taşıyıcı Firma Kodu"
            placeholderTextColor={colors.placeholderTextColor}
            value={faturaBilgileri.eir_tasiyici_firma_kodu}
            onChangeText={(value) => handleInputChange('eir_tasiyici_firma_kodu', value)}
          />
          <TouchableOpacity
            style={MainStyles.buttonCariKodu}
            onPress={() => setIsCarrierModalVisible(true)}
          >
            <Ara/>
          </TouchableOpacity>
        </View>
        <Text style={MainStyles.formTitle}>Taşıyıcı Firma Ünvan</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputCariKodu}
            placeholder="Taşıyıcı Firma Ünvan"
            placeholderTextColor={colors.placeholderTextColor}
            value={faturaBilgileri.tasiyiciFirmaUnvan}
            editable={false}
          />
         <TouchableOpacity
            style={MainStyles.buttonCariKodu}
            onPress={() => setIsCarrierModalVisible(true)}
          >
            <Ara/>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isCarrierModalVisible}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setIsCarrierModalVisible(false)}
        >
          
          <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Taşıyıcı Firmalar</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={() => setIsCarrierModalVisible(false)}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
              <View style={MainStyles.modalContent}>
              <FlatList
                data={carrierList}
                keyExtractor={(item) => item.Kod.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={MainStyles.modalItem}
                    onPress={() => handleCarrierSelect(item)}
                  >
                    <Text style={MainStyles.modalItemTextDetay}>{item.Kod} </Text><Text style={MainStyles.modalItemText2}>{item.Adi}</Text>
                  </TouchableOpacity>
                )}
              />
             
            </View>
          </View>
          </SafeAreaView>
        </Modal>
        <Text style={MainStyles.formTitle}>Şöför Adı 1</Text> 
        <TextInput
          style={MainStyles.inputSatisIrsaliyesi}
          placeholder="Şöför Adı 1"
          placeholderTextColor={colors.placeholderTextColor}
          onChangeText={(value) => handleInputChange('eir_sofor_adi', value)}
        />
        <Text style={MainStyles.formTitle}>Şöför Soyadı 1</Text> 
        <TextInput
          style={MainStyles.inputSatisIrsaliyesi}
          placeholder="Şöför Soyadı 1"
          placeholderTextColor={colors.placeholderTextColor}
          onChangeText={(value) => handleInputChange('eir_sofor_soyadi', value)}
        />
        <Text style={MainStyles.formTitle}>Şöför Adı 2</Text> 
        <TextInput
          style={MainStyles.inputSatisIrsaliyesi}
          placeholder="Şöför Adı 2"
          placeholderTextColor={colors.placeholderTextColor}
          onChangeText={(value) => handleInputChange('eir_sofor2_adi', value)}
        />
        <Text style={MainStyles.formTitle}>Şöför Soyadı 2</Text> 
        <TextInput
          style={MainStyles.inputSatisIrsaliyesi}
          placeholder="Şöför Soyadı 2"
          placeholderTextColor={colors.placeholderTextColor}
          onChangeText={(value) => handleInputChange('eir_sofor2_soyadi', value)}
        />
        <Text style={MainStyles.formTitle}>Şöför Kimlik Bilgileri</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputSatisIrsaliyesiEvrakNo}
            placeholder="Şöför TCKN 1"
            keyboardType="numeric"
            placeholderTextColor={colors.placeholderTextColor}
            onChangeText={(value) => handleInputChange('eir_sofor_tckn', value)}
          />
          <TextInput
            style={MainStyles.inputSatisIrsaliyesiEvrakSira}
            placeholder="Şöför TCKN 2"
            keyboardType="numeric"
            placeholderTextColor={colors.placeholderTextColor}
            onChangeText={(value) => handleInputChange('eir_sofor2_tckn', value)}
          />
        </View>
        <Text style={MainStyles.formTitle}>Araç Plakası</Text> 
        <TextInput
          style={MainStyles.inputSatisIrsaliyesi}
          placeholder="Araç Plakası"
          placeholderTextColor={colors.placeholderTextColor}
          onChangeText={(value) => handleInputChange('eir_tasiyici_arac_plaka', value)}
        />
        <Text style={MainStyles.formTitle}>Dorse Plakası</Text> 
        <View style={MainStyles.inputContainer}>
          <TextInput
            style={MainStyles.inputSatisIrsaliyesiEvrakNo}
            placeholder="Dorse Plakası 1"
            placeholderTextColor={colors.placeholderTextColor}
            onChangeText={(value) => handleInputChange('eir_tasiyici_dorse_plaka1', value)}
          />
          <TextInput
            style={MainStyles.inputSatisIrsaliyesiEvrakSira}
            placeholder="Dorse Plakası 2"
            placeholderTextColor={colors.placeholderTextColor}
            onChangeText={(value) => handleInputChange('eir_tasiyici_dorse_plaka2', value)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SatisIrsaliyesiDetay;
