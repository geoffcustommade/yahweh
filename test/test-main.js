var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

require.config({
  baseUrl: '/base',

  paths: {
    jquery: 'bower_components/jquery/jquery',
    underscore: 'bower_components/underscore/underscore',
    backbone: 'bower_components/backbone/backbone',
    'jasmine-jquery': 'bower_components/jasmine-jquery/lib/jasmine-jquery',
    yahweh: 'src/yahweh',
    'page-manager': 'src/page-manager'
    //'test-helpers': 'test/helpers'
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
  },

  // ask Require.js to load these files (all our tests)
  deps: tests,

  // start test run, once Require.js is done
  callback: window.__karma__.start
});
