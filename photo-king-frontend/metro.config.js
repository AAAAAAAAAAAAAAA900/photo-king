const { getDefaultConfig } = require('expo/metro-config');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

// Start with Expo's default configuration
const config = getDefaultConfig(__dirname);

// Wrap the config with Reanimated's setup
module.exports = wrapWithReanimatedMetroConfig(config);