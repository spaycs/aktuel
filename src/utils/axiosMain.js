import axios from 'axios';
import { useAuth } from '../components/userDetail/Id';

let axiosLinkMain = axios.create({
  baseURL: 'http://213.14.109.246:8094', // Varsayılan URL
});

export const useAxiosLinkMain = () => {
  const { authData } = useAuth();

  if (authData && authData.FirmaApiUrl) {
    axiosLinkMain.defaults.baseURL = authData.FirmaApiUrl;
  }

  return axiosLinkMain;
};

export default axiosLinkMain;
