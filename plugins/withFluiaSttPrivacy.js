const { withPodfileProperties } = require("expo/config-plugins");

// Keep request audio and the session capability out of the development client's
// network inspector. This flag is consumed at native compilation time.
module.exports = function withFluiaSttPrivacy(config) {
  return withPodfileProperties(config, (mod) => {
    mod.modResults.EX_DEV_CLIENT_NETWORK_INSPECTOR = "false";
    return mod;
  });
};
