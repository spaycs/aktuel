// AdresListModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { MainStyles } from '../res/style';
import { Left } from '../res/images';

const AdresListModal = ({ isVisible, onClose, adresList, onSelect }) => {
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
    <View style={[MainStyles.modalContainer, MainStyles.marginBottom10]}>
        <View>
            <Text style={[MainStyles.fontSize16, MainStyles.fontWeightBold, MainStyles.textAlignCenter, MainStyles.textColorBlack]}>Adres Listesi</Text>
        </View>
        <TouchableOpacity style={{ position: 'absolute',marginTop: 25, marginLeft: 10}} onPress={onClose}>
        <Left width={17} height={17}/>
        </TouchableOpacity>
        <View style={[MainStyles.modalContainer, MainStyles.marginBottom10]}>
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
