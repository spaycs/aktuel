import React, { useContext, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, ScrollView, Alert, FlatList, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MainStyles } from '../res/style/MainStyles';
import { colors } from '../res/colors';
import axios from 'axios';
import { ProductContext } from '../context/ProductContext';
import { Ara, Takvim } from '../res/images';

const EditDepolarArasiProductModal = ({ selectedProduct, modalVisible, setModalVisible, }) => {
  const { addedProducts, setAddedProducts } = useContext(ProductContext);
  const [sth_miktar, setSth_miktar] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      setSth_miktar(selectedProduct.sth_miktar.toString());
    }
  }, [selectedProduct]);
  
  const handleUpdate = () => {
    setAddedProducts((prevProducts) =>
      prevProducts.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              sth_miktar: sth_miktar,
            }
          : product
      )
    );
    setSth_miktar('');
   
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
              <Text style={MainStyles.modalTahsilatTitle}>Miktar Güncelleme</Text>
         
              <TextInput
              style={MainStyles.productModalMiktarInput}
              placeholder="Miktar"
              placeholderTextColor="#999"
              value={sth_miktar}
              onChangeText={setSth_miktar}
              keyboardType="numeric"  
            />

  
              {/* Ekle Button */}
              <TouchableOpacity style={MainStyles.addButton} onPress={handleUpdate}>
                <Text style={MainStyles.addButtonText}>Güncelle</Text>
              </TouchableOpacity>
  
              {/* Kapat Button */}
              <TouchableOpacity style={MainStyles.closeOnizlemeButton} onPress={handleClose}>
                <Text style={MainStyles.addButtonText}>Kapat</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </ScrollView>
      </Modal>
    );
  };
  
  export default EditDepolarArasiProductModal;