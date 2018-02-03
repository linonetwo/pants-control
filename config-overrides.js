// @flow
const path = require('path');
const { getBabelLoader } = require('react-app-rewired')

const removeEslint = function (config) {
  const rules = config.module.rules;
  if (!rules[1] || !rules[0]) {
    console.log('eslint rule not found');
    return config;
  }
  config.module.rules = [rules[1]];
  return config;
};
const babelIgnorePath = function (exclude = [], config) {
  const loader = getBabelLoader(config.module.rules);
  if (!loader) {
    console.log('babel-loader not found');
    return config;
  }
  loader.exclude =  exclude.concat(loader.exclude || []);
  return config;
};

module.exports = function override(config, env) {
  // Make it run in electron renderer process
  // If we want electron start, we will set cross-env BROWSER=none
  if (process.env.BROWSER === 'none') {
    delete config.node;
    config.target = 'electron-renderer';
  }

  config = removeEslint(config);

  const nativeModulesPath = [path.resolve(__dirname, 'src/node_modules'), path.resolve(__dirname, 'src/~')];
  config = babelIgnorePath(nativeModulesPath, config);

  if (env === 'production') {
    console.log('⚡ Production build with Optimization.');
  }

  return config;
};
