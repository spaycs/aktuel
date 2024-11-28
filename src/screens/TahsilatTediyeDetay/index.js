import React, { useState, useContext } from 'react';
import { View, ScrollView, Text, TouchableOpacity } from 'react-native';
import { MainStyles } from '../../res/style';
import TahsilatTediyeNakitModal from '../../context/TahsilatTediyeNakitModal';
import TahsilatTediyeMusteriCekiModal from '../../context/TahsilatTediyeMusteriCekiModal';
import TahsilatTediyeKrediKartiModal from '../../context/TahsilatTediyeKrediKartiModal';
import TahsilatTediyeMusteriSenediModal from '../../context/TahsilatTediyeMusteriSenediModal';
import { ProductContext } from '../../context/ProductContext';

const TahsilatTediyeDetay = ({ sth_evraktip }) => {
    const [selectedPaymentType, setSelectedPaymentType] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isMusteriCekiModalVisible, setIsMusteriCekiModalVisible] = useState(false);
    const [isMusteriKrediKartiModalVisible, setIsMusteriKrediKartiModalVisible] = useState(false);
    const [isMusteriSenediModalVisible, setIsMusteriSenediModalVisible] = useState(false);
    const [firmaCekiValue, setFirmaCekiValue] = useState('');
    const [firmaSenediValue, setFirmaSenediValue] = useState('');
    const { faturaBilgileri } = useContext(ProductContext);

    const handlePaymentTypeSelect = (type) => {
        setSelectedPaymentType(type);

        // Modal visibility based on selected payment type
        setIsModalVisible(type === 'Nakit');
        setIsMusteriCekiModalVisible(type === 'Müşteri Çeki' || type === 'Firma Çeki');
        setIsMusteriKrediKartiModalVisible(type === 'Müşteri Kredi Kartı');
        setIsMusteriSenediModalVisible(type === 'Müşteri Senedi' || type === 'Firma Senedi');

        if (type === 'Firma Çeki') {
            setFirmaCekiValue('Firma Çeki');
        } else {
            setFirmaCekiValue('');
        }

        if (type === 'Firma Senedi') {
            setFirmaSenediValue('Firma Senedi');
        } else {
            setFirmaSenediValue('');
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
                {/* Payment Options */}
                {paymentOptions.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            MainStyles.tahsilatButton, 
                            selectedPaymentType === option.value && MainStyles.tahsilatSelectedButton
                        ]}
                        onPress={() => handlePaymentTypeSelect(option.value)}
                    >
                        <Text style={MainStyles.tahsilatButtonText}>
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}

                {/* Modal Components */}
                {isModalVisible && (
                    <TahsilatTediyeNakitModal 
                        isModalVisible={isModalVisible} 
                        setIsModalVisible={setIsModalVisible} 
                    />
                )}
                {isMusteriCekiModalVisible && (
                    <TahsilatTediyeMusteriCekiModal 
                        isModalVisible={isMusteriCekiModalVisible} 
                        setIsModalVisible={setIsMusteriCekiModalVisible} 
                        firmaCekiValue={firmaCekiValue} 
                    />
                )}
                {isMusteriSenediModalVisible && (
                    <TahsilatTediyeMusteriSenediModal 
                        isModalVisible={isMusteriSenediModalVisible} 
                        setIsModalVisible={setIsMusteriSenediModalVisible} 
                        firmaSenediValue={firmaSenediValue} 
                    />
                )}
                {isMusteriKrediKartiModalVisible && (
                    <TahsilatTediyeKrediKartiModal 
                        isModalVisible={isMusteriKrediKartiModalVisible} 
                        setIsModalVisible={setIsMusteriKrediKartiModalVisible} 
                    />
                )}
            </View>
        </ScrollView>
    );
};

export default TahsilatTediyeDetay;
