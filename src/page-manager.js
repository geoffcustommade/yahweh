(function(win) {
  function getRoot(root) {
    if (root) {
      return root + '/';
    }
  }

  var PageBuilder = Yahweh.Builder.extend({
    preInit: function(options) {
      this.root = options.root;
      this.bundler = options.bundler;
      this.views = this.bundler.views;
      this.viewsObj = this.createViewsObj();
    },

    postInit: function(options) {
      this.on('path-change', this.renderSection, this);
    },

    addToInstantiation: function(obj) {
      obj.root = this.root;
      obj.bundler = this.bundler;
      obj.views = this.views;
      obj.builder = this;
      return obj;
    },

    createViewsObj: function() {
      var i, len, instance, instanceObj = {};

      for (i = 0, len = this.views.length; i < len; i++) {
        instance = this.views[i];
        instanceObj[instance.path] = instance;
      }

      return instanceObj;
    },

    renderSection: function(path) {
      var view;
      this.bundler.tearDownCurrentView();

      if (!path) {
        view = this.views[0];
        path = this.views[0].path;
      } else {
        view = this.viewsObj[path];
      }

      this.bundler.setCurrentView(view);
      this.bundler.render();
    }
  });

  var PageRouter = Backbone.Router.extend({
    initialize: function(options) {
      this.counter = 0;
      this.root = options.root || '';
      this.view = options.view;
      this.setPageRoute();
    },

    routes: {
      '': 'listenForPath'
    },

    setPageRoute: function() {
      this.route(this.root + ':path', 'listenForPath');
    },

    listenForPath: function(path) {
      this.view.trigger('path-change', path, this.counter++);
    }
  });

  function PageManager(args) {
    var root = getRoot(args.root), view, router;

    args.root = root;
    view = new PageBuilder(args).render();
    router = new PageRouter({
      view: view,
      root: args.root
    });

    if (args.start) {
      Backbone.history.start();
    }

    return {
      view: view,
      router: router
    };
  }

  win.PageManager = PageManager;
}(window));

