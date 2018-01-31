// @flow
module.exports = function override(config, env) {
  // Make it run in electron renderer process
  delete config.node
  config.target = 'electron-renderer';

  // use the Preact rewire
  if (env === "production") {
    console.log("⚡ Production build with Optimization.");
  }

  return config;
}
