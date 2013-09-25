(function(win) {
  var PageBuilder = Yahweh.Builder.extend({
    preInit: function(options) {
      this.bundler = options.bundler;
      this.views = this.bundler.views;
      this.viewsObj = this.createViewsObj();
    },

    postInit: function(options) {
      this.on('path-change', this.renderSection, this);
    },

    addToInstantiation: function(obj) {
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

      if (!path) {
        view = this.views[0];
        path = this.views[0].path;
      } else {
        view = this.viewsObj[path];
      }

      view.el.innerHTML = view.render().el.innerHTML;
    }
  });

  var PageRouter = Backbone.Router.extend({
    initialize: function(options) {
      this.view = options.view;
    },

    routes: {
      '': 'listenForPath',
      ':path': 'listenForPath'
    },

    listenForPath: function(path) {
      this.view.trigger('path-change', path);
    }
  });

  function PageManager(args) {
    var view = new PageBuilder(args).render(),
        router = new PageRouter({ view: view });

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

