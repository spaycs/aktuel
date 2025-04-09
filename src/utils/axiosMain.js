import axios from 'axios';
import { useAuth } from '../components/userDetail/Id';

let axiosLinkMain = axios.create({
  baseURL: 'http://31.210.85.83:8055', // Varsayılan URL
});

export const useAxiosLinkMain = () => {
  const { authData } = useAuth();

  return axiosLinkMain;
};

export default axiosLinkMain;
