const overrides = require('react-app-rewired/config-overrides');

module.exports = {
  containerQuerySelector: '#root',
  webpackConfigPath: 'react-scripts/config/webpack.config.dev',
  webpack: config => overrides.webpack(config),
  publicPath: 'public',
  globalImports: ['./src/globalStyle.js'],
  proxiesPath: './cosmos.proxies',
};
