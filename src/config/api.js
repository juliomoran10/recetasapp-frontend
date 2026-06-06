import { Platform } from 'react-native';
import Constants from 'expo-constants';


const PRODUCTION_API_URL = 'https://recetasapp-backend.onrender.com';

function getDevServerHost() {
  try {
    const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.hostUri;
    if (hostUri) {
      return hostUri.split(':')[0];
    }
  } catch {}
  return null;
}

const getBaseUrl = () => {
  if (__DEV__) {
    const devHost = getDevServerHost();
    if (devHost && devHost !== 'localhost' && devHost !== '127.0.0.1') {
      return `http://${devHost}:3000`;
    }

    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    }

    return 'http://localhost:3000';
  }

  return PRODUCTION_API_URL;
};

export const API_BASE_URL = getBaseUrl();
