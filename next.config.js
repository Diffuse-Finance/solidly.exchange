module.exports = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.node = {
      }
    }
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules\/@metamask/,
      use: {
          loader: 'babel-loader',
          options: {
              presets: ['@babel/preset-env']
          }
      }
  });

    return config
  }
}