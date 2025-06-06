import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// AxiosLinkMain instance'ı tanımlama
let axiosLinkMain = axios.create({
  baseURL: '', // Varsayılan URL
});

// AxiosLink instance'ı tanımlama
let axiosLink = axios.create({
  baseURL: '', // Varsayılan URL
});

export const AuthProvider = ({ children }) => {
  const [authData, setAuthData] = useState({
    KullaniciKodu: "",
    Sifre: "",
    OrijinalSifre: "",
    AktivasyonKodu: "0123456789",
    FirmaKodu: "TEST",
    FirmaApiUrl: "http://hilalapi.novatekcloud.com:8094",
    MikroApiUrl: "http://hilalapi.novatekcloud.com:8084",
    CalismaYili: "2025",
    ApiKey: "",
    ApiKey1: "AJgbzKXca79D0gN4kmpyKtAVi4YxGi+sa69d9jyZVv5K3JYS48ocIsZXCgll6zUsrayaGbFTS79kTBkG8jMT3eYCDCfL473KOQ6t8/JOQwQ=",
    ApiKey2: "fzuHtApZA4Jop1b0sloOiWzGzCn066OJBRRPqNtkCgOnQ/6wxT52C57QOpPe7w02GSgxwt6GFdllMI9/8HpyTUWHd7P4IiWaQ3HQ6g2+N9k=",
    FirmaNo: "0",
    SubeNo: "0",
    selectedUser: "",
    IQ_MikroUserId: "",
  });

  const updateAuthData = (key, value) => {
    setAuthData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  useEffect(() => {
    // FirmaApiUrl değiştiğinde axiosLinkMain'i güncelle
  }); 

  useEffect(() => {
    // FirmaApiUrl değiştiğinde axiosLinkMain'i güncelle
    if (authData.FirmaApiUrl) {
      axiosLinkMain.defaults.baseURL = authData.FirmaApiUrl;
      console.log("Updated Axios baseURL:", axiosLinkMain.defaults.baseURL);
    }
  }, [authData.FirmaApiUrl]); // Sadece FirmaApiUrl değiştiğinde çalışır

  useEffect(() => {
    // MikroApiUrl değiştiğinde axiosLink'i güncelle
    if (authData.MikroApiUrl) {
      axiosLink.defaults.baseURL = authData.MikroApiUrl;
      console.log("Updated Axios baseURL:", axiosLink.defaults.baseURL);
    }
  }, [authData.MikroApiUrl]); // Sadece MikroApiUrl değiştiğinde çalışır


  return (
    <AuthContext.Provider
      value={{
        authData,
        updateAuthData,
        axiosLinkMain, 
        axiosLink,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
