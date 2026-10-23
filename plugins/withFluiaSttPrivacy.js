const { withPodfileProperties, withDangerousMod } = require("expo/config-plugins");
const { prepareNative } = require("../tools/fluia-stt/prepare-native.cjs");
const { prepareStreamNative } = require("../tools/fluia-stt/prepare-stream-native.cjs");

// Keep request audio and the session capability out of the development client's
// network inspector. This flag is consumed at native compilation time.
module.exports = function withFluiaSttPrivacy(config) {
  config = withPodfileProperties(config, (mod) => {
    mod.modResults.EX_DEV_CLIENT_NETWORK_INSPECTOR = "false";
    return mod;
  });
  return withDangerousMod(config, ["ios", (mod) => {
    prepareNative();
    prepareStreamNative();
    return mod;
  }]);
};
