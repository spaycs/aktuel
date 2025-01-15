import axios from "axios";
import { useAuth } from '../components/userDetail/Id';

let axiosLink = axios.create({
    baseURL: 'http://213.14.109.246:8084', // Varsayılan URL
  });

  export const useAxiosLink = () => {
    const { authData } = useAuth();
  
    if (authData && authData.MikroApiUrl) {
        axiosLink.defaults.baseURL = authData.MikroApiUrl;
    }
  
    return axiosLink;
  };

export default axiosLink;
