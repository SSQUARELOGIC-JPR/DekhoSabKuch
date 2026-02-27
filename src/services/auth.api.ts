import instance from './axiosInstance';

// 📲 Send OTP
export const sendOtpApi = async (mobile: string) => {
  try {
    const response = await instance.post('/auth/send-otp', { mobile });
    console.log(response);
    return response.data;
  } catch (error) {
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
export const getMeApi = async () => {
  try {
    const response = await instance.get('/auth/me');
    return response.data;
  } catch (error) {
    throw error;
  }
};