# Android Build Instructions for Play Store

## Prerequisites
1. Install Android Studio
2. Set up Android SDK (API level 34+)
3. Create a keystore for signing

## Build Steps

### 1. Export and Setup Local Development
```bash
# Export project to GitHub and clone locally
git clone [your-repo-url]
cd [project-name]
npm install
```

### 2. Add Android Platform
```bash
npx cap add android
```

### 3. Configure Android Manifest (android/app/src/main/AndroidManifest.xml)
Add these attributes to enable fullscreen:
```xml
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTask"
    android:theme="@style/AppTheme.NoActionBarLaunch"
    android:screenOrientation="portrait">
    
    <!-- Add these for fullscreen support -->
    <meta-data 
        android:name="android.app.shortcuts.allowFullscreen" 
        android:value="true" />
</activity>
```

### 4. Create Keystore for Signing
```bash
keytool -genkey -v -keystore clinibuilds-release-key.keystore -alias clinibuilds -keyalg RSA -keysize 2048 -validity 10000
```

### 5. Configure Gradle Signing (android/app/build.gradle)
Add to android block:
```gradle
signingConfigs {
    release {
        keyAlias 'clinibuilds'
        keyPassword 'your_key_password'
        storeFile file('clinibuilds-release-key.keystore')
        storePassword 'your_store_password'
    }
}

buildTypes {
    release {
        signingConfig signingConfigs.release
        minifyEnabled false
        proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
    }
}
```

### 6. Build Release AAB
```bash
# Sync Capacitor
npx cap sync android

# Open in Android Studio
npx cap open android

# In Android Studio:
# 1. Build > Generate Signed Bundle/APK
# 2. Select "Android App Bundle"
# 3. Choose your keystore
# 4. Select "release" build variant
# 5. Click "Build"
```

### 7. Alternative Command Line Build
```bash
cd android
./gradlew bundleRelease
```

The signed .aab file will be in: `android/app/build/outputs/bundle/release/app-release.aab`

## Play Store Upload
1. Upload the .aab file to Google Play Console
2. Configure app listing, screenshots, and metadata
3. Submit for review

## App Features Configured
- ✅ Fullscreen support
- ✅ Custom splash screen with CliniBuilds branding
- ✅ Status bar styling
- ✅ Proper app ID and naming
- ✅ Target SDK 34 (latest)
- ✅ Signed release build ready