import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { MainStyles } from '../../res/style';
import ProductList from '../../context/ProductList';


const AlinanSiparisUrunList = () => {
 
  return (
     <View style={{ flex: 1 }}>
      <ProductList />
    </View>
  );
};

export default AlinanSiparisUrunList;
