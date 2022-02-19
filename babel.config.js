module.exports = function (api) {
  api.cache(true);
  return {
    plugins: ['@babel/plugin-transform-destructuring'],
    presets: [
      'babel-preset-expo'
    ]
  };
};
