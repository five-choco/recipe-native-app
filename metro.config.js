// Learn more on how to config Metro for different platforms:
// https://docs.expo.dev/more/metro/

const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname, {
  // Web環境でのバンドル設定を有効にします
  isWeb: true,
});

// .wasmファイルをMetro Bundlerがアセットとして認識し、バンドルできるようにするための設定を追加します
config.resolver.assetExts.push('wasm');
config.resolver.sourceExts.push('wasm'); // WASMファイルを直接JavaScriptモジュールとして扱う場合も考慮します

module.exports = config;
