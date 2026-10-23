import assert from 'node:assert/strict';
import test from 'node:test';
import { createRequire } from 'node:module';
const { patchAppDelegate, legacyWindow } = createRequire(import.meta.url)('../../plugins/withFluiaIosScene.js');
const source = `import Expo
class AppDelegate: ExpoAppDelegate {
  var reactNativeFactory: RCTReactNativeFactory?
  func launch() -> Bool {
${legacyWindow}
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  // Linking API
}`;

test('adaptação cria a janela na cena e prepara Dev Launcher antes dos subscribers', () => {
  const result = patchAppDelegate(source);
  assert.doesNotMatch(result, /UIScreen.main.bounds/);
  const scene = result.slice(result.indexOf('class FluiaVoiceSceneDelegate'));
  assert.ok(scene.indexOf('UIWindow(windowScene: windowScene)') < scene.indexOf('factory.startReactNative'));
  assert.ok(scene.indexOf('factory.startReactNative') < scene.indexOf('finishSceneLaunch(launchOptions)'));
  for (const lifecycle of ['applicationDidBecomeActive', 'applicationWillResignActive', 'applicationWillEnterForeground', 'applicationDidEnterBackground']) assert.ok(scene.includes(lifecycle));
  assert.equal(patchAppDelegate(result), result);
});
test('adaptação recusa fonte desconhecida ou parcialmente alterada', () => {
  assert.throws(() => patchAppDelegate('different source'));
  assert.throws(() => patchAppDelegate('FLUIA_IOS27_SCENE incomplete'));
});
