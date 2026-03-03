import { AuthUser } from '../types/interfaces';
import { ENV } from '../config/env';
import instance from './axiosInstance';

// 📲 Send OTP
export const sendOtpApi = async (mobile: string) => {
  try {
    console.log('🌐 BASE URL:', ENV.API_BASE_URL);
    console.log('📤 Sending mobile:', mobile);
    console.log('🔗 Full URL:', `${ENV.API_BASE_URL}/auth/send-otp`);

    const response = await instance.post('/auth/send-otp', { mobile });

    console.log('✅ API Raw Response:', response);
    return response.data;
  } catch (error: any) {
    console.log('❌ AXIOS ERROR FULL:', error);
    console.log('❌ AXIOS ERROR MESSAGE:', error?.message);
    console.log('❌ AXIOS ERROR RESPONSE:', error?.response);
    console.log('❌ AXIOS ERROR CONFIG:', error?.config);

    throw error;
  }
};

// 🔐 Verify OTP
export const verifyOtpApi = async (mobile: string, otp: string) => {
  try {
    const response = await instance.post('/auth/verify-otp', {
      mobile,
      otp,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 👤 Save Role
export const saveRoleApi = async (role: string) => {
  try {
    const response = await instance.post('/auth/save-role', { role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 👤 Get Profile
export const getProfileApi = async (): Promise<AuthUser> => {
  try {
    const response = await instance.get('/auth/me'); // or '/user/profile'
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

export const updateProfileApi = async (payload: FormData) => {
  try {
    const response = await instance.put('/user/profile', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data; // { success, user }
  } catch (error) {
    throw error;
  }
};

export const getProvidersApi = async (page: number, limit: number) => {
  try {
    const res = await instance.get(
      `/providers?page=${page}&limit=${limit}`
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProviderByIdApi = async (providerId: string) => {
  try {
    const response = await instance.get(`/providers/${providerId}`);
    return response.data; // { success, provider }
  } catch (error: any) {
    throw error?.response?.data || error;
  }
};


export const makePaymentApi = async (amount: number) => {
  try {
    const response = await instance.post('/payment/success', { amount });
    return response.data; // { success, data }
  } catch (error) {
    throw error;
  }
};

export const createSupportTicketApi = async (payload: any) => {
  try {
    const res = await instance.post('/support/ticket', payload);
    return res.data;
  } catch (error) {
    throw error;
  }

};

export const logoutApi = async () => {
  try {
    await instance.post('/auth/logout');
  } catch (error) {
    throw error;
  }
};

export const deleteAccountApi = async (mobile: string) => {
  try {
    const res = await instance.delete('/user/delete', { data: { mobile } });
    return res.data;
  } catch (error) {
    throw error;
  }
};