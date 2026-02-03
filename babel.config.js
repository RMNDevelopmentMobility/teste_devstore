module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'expo-router/babel',
      [
        'module-resolver',
        {
          root: ['./src'],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
          alias: {
            '@': './src',
            '@features': './src/features',
            '@design-system': './src/design_system',
            '@core': './src/core',
            '@shared': './src/shared',
          },
        },
      ],
    ],
  };
};
