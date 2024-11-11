import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { MainStyles } from '../../res/style';
import AlinanSiparisProductList from '../../context/AlinanSiparisProductList';


const AlinanSiparisUrunList = () => {
 
  return (
     <View style={{ flex: 1 }}>
      <AlinanSiparisProductList />
    </View>
  );
};

export default AlinanSiparisUrunList;
