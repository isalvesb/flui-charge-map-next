/* global __dirname */
const fs = require("node:fs");
const path = require("node:path");
const { withAppDelegate, withInfoPlist } = require("expo/config-plugins");

const legacyWindow = `#if os(iOS) || os(tvOS)
    window = UIWindow(frame: UIScreen.main.bounds)
    factory.startReactNative(
      withModuleName: "main",
      in: window,
      launchOptions: launchOptions)
#endif`;
const finish = "    return super.application(application, didFinishLaunchingWithOptions: launchOptions)";
const factoryProperty = "  var reactNativeFactory: RCTReactNativeFactory?";
const scene = fs.readFileSync(path.join(__dirname, "templates/FluiaVoiceSceneDelegate.swift"), "utf8");

function patchAppDelegate(source) {
  if (source.includes("FLUIA_IOS27_SCENE")) {
    if (!source.includes(scene.trim()) || source.includes(legacyWindow)) throw new Error("Adaptação UIScene incompleta.");
    return source;
  }
  for (const anchor of [legacyWindow, finish, factoryProperty, "  // Linking API"]) {
    if (source.split(anchor).length !== 2) throw new Error("AppDelegate diferente do template SDK54 revisado.");
  }
  return source
    .replace(factoryProperty, `${factoryProperty}\n  var sceneLaunchOptions: [UIApplication.LaunchOptionsKey: Any]?`)
    .replace(legacyWindow, "    // FLUIA_IOS27_SCENE: create the window only when a scene connects.\n    sceneLaunchOptions = launchOptions")
    .replace(finish, "    return true // Expo subscribers start after the scene window is ready.")
    .replace("  // Linking API", `  func finishSceneLaunch(_ options: [UIApplication.LaunchOptionsKey: Any]) -> Bool {
    return super.application(UIApplication.shared, didFinishLaunchingWithOptions: options)
  }

  // Linking API`)
    + `\n${scene}`;
}

function withFluiaIosScene(config) {
  config = withInfoPlist(config, mod => {
    mod.modResults.UIApplicationSceneManifest = {
      UIApplicationSupportsMultipleScenes: false,
      UISceneConfigurations: {
        UIWindowSceneSessionRoleApplication: [{
          UISceneConfigurationName: "FluiaVoice",
          UISceneDelegateClassName: "$(PRODUCT_MODULE_NAME).FluiaVoiceSceneDelegate",
        }],
      },
    };
    return mod;
  });
  return withAppDelegate(config, mod => {
    if (mod.modResults.language !== "swift") throw new Error("UIScene requer o AppDelegate Swift revisado.");
    mod.modResults.contents = patchAppDelegate(mod.modResults.contents);
    return mod;
  });
}

module.exports = withFluiaIosScene;
module.exports.patchAppDelegate = patchAppDelegate;
module.exports.legacyWindow = legacyWindow;
