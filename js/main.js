require.config({
  baseUrl: 'js',

  paths: {
    jquery: 'lib/jquery',
    underscore: 'lib/underscore',
    backbone: 'lib/backbone',
    yahweh: 'lib/yahweh',
    'page-manager': 'lib/page-manager'
  },

  shim: {
    'page-manager': {
      deps: ['backbone', 'yahweh'],
      exports: 'PageManager'
    },

    'yahweh': {
      deps: ['underscore', 'backbone'],
      exports: 'Yahweh'
    },

    'backbone': {
      deps: ['underscore', 'jquery'],
      exports: 'Backbone'
    },

    'underscore': {
      exports: '_'
    }
  }
});

