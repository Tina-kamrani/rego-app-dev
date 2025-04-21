import { Platform } from "react-native";
import Constants from "expo-constants";

console.log('Starting environment configuration...');
console.log('Platform:', Platform.OS);
console.log('Constants:', {
  expoConfig: Constants.expoConfig,
  manifest: Constants.manifest,
  appOwnership: Constants.appOwnership,
  executionEnvironment: Constants.executionEnvironment
});

const isDev = process.env.NODE_ENV !== "production";
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  isDev,
  __DEV__: __DEV__
});

const extra = Constants.expoConfig?.extra || {};
console.log('Extra config:', extra);

const envConfig = isDev ? extra.development : extra.production;
console.log('Environment config:', {
  isDev,
  envConfig,
  hasDevelopment: !!extra.development,
  hasProduction: !!extra.production
});

const defaultConfig = {
  development: {
    TENANT_ID: "e56302f2-6c0d-43bd-bc7a-09dcfe503cf7",
    CLIENT_ID: "48195ca1-022c-4c3e-a6c1-e49255494d2f",
    API_BASE_URL: "https://regotestapi.qreform.com/api/",
  },

  production: {
    TENANT_ID: "2913ee49-8035-4f15-ac37-deb801e2436d",
    CLIENT_ID: "45ba805c-cd6a-4fba-b087-78486f968910",
    API_BASE_URL: "https://tuumaapi.qreform.com/api/",
  },
};

const loadEnvConfig = () => {
  try {
    console.log('Loading environment configuration...');
    const env = isDev ? "development" : "production";
    console.log('Selected environment:', env);

    const config = {
      TENANT_ID: envConfig?.TENANT_ID || defaultConfig[env].TENANT_ID,
      CLIENT_ID: envConfig?.CLIENT_ID || defaultConfig[env].CLIENT_ID,
      API_BASE_URL: envConfig?.API_BASE_URL || defaultConfig[env].API_BASE_URL,
    };

    console.log('Final configuration:', {
      env,
      config,
      envConfig,
      defaultConfig: defaultConfig[env],
      usingEnvConfig: !!envConfig?.TENANT_ID,
      usingDefaultConfig: !envConfig?.TENANT_ID
    });

    return config;
  } catch (error) {
    console.error('Error loading environment variables:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      code: error.code
    });
    return isDev ? defaultConfig.development : defaultConfig.production;
  }
};

const Config = loadEnvConfig();
console.log('Final Config object:', Config);

export default Config;
