const googleMapsApiKeyAndroid =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_ANDROID ??
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
const googleMapsApiKeyIos =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY_IOS ??
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

module.exports = {
  expo: {
    name: "flui-charge-map",
    slug: "flui-charge-map",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./src/assets/images/icon.png",
    scheme: "fluichargemap",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.allyhere.flui-charge-map",
      config: {
        googleMapsApiKey: googleMapsApiKeyIos,
      },
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./src/assets/images/android-icon-foreground.png",
        monochromeImage: "./src/assets/images/android-icon-monochrome.png",
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      config: {
        googleMaps: {
          apiKey: googleMapsApiKeyAndroid,
        },
      },
    },
    web: {
      output: "static",
      favicon: "./src/assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./src/assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
          dark: {
            backgroundColor: "#000000",
          },
        },
      ],
      "expo-font",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Permitir que $(PRODUCT_NAME) acesse sua localização.",
        },
      ],
      [
        "expo-speech-recognition",
        {
          microphonePermission:
            "Permitir que $(PRODUCT_NAME) use o microfone.",
          speechRecognitionPermission:
            "Permitir que $(PRODUCT_NAME) converta a fala em texto.",
          androidSpeechServicePackages: [
            "com.google.android.googlequicksearchbox",
          ],
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  },
};
