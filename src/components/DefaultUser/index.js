import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAxiosLinkMain } from '../../utils/axiosMain';
import { useAuth } from '../../components/userDetail/Id';

// Varsayılan kullanıcı bilgileri için Context oluşturuluyor
const AuthDefaultContext = createContext();

// Bu hook, AuthDefaultContext'i kolayca kullanabilmek için oluşturulmuş kısayoldur
export const useAuthDefault = () => {
    return useContext(AuthDefaultContext);
};

// Context Provider bileşeni, alt bileşenlere kullanıcı bilgilerini sağlar
export const AuthDefaultProvider = ({ children }) => {
    const axiosLinkMain = useAxiosLinkMain();
    const [user, setUser] = useState(null);
    const [defaults, setDefaults] = useState([]);
    const { authData } = useAuth();

    useEffect(() => {
        if (authData) {
            fetchDefaults();
        }
    }, [authData]);

    // Kullanıcının varsayılan bilgilerini API'den çeken fonksiyon
    const fetchDefaults = async () => {
        try {
            const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${authData.IQ_MikroUserId}`);
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setDefaults(data);
        } catch {
        }
    };

    const value = {
        user,
        defaults,
    };

    return <AuthDefaultContext.Provider value={value}>{children}</AuthDefaultContext.Provider>;
};
