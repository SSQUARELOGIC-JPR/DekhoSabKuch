const ENV_TYPE = 'prod'; 
// 'dev' | 'prod'

const CONFIG = {
  dev: {
    API_BASE_URL: 'http://192.168.1.2:3005/api',
    IMAGE_BASE_URL: 'http://192.168.1.2:3005/',
  },

  prod: {
    API_BASE_URL: 'https://api.dekhosabkuch.com/api',
    IMAGE_BASE_URL: 'https://api.dekhosabkuch.com/',
  },
};

export const ENV = CONFIG[ENV_TYPE];