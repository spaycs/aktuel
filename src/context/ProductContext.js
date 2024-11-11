import { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [addedProducts, setAddedProducts] = useState([]);
  const [addedAlinanSiparisProducts, setAddedAlinanSiparisProducts] = useState([]);
  const [faturaBilgileri, setFaturaBilgileri] = useState({});
  const [alinanSiparis, setAlinanSiparis] = useState({});

  return (
    <ProductContext.Provider
      value={{
        addedProducts,
        setAddedProducts,
        addedAlinanSiparisProducts,
        setAddedAlinanSiparisProducts,
        faturaBilgileri,
        setFaturaBilgileri,
        alinanSiparis,
        setAlinanSiparis,
        
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
