const path = require('path');
const { injectBabelPlugin, getBabelLoader } = require('react-app-rewired');

function babelIgnorePath(exclude = [], config) {
  const loader = getBabelLoader(config.module.rules);
  if (!loader) {
    console.log('babel-loader not found');
    return config;
  }
  loader.options.exclude = exclude.concat(loader.options.exclude || []);
  return config;
}

module.exports = function override(config, env) {
  // remove eslint in eslint, we only need it on VSCode
  config.module.rules.splice(1, 1);

  config = injectBabelPlugin(
    [
      'flow-runtime',
      {
        assert: true,
        annotate: true,
      },
    ],
    config,
  );
  config = injectBabelPlugin('transform-decorators-legacy', config);
  config = injectBabelPlugin('@babel/plugin-proposal-do-expressions', config);
  config = injectBabelPlugin('@babel/plugin-proposal-optional-chaining', config);
  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config);

  const nativeModulesPath = [path.resolve(__dirname, 'src/node_modules'), path.resolve(__dirname, 'src/~')];
  config = babelIgnorePath(nativeModulesPath, config);
  config = injectBabelPlugin('macros', config);
  config = injectBabelPlugin('styled-components', config);

  if (env === 'production') {
    console.log('⚡ Production build with optimization ⚡');
    config = injectBabelPlugin('closure-elimination', config);
    config = injectBabelPlugin('@babel/plugin-transform-react-inline-elements', config);
    config = injectBabelPlugin('@babel/plugin-transform-react-constant-elements', config);
  }

  return config;
};
