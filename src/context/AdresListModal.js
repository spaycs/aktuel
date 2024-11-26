// AdresListModal.js
import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, SafeAreaView } from 'react-native';
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
      <SafeAreaView style={MainStyles.modalContainer}>
                <View style={MainStyles.modalContent}>
                    <View >
                      <Text style={MainStyles.modalTitle}>Adres Listesi</Text>
                    </View>
                    <TouchableOpacity style={{position :'absolute', marginTop: 2, marginLeft: 10}} onPress={onClose}>
                    <Left width={17} height={17}/>
                    </TouchableOpacity>
                  <View style={MainStyles.modalContent}>
          <FlatList
            data={adresList}
            renderItem={renderAdresItem}
            keyExtractor={item => item.Adres_No.toString()} 
          />
        </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default AdresListModal;
