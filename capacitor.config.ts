import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Highker',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  "plugins": {
    "LocalNotifications": {
      "smallIcon": "img.png"
    }
  }
};

export default config;
