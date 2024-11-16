import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAxiosLinkMain } from '../../utils/axiosMain';
import { useAuth } from '../../components/userDetail/Id';

const AuthDefaultContext = createContext();

export const useAuthDefault = () => {
    return useContext(AuthDefaultContext);
};

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

    const fetchDefaults = async () => {
        try {
            const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${authData.IQ_MikroUserId}`);
            //const response = await axiosLinkMain.get(`/Api/Kullanici/KullaniciVarsayilanlar?a=${authData.KullaniciKodu}`);
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
