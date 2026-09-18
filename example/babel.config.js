module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // babel-preset-expo already includes the worklets plugin when Reanimated is installed.
  };
};
