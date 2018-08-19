const { injectBabelPlugin, getBabelLoader } = require('react-app-rewired');
const rewireLess = require('react-app-rewire-less');
const StatsWebpackPlugin = require('stats-webpack-plugin');
const path = require('path');
const fs = require('fs');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

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
  // config = injectBabelPlugin('transform-decorators-legacy', config);
  config = injectBabelPlugin('@babel/plugin-proposal-do-expressions', config);
  config = injectBabelPlugin('@babel/plugin-proposal-optional-chaining', config);
  config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }], config);
  config = injectBabelPlugin('lodash', config);
  config = injectBabelPlugin('date-fns', config);
  config = injectBabelPlugin(
    [
      'prismjs',
      {
        languages: ['javascript', 'css', 'markup', 'json', 'python', 'rust'],
        theme: 'tomorrow',
        css: true,
      },
    ],
    config,
  );

  if (env === 'production') {
    console.log('⚡ Production build with optimization ⚡');
    config = injectBabelPlugin('closure-elimination', config);
    config = injectBabelPlugin('@babel/plugin-transform-react-inline-elements', config);
    config = injectBabelPlugin('@babel/plugin-transform-react-constant-elements', config);
  } else {
    // config = injectBabelPlugin(
    //   [
    //     'flow-runtime',
    //     {
    //       assert: true,
    //       annotate: true,
    //     },
    //   ],
    //   config,
    // );
  }

  // remove eslint in eslint, we only need it on VSCode
  config.module.rules.splice(1, 1);

  config.resolve = {
    alias: {
      'mapbox-gl$': path.join(resolveApp('node_modules'), '/mapbox-gl/dist/mapbox-gl.js'),
    },
  };

  config.module.rules[1].oneOf[1].include.push(path.join(resolveApp('node_modules'), 'react-echarts-v3/src'));
  config.module.rules[1].oneOf[1].exclude = /node_modules(?![\\/]react-echarts-v3[\\/]src[\\/])/;

  config = rewireLess.withLoaderOptions({
    modifyVars: { '@primary-color': '#1aa2db' },
    javascriptEnabled: true,
  })(config, env);
  config.plugins.push(new StatsWebpackPlugin('stats.json', { chunkModules: true }));

  const nativeModulesPath = [path.resolve(__dirname, 'src/node_modules'), path.resolve(__dirname, 'src/~')];
  config = babelIgnorePath(nativeModulesPath, config);

  // when open in electron, change compile target to electron-renderer
  if (process.env.BROWSER === 'none') {
    config.target = 'electron-renderer';
  }
  return config;
};
