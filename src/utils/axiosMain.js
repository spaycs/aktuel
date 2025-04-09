import axios from 'axios';
import { useAuth } from '../components/userDetail/Id';

let axiosLinkMain = axios.create({
  baseURL: 'http://172.24.129.10:8055', // Varsayılan URL
});

export const useAxiosLinkMain = () => {
  const { authData } = useAuth();

  return axiosLinkMain;
};

export default axiosLinkMain;
