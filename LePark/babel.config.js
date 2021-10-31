module.exports = function(api) {
  api.cache(true);

  const plugins = [
    ["module:react-native-dotenv"]
  ]
  return {
    presets: [
      'babel-preset-expo',
      // 'module:metro-react-native-babel-preset',
      // 'module:react-native-dotenv'
  ],
    plugins: ["module:react-native-dotenv"]
  };
};
