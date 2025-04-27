
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.0e291756186f4cb69692ba06849e1472',
  appName: 'medishare-hub-connect',
  webDir: 'dist',
  server: {
    url: 'https://0e291756-186f-4cb6-9692-ba06849e1472.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'medishare-hub-connect'
  },
  android: {
    buildOptions: {
      targetSdkVersion: 33
    }
  }
};

export default config;
