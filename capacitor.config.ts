
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.clinibuilds.medishare',
  appName: 'CliniBuilds',
  webDir: 'dist',
  server: {
    url: 'https://0e291756-186f-4cb6-9692-ba06849e1472.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  ios: {
    scheme: 'clinibuilds'
  },
  android: {
    buildOptions: {
      targetSdkVersion: 34,
      minSdkVersion: 24
    },
    allowMixedContent: true,
    captureInput: true,
    webContentsDebuggingEnabled: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#E02020",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      spinnerColor: "#FFFFFF"
    },
    StatusBar: {
      style: "default",
      backgroundColor: "#E02020"
    }
  }
};

export default config;
