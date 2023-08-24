module.exports = {
  future: {
    webpack5: true,
  },
};
module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
      }
    }

    return config
  }
}