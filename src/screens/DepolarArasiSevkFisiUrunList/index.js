import React, { useState, useCallback, useEffect, useContext } from 'react';
import { View, Alert, TextInput, TouchableOpacity, Text, FlatList, Image } from 'react-native';
import { MainStyles } from '../../res/style';
import DepolarArasiProductList from '../../context/DepolarArasiProductList';


const DepolarArasiSevkFisiBilgisiUrunList = () => {
 
  return (
     <View style={{ flex: 1 }}>
      <DepolarArasiProductList />
    </View>
  );
};

export default DepolarArasiSevkFisiBilgisiUrunList;
