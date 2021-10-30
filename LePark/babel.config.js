module.exports = function(api) {
  api.cache(true);

  const plugins = [
    ["module:react-native-dotenv"]
  ]
  return {
    presets: ['babel-preset-expo'],
    plugins
  };
};
