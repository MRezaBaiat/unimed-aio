const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
/* const {BroadcastUpdatePlugin} = require('workbox-broadcast-update'); */
const { GenerateSW, GenerateSWOptions } = require('workbox-webpack-plugin');
const path = require('path');
const createWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');

// custom plugins usage at https://developers.google.com/web/tools/workbox/guides/using-plugins#custom_plugins
// causes all get requests (event to the api !) to be cached
const runTimeCache = {
  urlPattern: /^https?.*/,
  handler: 'cacheFirst',
  options: {
    cacheName: 'offlineCache',
    expiration: {
      /**
         * Cache will only hold X entries.
         */
      maxEntries: 200
      /**
         * Cache will only hold entries for X seconds.
         */
      // maxAgeSeconds?: number;
    }
  }
};

const generateSWOptions = { // : GenerateSWOptions
  /**
   * Whether or not the service worker should skip over the waiting lifecycle stage. Normally this is used with `clientsClaim: true`.
   */
  skipWaiting: true,
  /**
   * Whether or not the service worker should [start controlling](https://developers.google.com/web/fundamentals/primers/service-workers/lifecycle#clientsclaim)
   * any existing clients as soon as it activates.
   */
  clientsClaim: true
  /**
   * Passing in an array of objects containing `urlPatterns`, `handlers`, and potentially `options` will add the appropriate code to the generated service worker to handle runtime caching.
   * Requests for precached URLs that are picked up via `globPatterns` are handled by default, and don't need to be accommodated in `runtimeCaching`.
   */
  // runtimeCaching: [

  /*, {
    urlPattern: /./,
    handler: 'staleWhileRevalidate',
    options: {
      // Add in any additional plugin logic you need.
      plugins: [{

        cacheDidUpdate: async ({ cacheName, request, oldResponse, newResponse, event, state }) => {
          console.log('in event ' + event);
          clients.matchAll().then(clients => {
            clients.forEach(client => {
              const msg_chan = new MessageChannel();
              client.postMessage('cacheDidUpdate', [msg_chan.port2]);
            });
          });
        }
      }]
    }
  } */
// ]
};
// see https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/workbox-webpack-plugin/v3/index.d.ts for types
module.exports = async function (env, argv) {
  const config = await createWebpackConfigAsync({
    ...env,
    // Passing true will enable the default Workbox + Expo SW configuration.
    offline: true,
    removeUnusedImportExports: true
    /* https: true will run bundler in https */
  }, {
    ...argv,
    workbox: {
      /* useServiceWorker: false,
      injectManifestOptions: {
        swSrc: 'service-worker.js'
      } */
      generateSWOptions
    }
  });
  config.plugins.push(
    // load `moment/locale/ja.js` and `moment/locale/it.js`

    new webpack.DefinePlugin({
      /* DEBUG: true */
    }),
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fa|en-gb/)
  );
  /*
  // Optionally you can enable the bundle size report.
  // It's best to do this only with production builds because it will add noticeably more time to your builds and reloads.
  If you want to track down why a package was included, you can build your project in debug mode.
      EXPO_WEB_DEBUG=true expo build:web
  //This will make your bundle much larger, and you shouldn't publish your project in this state.
  if (env.mode === 'production') {
    config.plugins.push(
        new BundleAnalyzerPlugin({
          path: 'web-report',
        })
    );
  }
  */
  /* config.module.rules.push({
    test: /\.ts$/,
    include: /node_modules\\api/,
    loader: 'ignore-loader'
  }) */
  return config;
};
