const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Fix for import.meta error
config.resolver.unstable_enablePackageExports = true;

module.exports = config;