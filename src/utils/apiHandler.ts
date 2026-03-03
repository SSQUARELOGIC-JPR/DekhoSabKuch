import { Vibration } from 'react-native';
import { store } from '../store';
import { showError } from '../store/errorSlice';

interface ApiHandlerOptions {
  showError?: boolean;
  vibrate?: boolean;
  customMessage?: string;
}

export const apiHandler = async <T>(
  apiCall: () => Promise<T>,
  options?: ApiHandlerOptions
): Promise<T | null> => {
  const {
    showError: shouldShowError = true,
    vibrate = true,
    customMessage,
  } = options || {};

  try {
    return await apiCall();
  } catch (error: any) {
    const status = error?.response?.status;
    const code = error?.code;

    // 🔐 Already handled in axios
    if (
      status === 401 ||
      code === 'ECONNABORTED' ||
      !error.response
    ) {
      return null;
    }

    if (vibrate) {
      Vibration.vibrate([0, 200, 100, 200]);
    }

    if (shouldShowError) {
      const message =
        customMessage ||
        error?.response?.data?.message ||
        'Something went wrong';

      store.dispatch(showError({ message }));
    }

    return null;
  }
};