'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    'ember-fetch': {
      preferNative: true,
    },
    fingerprint: {
      enabled: true,
      exclude: [
        'images/layers-2x.png',
        'images/layers.png',
        'images/marker-icon-2x.png',
        'images/marker-icon.png',
        'images/marker-shadow.png',
      ],
      fingerprintAssetMap: true,
      generateAssetMap: true,
    },
    postcssOptions: {
      compile: {
        plugins: [
          {
            module: require('postcss-simple-vars'),
            options: {
              variables: {
                blue: '#2E368F',
                gold: '#F9AE3A',
              },
            },
          },
          require('tailwindcss')('./app/styles/tailwind.js'),
        ],
      },
    },
  });

  app.import('vendor/netlify.toml', {
    destDir: '/',
  });

  return app.toTree();
};
