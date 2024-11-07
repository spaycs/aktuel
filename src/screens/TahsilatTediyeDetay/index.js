import React, { useState, useContext, useEffect } from 'react';
import { View, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../../res/style';
import TahsilatTediyeNakitModal from '../../context/TahsilatTediyeNakitModal';
import TahsilatTediyeMusteriCekiModal from '../../context/TahsilatTediyeMusteriCekiModal';
import TahsilatTediyeKrediKartiModal from '../../context/TahsilatTediyeKrediKartiModal';
import TahsilatTediyeMusteriSenediModal from '../../context/TahsilatTediyeMusteriSenediModal';
import { ProductContext } from '../../context/ProductContext';

const TahsilatTediyeDetay = ({ sth_evraktip }) => {  // Pass sth_evraktip as a prop or get it from context
    const [selectedPaymentType, setSelectedPaymentType] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMusteriCekiModalVisible, setIsMusteriCekiModalVisible] = useState(false);
    const [isMusteriKrediKartiModalVisible, setIsMusteriKrediKartiModalVisible] = useState(false);
    const [isMusteriSenediModalVisible, setIsMusteriSenediModalVisible] = useState(false);
    const [firmaCekiValue, setFirmaCekiValue] = useState(''); 
    const [firmaSenediValue, setFirmaSenediValue] = useState(''); 
    const { addedProducts, setAddedProducts, faturaBilgileri, setFaturaBilgileri } = useContext(ProductContext);
  
    const handlePickerChange = (itemValue) => {
        setSelectedPaymentType(itemValue);
        // Modal visibility based on selected payment type
        setIsModalVisible(itemValue === 'Nakit');
        setIsMusteriCekiModalVisible(itemValue === 'Müşteri Çeki');
        setIsMusteriKrediKartiModalVisible(itemValue === 'Müşteri Kredi Kartı');
        setIsMusteriSenediModalVisible(itemValue === 'Müşteri Senedi');

        if (itemValue === 'Firma Çeki') {
            setFirmaCekiValue('Firma Çeki'); // Burada gerekli değeri ayarlayın
            // Müşteri Çeki modalını açıyoruz
            setIsMusteriCekiModalVisible(true);
        } else {
            setFirmaCekiValue(''); // Diğer durumlarda değeri sıfırla
        }

        if (itemValue === 'Firma Senedi') {
            setFirmaSenediValue('Firma Senedi'); // Burada gerekli değeri ayarlayın
            // Firma Senedi modalını açıyoruz
            setIsMusteriSenediModalVisible(true);
        } else {
            setFirmaSenediValue(''); // Diğer durumlarda değeri sıfırla
        }
    };

    const paymentOptions = faturaBilgileri.sth_evraktip === 1
        ? [
            { label: "Nakit", value: "Nakit" },
            { label: "Müşteri Çeki", value: "Müşteri Çeki" },
            { label: "Müşteri Kredi Kartı", value: "Müşteri Kredi Kartı" },
            { label: "Müşteri Senedi", value: "Müşteri Senedi" }
          ]
        : [
            { label: "Nakit", value: "Nakit" },
            { label: "Firma Çeki", value: "Firma Çeki" },
            { label: "Firma Kredi Kartı", value: "Müşteri Kredi Kartı" },
            { label: "Firma Senedi", value: "Firma Senedi" }
          ];

    return (
        <ScrollView style={MainStyles.faturaContainerMenu}>
            <View style={MainStyles.faturaContainer}>
                <View style={MainStyles.inputStyle}>
                    <Picker
                        selectedValue={selectedPaymentType}
                        itemStyle={{height:40, fontSize: 12 }} style={{ marginHorizontal: -10 }} 
                        onValueChange={handlePickerChange}
                    >
                        <Picker.Item label="Seçiniz" value="Seçiniz" />
                        {paymentOptions.map(option => (
                            <Picker.Item key={option.value} label={option.label} value={option.value} />
                        ))}
                    </Picker>
                </View>
  
                {/* Modal Components */}
                {isModalVisible && <TahsilatTediyeNakitModal isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />}
                {isMusteriCekiModalVisible && <TahsilatTediyeMusteriCekiModal isModalVisible={isMusteriCekiModalVisible} setIsModalVisible={setIsMusteriCekiModalVisible}  firmaCekiValue={firmaCekiValue}/>}
                {isMusteriSenediModalVisible && <TahsilatTediyeMusteriSenediModal isModalVisible={isMusteriSenediModalVisible} setIsModalVisible={setIsMusteriSenediModalVisible} firmaSenediValue={firmaSenediValue}/>}
                {isMusteriKrediKartiModalVisible && <TahsilatTediyeKrediKartiModal isModalVisible={isMusteriKrediKartiModalVisible} setIsModalVisible={setIsMusteriKrediKartiModalVisible} />}
            </View>
        </ScrollView>
    );
};

export default TahsilatTediyeDetay;
