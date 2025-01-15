// AdresListModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { MainStyles } from '../res/style';
import { Left } from '../res/images';
import CustomHeader from '../components/CustomHeader';

// AdresListModal bileşeni tanımlanıyor
const AdresListModal = ({ isVisible, onClose, adresList, onSelect }) => {

  // Adres öğelerini listelemek için render edilen öğe
  const renderAdresItem = ({ item }) => (
    <TouchableOpacity onPress={() => onSelect(item)} style={MainStyles.modalItem}> 
      <Text style={MainStyles.modalItemText}>{item.Adres}</Text>
      <Text style={MainStyles.modalSubItemText}>{`${item.Il}, ${item.Ilce}`}</Text> 
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={MainStyles.modalContainerDetail}>
        <CustomHeader
          title="Adres Listesi"
          onClose={onClose}
        />
          <View style={MainStyles.modalContent}>
              <FlatList
                data={adresList}
                renderItem={renderAdresItem}
                keyExtractor={item => item.Adres_No.toString()} 
              />
          </View>
      </View>
    </Modal>
  );
};

export default AdresListModal;
