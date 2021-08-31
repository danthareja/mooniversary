const {
  BugsnagBuildReporterPlugin,
  BugsnagSourceMapUploaderPlugin,
} = require("webpack-bugsnag-plugins");

module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  webpack: (config, { isServer, webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.NEXT_INTERNAL_IS_SERVER": JSON.stringify(isServer),
      })
    );

    // Upload source maps on production build
    if (process.env.VERCEL && process.env.NEXT_PUBLIC_BUGSNAG_API_KEY) {
      config.plugins.push(
        new BugsnagBuildReporterPlugin({
          apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
          appVersion: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
          releaseStage: process.env.NEXT_PUBLIC_VERCEL_ENV,
          sourceControl: {
            provider: "github",
            repository: `https://github.com/${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`,
            revision: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
            builderName: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_AUTHOR_NAME,
          },
        })
      );

      config.plugins.push(
        new BugsnagSourceMapUploaderPlugin({
          apiKey: process.env.NEXT_PUBLIC_BUGSNAG_API_KEY,
          appVersion: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
          publicPath: `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`,
        })
      );
    }

    return config;
  },
};
