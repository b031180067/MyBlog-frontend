import axios from 'axios';
import { ElMessage } from 'element-plus';
import { useTokenStore } from '@/store/token.js';
import router from '@/router';

// 建立axios實體，設定baseURL
const baseURL = '/api';
const instance = axios.create({ baseURL });

// axios請求攔截器
instance.interceptors.request.use(
    (config) => {
        // 取得token後，加到header裡
        const token = useTokenStore().token;
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    // 錯誤處理
    (error) => {
        ElMessage.error('服務異常');
        return Promise.reject(error);
    }
);

// axios回應攔截器
instance.interceptors.response.use(
    (response) => {
        if (response.data.code === 0) {
            return response.data;
        }
        ElMessage.error(response.data.message ? response.data.message : '服務異常');
        return Promise.reject(response.data);
    },
    // 錯誤處理
    (error) => {
        if (error.response.status === 401) {
            ElMessage.error('尚未登入');
            router.push('/login');
        } else {
            ElMessage.error('服務異常');
        }
        return Promise.reject(error);
    }
);

export default instance;
