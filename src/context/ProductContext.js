import { createContext, useState } from 'react';

export const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [addedProducts, setAddedProducts] = useState([]);
  const [faturaBilgileri, setFaturaBilgileri] = useState({});

  return (
    <ProductContext.Provider
      value={{
        addedProducts,
        setAddedProducts,
        faturaBilgileri,
        setFaturaBilgileri,
        
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
